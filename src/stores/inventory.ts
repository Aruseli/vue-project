import { t } from "i18next";
import { defineStore } from "pinia";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { getNextInventoryNumber } from "src/services/documents";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { useGoodsStore, type Good } from "./goods";

export type InventoryItem = {
  id: string,
  quant: number,
  price: number,
  title: string,
  stock: number | null,
  confirmed?: boolean,
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
    const kioskCorrId = appStore.kioskState.kioskCorr?.id ?? '';
    const doc = {
      id: undefined,
      state: 0,
      doc_type: settings?.inventory_doc_type_id ?? "",
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
        gs.goods.map((good, index) => ({
          id: undefined,
          state: 0,
          rec_order: index + 1,
          good_id: good.id,
          munit_id: settings?.munit_id ?? "", // default
          quant: 0,
          total: good.stock * good.price,
          doc_detail_link: undefined,
          doc_detail_type: settings?.inventory_docdetail_type_id ?? "",
        }),
      ))
    }
    return doc;
  }

  const submitInventory = async () => {
    const settings = appStore.kioskState.settings;
    const kioskCorrId = appStore.kioskState.kioskCorr?.id ?? '';
    const doc = {
      id: undefined,
      state: 0,
      doc_type: settings?.inventory_doc_type_id ?? "",
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
      details: inventory.value.map((item, index) => ({
        id: undefined,
        state: 0,
        rec_order: index + 1,
        good_id: item.id,
        munit_id: settings?.munit_id ?? "", // default
        quant: item.quant,
        total: item.quant * item.price,
        doc_detail_link: undefined,
        doc_detail_type: settings?.inventory_docdetail_type_id ?? "",
      })),
    };
    await apiSaveDocument(doc);
  };

  const updateInventory = async () => {
    inventoryLoading.value = true;
    try {
      inventory.value = goodsStore.goods
        .map((g) =>
          g.goods.map((good) => ({
            id: good.id,
            quant: 0,
            confirmed: false,
            price: good.price,
            title: good.title,
            stock: good.stock,
          }))
        )
        .flat();
      docNum.value = getNextInventoryNumber();
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

  const scanInventoryGood = async (good: Good) => {
    const inventoryItem = inventory.value?.find((i) => i.id == good.id);
    if (!inventoryItem) {
      return;
    }
    if (inventoryItem?.confirmed){
      return;
    }
    inventoryItem.quant += 1;
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
