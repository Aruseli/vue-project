import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAppStore } from "./app";
import { KioskDocument, apiGetDocuments, apiSaveDocument } from "src/services";
import { useGoodsStore } from "./goods";
import { ORDERS_CACHE_TTL } from "src/services/consts";
import { i18n } from "src/boot/i18_n";

export const useOrdersStore = defineStore('orders', () => {
  const appStore = useAppStore()
  const goodsStore = useGoodsStore()

  const orders = ref<ReturnType<typeof documentToOrder>[]>([])
  const ordersDocuments = ref([] as KioskDocument[])
  const ordersLoading = ref(true)
  const ordersLastUpdate = ref(0)

  const currentOrder = ref<ReturnType<typeof documentToOrder> | null>(null)
  const currentOrderDocument = ref<KioskDocument | null>(null)
  const currentOrderLoading = ref(true)

  const updateOrders = async () => {
    ordersLoading.value = true
    try {
      const terminal_settings = appStore.kioskState.params?.terminal_settings
      ordersDocuments.value = await apiGetDocuments([terminal_settings!.invoice_doc_type_id!], [2])
      orders.value = ordersDocuments.value.map(od => documentToOrder(od, i18n.global, goodsStore))
      ordersLastUpdate.value = Date.now()
    } finally {
      ordersLoading.value = false
    }
  }

  const selectOrder = async (id: string) => {
    currentOrderLoading.value = true
    try {
      // Bug: await apiGetDocument(id) returns none, and we forced to use updateOrders
      if (Date.now() - ordersLastUpdate.value > ORDERS_CACHE_TTL) {
        await updateOrders()
      }
      const orderDoc = ordersDocuments.value.find(d => d.id == id) || null
      currentOrder.value = orderDoc ? documentToOrder(orderDoc, i18n.global, goodsStore) : null
      currentOrderDocument.value = orderDoc
    } catch {
      currentOrder.value = null
      currentOrderDocument.value = null
    } finally {
      currentOrderLoading.value = false
    }
  }

  const confirmCurrentOrderIssue = async () => {
    const doc = currentOrderDocument.value
    if (!doc) {
      return
    }
    doc.state = 0
    doc.details.forEach(d => {
      const item = currentOrder.value?.items.find(i => i.id == d.good_id)
      if (!item || d.quant != item.quant || item.issued != item.quant) {
        console.log('Order line mismatch while issuing', d, item)
        throw new Error(`Wrong state of order to issue.`)
      }
      d.total = (goodsStore.getGoodById(d.id)?.stock ?? 0) - d.quant
    })
    await apiSaveDocument(doc)
  }

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
  }
})

type I18nType = typeof i18n["global"]
function documentToOrder(od: KioskDocument, i18n: I18nType, goodsStore: ReturnType<typeof useGoodsStore>) {
  const { t } = i18n
  let hasAllGoods = true;
  const order = {
    id: od.id,
    orderNumStr: (od.abbr_num?.toString().padStart(4, "0") ?? t('Unknown')),
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
        image: good?.images[0],
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

