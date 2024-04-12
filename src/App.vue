<script setup lang="ts">
  import { eventEmitter, throwErr } from "src/services";
  import RectangularButton from 'components/buttons/rectangular-button.vue';
  import RedirectDialog from 'components/dialog/redirect-dialog.vue';
  import { parseBarcode, uuidToBarcodeDocId } from "src/services/barcodes";
  import { useAppStore } from "src/stores/app";
  import { useOrdersStore } from "src/stores/orders";
  import { useRoute, useRouter } from "vue-router";
  import { useGoodsStore } from "./stores/goods";
  import { useArrivalsStore } from'src/stores/arrivals';
  import { useInventoryStore } from "./stores/inventory";
  import { useSelectiveInventoryStore } from "./stores/selective-inventory";
  import { forceNewVisit } from "./services/tracking";
  import { onMounted, ref } from "vue";

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
    const selectiveInventoryStore = useSelectiveInventoryStore();
    if (evt.cmd == 'barcode' && evt.data.length == 13) {
      const barcode = parseBarcode(evt.data)
      switch (barcode.prefix) {
        case '210':
          // GoodBarcode
          if (route.path == `/issuing-order/order/${route.params.id}`) {
            const good = goodsStore.getGoodByCode(barcode.code);
            if (!good) {
              console.error(`Good for barcode ${barcode.barcode} not found`);
              return;
            }
            await ordersStore.scanGood(good);
          }
          if (route.path == `/arrival-goods/${route.params.id}`) {
            const good = goodsStore.getGoodByCode(barcode.code);
            if (!good) {
              console.error(`Good for barcode ${barcode.barcode} not found`);
              return;
            }
            await arrivalsStore.scanArrivalGood(good);
          }
          if (route.path == '/complete-inventory' ||
              route.path == '/open-shift/complete-inventory' ||
              route.path == '/close-shift/complete-inventory'
          ) {
            const good = goodsStore.getGoodByCode(barcode.code);
            if (!good) {
              console.error(`Good for barcode ${barcode.barcode} not found`);
              return;
            }
            await inventoryStore.scanInventoryGood(good);
          }
          if (route.path == '/selective-inventory') {
            const good = goodsStore.getGoodByCode(barcode.code);
            if (!good) {
              console.error(`Good for barcode ${barcode.barcode} not found`);
              return;
            }
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


  // ======================================================
  // Handle inactivity redirects
  // ======================================================

  // should init in onmounted becauce depends on route which is undefined before mount
  const appStore = ref<ReturnType<typeof useAppStore> | null>(null)
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
    const settings = appStore.value?.kioskState.settings ?? throwErr('Settings are not defined');
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
    if (route.path != lastPath.value) {
      updateRedirectSettings();
      lastPath.value = route.path;
    }
    return redirectSettings.value;
  }

  // Функция-обработчик, которая переведет на новую страницу
  const redirect = async () => {
    redirectDialogState.value = false;
    const redirectSettings = getRedirectSettings();
    if (!redirectSettings) {
      redirectAt.value = 0;
      return;
    }
    if (redirectSettings.action == 'customer') {
      await appStore.value?.updateShifts();
      if (appStore.value?.customerModeIsAllowed) {
        await router.push('hello');
        return;
      }
    }
    // action == 'lock' | whatever
    await appStore.value?.lockTerminal();
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
    appStore.value = useAppStore() as any;

    // Start or reset redirect timer
    router.afterEach(() => {
      resetRedirectTimer();
    })

    redirectTimer.value = setInterval(() => tick(), 100);
    // Обрабатываем события
    ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
      document.addEventListener(e, boundResetTimer)
    )
  })

</script>

<template>
  <router-view />
  <div class="bg_layer" />
  <div id="modal" />
  <div id="redirect-dialog" />
  <div id="drawer" />
  <RedirectDialog
    :modelValue="redirectDialogState"
    title="you_are_inactive"
  >
    <template #content>
      <div class="text-h5 text-center">
        <div class="text-h5">{{$t('the_session_will_end_in')}}</div>
        <span>{{ countdown }}</span>&ensp;{{ $t('seconds', {count: countdown}) }}
      </div>
    </template>
    <template #actions>
      <RectangularButton :name="$t('complete')" color="transparent" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="redirect" textColor="primary" />
      <RectangularButton :name="$t('continue')" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="closeDialog" />
    </template>
  </RedirectDialog>
</template>


