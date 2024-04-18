<script setup lang="ts">
  import i18next, { t } from 'i18next';
  import moment from 'moment';
  import { useQuasar } from 'quasar';
  import { useGoodsStore } from 'src/stores/goods';
  import { useInventoryStore } from 'src/stores/inventory';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import DividerBold from '../dividers/divider-bold.vue';
  import ListItem from './list-item.vue';
  import { useAppStore } from 'src/stores/app';
  import {
    apiReportsGetView,
    printDocument,
    printInventory,
    wsSendMessage,
  } from 'src/services';
  import RedirectDialog from "src/components/dialog/redirect-dialog.vue";

  const goodsStore = useGoodsStore();
  const inventoryStore = useInventoryStore();
  const app = useAppStore();

  const router = useRouter();
  const route = useRoute();

  const $q = useQuasar();

  const documentId = ref(undefined);
  const isPrintConfirmationDialogVisible = ref(false);

  const allowConfirm = computed(() => {
    return inventoryStore.inventory?.every((i) => i.stock == i.quant);
  });

  async function showPrintConfirmationDialog() {

    isPrintConfirmationDialogVisible.value = true;
  }

  function hidePrintConfirmationDialog() {
    isPrintConfirmationDialogVisible.value = false;
  }

  async function handlePrintConfirmation(printConfirmed) {
    $q.loading.show();
    try {
      if (printConfirmed) {
        await printInventory({ documentId: documentId.value, $q, appStore: app });
      }
      hidePrintConfirmationDialog();
      if (route.path === "/open-shift/complete-inventory") {
        await app.openTerminalShift();
        router.push(app.shiftIsGood() ? "/hello" : "/employee-actions");
      } else if (route.path === "/close-shift/complete-inventory") {
        await app.closeTerminalShift();
        router.push("/employee-actions");
      } else {
        router.push("/employee-actions");
      }
    } catch (error) {
      console.error("inventoryStore.submitInventory print error:", error);
      $q.notify({
        color: "warning",
        icon: "warning",
        position: "center",
        message: t("unable_to_print_submit_inventory"),
        timeout: 6000,
      });
    } finally {
      $q.loading.hide();
    }
  }

  async function submitInventory() {
    try {
      $q.loading.show();
      try {
        if (route.path === "/open-shift/complete-inventory") {
          const { documentId: docId } = await inventoryStore.submitInventory();
          documentId.value = docId;
        } else if (route.path == "/close-shift/complete-inventory") {
          const { documentId: docId } = await inventoryStore.submitInventory();
          documentId.value = docId;
        } else {
          const { documentId: docId } = await inventoryStore.submitInventory();
          documentId.value = docId;
        }
        await showPrintConfirmationDialog();
      } catch (e) {
        console.error("inventoryStore.submitInventory error:", err);
        $q.notify({
          color: "warning",
          icon: "warning",
          position: "center",
          message: t("unable_to_submit_inventory"),
          timeout: 6000,
        });
      } finally {
        $q.loading.hide();
      }
    } catch (err) {
      console.error("inventoryStore.submitInventory error:", err);
      $q.notify({
        color: "warning",
        icon: "warning",
        position: "center",
        message: t("unable_to_submit_inventory"),
        timeout: 6000,
      });
    }
  }

  const date = new Date();
  // Format the date using Moment.js
  const formattedDate = moment(date).format("DD.MM.YY");
  const time = date.getTime();
  const formattedTime = moment(time).format("LT").slice(0, -3);

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language);
      await inventoryStore.updateInventory();
    } catch (err) {
      console.error("inventoryStore.updateInventories error:", err);
      $q.notify({
        color: "warning",
        icon: "warning",
        position: "center",
        message: t("unable_to_load_inventory"),
        timeout: 6000,
      });
      router.push("/employee-actions");
    }
  });
</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position">
      <RectangularButton
        :name="$t('back_to_employee_actions')"
        color="secondary"
        icon="arrow_back_ios_new"
        class="q-pr-sm"
        @click="router.push('/employee-actions')"
      />
      <div
        class="text-h2 text-uppercase text-center q-mb-lg-lg q-mb-xs-sm q-pt-sm-sm q-pt-xs-sm"
      >
        <div class="text-capitalize text-h3">
          {{ $t('remaining_goods') }}
        </div>
        <div class="row date_style text-h3">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№ {{ inventoryStore.docNumStr }}</span>
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <div>
        <ol class="bg-white text-black relative-position ol_style">
          <ListItem
            v-for="good in inventoryStore.inventory"
            :key="good.id"
            :actual_quantity="good.quant"
            :good_name="good.title"
            :estimated_quantity="good.stock"
            :not_equal="good.stock !== good.quant"
            :class="{ highlighted: good.confirmed }"
            @itemConfirm="good.confirmed = !good.confirmed"
            @resetActualQuantity="good.quant = 0"
            :id="good.id"
          />
        </ol>
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg-lg q-mb-md-sm q-mb-xs-sm" />
      <div
        class="row justify-between items-center q-mb-lg-xl q-mb-md-md q-mb-xs-sm"
      >
        <div class="row text-h3">
          <span class="q-mr-xs-xs">{{$t('total')}}</span>
          <span class="q-mr-xs-xs">{{inventoryStore.inventory.length}}</span>
          <span class="q-mr-xs-xs">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: inventoryStore.inventory.length}) }}</span>
        </div>

        <div class="text-h3 text-weight-regular row">
          <div class="q-mr-xs-xs">{{$t('estimated_quantity')}}</div>
          <div class="q-mr-xs-xs">{{inventoryStore.totalQuantity}}</div>
          <div class="q-mr-xs-xs">{{ $t('pc', {count: inventoryStore.totalQuantity}) }}</div>
          <q-separator color="secondary" vertical class="q-mr-xs-xs" size="0.2rem" />
          <div class="q-mr-xs-xs">{{$t('actual_quantity')}}</div>
          <div class="q-mr-xs-xs">{{ inventoryStore.totalActualQuant }}</div>
          <div>{{ $t("pc", { count: inventoryStore.totalActualQuant }) }}</div>
        </div>
      </div>
      <div class="row justify-evenly">
        <RectangularButton
          :name="$t('confirm')"
          class="col-5 button_style_confirm"
          @click="submitInventory"
        />
        <RectangularButton
          color="warning"
          :name="$t('declare_discrepancy')"
          class="col-5 button_style_confirm"
          @click="submitInventory"
        />
      </div>
    </div>
  </div>
  <RedirectDialog :modelValue="isPrintConfirmationDialogVisible" title="print?">
    <template #content>
      <div class="text-h5 text-center">
        <div class="text-h5">{{ $t("print") }}</div>
      </div>
    </template>
    <template #actions>
      <RectangularButton
        :name="$t('do_not') + ' ' + $t('print')"
        color="transparent"
        class="q-px-md-sm q-px-xs-sm q-py-xs-xs"
        @click="handlePrintConfirmation(false)"
        textColor="primary"
      />
      <RectangularButton
        :name="$t('print')"
        class="q-px-md-sm q-px-xs-sm q-py-xs-xs"
        @click="handlePrintConfirmation(true)"
      />
    </template>
  </RedirectDialog>
</template>

<style scoped>
.main_container {
  display: grid;
  grid-template-rows: max-content 1fr 0.1fr;
}

.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
ol li {
  margin-bottom: 2.5rem;
}

ol {
  padding: 0 3px;
}
</style>
