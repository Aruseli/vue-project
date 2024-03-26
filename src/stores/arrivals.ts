import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore, type Good } from "./goods";
import { t } from "i18next";
import { Notify } from 'quasar';

export const useArrivalsStore = defineStore("arrivalsStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const arrivals = ref<ReturnType<typeof documentGoodsArrival>[]>([]);
  const arrivalsDocuments = ref([] as KioskDocument[]);
  const arrivalsLoading = ref(true);
  const arrivalsLastUpdate = ref(0);

  const arrival = ref<ReturnType<typeof documentGoodsArrival> | null>(null);
  const arrivalDocument = ref<KioskDocument | null>(null);
  const arrivalGoodsLoading = ref(true);

  const updateArrivals = async () => {
    arrivalsLoading.value = true;
    try {
      const settings = appStore.kioskState.settings;
      arrivalsDocuments.value = await apiGetDocuments(
        [settings!.goods_arrival_doc_type_id!],
        [2]
      );
      arrivalsDocuments.value = arrivalsDocuments.value.filter(d =>
        d.corr_to_ref == appStore.kioskState.kioskCorr?.id)
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
      if (Date.now() - arrivalsLastUpdate.value > appStore.kioskState.settings!.cache__arrivals_ttl_ms!) {
        await updateArrivals();
      }
      const arrivalDoc = arrivalsDocuments.value.find((d) => d.id == id) || null;
      arrival.value = arrivalDoc
        ? documentGoodsArrival(arrivalDoc, goodsStore)
        : null;
      arrivalDocument.value = arrivalDoc;
    } catch {
      arrival.value = null;
      arrivalDocument.value = null;
    } finally {
      arrivalGoodsLoading.value = false;
    }
  };

  const confirmArrivalGoodsIssue = async () => {
    const doc = arrivalDocument.value;
    if (!doc) {
      return;
    }
    doc.state = 0;
    doc.respperson_ref = appStore.kioskState.userCorr?.id;
    doc.details.forEach((d) => {
      const item = arrival.value?.items.find((i) => i.id == d.good_id);
      if (!item || d.quant != item.quant || item.issued != item.quant) {
        throw new Error(`Wrong state of arrival to issue.`);
      }
      d.total = item.price * d.quant;
    });
    await apiSaveDocument(doc);
  };

  const totalQuant = computed(() => {
    if (arrival.value?.items) {
      return arrival.value.items.reduce(
        (acc: number, item: any) => acc + item.issued,
        0
      );
    }
    return 0;
  });

  const scanArrivalGood = async (good: Good) => {
    const arrivalItem = arrival.value?.items.find((i) => i.id == good.id);
    if (!arrivalItem) {
      return;
    }
    if (arrivalItem.issued >= arrivalItem.quant) {
      console.error("Stop scan");
      Notify.create({
        color: "warning",
        position: "center",
        classes: "text-h3 text-center text-uppercase",
        timeout: 30000,
        textColor: "white",
        message: t("product_has_already_been_scanned"),
      });
      return;
    }
    if (arrivalItem.confirmed == true) {
      console.error("Stop scan");
      Notify.create({
        color: "warning",
        position: "center",
        classes: "text-h3 text-center text-uppercase",
        timeout: 3000,
        textColor: "white",
        message: t("you_are_scanning_an_item_whose_quantity_has_been_confirmed"),
      });
    return;
    }
    arrivalItem.issued += 1;
    totalQuant;
  };


  return {
    arrivals,
    arrivalsDocuments,
    arrivalsLoading,

    arrival,
    arrivalDocument,
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
        image: good?.images[0]?.image,
        issued: 0,
        confirmed: false,
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

