<script setup lang="ts">
  import { apiGetDocument, eventEmitter, throwErr } from "src/services";
  import ModalButton from 'components/components-v3/buttons/modal-button.vue';
  import RedirectDialog from 'components/dialog/redirect-dialog.vue';
  import Dialogs from "./components/overlay/dialogs.vue";
  import { parseBarcode } from "src/services/barcodes";
  import { useAppStore } from "src/stores/app";
  import { useOrdersStore } from "src/stores/orders";
  import { useRoute, useRouter } from "vue-router";
  import { useGoodsStore } from "./stores/goods";
  import { useArrivalsStore } from'src/stores/arrivals';
  import { useInventoryStore } from "./stores/inventory";
  import { forceNewVisit } from "./services/tracking";
  import { computed, onMounted, ref } from "vue";
  import { debugGenerateArrival } from "src/services/documents/documents";
  import {closeAllDialogs, showSimpleNotification } from "./services/dialogs";
  import * as usersService from 'src/services/users';
  import Ping from './components/components-v3/ping.vue';
  import { initTerminal, settings } from "./services/terminal";
  import { updateShifts } from "./services/shifts";
  import { t } from "i18next";

  const route = useRoute()
  const router = useRouter()

  // ======================================================
  // Handle barcodes
  // ======================================================
  eventEmitter.on('local-ws', async evt => {
    const appStore = useAppStore();
    const ordersStore = useOrdersStore();
    const goodsStore = useGoodsStore();
    const arrivalsStore = useArrivalsStore();
    const inventoryStore = useInventoryStore();
    if (evt.cmd == 'barcode' && process.env.DEV && evt.data == 'debugGenerateArrival') {
      await debugGenerateArrival();
    }

    // GoodBarcode
    function tryGetGoodIdOrCodeFromBarchode() {
      if (evt.cmd != 'barcode') {
        return null;
      }
      const linkGoodRegexp = /[?&]g=([0-9a-zA-Z]+)/;
      const goodCode = evt.data.match(linkGoodRegexp)?.[1];
      if (goodCode) {
        return goodCode;
      }

      const uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
      const uuids = evt.data.match(uuidRegExp);
      if (uuids?.length > 1) {
        console.error("What's with uuids? Why not one?", uuids);
        return null;
      }
      if (uuids?.length == 1) {
        return uuids[0];
      }

      return null;
    }
    const goodIdOrCode = tryGetGoodIdOrCodeFromBarchode();
    if (goodIdOrCode) {
      if (route.path == `/issuing-order/order/${route.params.id}`) {
        await ordersStore.scanGood(goodIdOrCode);
      }
      if (route.path == `/arrival-goods/${route.params.id}`) {
        await arrivalsStore.scanArrivalGood(goodIdOrCode);
      }
      if (route.path == '/complete-inventory' ||
          route.path == '/open-shift/complete-inventory' ||
          route.path == '/close-shift/complete-inventory' ||
          route.path == '/selective-inventory'
      ) {
        await inventoryStore.scanInventoryGood(goodIdOrCode);
      }
    }

    const uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
    if (evt.cmd == 'barcode' && uuidRegExp.test(evt.data)) {
      const uuids = evt.data.match(uuidRegExp);
      if (uuids.length != 1) {
        console.error("What's with uuids? Why not one?", uuids);
        return;
      }
      const id = uuids[0];

      // DocumentBarcode
      if (route.path == '/employee-actions' || route.path == '/') {
        const doc = await apiGetDocument(id);
        if (doc.doc_type == settings.value?.doc_type__invoice && (doc.state == 0 || doc.state == 6)) {
          showSimpleNotification(t('order_already_issued'));
        }
      }
      if (appStore.orderIssueIsAllowed && (route.path == '/employee-actions' || route.path == '/')) {
        await ordersStore.updateOrders()
        // if (process.env.DEV) {
        console.log('Order ids', ordersStore.ordersDocuments.map(d => d.id));
        // }
        ordersStore.ordersDocuments.forEach(d => {
          if (d.id == uuids[0]) {
            router.push(`/issuing-order/order/${d.id}`)
          }
        });
      }
      if (appStore.arrivalsAreAllowed && route.path == '/employee-actions' || route.path == '/') {
        await arrivalsStore.updateArrivals();
        // if (process.env.DEV) {
        console.log('Arrival ids', arrivalsStore.arrivalsDocuments.map(d => d.id));
        // }
        arrivalsStore.arrivalsDocuments.forEach(d => {
          if (d.id == uuids[0]) {
            router.push(`/arrival-goods/${d.id}`)
          }
        });
      }
    }
    if (evt.cmd == 'barcode' && evt.data.length == 13) {
      const barcode = parseBarcode(evt.data)
      switch (barcode.prefix) {
        // case '210':
        //   // GoodBarcode
        //   break;
        case '220': // Employee
          // TODO populate disallowed paths
          if (route.path in []) {
            return
          }
          if (await usersService.loginByToken(barcode.token)) {
            forceNewVisit();
            await appStore.resetLocale()
            router.push('/employee-actions')
          }
          break;
        case '230': // Document, OBSOLETE
          if (appStore.orderIssueIsAllowed && route.path == '/employee-actions' || route.path == '/') {
            await ordersStore.updateOrders()
            // if (process.env.DEV) {
            console.log('Order barcodes', ordersStore.ordersDocuments.map(d => d.barcode));
            // }
            ordersStore.ordersDocuments.forEach(d => {
              if (d.barcode == barcode.barcode) {
                router.push(`/issuing-order/order/${d.id}`)
              }
            });
          }
          if (appStore.arrivalsAreAllowed && route.path == '/employee-actions' || route.path == '/') {
            await arrivalsStore.updateArrivals();
            // if (process.env.DEV) {
            console.log('Arrival barcodes', arrivalsStore.arrivalsDocuments.map(d => d.barcode));
            // }
            arrivalsStore.arrivalsDocuments.forEach(d => {
              // TODO: Check also docType
              if (d.barcode == barcode.barcode) {
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

  // ======================================================
  // Handle inactivity redirects
  // ======================================================

  // should init in onmounted becauce depends on route which is undefined before mount
  const appStore = useAppStore()
  const redirectAt = ref(0);
  const countdown = ref(0);
  const redirectDialogState = ref(false);
  const lastErrorPath = ref('');
  const lastPath = ref('');
  const redirectSettings = ref<{
      inactivity_before_action: number,
      countdown_duration: number,
      action: 'customer' | 'lock' | string,
    } | null>(null);

  const updateRedirectSettings = () => {
    // customer or disabled timeouts
    if (/^\/(|hello|languages|catalog)$/.test(route.path)
    ) {
      redirectSettings.value = null;
      return;
    }
    const settings = appStore.kioskState.settings ?? throwErr('Settings are not defined');
    // menu
    if (/^\/(employee-actions|issued-order)$/.test(route.path)) {
      redirectSettings.value = {
        inactivity_before_action: settings.employee_menu_inactivity_before_action,
        countdown_duration: settings.employee_menu_inactivity_countdown_duration,
        action: settings.employee_menu_inactivity_action,
      }
      return;
    }
    // document
    if (/^\/(arrival-goods\/.*|issuing-order\/order\/.*|complete-inventory|selective-inventory|close-shift\/complete-inventory|open-shift\/complete-inventory)$/.test(route.path)) {
      redirectSettings.value = {
        inactivity_before_action: settings.employee_docs_inactivity_before_action,
        countdown_duration: settings.employee_docs_inactivity_countdown_duration,
        action: settings.employee_docs_inactivity_action,
      }
      return;
    }
    // lists
    if (/^\/(issuing-order)$/.test(route.path)) {
      redirectSettings.value = {
        inactivity_before_action: settings.employee_doclists_inactivity_before_action,
        countdown_duration: settings.employee_doclists_inactivity_countdown_duration,
        action: settings.employee_doclists_inactivity_action,
      }
      return;
    }
    if (lastErrorPath.value != route.path) {
      lastErrorPath.value = route.path;
      console.error(`Unknown path type for route ${route.path}. Using 'menu' settings for inactivity`);
    }
    redirectSettings.value = {
      inactivity_before_action: settings.employee_menu_inactivity_before_action,
      countdown_duration: settings.employee_menu_inactivity_countdown_duration,
      action: settings.employee_menu_inactivity_action,
    }
  }

  const getRedirectSettings = () => {
    if (appStore.kioskState.status != "Ready") {
      return undefined;
    }
    if (route.path != lastPath.value) {
      updateRedirectSettings();
      lastPath.value = route.path;
    }
    return redirectSettings.value;
  }

  // Функция-обработчик, которая переведет на новую страницу
  const redirect = async () => {
    redirectAt.value = 0;
    redirectDialogState.value = false;
    const redirectSettings = getRedirectSettings();
    if (!redirectSettings) {
      return;
    }
    try {
      if (redirectSettings.action == 'customer') {
        await updateShifts(true);
        if (appStore.customerModeIsAllowed) {
          await router.push('/hello');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // action == 'lock' | whatever
    await appStore.lockTerminal();
  }

  const tick = () => {
    const redirectSettings = getRedirectSettings();
    if (!redirectSettings) {
      redirectDialogState.value = false;
      redirectAt.value = 0;
      return;
    }
    if (Date.now() - redirectAt.value > 60*1000) {
      redirectAt.value = Date.now() + redirectSettings.inactivity_before_action ?? 37000;
    }

    const timeBeforeRedirect = redirectAt.value - Date.now();
    if (timeBeforeRedirect < 0) {
      // redirect phase
      redirect();
      return;
    }

    if (timeBeforeRedirect < redirectSettings.countdown_duration ?? 7000) {
      // countdown phase
      countdown.value = Math.floor(timeBeforeRedirect / 1000);
      redirectDialogState.value = true;
      return;
    }
    redirectDialogState.value = false;

    // boring phase
    return;
  }

  function closeDialog() {
    const redirectSettings = getRedirectSettings();
    redirectAt.value = redirectSettings ? Date.now() + redirectSettings.inactivity_before_action : 0;
  }

  function resetRedirectTimer() {
    if (redirectDialogState.value) {
      return;
    }
    const redirectSettings = getRedirectSettings();
    redirectAt.value = redirectSettings ? Date.now() + redirectSettings.inactivity_before_action : 0;
  }

  const redirectTimer = ref<NodeJS.Timeout | null>(null);
  const boundResetTimer = resetRedirectTimer.bind(this);
  onMounted(() => {
    initTerminal();

    router.isReady().then(() => {
      router.beforeEach((to, from, next) => {
        closeAllDialogs();
        next();
      });

      // Start or reset redirect timer
      router.afterEach(() => {
        resetRedirectTimer();
      })

      redirectTimer.value = setInterval(() => tick(), 100);
      // Обрабатываем события
      ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
        document.addEventListener(e, boundResetTimer)
      )
    });
  })

</script>

<template>
  <router-view />
  <div class="bg_layer" />
  <div id="modal" />
  <div id="drawer" />
  <Dialogs />
  <div id="redirect-dialog" />
  <div id="reason-dialog" />
  <RedirectDialog
    :modelValue="redirectDialogState"
    mode="light"
  >
    <template #content>
      <div class="text-h3 text-center mb-30">
        <div class="text-h3 first_letter line_height">{{$t('the_session_will_end_in')}}</div>
        <span>{{ countdown }}</span>&ensp;{{ $t('seconds', {count: countdown}) }}
      </div>
    </template>
    <template #actions>
      <ModalButton
        :name="$t('complete')"
        unelevated
        color="black"
        textColor="white"
        @click="redirect" />
        <ModalButton
        :name="$t('continue')"
        color="green"
        textColor="black"
        @click="closeDialog"
      />
    </template>
  </RedirectDialog>

  <Ping />
</template>
