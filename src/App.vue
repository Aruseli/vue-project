<script setup>
  import { eventEmitter } from "src/services";
  import { parseBarcode, uuidToBarcodeDocId } from "src/services/barcodes";
  import { useAppStore } from "src/stores/app";
  import { useOrdersStore } from "src/stores/orders";
  import { useRoute, useRouter } from "vue-router";
  import { useGoodsStore } from "./stores/goods";

  const route = useRoute()
  const router = useRouter()

  eventEmitter.on('local-ws', async evt => {
    const appStore = useAppStore() // Don't move up: it will break init (query params are unaccessible)
    const ordersStore = useOrdersStore()
    const goodsStore = useGoodsStore();
    if (evt.cmd == 'barcode' && evt.data.length == 13) {
      const barcode = parseBarcode(evt.data)
      switch (barcode.prefix) {
        case '210':
          // GoodBarcode

          const order_id = ordersStore.currentOrder?.items.flatMap(or => or.id)[0];
          const order_item = ordersStore.currentOrder?.items.find(i => i.id);

          const good_id = goodsStore.getGoodByCode(order_id)
          const code = good_id.id == order_id ? 210 + `${good_id.code}` + 9 : null
          if (barcode.barcode === code) {
            order_item.issued += 1;
          }
          break;
        case '220': // Employee
          // TODO populate disallowed paths
          if (route.path in []) {
            return
          }
          if (await appStore.loginByToken(barcode.token)) {
            await appStore.resetLocale()
            router.push('/employee-actions')
          }
          break;
        case '230': // Document
          if (route.path == '/employee-actions') {
            await ordersStore.updateOrders()
            ordersStore.ordersDocuments.forEach(d => {
              // TODO: Check also docType
              if (uuidToBarcodeDocId(d.id) == barcode.docId) {
                router.push(`/issuing-order/order/${d.id}`)
              }
            })
          }
          break;
        default:
          console.error('Unknown prefix')
      }
    }
  })

</script>

<template>
  <router-view />
  <div class="bg_layer" />
</template>

