import { defineStore } from "pinia";
import { ref } from "vue";
import { useAppStore } from "./app";
import { Check, KioskDocument, apiGetDocuments, apiSaveDocument, apiUpsertCheck, throwErr } from "src/services";
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
        [2],
        [appStore.kioskState.kioskCorr?.id ?? ''],
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

  const deleteOrder = async (id: string) => {
    ordersLoading.value = true;
    try {
      const doc = ordersDocuments.value.find(doc => doc.id == id);
      if (doc) {
        doc.state = 1;
        await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '')
      }
    } finally {
      ordersLoading.value = false;
    }
    await updateOrders();
  }

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
      d.state = item.deleted ? 1 : 0;
      d.total = item?.price * d.quant;
    });
    const totalPrice = currentOrder.value?.totalPrice ?? throwErr("Wrong state of order to issue: totalPrice");
    let payment_type_id: string;
    switch (currentOrder.value?.payment) {
      case 'cash':
        payment_type_id = appStore.kioskState.settings!.payment_type_id_cash;
        break;

      case 'card':
        payment_type_id = appStore.kioskState.settings!.payment_type_id_card;
        break;

      default:
        throw new Error(`Wrong state of order to issue: payment_type_id`);
    }

    const check: Check = {
      ext_source: appStore.kioskState.settings!.check_ext_source,
      ext_id: doc.id,
      opened: doc.doc_date,
      closed: new Date().toISOString(),
      terminal_shift_id: appStore.kioskState.terminalShift?.id ?? '',
      check_type: 'sale',
      total: totalPrice,
      state: 0,
      content: docDetailsToCheckContent({ doc }),
      payments: [
        {
          amount: totalPrice,
          currency_id: doc.currency_ref,
          payment_date: doc.doc_date,
          payment_type_id,
          staff_id: appStore.kioskState.user?.id ?? '',
          state: 0,
        }
      ],
    };

    await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '');
    await apiUpsertCheck(check);
  };

  const docDetailsToCheckContent = ({doc} :{doc: KioskDocument}): Check['content'] => {
    return doc.details.map((detail) => ({
      id: detail.id,
      type: appStore.kioskState.settings?.check_content_type ?? '',
      good_id: detail.good_id,
      amount: detail.quant,
      base_price: detail.total / detail.quant,
      final_price: detail.total / detail.quant,
      total: detail.total,
      munit: detail.munit_id,
      staff_id: appStore.kioskState.user?.id ?? '',
      currency_id: doc.currency_ref,
      state: detail.state,
    }));
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

  const deleteGoodInCurrentOrder = async (id: string) => {
    const item = currentOrder.value?.items.find(i => i.id == id);
    if (item) {
      item.deleted = true;
      recalculateTotals(currentOrder.value!);
    }
  }

  return {
    currentOrder,
    currentOrderDocument,
    currentOrderLoading,
    selectOrder,
    confirmCurrentOrderIssue,
    deleteOrder,
    deleteGoodInCurrentOrder,

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
        deleted: false,
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

function recalculateTotals(order: ReturnType<typeof documentToOrder>) {
  order.totalCount = order.items.reduce((acc, item) => acc + (!item.deleted ? item.quant : 0), 0);
  order.totalPrice = order.items.reduce((acc, item) => acc + (!item.deleted ? item.quant * item.price : 0), 0);
}
