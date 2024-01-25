import { defineStore } from 'pinia';
import { ApiGoodCategory, Deferred, apiGetDocuments, apiGetGoods, apiGetGoodsImages, apiGetStockRemains, apiSaveDocument, delay, throwErr } from 'src/services';
import { ref } from 'vue';
import { KioskStatus, useAppStore } from './app';
import Dexie, { Table } from 'dexie';
import { IMAGES_CACHE_CLEANUP_INTERVAL } from 'src/services/consts';

export type Good = {
  id: string,
  title: string,
  description: string,
  price: number,
  stock: number,
  images: {
    id: string,
    image: string, // base64
  }[],
}

export type GoodCategory = {
  id: string,
  title: string,
  goods: Good[],
}

class GoodsDexie extends Dexie {
  images!: Table<{id: string, image: string}>

  constructor() {
    super('goods')
    this.version(1).stores({
      images: '&id',
    })
  }
}

const goodsDb = new GoodsDexie();

/**
 * NOTES:
 * 1. Перед отображением вызывать waitGoodsReady или проверять goodsLoading
 */
export const useGoodsStore = defineStore('goodsStore', () => {
  const _appStore = useAppStore()
  const _goods = ref<GoodCategory[]>([]);
  const _images = new Map<string, string>() // id -> base64 image
  const _goodsLoading = ref(false)
  let _goodsWaiter = new Deferred()
  _goodsWaiter.resolve(true)
  const _locale = ref('en-US')
  let _imageCacheCleanupAfter = Date.now()

  const cleanupImagesCache = async () => {
    const allImagesIds = new Set(_goods.value.flatMap(gc =>
      gc.goods.flatMap(g => g.images.map(i => i.id))
    ))
    const allCachedImagesIds = await goodsDb.images.orderBy('id').primaryKeys() as string[]
    await goodsDb.images.bulkDelete(allCachedImagesIds.filter(id => !allImagesIds.has(id)))
  }

  const fetchImages = async (imageIds: string[]) => {
    const batchSize = 10
    while (imageIds.length > 0) {
      const portion = imageIds.slice(0, batchSize)
      imageIds = imageIds.slice(batchSize)

      const result = await apiGetGoodsImages(portion)
      goodsDb.images.bulkPut(result)
      result.forEach(i => {
        _images.set(i.id, i.image)
      })
    }
  }

  const populateImages = async (goods: ApiGoodCategory[]) => {
    if (_images.size == 0) {
      await goodsDb.images.each(i => {
        _images.set(i.id, i.image)
      })
    }
    const allImagesIds = goods.flatMap(gc =>
        gc.goods.filter(g => !!g)
                .flatMap(g => g.images_ids)
      );
    const toFetch = allImagesIds.filter(id => !_images.has(id))
    await fetchImages(toFetch)
    return <GoodCategory[]>goods.map(gc => ({
      ...gc,
      goods: gc.goods.filter(g => !!g).map(g => ({
        ...g,
        images: g.images_ids.map(id => ({
          id,
          image: _images.get(id) ?? throwErr(new Error(`Image is missing: ${id}`)),
        })),
      })),
    }))
  }

  const updateGoods = async () => {
    if (_goodsLoading.value) {
      await _goodsWaiter.promise
      return
    }
    _goodsLoading.value = true
    _goodsWaiter = new Deferred()
    while (true) {
      try {
        if (_appStore.kioskState.status != KioskStatus.READY) {
          await delay(100)
          continue;
        }
        const location_id = _appStore.kioskState.params?.location_id ?? ''
        const locale = _locale.value
        const terminal_settings = _appStore.kioskState.params?.terminal_settings
        const [fetchedGoods, stockRemains] = await Promise.all([
          apiGetGoods(location_id, locale),
          apiGetStockRemains(terminal_settings?.kiosk_corr_id ?? ''),
        ]);
        fetchedGoods.forEach(gc => gc.goods.forEach(g => {
          g.stock = stockRemains.find(v => v.good_id == g.id)?.remain_quant ?? 0
        }))
        // if (!stockRemains.length) {
        //   const goodsArrivalDoc = {
        //     id: undefined,
        //     state: 0,
        //     doc_type: terminal_settings?.goods_arrival_doc_type_id ?? '',
        //     abbr_text: undefined,
        //     abbr_num: undefined,
        //     doc_date: new Date().toISOString(),
        //     doc_order: 0,
        //     corr_from_ref: "48395457-cef7-47b0-bb2c-54ccf4f8fda8", // supplier
        //     corr_to_ref: terminal_settings?.kiosk_corr_id ?? '',
        //     respperson_ref: _appStore.kioskState.user?.id ?? '',
        //     currency_ref: terminal_settings?.currency_id ?? '',
        //     curr_rate: 1,
        //     comment: undefined,
        //     details: fetchedGoods.flatMap(gc => gc.goods.filter(g => !!g)).map(g => ({
        //       id: undefined,
        //       state: 0,
        //       rec_order: 0,
        //       good_id: g.id,
        //       munit_id: terminal_settings?.munit_id ?? '', // default
        //       quant: 100,
        //       total: 100,
        //       doc_detail_link: undefined,
        //       doc_detail_type: terminal_settings?.goods_arrival_docdetail_type_id ?? '', // outgoing
        //     })),
        //   }
        //   console.log('Debug arrival goods', await apiSaveDocument(goodsArrivalDoc))
        // } else if (false) {
        //   // New invoice
        //   const invoiceDoc = {
        //     id: undefined,
        //     state: 2,
        //     doc_type: terminal_settings?.invoice_doc_type_id ?? '',
        //     abbr_text: undefined,
        //     abbr_num: undefined,
        //     doc_date: new Date().toISOString(),
        //     doc_order: 0,
        //     corr_from_ref: terminal_settings?.kiosk_corr_id ?? '',
        //     corr_to_ref: terminal_settings?.client_corr_id ?? '',
        //     respperson_ref: _appStore.kioskState.user?.id ?? '',
        //     currency_ref: terminal_settings?.currency_id ?? '',
        //     curr_rate: 1,
        //     comment: undefined,
        //     details: fetchedGoods[0].goods.map(g => ({
        //       id: undefined,
        //       state: 0,
        //       rec_order: 0,
        //       good_id: g.id,
        //       munit_id: terminal_settings?.munit_id ?? '', // default
        //       quant: 10,
        //       total: stock-quant,
        //       doc_detail_link: undefined,
        //       doc_detail_type: terminal_settings?.invoice_docdetail_type_id ?? '',
        //     })),
        //   }
        //   console.log('Invoice', await apiSaveDocument(invoiceDoc))
        // } else {
        //   const invoices = await apiGetDocuments([terminal_settings!.invoice_doc_type_id!], [2])
        //   console.log('Invoices', invoices)
        //   const invoiceDoc = invoices.find(d => d.id == '285ecd3c-84c2-428c-ab6e-1a30005cbf5e')
        //   if (invoiceDoc) {
        //     invoiceDoc.state = 0
        //     console.log('Issue goods', await apiSaveDocument(invoiceDoc))
        //   }
        // }
        _goods.value = await populateImages(fetchedGoods)
        _appStore.tab = fetchedGoods[0].id
        _goodsLoading.value = false
        _goodsWaiter.resolve(true)
        if (_imageCacheCleanupAfter < Date.now()) {
          _imageCacheCleanupAfter = Date.now() + IMAGES_CACHE_CLEANUP_INTERVAL
          cleanupImagesCache()
        }
        return
      }
      catch (e) {
        console.error("goodsStore", "updateGoods", e)
      }
      await delay(10000)
    }
  }

  const getGoodById = (id: string) => {
    return _goods.value.flatMap(gc => gc.goods).find(g => g.id == id)
  }

  const setLocale = async (locale: string) => {
    _locale.value = locale
    await updateGoods()
  }

  const waitGoodsReady = async () => {
    await _goodsWaiter.promise
  }

  return {
    goods: _goods,
    getGoodById,

    updateGoods,
    setLocale,
    goodsLoading: _goodsLoading,
    waitGoodsReady,
  }
})

