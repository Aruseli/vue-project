import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore, type Good } from "./goods";
import { ARRIVALS_CACHE_TTL } from "src/services/consts";
import { t } from "i18next";
import { Notify } from 'quasar';

export const useSelectInventoryStore = defineStore("selectInventoryStore", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const inventories = ref<ReturnType<typeof documentToInventory>[]>([]);
  const inventoriesDocuments = ref([] as KioskDocument[]);
  const inventoriesLoading = ref(true);
  const inventoriesLastUpdate = ref(0);

  const selectInventory = ref<ReturnType<typeof documentToInventory> | null>(null);
  const selectInventoryDocument = ref<KioskDocument | null>(null);
  const selectInventoryLoading = ref(true);

  const updateInventories = async () => {
    inventoriesLoading.value = true;
    try {
      const terminal_settings = appStore.kioskState.params?.terminal_settings;
      inventoriesDocuments.value = await apiGetDocuments(
        [terminal_settings!.inventory_doc_type_id!],
        [2]
      );
      inventories.value = inventoriesDocuments.value.map((inv) =>
      documentToInventory(inv, goodsStore)
      );
      inventoriesLastUpdate.value = Date.now();
    } finally {
      inventoriesLoading.value = false;
    }
  };

   const selectedInventory = async () => {
      selectInventoryLoading.value = true;
      try {
        // Bug: await apiGetDocument(id) returns none, and we forced to use updateArrivals
        if (Date.now() - inventoriesLastUpdate.value > ARRIVALS_CACHE_TTL) {
          await updateInventories();
        }

        // Fix type error by casting inventoriesDocuments to KioskDocument[]
        const inventoryDoc =
          (inventoriesDocuments.value as KioskDocument[]).sort(
            (a, b) => a.doc_date - b.doc_date
          )[0] || null;

        selectInventory.value = inventoryDoc
          ? documentToInventory(inventoryDoc, goodsStore)
          : null;
        selectInventoryDocument.value = inventoryDoc;
      } catch {
        selectInventory.value = null;
        selectInventoryDocument.value = null;
      } finally {
        selectInventoryLoading.value = false;
      }
    };


    const confirmSelectedInventory = async () => {
      const doc = selectInventoryDocument.value;
      if (!doc) {
        return;
      }

      doc.state = 0;

      doc.details.forEach((d) => {
        const item = selectInventory.value?.items.find(
          (i) => i.id == d.good_id
        );

        if (!item || d.quant != item.quant || item.quant != item.stock) {
          throw new Error(`Wrong state of selectInventory to issue.`);
        }

        const price = item.price ?? 0;
        d.total = (goodsStore.getGoodById(d.id)?.stock ?? 0) * price;
      });

      await apiSaveDocument(doc);
    };

  const totalQuant = computed(() => {
    if (selectInventory.value?.items) {
      return selectInventory.value.items.reduce(
        (acc: number, item: any) => acc + item.issued,
        0
      );
    }
    return 0;
  });

  const scanInventoryGood = async (good: Good) => {
    const selectInventoryItem = selectInventory.value?.items.find((i) => i.id == good.id);

    if (selectInventoryItem) {
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
      selectInventoryItem.quant += 1;
      totalQuant;
    }
  };

  return {
    inventories,
    inventoriesDocuments,
    inventoriesLoading,

    selectInventory,
    selectInventoryDocument,
    totalQuant,

    updateInventories,
    selectedInventory,
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
      };
    }),
  };
  return {
    ...inventory,
    totalCount: inventory.items.reduce((acc, item) => acc + item.quant, 0),
    totalStock: inventory.items.reduce(
      (acc, item) => acc + (item.stock ?? 0),
      0
    ),
  };
}

