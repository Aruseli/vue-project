import { t } from "i18next";
import { defineStore } from "pinia";
import { KioskDocument, SaveableDocument, apiGetDocument, apiGetDocuments, apiSaveDocument, throwErr } from "src/services";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { useGoodsStore } from "./goods";
import { journalErroneousAction } from "src/services/documents/documents";
import { showSimpleNotification } from "src/services/dialogs";
import { settings } from "src/services/terminal";
import { kioskCorr, userCorr } from "src/services/documents/correspondents";
import { terminalShift } from "src/services/shifts";

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
  const goodsStore = useGoodsStore();

  const inventory = ref<ReturnType<typeof documentToInventory> | null>(null);
  const inventoryDocument = ref<KioskDocument | null>(null);
  const inventoryLoading = ref(true);

  const inventoryRequestsCurrent = ref<string | undefined>(undefined);
  const inventoryRequestsLoading = ref(true);
  const inventoryRequestsDocuments = ref([] as KioskDocument[]);
  const inventoryRequestsLastUpdate = ref(0);

  const updateInventoryRequests = async () => {
    inventoryRequestsLoading.value = true;
    try {
      if (!settings.value || !kioskCorr.value) {
        console.error("Settings or kioskCorr are not defined");
        return;
      }
      const documents = await apiGetDocuments(
        [settings.value.doc_type__inventory_request],
        [settings.value.inventory_request_state_requested],
        [kioskCorr.value.id],
      )
      documents.sort(
        (a, b) => (a.doc_date != b.doc_date) ? a.doc_date - b.doc_date : a.doc_order - b.doc_order
      );
      inventoryRequestsDocuments.value = documents;
      inventoryRequestsLastUpdate.value = Date.now();
    } finally {
      inventoryRequestsLoading.value = false;
    }
  };


  const initInventoryDocForGoods = async (goodIds: Set<string>) => {
    if (!settings.value || !kioskCorr.value || !userCorr.value) {
      throwErr("Settings or kioskCorr or userCorr are not defined");
    }
    const doc = {
      id: undefined,
      state: 2,
      doc_type: settings.value.doc_type__inventory,
      abbr_text: undefined,
      doc_date: new Date().toISOString(),
      doc_order: 0,
      corr_from_ref: kioskCorr.value.id,
      corr_to_ref: kioskCorr.value.id,
      respperson_ref: userCorr.value.id,
      currency_ref: settings.value.currency_id,
      curr_rate: 1,
      comment: undefined,
      details: goodsStore.goods.flatMap(gs =>
        gs.goods.filter(g => goodIds.has(g.id)).flatMap((good, index) =>
          good.items.map((item, index2) => ({
            id: undefined,
            state: 0,
            rec_order: index * 100 + index2 + 1,
            good_id: good.id,
            munit_id: settings.value?.munit_id ?? "",
            quant: 1,
            total: good.price,
            doc_detail_link: item.mark,
            doc_detail_type: settings.value?.docdetail_type__inventory ?? "",
          })
        ),
      ))
    }
    return doc;
  }

  const submitInventory = async (autocomplete = false) => {
    const doc: SaveableDocument | null = inventoryDocument.value;
    if (!doc) {
      throw new Error('Missing inventory document');
    }

    if (autocomplete) {
      inventory.value?.items.forEach(i => {
        i.scannedItems.push(...i.itemsToScan.map(its => its.mark).filter(id => !i.scannedItems.includes(id)));
      });
    }

    doc.state = 0;
    doc.respperson_ref = userCorr.value?.id ?? throwErr("Missing userCorr");

    doc.details = inventory.value?.items.flatMap((item, goodIndex) =>
      item.scannedItems.map((itemId, index) => ({
        id: undefined,
        state: 0,
        rec_order: goodIndex * 100 + index,
        good_id: item.id,
        munit_id: settings.value?.munit_id ?? '',
        quant: 1,
        total: item.price,
        doc_detail_link: itemId,
        doc_detail_type: settings.value?.docdetail_type__inventory ?? '',
      }))) ?? [];

    const documentId = await apiSaveDocument(doc, terminalShift.value?.id);

    const reqDoc = inventoryRequestsCurrent.value ? inventoryRequestsDocuments.value.find(d => d.id == inventoryRequestsCurrent.value) : undefined;
    if (reqDoc) {
      reqDoc.state = settings.value?.inventory_request_state_fulfilled ?? throwErr("Missing inventory_request_state_fulfilled");
      await apiSaveDocument(doc, terminalShift.value?.id);
    }

    return { documentId }
  };

  const prepareInventory = async (goodIds: Set<string>) => {
    const doc = await initInventoryDocForGoods(goodIds);
    const documentId = await apiSaveDocument(doc, terminalShift.value?.id);
    inventoryDocument.value = await apiGetDocument(documentId);
    inventory.value = documentToInventory(inventoryDocument.value, goodsStore);
    const debugGoodItemCodes = inventory.value?.items.flatMap(i => goodsStore.getGoodById(i.id).items.map(item => item.code));
    console.log("Inventory expected good individual codes", debugGoodItemCodes);
    console.log(debugGoodItemCodes.map(s => `curl --location 'http://127.0.0.1:3010/api/system/emulate/barcode?code=''url?g=${s}'''`).join('\n'))
    console.log(debugGoodItemCodes.map(s => `https://tdp.high-thai.com/api/system/emulate/barcode?code=''url?g=${s}''`).join('\n'))
  }

  const prepareFullInventory = async () => {
    inventoryLoading.value = true;
    try {
      const allGoodsIds = new Set(goodsStore.goods.flatMap(gc => gc.goods.map(g => g.id)));
      inventoryRequestsCurrent.value = undefined;
      await prepareInventory(allGoodsIds);
    } finally {
      inventoryLoading.value = false;
    }
  };

  const prepareRequestedInventory = async () => {
    inventoryLoading.value = true;
    try {
      const cache_ttl = settings.value?.cache__inventories_ttl_ms ?? throwErr('settings not defined');
      if (Date.now() - inventoryRequestsLastUpdate.value > cache_ttl) {
        await updateInventoryRequests();
      }
      const requestDoc = inventoryRequestsDocuments.value[0] || null;
      const goodIds = new Set(requestDoc.details.map(d => d.good_id));
      inventoryRequestsCurrent.value = requestDoc.id;
      await prepareInventory(goodIds);
    } finally {
      inventoryLoading.value = true;
    }
  }

  const totalActualQuant = computed(() => {
    return inventory.value?.items.reduce(
      (acc: number, item: any) => acc + item.quant,
      0
    ) ?? 0;
  });

  const scanInventoryGood = async (itemIdOrCode: string) => {
    const docId = inventoryDocument.value?.id ?? throwErr("Missing selectedInventory.value?.id");
    const good = goodsStore.getGoodByItemCode(itemIdOrCode) ?? goodsStore.getGoodByItemId(itemIdOrCode);
    const itemId = good?.items.find(g => g.code == itemIdOrCode || g.mark == itemIdOrCode)?.mark;
    if (!good || !itemId) {
      await journalErroneousAction(docId, { event_type: 'unknown_good_marking', marking: itemIdOrCode });
      showSimpleNotification(t('unknown_good_marking'));
      return;
    }
    const inventoryItem = inventory.value?.items.find((i) => i.id == good.id);
    if (!inventoryItem) {
      await journalErroneousAction(docId, { event_type: 'scanned_good_is_not_in_inventory', marking: itemIdOrCode });
      showSimpleNotification(t('scanned_good_is_not_in_inventory'));
      return;
    }
    if (inventoryItem.scannedItems.includes(itemId)) {
      await journalErroneousAction(docId, { event_type: 'repeated_good_scan', marking: itemIdOrCode });
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
    inventoryRequestsDocuments,
    inventoryRequestsLastUpdate,
    inventoryRequestsLoading,
    updateInventoryRequests,
    prepareFullInventory,
    prepareRequestedInventory,
    scanInventoryGood,
    submitInventory,
    totalActualQuant,
    docNumStr: computed(() => inventoryDocument.value?.abbr_num?.toString().padStart(4, "0") ?? t("Unknown")),
    isInventoryDone: computed(() => inventory.value?.items.every(i => i.scannedItems.length == i.itemsToScan.length) ?? false),
  };
});

function documentToInventory(
  inv: KioskDocument,
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
        itemsToScan: good.items,
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
