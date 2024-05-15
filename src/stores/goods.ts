import Dexie, { Table } from 'dexie';
import { defineStore } from 'pinia';
import { Deferred, apiGetGoods, apiGetGoodsImages, apiGetStockRemains, delay } from 'src/services';
import { reactive, ref } from 'vue';
import { useAppStore } from './app';

export type Good = {
  id: string,
  title: string,
  description: string,
  price: number,
  stock: number,
  items: {
    /** UUID */
    mark: string,
    /** Human-readable */
    code: string,
  }[],
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
  const goodsByGoodId = ref<{ [key: string]: Good}>({});
  const goodsByItemId = ref<{ [key: string]: Good}>({});
  const imagesCache = reactive(new Map<string, string>()) // id -> base64 image
  const goodsLoading = ref(false)
  const goodsLoadingWaiter = ref(new Deferred())
  goodsLoadingWaiter.value.resolve(false)
  const imagesCacheExpirationAt = ref(Date.now())

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
        const stockRemainsMap = Object.fromEntries(stockRemains.map(v => [v.good_id, v]));
        goods.value = fetchedGoods.map(gc => ({
          ...gc,
          goods: gc.goods.filter(g => !!g).map(g => ({
            ...g,
            description: g.description?.replace(/\n/g, '<br/>'),
            stock: (stockRemainsMap[g.id]?.items?.length ?? 0) - (stockRemainsMap[g.id]?.reserved ?? 0),
            items: stockRemainsMap[g.id]?.items ?? [],
            images: g.images_ids.map(id => ({
              id,
              image: imagesCache.get(id),
            }))
          })),
        }));
        const goodsArray = goods.value.flatMap(gc => gc.goods);
        goodsByGoodId.value = Object.fromEntries(goodsArray.map(g => [g.id, g]));
        goodsByItemId.value = Object.fromEntries(goodsArray.flatMap(g => g.items.map(item => [item.mark, g])));
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

  const getGoodById = (id: string) => {
    return goodsByGoodId.value[id];
  }

  const getGoodByItemId = (id: string) => {
    return goodsByItemId.value[id];
  }

  const waitGoodsReady = async () => {
    await goodsLoadingWaiter.value.promise
  }

  return {
    goods,
    goodsByGoodId,
    goodsByItemId,
    getGoodById,
    getGoodByItemId,

    updateGoods,
    goodsLoading,
    goodsLoadingWaiter,
    imagesCache,
    imagesCacheExpirationAt,
    waitGoodsReady,
  }
},
  // {
  //   persist: true,
  // }

)

