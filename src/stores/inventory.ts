import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore, type Good, GoodCategory } from "./goods";
import { ORDERS_CACHE_TTL } from "src/services/consts";
import { t } from "i18next";
import { Notify } from 'quasar';
import { getNextInventoryNumber } from "src/services/documents";

export type InventoryItem = {
  id: string,
  quant: number,
  price: number,
}

export const useInventoryStore = defineStore("inventoryStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  // const inventory = ref<ReturnType<typeof documentToInventory>[]>([]);
  const inventory = ref<InventoryItem[]>([]);
  const inventoryDocument = ref<KioskDocument | null>(null);
  const inventoryLoading = ref(true);

  const submitInventory = async () => {
    const terminal_settings = appStore.kioskState.params?.terminal_settings
    const doc = {
      id: undefined,
      state: 2,
      doc_type: terminal_settings?.inventory_doc_type_id ?? '',
      abbr_text: undefined,
      abbr_num: getNextInventoryNumber(),
      doc_date: new Date().toISOString(),
      doc_order: 0,
      corr_from_ref: terminal_settings?.kiosk_corr_id ?? '',
      corr_to_ref: terminal_settings?.client_corr_id ?? '',
      respperson_ref: appStore.kioskState.user?.id ?? '',
      currency_ref: terminal_settings?.currency_id ?? '',
      curr_rate: 1,
      comment: undefined,
      details: inventory.value.map((item, index) => ({
        id: undefined,
        state: 0,
        rec_order: index + 1,
        good_id: item.id,
        munit_id: terminal_settings?.munit_id ?? '', // default
        quant: item.quant,
        total: item.quant * item.price,
        doc_detail_link: undefined,
        doc_detail_type: terminal_settings?.inventory_docdetail_type_id ?? '',
      })),
    }
    await apiSaveDocument(doc)
  }
  // for (let i = 0; i < goodsStore.goods.length; i++) {
  //   for (let j = 0; j < goodsStore.goods[i].goods.length; j++) {
  //     let item = {
  //       ...goodsStore.goods[i].goods[j],
  //       quant: 0,
  //     };
  //     inventory.value.push(item);
  //   }
  //   return inventory;
  // }

  const updateInventory = async () => {
    inventoryLoading.value = true;
    try {
      const terminal_settings = appStore.kioskState.params?.terminal_settings;
      inventory.value = goodsStore.goods
        .map((g) =>
          g.goods.map((good) => ({
            ...good,
            id: good.id,
            quant: 0,
          }))
        )
        .flat();
    } finally {
      inventoryLoading.value = false;
    }
  };

  const scanInventoryGood = async (good: Good) => {
    const inventoryItem = inventory.value?.find(
      (i) => i.id == good.id
    );
    if (!inventoryItem) {
      return;
    }
    if (inventoryItem.quant >= inventoryItem.quant) {
      console.error("Stop scan");
      Notify.create({
        color: 'warning',
        position: 'center',
        classes: "text-h3 text-center text-uppercase",
        timeout: 30000,
        textColor: "white",
        message: t('product_has_already_been_scanned'),
      });
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
  };
});

function documentToInventory(inv: KioskDocument, goodsStore: ReturnType<typeof useGoodsStore>) {
  const inventory = {
    id: inv.id,
    inventoryNumStr: (inv.abbr_num?.toString().padStart(4, "0") ?? t('Unknown')),
    items: inv.details.map(d => {
      const good = goodsStore.getGoodById(d.good_id);
      if (!good) {
      }
      return {
        id: d.good_id,
        stock: d.quant,
        title: good?.title,
        quant: 0,
      };
    })
  };
  return {
    ...inventory,
    totalCount: inventory.items.reduce((acc, item) => acc + item.quant, 0),
  };
}

