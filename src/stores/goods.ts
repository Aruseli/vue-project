import Dexie, { Table } from 'dexie';
import { defineStore } from 'pinia';
import { ApiGoodCategory, Deferred, apiGetGoods, apiGetGoodsImages, apiGetStockRemains, apiSaveDocument, delay, throwErr } from 'src/services';
import { reactive, ref } from 'vue';
import { useAppStore } from './app';

export type Good = {
  id: string,
  title: string,
  description: string,
  price: number,
  stock: number,
  images: {
    id: string,
    image?: string, // base64
  }[],
  code: string
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

export const useGoodsStore = defineStore('goodsStore', () => {
  const appStore = useAppStore()
  const goods = ref<GoodCategory[]>([]);
  const imagesCache = reactive(new Map<string, string>()) // id -> base64 image
  const goodsLoading = ref(false)
  const goodsLoadingWaiter = ref(new Deferred())
  goodsLoadingWaiter.value.resolve(false)
  const imagesCacheExpirationAt = ref(Date.now())
  const openDialog = ref(false)

  const goodDetails = (id: string) => {
    console.log('id', id)
    const good = goods.value.flatMap(gc => gc.goods).find(g => g.id == id)
    console.log('good', good?.id)
    if (id === good?.id) {
      console.log('openDialog.value1', openDialog.value)
      openDialog.value = true;
      console.log('openDialog.value2', openDialog.value)
    }
    console.log('openDialog.value3', openDialog.value)
  }

  const cleanupImagesCache = async () => {
    const allImagesIds = new Set(goods.value.flatMap(gc =>
      gc.goods.flatMap(g => g.images.map(i => i.id))
    ))
    const allCachedImagesIds = await goodsDb.images.orderBy('id').primaryKeys() as string[]
    const toDelete = allCachedImagesIds.filter(id => !allImagesIds.has(id))
    await goodsDb.images.bulkDelete(toDelete)
    toDelete.forEach(id => imagesCache.delete(id))
  }

  const fetchImages = async (imageIds: string[]) => {
    const batchSize = 10;
    while (imageIds.length > 0) {
      const portion = imageIds.slice(0, batchSize);
      imageIds = imageIds.slice(batchSize);

      const result = await apiGetGoodsImages(portion);
      goodsDb.images.bulkPut(result);
      result.forEach((i) => {
        imagesCache.set(i.id, i.image);
      });
    }
  };

  const updateImages = async () => {
    if (imagesCache.size == 0) {
      await goodsDb.images.each(i => {
        imagesCache.set(i.id, i.image)
      })
    }
    const allImagesIds = goods.value.flatMap(gc =>
      gc.goods.flatMap(g => g.images.map(i => i.id))
    )
    const toFetch = allImagesIds.filter(id => !imagesCache.has(id))
    await fetchImages(toFetch)

    goods.value.forEach(gc => gc.goods.forEach(g => g.images.forEach(i => {
      i.image = imagesCache.get(i.id);
    })));

    if (imagesCacheExpirationAt.value < Date.now()) {
      const settings = appStore.kioskState.settings;
      imagesCacheExpirationAt.value = Date.now() + settings!.cache__images_cleanup_interval_ms!;
      cleanupImagesCache() // do not await intentionally
    }
  }

  const updateGoods = async (locale: string) => {
    if (goodsLoading.value) {
      await goodsLoadingWaiter.value.promise
      return
    }
    goodsLoading.value = true
    goodsLoadingWaiter.value = new Deferred()
    let i = 0;
    while (true) {
      try {
        if (appStore.kioskState.status != 'Ready') {
          await delay(100)
          continue;
        }
        const location_id = appStore.kioskState.params?.location_id ?? ''
        // const locale = _locale.value
        const [fetchedGoods, stockRemains] = await Promise.all([
          apiGetGoods(location_id, locale),
          apiGetStockRemains(appStore.kioskState.kioskCorr?.id ?? ''),
        ]);
        fetchedGoods.forEach(gc => gc.goods.filter(g => !!g).forEach(g => {
          g.stock = stockRemains.find(v => v.good_id == g.id)?.remain_quant ?? 0
        }))
        // ---------- Generate goods arrival ----------
        // const goodsArrivalDoc = {
        //   id: undefined,
        //   state: 2,
        //   doc_type: settings?.goods_arrival_doc_type_id ?? '',
        //   abbr_text: undefined,
        //   abbr_num: undefined,
        //   doc_date: new Date().toISOString(),
        //   doc_order: 0,
        //   corr_from_ref: "48395457-cef7-47b0-bb2c-54ccf4f8fda8", // supplier
        //   corr_to_ref: appStore.kioskState.kioskCorr?.id ?? '',
        //   respperson_ref: appStore.kioskState.userCorr?.id ?? '',
        //   currency_ref: settings?.currency_id ?? '',
        //   curr_rate: 1,
        //   comment: undefined,
        //   details: fetchedGoods.flatMap(gc => gc.goods.filter(g => !!g)).map(g => ({
        //     id: undefined,
        //     state: 0,
        //     rec_order: 0,
        //     good_id: g.id,
        //     munit_id: settings?.munit_id ?? '', // default
        //     quant: 100,
        //     total: 100,
        //     doc_detail_link: undefined,
        //     doc_detail_type: settings?.goods_arrival_docdetail_type_id ?? '', // outgoing
        //   })),
        // }
        // console.log('Debug arrival goods', await apiSaveDocument(goodsArrivalDoc))
        // --------------------------------------------
        // ---------- Generate selective inventory ----------
        // const goodsInventoryDoc = {
        //   id: undefined,
        //   state: 2,
        //   doc_type: settings?.inventory_doc_type_id ?? '',
        //   abbr_text: undefined,
        //   abbr_num: undefined,
        //   doc_date: new Date().toISOString(),
        //   doc_order: 0,
        //   corr_from_ref: appStore.kioskState.kioskCorr?.id ?? '',
        //   corr_to_ref: appStore.kioskState.kioskCorr?.id ?? '',
        //   respperson_ref: appStore.kioskState.userCorr?.id ?? '',
        //   currency_ref: settings?.currency_id ?? '',
        //   curr_rate: 1,
        //   comment: undefined,
        //   details: fetchedGoods.flatMap(gc => gc.goods.filter(g => !!g)).map(g => ({
        //     id: undefined,
        //     state: 0,
        //     rec_order: 0,
        //     good_id: g.id,
        //     munit_id: settings?.munit_id ?? '', // default
        //     quant: 3,
        //     total: 3*g.price,
        //     doc_detail_link: undefined,
        //     doc_detail_type: settings?.inventory_docdetail_type_id ?? '',
        //   })),
        // }
        // console.log('Debug inventory goods', await apiSaveDocument(goodsInventoryDoc))
        // --------------------------------------------------
        goods.value = fetchedGoods.map(gc => ({
          ...gc,
          goods: gc.goods.filter(g => !!g).map(g => ({
            ...g,
            images: g.images_ids.map(id => ({
              id,
              image: imagesCache.get(id),
            }))
          })),
        }));
        setTimeout(() => updateImages(), 0);
        appStore.tab = fetchedGoods[0].id
        goodsLoading.value = false
        goodsLoadingWaiter.value.resolve(true)
        return
      }
      catch (e) {
        console.error("goodsStore", "updateGoods", e)
      }
      await delay(10000)
    }
  }

  const getGoodByIdHits = ref(0)
  const getGoodById = (id: string) => {
    getGoodByIdHits.value += 1
    if (getGoodByIdHits.value % 100 == 0) {
      console.log('getGoodById hits', getGoodByIdHits.value)
    }
    return goods.value.flatMap(gc => gc.goods).find(g => g.id == id)
  }

  const getGoodByDataCodeHits = ref(0);
  const getGoodByCode = (code: string) => {
    getGoodByDataCodeHits.value += 1
    if (getGoodByDataCodeHits.value % 100 == 0) {
      console.log('getGoodByDataCode hits', getGoodByDataCodeHits.value)
    }
    return goods.value.flatMap(gc => gc.goods).find(g => g.code === code)
  }

  const waitGoodsReady = async () => {
    await goodsLoadingWaiter.value.promise
  }

  return {
    openDialog,
    goods: goods,
    getGoodById,
    getGoodByIdHits, // debug

    getGoodByCode,

    updateGoods,
    goodsLoading,
    goodsLoadingWaiter,
    imagesCache,
    imagesCacheExpirationAt,
    waitGoodsReady,
    goodDetails,
  }
},
  // {
  //   persist: true,
  // }

)

