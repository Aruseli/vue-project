import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument, throwErr } from "src/services";
import { useGoodsStore, type Good } from "./goods";
import { t } from "i18next";
import { Notify } from 'quasar';
import { journalErroneousAction } from "src/services/documents/documents";
import { showSimpleNotification } from "src/services/dialogs";
import { settings } from "src/services/terminal";

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
        [settings!.doc_type__goods_arrival!],
        [2],
        [appStore.kioskState.kioskCorr?.id ?? throwErr("Missing kioskCorr")],
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
      if (Date.now() - arrivalsLastUpdate.value > appStore.kioskState.settings!.cache__arrivals_ttl_ms!) {
        await updateArrivals();
      }
      const arrivalDoc = arrivalsDocuments.value.find((d) => d.id == id) || null;
      arrival.value = arrivalDoc
        ? documentGoodsArrival(arrivalDoc, goodsStore)
        : null;
      arrivalDocument.value = arrivalDoc;
      const debugGoodItemIds = arrival.value?.items.flatMap(i => i.itemsToScan);
      console.log("Arrival expected good individual IDs", debugGoodItemIds);
      console.log(debugGoodItemIds?.map(s => `curl --location 'http://127.0.0.1:3010/api/system/emulate/barcode?code=${s}'`).join('\n'))
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
    doc.details.filter(d => d.doc_detail_type == settings.value?.docdetail_type__goods_arrival_incoming)
      .forEach((d) => {
        const item = arrival.value?.items.find((i) => i.id == d.good_id);
        if (!item || d.quant != 1 || item.issued != item.quant || !item.itemsToScan.includes(d.doc_detail_link)) {
          throw new Error(`Wrong state of arrival to issue.`);
        }
        d.total = item.price * d.quant;
      });
    await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '');
    return { success: true, documentId: doc.id };
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

  const scanArrivalGood = async (itemId: string) => {
    const docId = arrival.value?.id ?? throwErr("Missing currentOrder.value?.id");
    const arrivalItem = arrival.value?.items.find((i) => i.itemsToScan.includes(itemId));
    if (!arrivalItem) {
      await journalErroneousAction(docId, { event_type: 'scanned_good_not_in_arrival', marking: itemId });
      showSimpleNotification(t('scanned_good_not_in_arrival'));
      return;
    }
    if (arrivalItem.issuedItems.includes(itemId)) {
      await journalErroneousAction(docId, { event_type: 'repeated_good_scan', marking: itemId });
      showSimpleNotification(t('repeated_good_scan'));
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
    arrivalItem.issued = arrivalItem.issuedItems.push(itemId);
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
  const goodIds = [...new Set(ad.details.map(d => d.good_id as string))]
  const arrival = {
    id: ad.id,
    arrivalNumStr: (ad.abbr_num?.toString().padStart(4, "0") || t('Unknown')),
    items: goodIds.map(goodId => {
      const good = goodsStore.getGoodById(goodId);
      if (!good) {
        hasAllGoods = false;
      }
      const goodDetails = ad.details.filter(d => d.good_id == goodId && d.doc_detail_type == settings.value?.docdetail_type__goods_arrival_incoming);
      const quant = goodDetails.reduce((acc, d) => acc + d.quant, 0);
      const total = goodDetails.reduce((acc, d) => acc + d.total, 0);
      return {
        id: goodId,
        quant,
        price: total / quant,
        title: good?.title,
        image: good?.images[0]?.image,
        itemsToScan: goodDetails.map(d => d.doc_detail_link),
        issued: 0,
        issuedItems: [] as string[],
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

