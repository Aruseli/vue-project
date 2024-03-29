import { defineStore } from "pinia";
import { ref } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore, type Good } from "./goods";
import { t } from "i18next";
import { Notify } from 'quasar';

export const useOrdersStore = defineStore("orders", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const orders = ref<ReturnType<typeof documentToOrder>[]>([]);
  const ordersDocuments = ref([] as KioskDocument[]);
  const ordersLoading = ref(true);
  const ordersLastUpdate = ref(0);

  const payment = ref(null);


  const currentOrder = ref<ReturnType<typeof documentToOrder> | null>(null);
  const currentOrderDocument = ref<KioskDocument | null>(null);
  const currentOrderLoading = ref(true);

  const updateOrders = async () => {
    ordersLoading.value = true;
    try {
      const settings = appStore.kioskState.settings;
      ordersDocuments.value = await apiGetDocuments(
        [settings!.invoice_doc_type_id!],
        [2]
      );
      ordersDocuments.value = ordersDocuments.value.filter(d =>
        d.corr_from_ref == appStore.kioskState.kioskCorr?.id)
      orders.value = ordersDocuments.value.map((od) =>
        documentToOrder(od, goodsStore)
      );
      ordersLastUpdate.value = Date.now();
    } finally {
      ordersLoading.value = false;
    }
  };

  const selectOrder = async (id: string) => {
    currentOrderLoading.value = true;
    try {
      // Bug: await apiGetDocument(id) returns none, and we forced to use updateOrders
      if (Date.now() - ordersLastUpdate.value > appStore.kioskState.settings!.cache__orders_ttl_ms!) {
        await updateOrders();
      }
      const orderDoc = ordersDocuments.value.find((d) => d.id == id) || null;
      currentOrder.value = orderDoc
        ? documentToOrder(orderDoc, goodsStore)
        : null;
      currentOrderDocument.value = orderDoc;
    } catch {
      currentOrder.value = null;
      currentOrderDocument.value = null;
    } finally {
      currentOrderLoading.value = false;
    }
  };

  const confirmCurrentOrderIssue = async () => {
    const doc = currentOrderDocument.value;
    if (!doc) {
      return;
    }
    doc.state = 0;
    doc.respperson_ref = appStore.kioskState.userCorr?.id;
    doc.details.forEach((d) => {
      const item = currentOrder.value?.items.find((i) => i.id == d.good_id);
      if (!item || d.quant != item.quant || item.issued != item.quant) {
        console.log("Order line mismatch while issuing", d, item);
        throw new Error(`Wrong state of order to issue.`);
      }
      d.total = item?.price * d.quant;
    });
    await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '');
  };

  const scanGood = async (good: Good) => {
    const currentOrderItem = currentOrder.value?.items.find(
      (i) => i.id == good.id
    );
    if (!currentOrderItem) {
      return;
    }
    if (currentOrderItem.issued >= currentOrderItem.quant) {
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
    currentOrderItem.issued += 1;
  };

  return {
    currentOrder,
    currentOrderDocument,
    currentOrderLoading,
    selectOrder,
    confirmCurrentOrderIssue,

    orders,
    ordersDocuments,
    ordersLoading,
    updateOrders,
    scanGood,
    payment,
  };
});

function documentToOrder(od: KioskDocument, goodsStore: ReturnType<typeof useGoodsStore>) {
  let hasAllGoods = true;
  const order = {
    id: od.id,
    orderNumStr: (od.abbr_num?.toString().padStart(4, "0") ?? t('Unknown')),
    payment: '',
    items: od.details.map(d => {
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
      };
    })
  };
  return {
    ...order,
    allTitles: order.items.map(g => g.title ?? t('Unknown')).join(', '),
    hasAllGoods,
    totalCount: order.items.reduce((acc, item) => acc + item.quant, 0),
    totalPrice: order.items.reduce((acc, item) => acc + item.quant * item.price, 0),
  };
}

