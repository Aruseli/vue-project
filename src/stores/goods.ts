import { defineStore } from 'pinia';
import { ApiGoodCategory, Deferred, apiGetGoods, apiGetGoodsImages, delay, throwErr } from 'src/services';
import { ref } from 'vue';
import { KioskState, useAppStore } from './app';

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

  const fetchImages = async (imageIds: string[]) => {
    const batchSize = 10
    while (imageIds.length > 0) {
      const portion = imageIds.slice(0, batchSize)
      imageIds = imageIds.slice(batchSize)

      const result = await apiGetGoodsImages(portion)
      result.forEach(i => {
        _images.set(i.id, i.image)
      })
    }
  }

  const populateImages = async (goods: ApiGoodCategory[]) => {
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
        if (_appStore.kioskState != KioskState.READY) {
          await delay(100)
          continue;
        }
        const location_id = _appStore.terminal.params?.location_id ?? ''
        const locale = _locale.value
        const fetchedGoods = await apiGetGoods(location_id, locale)
        _goods.value = await populateImages(fetchedGoods)
        _appStore.tab = fetchedGoods[0].id
        _goodsLoading.value = false
        _goodsWaiter.resolve(true)
        return
      }
      catch (e) {
        console.error("goodsStore", "updateGoods", e)
      }
      await delay(1000)
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
},
  {
    persist: true,
  }

)

