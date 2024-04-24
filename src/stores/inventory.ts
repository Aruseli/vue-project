import { t } from "i18next";
import { defineStore } from "pinia";
import { KioskDocument, SaveableDocument, apiGetDocument, apiGetDocuments, apiSaveDocument, throwErr } from "src/services";
import { getNextInventoryNumber } from "src/services/documents/counters";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { useGoodsStore, type Good } from "./goods";
import { Notify } from 'quasar';
import { journalErroneousAction } from "src/services/documents/documents";
import { showSimpleNotification } from "src/services/dialogs";

export type InventoryItem = {
  id: string,
  quant: number,
  price: number,
  title: string,
  stock: number | null,
  confirmed?: boolean,
  scannedItems: string[],
}

export const useInventoryStore = defineStore("inventoryStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const inventory = ref<InventoryItem[]>([]);
  const inventoryDocument = ref<KioskDocument | null>(null);
  const inventoryLoading = ref(true);
  const docNum = ref(0);

  // This will be useful when we apply DRI to code and merge document stores
  const initFullInventoryDoc = async () => {
    const settings = appStore.kioskState.settings;
    const kioskCorrId = appStore.kioskState.kioskCorr?.id ?? throwErr("Missing kioskCorr");
    const doc = {
      id: undefined,
      state: 2,
      doc_type: settings?.doc_type__inventory ?? "",
      abbr_text: undefined,
      abbr_num: getNextInventoryNumber(),
      doc_date: new Date().toISOString(),
      doc_order: 0,
      corr_from_ref: kioskCorrId,
      corr_to_ref: kioskCorrId,
      respperson_ref: appStore.kioskState.userCorr?.id ?? "",
      currency_ref: settings?.currency_id ?? "",
      curr_rate: 1,
      comment: undefined,
      details: goodsStore.goods.flatMap(gs =>
        gs.goods.flatMap((good, index) => good.itemIds.map((itemId, index2) => ({
          id: undefined,
          state: 0,
          rec_order: index * 100 + index2 + 1,
          good_id: good.id,
          munit_id: settings?.munit_id ?? "", // default
          quant: 1,
          total: good.price,
          doc_detail_link: itemId,
          doc_detail_type: settings?.docdetail_type__inventory ?? "",
        })),
      ))
    }
    return doc;
  }

  const submitInventory = async () => {
    const doc: SaveableDocument | null = inventoryDocument.value;
    if (!doc) {
      throw new Error('Missing inventory document');
    }

    doc.state = 0;
    doc.respperson_ref = appStore.kioskState.userCorr?.id ?? throwErr("Missing userCorr");

    doc.details = inventory.value?.flatMap((item, goodIndex) =>
      item.scannedItems.map((itemId, index) => ({
        id: undefined,
        state: 0,
        rec_order: goodIndex * 100 + index,
        good_id: item.id,
        munit_id: appStore.kioskState.settings?.munit_id ?? '',
        quant: 1,
        total: item.price,
        doc_detail_link: itemId,
        doc_detail_type: appStore.kioskState.settings?.docdetail_type__inventory ?? '',
      }))) ?? [];

    const documentId = await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '');
    return { documentId }
  };

  const updateInventory = async () => {
    inventoryLoading.value = true;
    try {
      const doc = await initFullInventoryDoc();
      const documentId = await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '');
      inventoryDocument.value = await apiGetDocument(documentId);
      inventory.value = documentToInventory(inventoryDocument.value, goodsStore).items;
      const debugGoodItemIds = inventory.value?.flatMap(i => goodsStore.getGoodById(i.id).itemIds);
      console.log("Order expected good individual IDs", debugGoodItemIds);
      console.log(debugGoodItemIds.map(s => `curl --location 'http://127.0.0.1:3010/api/system/emulate/barcode?code=${s}'`).join('\n'))
    } finally {
      inventoryLoading.value = false;
    }
  };

  const totalActualQuant = computed(() => {
    return inventory.value?.reduce(
      (acc: number, item: any) => acc + item.quant,
      0
    ) ?? 0;
  });

  const scanInventoryGood = async (itemId: string) => {
    const docId = inventoryDocument.value?.id ?? throwErr("Missing selectedInventory.value?.id");
    const good = goodsStore.getGoodByItemId(itemId);
    if (!good) {
      await journalErroneousAction(docId, { event_type: 'unknown_good_marking', marking: itemId });
      showSimpleNotification(t('unknown_good_marking'));
      return;
    }
    const inventoryItem = inventory.value?.find((i) => i.id == good.id);
    if (!inventoryItem) {
      await journalErroneousAction(docId, { event_type: 'scanned_good_is_not_in_inventory', marking: itemId });
      showSimpleNotification(t('scanned_good_is_not_in_inventory'));
      return;
    }
    if (inventoryItem.scannedItems.includes(itemId)) {
      await journalErroneousAction(docId, { event_type: 'repeated_good_scan', marking: itemId });
      showSimpleNotification(t('repeated_good_scan'));
      return;
    }
    inventoryItem.quant = inventoryItem.scannedItems.push(itemId)

    // you_are_scanning_an_item_whose_quantity_has_been_confirmed now unused because of individual barcodes
  };

  return {
    inventory,
    inventoryDocument,
    inventoryLoading,
    updateInventory,
    scanInventoryGood,
    submitInventory,
    totalQuantity: computed(() =>
      inventory.value.reduce((acc, item) => acc + (item.stock ?? 0), 0)
    ),
    totalActualQuant,
    docNum,
    docNumStr: computed(() => docNum.value?.toString().padStart(4, "0") ?? t("Unknown")),
  };
});

function documentToInventory(
  inv: SaveableDocument,
  goodsStore: ReturnType<typeof useGoodsStore>
) {
  const goodIds = [...new Set(inv.details.map(d => d.good_id as string))]
  const inventory = {
    id: inv.id,
    inventoryNumStr: inv.abbr_num?.toString().padStart(4, "0") ?? t("Unknown"),
    inventoryDate: inv.doc_date,
    items: goodIds.map(goodId => {
      const good = goodsStore.getGoodById(goodId);
      return {
        id: goodId,
        stock: good?.stock ?? 0,
        title: good?.title,
        price: good?.price,
        quant: 0,
        scannedItems: [] as string[],
        confirmed: false,
      };
    }),
  };
  return {
    ...inventory,
    totalStock: inventory.items.reduce(
      (acc, item) => acc + (item.stock ?? 0),
      0
    ),
  };
}
