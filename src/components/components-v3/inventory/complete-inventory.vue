<script setup lang="ts">
  import i18next, { t } from 'i18next';
import moment from 'moment';
import { useQuasar } from 'quasar';
import {
printInventory
} from 'src/services';
import { showDialog } from 'src/services/dialogs';
import { useAppStore } from 'src/stores/app';
import { useGoodsStore } from 'src/stores/goods';
import { useInventoryStore } from 'src/stores/inventory';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DividerBold from '../../dividers/divider-bold.vue';
import BackButton from '../buttons/back-button.vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import InventoryTableBody from './table/inventory-table-body.vue';
import InventoryTable from './table/inventory-table.vue';

  const goodsStore = useGoodsStore();
  const inventoryStore = useInventoryStore();
  const app = useAppStore();

  const router = useRouter();
  const route = useRoute();

  const $q = useQuasar();

  const documentId = ref<string | undefined>(undefined);

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

  async function submitInventory(autocomplete = false) {
    try {
      $q.loading.show();
      try {
        const { documentId: docId } = await inventoryStore.submitInventory(autocomplete);
        documentId.value = docId;
        showDialog({
          text: t("print_inventory_results"),
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
      await inventoryStore.prepareFullInventory();
    } catch (err) {
      console.error("inventoryStore.prepareFullInventory error:", err);
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
    const item = inventoryStore.inventory?.items.find((i) => i.id === id);
    if(item?.id == id) {
      showDialog({
        text: `${t('are_you_sure_you_want_to_rescan_the_product')} ${item.title}`,
        buttons: [{
          name: "no", type: "common", handler: async () => {
            console.log("close");
          },
        }, {
          name: "yes", type: "primary", handler: async () => {
            item.quant = 0;
            item.scannedItems = [];
          },
        }],
      })
    }
  }
</script>

<template>
  <div class="main_container full-height full-width relative-position">
    <div class="column justify-center relative-position mb-20 px-40 pt-60">
      <BackButton @click="router.push('/employee-actions')" class="back_button_class" />
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
          v-for="(good, index) in inventoryStore.inventory?.items"
          :key="good.id"
          :good_quant="good.quant"
          :good_title="good.title"
          :good_stock="good.stock ?? 0"
          :good_number="index + 1"
          :class="{ 'highlighted': good.confirmed }"
          @resetActualQuantity="reset(good.id)"
        />
      </InventoryTable>
    </div>
    <div>
      <DividerBold class="mb-30" />
      <div class="row justify-between items-center px-40 mb-40">
        <div class="row text-h4">
          <span class="mr-16">{{$t('total')}}</span>
          <span class="mr-16">{{inventoryStore.inventory?.items.length}}</span>
          <span class="mr-16">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: inventoryStore.inventory?.items.length}) }}</span>
        </div>

        <div class="text-h4 text-weight-regular row">
          <div class="mr-16">{{$t('estimated_quantity')}}</div>
          <div class="mr-16">{{inventoryStore.inventory?.totalStock}}</div>
          <div class="mr-16">{{ $t('pc', {count: inventoryStore.inventory?.totalStock}) }}</div>
          <q-separator color="secondary" vertical class="mr-16" size="0.2rem" />
          <div class="mr-16">{{$t('actual_quantity')}}</div>
          <div class="mr-16">{{ inventoryStore.totalActualQuant }}</div>
          <div>{{ $t("pc", { count: inventoryStore.totalActualQuant }) }}</div>
        </div>
      </div>
      <div class="full-width buttons_container px-100 pb-40">
        <RectangularButton
          :name="$t('autocomplete_inventory_under_my_responsibility')"
          @click="submitInventory(true)"
        />
        <RectangularButton v-if="!inventoryStore.isInventoryDone"
          :name="$t('declare_discrepancy')"
          color="warning"
          @click="submitInventory(false)"
        />
        <RectangularButton v-else
          :name="$t('confirm')"
          @click="submitInventory(false)"
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
