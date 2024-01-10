import { defineStore } from 'pinia';
import { ApiGood, Deferred, apiGetGoods, apiGetGoodsImages, delay, throwErr } from 'src/services';
import { ref } from 'vue';
import { useAppStore } from './app';

export type LocalizedGood = {
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

/**
 * NOTES:
 * 1. Перед отображением вызывать waitGoodsReady
 * 2. TODO: Retries
 */
export const useGoodsStore = defineStore('goodsStore', () => {
  const _appStore = useAppStore()
  const _goods = ref([] as LocalizedGood[]);
  const _images = new Map<string, string>() // id -> base64 image
  let _goodsWaiter = new Deferred()
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

  const populateImages = async (goods: ApiGood[]) => {
    const allImagesIds = goods.flatMap(g => g.imageIds)
    const toFetch = allImagesIds.filter(id => !_images.has(id))
    await fetchImages(toFetch)
    return goods.map(g => ({
      ...g,
      images: g.imageIds.map(id => ({
        id,
        image: _images.get(id) ?? throwErr(new Error(`Image is missing: ${id}`)),
      }))
    }))
  }

  const updateGoods = async () => {
    _goodsWaiter.reject("Cancelled")
    _goodsWaiter = new Deferred()
    while (true) {
      try {
        const fetchedGoods = await apiGetGoods(_appStore.terminal.params?.location_id ?? '', _locale.value)
        _goods.value = await populateImages(fetchedGoods)
        _goodsWaiter.resolve(true)
        return
      }
      catch (e) {
        console.error("goodsStore", "updateGoods", e)
      }
      await delay(100)
    }

  }

  const getGoodById = (id: string) => {
    return _goods.value.find(g => g.id == id)
  }

  const setLocale = async (locale: string) => {
    _locale.value = locale
    await updateGoods()
  }

  const waitGoodsReady = async () => {
    await delay(5000) // TODO
  }

  return {
    goods: _goods,
    getGoodById,

    updateGoods,
    setLocale,
    waitGoodsReady,
  }
})

