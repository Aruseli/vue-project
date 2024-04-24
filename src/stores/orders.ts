import { defineStore } from "pinia";
import { ref } from "vue";
import { useAppStore } from "./app";
import { Check, KioskDocument, SaveableDocument, apiGetDocuments, apiSaveDocument, apiSaveOperation, apiUpsertCheck, throwErr } from "src/services";
import { useGoodsStore } from "./goods";
import { t } from "i18next";
import { showSimpleNotification } from "src/services/dialogs";
import { journalErroneousAction } from "src/services/documents/documents";

export type Order = {
  id: string,
  orderNumStr: string,
  payment: string, // '' | 'cash' | 'card',
  items: {
    id: string,
    quant: number,
    price: number,
    title?: string,
    image?: string,
    issued: number,
    issuedItems: string[],
    deleted: boolean,
  }[],
  hasAllGoods: boolean,
  allTitles: string,
  totalCount: number,
  totalPrice: number,
};

export const useOrdersStore = defineStore("orders", () => {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();

  const orders = ref<Order[]>([]);
  const ordersDocuments = ref([] as KioskDocument[]);
  const ordersLoading = ref(true);
  const ordersLastUpdate = ref(0);

  const payment = ref(null);


  const currentOrder = ref<Order | null>(null);
  const currentOrderDocument = ref<KioskDocument | null>(null);
  const currentOrderLoading = ref(true);

  const updateOrders = async () => {
    ordersLoading.value = true;
    try {
      const settings = appStore.kioskState.settings;
      ordersDocuments.value = await apiGetDocuments(
        [settings!.doc_type__invoice!],
        [2],
        [appStore.kioskState.kioskCorr?.id ?? throwErr("Missing kioskCorr")],
      );
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
      const debugGoodItemIds = currentOrder.value?.items.flatMap(i => goodsStore.getGoodById(i.id).itemIds);
      console.log("Order expected good individual IDs", debugGoodItemIds);
      console.log(debugGoodItemIds?.map(s => `curl --location 'http://127.0.0.1:3010/api/system/emulate/barcode?code=${s}'`).join('\n'));
    } catch {
      currentOrder.value = null;
      currentOrderDocument.value = null;
    } finally {
      currentOrderLoading.value = false;
    }
  };

  const confirmCurrentOrderIssue = async () => {
    const doc: SaveableDocument | null = currentOrderDocument.value;
    if (!doc) {
      return;
    }
    doc.state = 0;
    doc.respperson_ref = appStore.kioskState.userCorr?.id ?? throwErr("Missing userCorr");
    doc.details = doc.details
      .filter(d => d.doc_detail_type == appStore.kioskState.settings?.docdetail_type__invoice_placing)
      .flatMap(d => {
        const item = currentOrder.value?.items.find((i) => i.id == d.good_id);
        if (
          !item || d.quant != item.quant ||
          !item.deleted && (item.issued != item.issuedItems.length || item.issued != item.quant)
        ) {
          console.log("Order line error while issuing", d, item);
          throw new Error(`Wrong state of order to issue.`);
        }
        d.state = item.deleted ? 1 : 0;
        d.total = item.price * d.quant;
        return [
          d,
          ...item.issuedItems.map((itemId, index) => ({
            id: undefined,
            state: 0,
            rec_order: d.rec_order * 100 + index,
            good_id: d.good_id,
            munit_id: d.munit_id,
            quant: 1,
            total: item.price,
            doc_detail_link: itemId,
            doc_detail_type: appStore.kioskState.settings?.docdetail_type__invoice_issue ?? '',
          })),
        ]
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

  const docDetailsToCheckContent = ({doc} :{doc: SaveableDocument}): Check['content'] => {
    return doc.details
      .filter(d => d.doc_detail_type == appStore.kioskState.settings?.docdetail_type__invoice_placing)
      .map((detail) => ({
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

  const scanGood = async (itemId: string) => {
    const docId = currentOrder.value?.id ?? throwErr("Missing currentOrder.value?.id");
    const good = goodsStore.getGoodByItemId(itemId);
    if (!good) {
      await journalErroneousAction(docId, { event_type: 'unknown_good_marking', marking: itemId });
      showSimpleNotification(t('unknown_good_marking'));
      return;
    }
    const currentOrderItem = currentOrder.value?.items.find((i) => i.id == good.id);
    if (!currentOrderItem) {
      await journalErroneousAction(docId, { event_type: 'scanned_good_is_not_in_order', marking: itemId });
      showSimpleNotification(t('scanned_good_is_not_in_order'));
      return;
    }
    if (currentOrderItem.issuedItems.includes(itemId)) {
      await journalErroneousAction(docId, { event_type: 'repeated_good_scan', marking: itemId });
      showSimpleNotification(t('repeated_good_scan'));
      return;
    }
    if (currentOrderItem.issued >= currentOrderItem.quant) {
      await journalErroneousAction(docId, { event_type: 'order_overissue_attempt', marking: itemId });
      showSimpleNotification(t('product_has_already_been_scanned'));
      return;
    }
    currentOrderItem.issued = currentOrderItem.issuedItems.push(itemId);
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
        issuedItems: [],
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

function recalculateTotals(order: Order) {
  order.totalCount = order.items.reduce((acc, item) => acc + (!item.deleted ? item.quant : 0), 0);
  order.totalPrice = order.items.reduce((acc, item) => acc + (!item.deleted ? item.quant * item.price : 0), 0);
}
