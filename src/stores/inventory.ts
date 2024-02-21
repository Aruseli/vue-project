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
  confirm?: boolean,
}

export const useInventoryStore = defineStore("inventoryStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const inventory = ref<InventoryItem[]>([]);
  const inventoryDocument = ref<KioskDocument | null>(null);
  const inventoryLoading = ref(true);

  const initFullInventoryDoc = async () => {
    const terminal_settings = appStore.kioskState.params?.terminal_settings;
    const doc = {
      id: undefined,
      state: 0,
      doc_type: terminal_settings?.inventory_doc_type_id ?? "",
      abbr_text: undefined,
      abbr_num: getNextInventoryNumber(),
      doc_date: new Date().toISOString(),
      doc_order: 0,
      corr_from_ref: terminal_settings?.kiosk_corr_id ?? "",
      corr_to_ref: terminal_settings?.kiosk_corr_id ?? "",
      respperson_ref: appStore.kioskState.user?.id ?? "",
      currency_ref: terminal_settings?.currency_id ?? "",
      curr_rate: 1,
      comment: undefined,
      details: goodsStore.goods.map(gs =>
        gs.goods.map((good, index) => ({
          id: undefined,
          state: 0,
          rec_order: index + 1,
          good_id: good.id,
          munit_id: terminal_settings?.munit_id ?? "", // default
          quant: 0,
          total: good.stock * good.price,
          doc_detail_link: undefined,
          doc_detail_type: terminal_settings?.inventory_docdetail_type_id ?? "",
        }),
      ))
    }
    return doc;
  }

  const submitInventory = async () => {
    const terminal_settings = appStore.kioskState.params?.terminal_settings;
    const doc = {
      id: undefined,
      state: 0,
      doc_type: terminal_settings?.inventory_doc_type_id ?? "",
      abbr_text: undefined,
      abbr_num: getNextInventoryNumber(),
      doc_date: new Date().toISOString(),
      doc_order: 0,
      corr_from_ref: terminal_settings?.kiosk_corr_id ?? "",
      corr_to_ref: terminal_settings?.kiosk_corr_id ?? "",
      respperson_ref: appStore.kioskState.user?.id ?? "",
      currency_ref: terminal_settings?.currency_id ?? "",
      curr_rate: 1,
      comment: undefined,
      details: inventory.value.map((item, index) => ({
        id: undefined,
        state: 0,
        rec_order: index + 1,
        good_id: item.id,
        munit_id: terminal_settings?.munit_id ?? "", // default
        quant: item.quant,
        total: item.quant * item.price,
        doc_detail_link: undefined,
        doc_detail_type: terminal_settings?.inventory_docdetail_type_id ?? "",
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
            confirm: false,
            price: good.price,
            title: good.title,
            stock: good.stock,
          }))
        )
        .flat();
    } finally {
      inventoryLoading.value = false;
    }
  };

  const totalActualQuant = computed(() => {
    if (inventory.value?.length) {
      return inventory.value.reduce(
        (acc: number, item: any) => acc + item.quant,
        0
      );
    }
    return 0;
  });

  const scanInventoryGood = async (good: Good) => {
    const inventoryItem = inventory.value?.find((i) => i.id == good.id);
    if (inventoryItem?.confirm){
      return;
    } else {
      if (!inventoryItem) {
        return;
      }
    inventoryItem.quant += 1;
    totalActualQuant;
    }
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
    docNum: getNextInventoryNumber().toString().padStart(4, "0"),
  };
});



