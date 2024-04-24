import { t } from "i18next";
import { defineStore } from "pinia";
import { KioskDocument, SaveableDocument, apiGetDocuments, apiSaveDocument, throwErr } from "src/services";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { useGoodsStore } from "./goods";
import { journalErroneousAction } from "src/services/documents/documents";
import { showSimpleNotification } from "src/services/dialogs";

export const useSelectiveInventoryStore = defineStore("selectiveInventoryStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const inventories = ref<ReturnType<typeof documentToInventory>[]>([]);
  const inventoriesDocuments = ref([] as KioskDocument[]);
  const inventoriesLoading = ref(true);
  const inventoriesLastUpdate = ref(0);

  const selectedInventory = ref<ReturnType<typeof documentToInventory> | null>(null);
  const selectedInventoryDocument = ref<KioskDocument | null>(null);
  const selectedInventoryLoading = ref(true);

  const updateInventories = async () => {
    inventoriesLoading.value = true;
    try {
      const settings = appStore.kioskState.settings;
      inventoriesDocuments.value = await apiGetDocuments(
        [settings!.doc_type__inventory!],
        [2],
        [appStore.kioskState.kioskCorr?.id ?? throwErr("Missing kioskCorr")],
      )

      inventoriesDocuments.value.sort(
        (a, b) => (a.doc_date != b.doc_date) ? a.doc_date - b.doc_date : a.doc_order - b.doc_order
      );
      inventories.value = inventoriesDocuments.value.map((inv) =>
        documentToInventory(inv, goodsStore)
      );
      inventoriesLastUpdate.value = Date.now();
    } finally {
      inventoriesLoading.value = false;
    }
  };

  const selectInventory = async () => {
    selectedInventoryLoading.value = true;
    try {
      if (Date.now() - inventoriesLastUpdate.value > appStore.kioskState.settings!.cache__inventories_ttl_ms!) {
        await updateInventories();
      }
      const inventoryDoc = inventoriesDocuments.value[0] || null;

      selectedInventory.value = inventoryDoc
        ? documentToInventory(inventoryDoc, goodsStore)
        : null;
      selectedInventoryDocument.value = inventoryDoc;
      const debugGoodItemIds = selectedInventory.value?.items.flatMap(i => goodsStore.getGoodById(i.id).items.map(item => item.mark));
      console.log("Inventory expected good individual IDs", debugGoodItemIds);
      console.log(debugGoodItemIds?.map(s => `curl --location 'http://127.0.0.1:3010/api/system/emulate/barcode?code=${s}'`).join('\n'));
    } catch {
      selectedInventory.value = null;
      selectedInventoryDocument.value = null;
    } finally {
      selectedInventoryLoading.value = false;
    }
  };


  const confirmSelectedInventory = async () => {
    const doc: SaveableDocument | null = selectedInventoryDocument.value;
    if (!doc) {
      return;
    }

    doc.state = 0;
    doc.respperson_ref = appStore.kioskState.userCorr?.id ?? throwErr("Missing userCorr");

    doc.details = selectedInventory.value?.items.flatMap((item, goodIndex) =>
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

    await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '');
    return {documentId: doc.id};
  };

  const totalQuant = computed(() => {
    return selectedInventory.value?.items?.reduce(
      (acc: number, item: any) => acc + item.quant,
      0
    ) ?? 0;
  });

  const scanInventoryGood = async (itemId: string) => {
    const docId = selectedInventory.value?.id ?? throwErr("Missing selectedInventory.value?.id");
    const good = goodsStore.getGoodByItemId(itemId);
    if (!good) {
      await journalErroneousAction(docId, { event_type: 'unknown_good_marking', marking: itemId });
      showSimpleNotification(t('unknown_good_marking'));
      return;
    }
    const inventoryItem = selectedInventory.value?.items.find((i) => i.id == good.id);
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
  };

  return {
    inventories,
    inventoriesDocuments,
    inventoriesLoading,

    selectedInventory,
    selectedInventoryDocument: selectedInventoryDocument,
    totalQuant,

    updateInventories,
    selectInventory,
    confirmSelectedInventory,
    scanInventoryGood,
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

