<script setup>
  import { useRouter } from 'vue-router';
  import { onMounted, reactive, ref, watch, watchEffect, computed, onUnmounted } from 'vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';
  import { useQuasar } from 'quasar';
  import i18next, { t } from 'i18next';
  import { useAppStore } from 'src/stores/app';
  import { useSelectiveInventoryStore } from 'src/stores/selective-inventory';
  import RedirectDialog from 'src/components/dialog/redirect-dialog.vue';
  import Logo from 'src/components/logo/logo.vue';
  import LogoSvg from 'src/components/logo/logo-svg.vue';
  import LogoSimple from 'src/components/logo/logo-simple.vue';
  import { delay, eventEmitter, printLeftovers } from 'src/services';
  import { useGoodsStore } from 'src/stores/goods';
  import EmployeeActions from '../components/components-v3/employee-actions.vue';
  import {default as EmployeeActionsOld} from '../components/catalog/employee-actions.vue';

  const $q = useQuasar();
  const router = useRouter();
  const app = useAppStore();
  const goodsStore = useGoodsStore();
  const selectiveInventoryStore = useSelectiveInventoryStore();
  const dialogState = ref(false);
  const inventoryRequests = ref(0);

  const route = (path) => {
    router.push(path);
  }

  const buttons = computed(() => {
    const inventoryOnShiftOpen = app.kioskState.settings?.shifts__inventory_on_open;
    const inventoryOnShiftClose = app.kioskState.settings?.shifts__inventory_on_close;
    const skipInventoryOnOpen = app.kioskState.settings?.shifts__skip_inventory_on_open_if_same_user &&
      app.kioskState.terminalShiftPreviousClosedBy == app.kioskState.user?.id;

    return [
      {
        name: (app.customerModeIsAllowed) ? 'shift_is_open_switch_to_user_mode' : 'open_shift',
        click: async () => {
          if (app.customerModeIsAllowed) {
            route('hello');
            return;
          }
          if (inventoryOnShiftOpen && !skipInventoryOnOpen) {
            route('open-shift/complete-inventory');
          } else {
            await app.openTerminalShift();
            route('hello');
          }
        },
        disable: !app.customerModeIsAllowed && !app.shiftOpenIsAllowed,
      },
      {
        name: 'close_shift',
        click: async () => {
          if (!app.shiftIsClosing) {
            await app.startClosingTerminalShift();
          }
          if (inventoryOnShiftClose) {
            route('close-shift/complete-inventory');
          } else {
            await app.closeTerminalShift();
          }
        },
        disable: !app.shiftCloseIsAllowed,
      },
      {
        name: 'issue_order',
        click: () => route('issuing-order'),
        disable: !app.orderIssueIsAllowed,
      },
      {
        name:'selective_inventory',
        click: () => route('selective-inventory'),
        // TODO rights__kiosk_selective_inventory_extended
        disable: inventoryRequests.value > 0 ? !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_selective_inventory) : true,
        badge: inventoryRequests.value > 0 ? true : false,
      },
      {
        name: 'complete_inventory',
        click: () => route('complete-inventory'),
        disable: !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_full_inventory),
      },
      {
        name: 'arrival_goods',
        click: async () => {
          $q.notify({
            position: "center",
            color: "positive",
            classes: "full-width warning_customization",
            timeout: 1000,
            icon: 'img:/barcode_scanner.svg',
            iconSize: '5rem',
            spinnerSize: '3rem',
            actions: [
              {
                icon: "cancel",
                'aria-label': 'cancel',
                label: t("scan_the_barcode_of_the_document"),
                color: "white",
                round: true,
              },
            ],
          });
        },
        disable: !app.arrivalsAreAllowed,
      },
      {
        name: 'print_leftovers',
        // TODO print_leftovers
        click: async () => {
          const currentDate = new Date();
          const dateString = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
          await printLeftovers({appStore: app, $q,dateTo: dateString, kioskCorrespondentId: app.kioskState.kioskCorr.id})
        },
        disable: !app.shiftIsGood || !app.hasRight(app.kioskState.settings?.rights__kiosk_print_stock),
      },
    ];
  });

  onMounted(async() => {
    if (app.kioskState.status != 'Ready') {
      // Hack for page reloads
      await delay(1000);
    }
    if (app.kioskState.status == 'Ready' && goodsStore.imagesCacheExpirationAt < Date.now()) {
      goodsStore.updateGoods(i18next.language); // Don't await intentionally
    }
    await app.updateShifts();
    await selectiveInventoryStore.updateInventories();
    inventoryRequests.value = selectiveInventoryStore.inventoriesDocuments.length;
    if( inventoryRequests.value > 0 ) {
      dialogState.value = true;
    }

  })
</script>

<template>
  <q-page class="flex flex-center bg-secondary relative-position">
    <EmployeeActions
      :buttons="buttons"
      :inventoryRequests="inventoryRequests"
      v-if="app.kioskState.settings?.alt_ui === 'design_v3'"
    />
    <EmployeeActionsOld
      :buttons="buttons"
      :inventoryRequests="inventoryRequests"
      v-if="app.kioskState.settings?.alt_ui !== 'design_v3'"
    />

    <!-- <div class="column justify-center items-center full-height full-width container">
      <Logo class="logo_column" classes="q-mb-md-sm q-mb-xs-xs" v-if="app.kioskState.settings?.alt_ui !== 'design_v3'">
        <LogoSvg fill="#FAFAFA" />
      </Logo>
      <LogoSimple text_style="text-green" v-if="app.kioskState.settings?.alt_ui === 'design_v3'">
        <LogoSvg
          fill="#88D863"
          width="6em"
          height="6em"
        />
      </LogoSimple>
      <RectangularButton
        v-for="(button, index) in buttons"
        :key="index"
        :name='$t(button.name)'
        :disable='button.disable'
        class="button_style"
        :class="{ 'blocked': button.disable }"
        @click="button.click"
      >
        <div v-if="button.badge == true" class="badge_style bg-positive flex items-center justify-center">
          <div class="text-white text-h3">{{ inventoryRequests }}</div>
        </div>
      </RectangularButton>

    </div> -->
    <RedirectDialog
      :modelValue="dialogState"
      title="there_are_documents_for_inventory"
    >
      <template #actions>
        <RectangularButton :name="$t('defer')" color="transparent" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="dialogState = false" textColor="primary" />
        <RectangularButton :name="$t('execute')" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="route('selective-inventory')" />
      </template>
    </RedirectDialog>
  </q-page>
</template>
