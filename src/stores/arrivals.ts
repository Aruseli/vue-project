import { defineStore } from "pinia";
import { ref } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore, type Good } from "./goods";
import { ORDERS_CACHE_TTL } from "src/services/consts";
import { t } from "i18next";
import { Notify } from 'quasar';

export const useArrivalsStore = defineStore("arrivals", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const arrivalGoods = ref<ReturnType<typeof documentGoodsArrival> | null>(null);
  const arrivalGoodsDocument = ref<KioskDocument | null>(null);
  const arrivalGoodsLoading = ref(true);
  const arrivalLastUpdate = ref(0);

  const updateArrivals = async () => {
    arrivalGoodsLoading.value = true;
    try {
      const terminal_settings = appStore.kioskState.params?.terminal_settings;
      const documents = await apiGetDocuments(
        [terminal_settings!.goods_arrival_doc_type_id!],
        [2]
      );
      arrivalGoods.value = documents.map((ag) =>
      documentGoodsArrival(ag, goodsStore)
      );
      arrivalLastUpdate.value = Date.now();
    } finally {
      arrivalGoodsLoading.value = false;
    }
  };

  const confirmArrivalGoodsIssue = async () => {
    const doc = arrivalGoodsDocument.value;
    if (!doc) {
      return;
    }
    doc.state = 0;
    doc.details.forEach((d) => {
      const item = arrivalGoods.value?.items.find((i) => i.id == d.good_id);
      if (!item || d.quant != item.quant || item.issued != item.quant) {
        console.log("Order line mismatch while issuing", d, item);
        throw new Error(`Wrong state of order to issue.`);
      }
      d.total = (goodsStore.getGoodById(d.id)?.stock ?? 0) - d.quant;
    });
    await apiSaveDocument(doc);
  };

  const scanGood = async (good: Good) => {
    const arrivalItem = arrivalGoods.value?.items.find(
      (i) => i.id == good.id
    );
    if (arrivalItem) {
      const code = good.id === arrivalItem.id ? 210 + `${good.code}` + 9 : null;
      arrivalItem.issued += 1;
    }
  };

  return {
    arrivalGoods,
    arrivalGoodsDocument,
    arrivalLastUpdate,
    arrivalGoodsLoading,
    updateArrivals,
    confirmArrivalGoodsIssue,
    scanGood,
  };
});

function documentGoodsArrival(ga: KioskDocument, goodsStore: ReturnType<typeof useGoodsStore>) {
  let hasAllGoods = true;
  const arrival = {
    id: ga.id,
    arrivalNumStr: (ga.abbr_num?.toString().padStart(4, "0") ?? t('Unknown')),
    items: ga.details.map(d => {
      const good = goodsStore.getGoodById(d.good_id);
      if (!good) {
        hasAllGoods = false;
      }
      return {
        id: d.good_id,
        quant: d.quant,
        price: d.total / d.quant,
        title: good?.title,
        image: good?.images[0],
        issued: 0,
      };
    })
  };
  return {
    ...arrival,
    allTitles: arrival.items.map(g => g.title ?? t('Unknown')).join(', '),
    hasAllGoods,
    totalCount: arrival.items.reduce((acc, item) => acc + item.quant, 0),
    totalPrice: arrival.items.reduce((acc, item) => acc + item.quant * item.price, 0),
  };
}

