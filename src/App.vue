<script setup>
  import { eventEmitter } from "src/services";
  import { parseBarcode, uuidToBarcodeDocId } from "src/services/barcodes";
  import { useAppStore } from "src/stores/app";
  import { useOrdersStore } from "src/stores/orders";
  import { useRoute, useRouter } from "vue-router";
  import { useGoodsStore } from "./stores/goods";
  import { useArrivalsStore } from'src/stores/arrivals';
  import { useInventoryStore } from "./stores/inventory";
  import { useSelectInventoryStore } from "./stores/selective-inventory";

  const route = useRoute()
  const router = useRouter()

  eventEmitter.on('local-ws', async evt => {
    const appStore = useAppStore() // Don't move up: it will break init (query params are unaccessible)
    const ordersStore = useOrdersStore()
    const goodsStore = useGoodsStore();
    const arrivalsStore = useArrivalsStore();
    const inventoryStore = useInventoryStore();
    const selectInventoryStore = useSelectInventoryStore();
    if (evt.cmd == 'barcode' && evt.data.length == 13) {
      const barcode = parseBarcode(evt.data)
      switch (barcode.prefix) {
        case '210':
          // GoodBarcode
          if (route.path == `/issuing-order/order/${route.params.id}`) {
            const good = goodsStore.getGoodByCode(barcode.code);
            await ordersStore.scanGood(good);
          }
          if (route.path == `/arrival-goods/${route.params.id}`) {
            const good = goodsStore.getGoodByCode(barcode.code);
            await arrivalsStore.scanArrivalGood(good);
          }
          if (route.path == '/complete-inventory') {
            const good = goodsStore.getGoodByCode(barcode.code);
            await inventoryStore.scanInventoryGood(good);
          }
          if (route.path == '/selective-inventory') {
            const good = goodsStore.getGoodByCode(barcode.code);
            await selectInventoryStore.scanInventoryGood(good);
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
            });
          }
          if (route.path == '/employee-actions') {
            await arrivalsStore.updateArrivals();
            arrivalsStore.arrivalsDocuments.forEach(d => {
              // TODO: Check also docType
              if (uuidToBarcodeDocId(d.id) == barcode.docId) {
                router.push(`/arrival-goods/${d.id}`)
              }
            });
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

