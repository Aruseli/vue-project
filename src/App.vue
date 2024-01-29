<script setup>
  import { eventEmitter } from "src/services";
  import { parseBarcode, uuidToBarcodeDocId } from "src/services/barcodes";
  import { useAppStore } from "src/stores/app";
  import { useOrdersStore } from "src/stores/orders";
  import { useRoute, useRouter } from "vue-router";

  const appStore = useAppStore()
  const route = useRoute()
  const router = useRouter()
  const ordersStore = useOrdersStore()

  eventEmitter.on('local-ws', async evt => {
    if (evt.cmd == 'barcode' && evt.data.length == 13) {
      const barcode = parseBarcode(evt.data)
      switch (barcode.prefix) {
        case '210':
          // GoodBarcode
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

