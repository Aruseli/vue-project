import { defineStore } from "pinia";
import { ref } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore, type Good } from "./goods";
import { ARRIVALS_CACHE_TTL } from "src/services/consts";
import { t } from "i18next";
import { Notify } from 'quasar';

export const useArrivalsStore = defineStore("arrivalsStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const arrivals = ref<ReturnType<typeof documentGoodsArrival>[]>([]);
  const arrivalsDocuments = ref([] as KioskDocument[]);
  const arrivalsLoading = ref(true);
  const arrivalsLastUpdate = ref(0);

  const arrivalGoods = ref<ReturnType<typeof documentGoodsArrival> | null>(null);
  const arrivalsDocument = ref<KioskDocument | null>(null);
  const arrivalGoodsLoading = ref(true);

  const updateArrivals = async () => {
    arrivalsLoading.value = true;
    try {
      const terminal_settings = appStore.kioskState.params?.terminal_settings;
      arrivalsDocuments.value = await apiGetDocuments(
        [terminal_settings!.goods_arrival_doc_type_id!],
        [2]
      );
      arrivals.value = arrivalsDocuments.value.map((ag) =>
      documentGoodsArrival(ag, goodsStore)
      );
      arrivalsLastUpdate.value = Date.now();
    } finally {
      arrivalsLoading.value = false;
    }
  };

  const selectArrival = async (id: string) => {
    arrivalGoodsLoading.value = true;
    try {
      // Bug: await apiGetDocument(id) returns none, and we forced to use updateArrivals
      if (Date.now() - arrivalsLastUpdate.value > ARRIVALS_CACHE_TTL) {
        await updateArrivals();
      }
      const arrivalDoc = arrivalsDocuments.value.find((d) => d.id == id) || null;
      arrivalGoods.value = arrivalDoc
        ? documentGoodsArrival(arrivalDoc, goodsStore)
        : null;
      arrivalsDocument.value = arrivalDoc;
    } catch {
      arrivalGoods.value = null;
      arrivalsDocument.value = null;
    } finally {
      arrivalGoodsLoading.value = false;
    }
  };

  const confirmArrivalGoodsIssue = async () => {
    const doc = arrivalsDocument.value;
    if (!doc) {
      return;
    }
    doc.state = 0;
    doc.details.forEach((d) => {
      const item = arrivalGoods.value?.items.find((i) => i.id == d.good_id);
      if (!item || d.quant != item.quant || item.issued != item.quant) {
        throw new Error(`Wrong state of arrival to issue.`);
      }
      d.total = (goodsStore.getGoodById(d.id)?.stock ?? 0) - d.quant;
    });
    await apiSaveDocument(doc);
  };

  const totalQuant = ref(0);
  const scanArrivalGood = async (good: Good) => {
    const arrivalItem = arrivalGoods.value?.items.find((i) => i.id == good.id);
    if (arrivalItem) {
      // if (arrivalItem.issued >= arrivalItem.quant) {
      //   console.error("Stop scan");
      //   Notify.create({
      //     color: "warning",
      //     position: "center",
      //     classes: "text-h3 text-center text-uppercase",
      //     timeout: 30000,
      //     textColor: "white",
      //     message: t("product_has_already_been_scanned"),
      //   });
      //   return;
      // }
      arrivalItem.issued += 1;
      totalQuant.value += 1;
    }
    // for (let i = 0; i < array.length; i++) {

    // }
  };



  // function increaseQuant() {
  //   for (let i = 0; i < array.length; i++) {
  //     array[i].quant.value += 1;
  //     totalQuant.value += 1;
  //   }
  // }

  return {
    arrivals,
    arrivalsDocuments,
    arrivalsLoading,

    arrivalGoods,
    arrivalsDocument,
    arrivalGoodsLoading,

    totalQuant,

    updateArrivals,
    selectArrival,
    confirmArrivalGoodsIssue,
    scanArrivalGood,
  };
});

function documentGoodsArrival(ad: KioskDocument, goodsStore: ReturnType<typeof useGoodsStore>) {
  let hasAllGoods = true;
  const arrival = {
    id: ad.id,
    arrivalNumStr: (ad.abbr_num?.toString().padStart(4, "0") || t('Unknown')),
    items: ad.details.map(d => {
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

