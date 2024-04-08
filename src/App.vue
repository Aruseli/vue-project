<script setup>
  import { eventEmitter } from "src/services";
  import { parseBarcode, uuidToBarcodeDocId } from "src/services/barcodes";
  import { useAppStore } from "src/stores/app";
  import { useOrdersStore } from "src/stores/orders";
  import { useRoute, useRouter } from "vue-router";
  import { useGoodsStore } from "./stores/goods";
  import { useArrivalsStore } from'src/stores/arrivals';
  import { useInventoryStore } from "./stores/inventory";
  import { useSelectiveInventoryStore } from "./stores/selective-inventory";
  import { forceNewVisit } from "./services/tracking";

  const route = useRoute()
  const router = useRouter()

  eventEmitter.on('redirect', () => {
    const app = useAppStore();

    app.redirectDialogState = false;
    if (!app.customerModeIsAllowed) {
      router.push('/');
      app.lockTerminal();
      app.updateShifts();
    }
    router.push('hello');
    app.redirectAt = 0;
  })
  eventEmitter.on('tick', () => {
    const app = useAppStore();
    if (Date.now() - app.redirectAt > 60*1000) {
      app.redirectAt = Date.now() + (app.kioskState.settings?.employee_inactivity_before_redirect ?? 150000);
    }

    const timeBeforeRedirect = app.redirectAt - Date.now();
    if (timeBeforeRedirect < 0) {
      // redirect phase
      eventEmitter.emit('redirect');
      return;
    }

    if (timeBeforeRedirect < (app.kioskState.settings?.employee_inactive_notify_duration_ms ?? 30000)) {
      // countdown phase
      app.countdown = Math.floor(timeBeforeRedirect / 1000);
      app.redirectDialogState = true;
      return;
    }
    app.redirectDialogState = false;
    return;
  })

  eventEmitter.on('local-ws', async evt => {
    const appStore = useAppStore(); // Don't move up: it will break init (query params are unaccessible)
    const ordersStore = useOrdersStore();
    const goodsStore = useGoodsStore();
    const arrivalsStore = useArrivalsStore();
    const inventoryStore = useInventoryStore();
    const selectiveInventoryStore = useSelectiveInventoryStore();
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
          if (route.path == '/complete-inventory' ||
              route.path == '/open-shift/complete-inventory' ||
              route.path == '/close-shift/complete-inventory'
          ) {
            const good = goodsStore.getGoodByCode(barcode.code);
            await inventoryStore.scanInventoryGood(good);
          }
          if (route.path == '/selective-inventory') {
            const good = goodsStore.getGoodByCode(barcode.code);
            await selectiveInventoryStore.scanInventoryGood(good);
          }
          break;
        case '220': // Employee
          // TODO populate disallowed paths
          if (route.path in []) {
            return
          }
          if (await appStore.loginByToken(barcode.token)) {
            forceNewVisit();
            await appStore.resetLocale()
            router.push('/employee-actions')
          }
          break;
        case '230': // Document
          if (appStore.orderIssueIsAllowed && route.path == '/employee-actions') {
            await ordersStore.updateOrders()
            // if (process.env.DEV) {
            console.log('Order barcodes', ordersStore.ordersDocuments.map(d =>
              `2300${uuidToBarcodeDocId(d.id).toString().padStart(8, "0")}0`))
            // }
            ordersStore.ordersDocuments.forEach(d => {
              // TODO: Check also docType
              if (uuidToBarcodeDocId(d.id) == barcode.docId) {
                router.push(`/issuing-order/order/${d.id}`)
              }
            });
          }
          if (appStore.arrivalsAreAllowed && route.path == '/employee-actions') {
            await arrivalsStore.updateArrivals();
            // if (process.env.DEV) {
            console.log('Arrival barcodes', arrivalsStore.arrivalsDocuments.map(d =>
              `2300${uuidToBarcodeDocId(d.id).toString().padStart(8, "0")}0`))
            // }
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
  <div id="modal" />
  <div id="redirect-dialog" />
  <div id="drawer" />
</template>

