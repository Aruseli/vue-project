<script setup lang="ts">
  import i18next, { t } from 'i18next';
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
printInventory
} from 'src/services';
import { useAppStore } from 'src/stores/app';
import { useGoodsStore } from 'src/stores/goods';
import { useInventoryStore } from 'src/stores/inventory';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DividerBold from '../../dividers/divider-bold.vue';
import BackButton from '../buttons/back-button.vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import InventoryTableBody from './table/inventory-table-body.vue';
import InventoryTable from './table/inventory-table.vue';
import { showDialog } from 'src/services/dialogs';

  const goodsStore = useGoodsStore();
  const inventoryStore = useInventoryStore();
  const app = useAppStore();

  const router = useRouter();
  const route = useRoute();

  const $q = useQuasar();

  const documentId = ref<string | undefined>(undefined);

  const allowConfirm = computed(() => {
    return inventoryStore.inventory?.every((i) => i.stock == i.quant);
  });

async function handlePrintConfirmation(printConfirmed: boolean) {
  $q.loading.show();
  try {
    if (printConfirmed) {
      if (documentId.value !== undefined) {
        await printInventory({ documentId: documentId.value, $q, appStore: app });
      } else {
        // Handle the case where documentId.value is undefined
        console.error("documentId is undefined");
      }
    }
    if (route.path === "/open-shift/complete-inventory") {
      await app.openTerminalShift();
      router.push(app.shiftIsGood ? "/hello" : "/employee-actions");
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
        // await showPrintConfirmationDialog();
        await showDialog({
          text: "print_inventory_results",
          buttons: [{
            name: "not_print", type: "equal", handler: async () => handlePrintConfirmation(false)
          }, {
            name: "print", type: "equal", handler: async () => handlePrintConfirmation(true)
          }],
        })
      } catch (err) {
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

  const reset = (id: string) => {
    const item = inventoryStore.inventory.find((i) => i.id === id);
    if(item?.id == id) {
      console.log(item.title, item.id)
      showDialog({
        text: `$t(are_you_sure_you_want_to_rescan_the_product) ${item.title}`,
        buttons: [{
          name: "defer", type: "common", handler: async () => {console.log("close")}
        }, {
          name: "execute", type: "primary", handler: async () => item.quant = 0
        }],
      })
    }
  }
</script>

<template>
  <div class="main_container full-height full-width">
    <div class="column justify-center relative-position mb-20 px-40 pt-40">
      <BackButton @click="router.push('/employee-actions')" class="absolute-top-left" />
      <div class="text-h2 text-uppercase text-center mb-100">
        {{ $t('complete_inventory') }}
      </div>

      <div class="row justify-between">
        <div class="text-h3 first_letter">
          {{ $t('received_goods') }}
        </div>
        <div class="text-h4 row q-gutter-x-sm text-weight-regular">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№{{ inventoryStore.docNumStr  }}</span>
        </div>
      </div>
    </div>

    <div class="scroll_area">
      <InventoryTable>
        <InventoryTableBody
          v-for="(good, index) in inventoryStore.inventory"
          :key="good.id"
          :good_quant="good.quant"
          :good_title="good.title"
          :good_stock="good.stock ?? 0"
          :good_number="index + 1"
          :class="{ 'highlighted': good.confirmed }"
          @itemConfirm="good.confirmed = !good.confirmed"
          @resetActualQuantity="reset(good.id)"
        />
      </InventoryTable>
    </div>
    <div>
      <DividerBold class="mb-30" />
      <div class="row justify-between items-center px-40 mb-40">
        <div class="row text-h3">
          <span class="mr-16">{{$t('total')}}</span>
          <span class="mr-16">{{inventoryStore.inventory.length}}</span>
          <span class="mr-16">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: inventoryStore.inventory.length}) }}</span>
        </div>

        <div class="text-h3 text-weight-regular row">
          <div class="mr-16">{{$t('estimated_quantity')}}</div>
          <div class="mr-16">{{inventoryStore.totalQuantity}}</div>
          <div class="mr-16">{{ $t('pc', {count: inventoryStore.totalQuantity}) }}</div>
          <q-separator color="secondary" vertical class="mr-16" size="0.2rem" />
          <div class="mr-16">{{$t('actual_quantity')}}</div>
          <div class="mr-16">{{ inventoryStore.totalActualQuant }}</div>
          <div>{{ $t("pc", { count: inventoryStore.totalActualQuant }) }}</div>
        </div>
      </div>
      <div class="full-width buttons_container px-100 pb-40">
        <RectangularButton
          :name="$t('confirm')"
          @click="submitInventory"
        />
        <RectangularButton
          color="warning"
          :name="$t('declare_discrepancy')"
          @click="submitInventory"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_container {
  display: grid;
  grid-template-rows: max-content 1fr max-content;
}
.buttons_container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--px60);
}
</style>
