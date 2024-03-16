import { t } from "i18next";
import { defineStore } from "pinia";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { useGoodsStore, type Good } from "./goods";

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
        [settings!.inventory_doc_type_id!],[2]
      )

      inventoriesDocuments.value = inventoriesDocuments.value.filter(d =>
        d.corr_from_ref == appStore.kioskState.kioskCorr?.id)
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
    } catch {
      selectedInventory.value = null;
      selectedInventoryDocument.value = null;
    } finally {
      selectedInventoryLoading.value = false;
    }
  };


  const confirmSelectedInventory = async () => {
    const doc = selectedInventoryDocument.value;
    if (!doc) {
      return;
    }

    doc.state = 0;
    doc.respperson_ref = appStore.kioskState.userCorr?.id;

    doc.details.forEach((d) => {
      const item = selectedInventory.value?.items.find(
        (i) => i.id == d.good_id
      );

      if (!item) {
        throw new Error(`Wrong state of selectedInventory to issue.`);
      }
      d.quant = item?.quant;
      d.total = item?.price ?? 0 * d.quant;
    });

    await apiSaveDocument(doc);
  };

  const totalQuant = computed(() => {
    return selectedInventory.value?.items?.reduce(
      (acc: number, item: any) => acc + item.quant,
      0
    ) ?? 0;
  });

  const scanInventoryGood = async (good: Good) => {
    const selectedInventoryItem = selectedInventory.value?.items.find((i) => i.id == good.id);

    if (!selectedInventoryItem) {
      return;
    }
    if (selectedInventoryItem?.confirmed) {
      return;
    }
    // if (selectedInventoryItem.quant >= selectedInventoryItem.stock) {
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
    selectedInventoryItem.quant += 1;
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
  inv: KioskDocument,
  goodsStore: ReturnType<typeof useGoodsStore>
) {
  const inventory = {
    id: inv.id,
    inventoryNumStr: inv.abbr_num?.toString().padStart(4, "0") ?? t("Unknown"),
    inventoryDate: inv.doc_date,
    items: inv.details.map((d) => {
      const good = goodsStore.getGoodById(d.good_id);
      if (!good) {
      }
      return {
        id: d.good_id,
        stock: good?.stock ?? 0,
        title: good?.title,
        price: good?.price,
        quant: 0,
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

