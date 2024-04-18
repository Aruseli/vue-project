<script setup>
  import i18next, { t } from 'i18next';
  import moment from 'moment';
  import { useQuasar } from 'quasar';
  import { useGoodsStore } from 'src/stores/goods';
  import { useSelectiveInventoryStore } from 'src/stores/selective-inventory';
  import { onMounted , ref} from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import DividerBold from '../dividers/divider-bold.vue';
  import ListItem from './list-item.vue';
  import { useAppStore } from "src/stores/app";
  import RedirectDialog from 'src/components/dialog/redirect-dialog.vue';
import { printInventory } from 'src/services';

  const $q = useQuasar();

  const router = useRouter();
  const route = useRoute();
  const selectiveInventoryStore = useSelectiveInventoryStore();
  const goodsStore = useGoodsStore();

  const app = useAppStore();
  const documentId = ref(undefined);
  const isPrintConfirmationDialogVisible = ref(false);

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language)
      await selectiveInventoryStore.updateInventories();
      await selectiveInventoryStore.selectInventory();
    } catch (err) {
      console.error('selectiveInventoryStore.updateInventories error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_inventory'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })

  const date = selectiveInventoryStore.selectedInventory?.inventoryDate;
  // Format the date using Moment.js
  const formattedDate = moment(date).format('DD.MM.YY HH:mm');

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
    router.push('/employee-actions');
    // TODO возможно стоит добавить диалоговое окно, перед редиректом, с информацией что товар добавлен
  }
}

  const confirmInventory = async () => {
    const {documentId: docId} = await selectiveInventoryStore.confirmSelectedInventory()
    if(docId) {
      documentId.value = docId;
      await showPrintConfirmationDialog();
    }
  }

</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position">
      <RectangularButton
        :name="$t('back_to_employee_actions')"
        color="secondary"
        icon="arrow_back_ios_new"
        class="q-pr-sm"
        classTitle="text-subtitle1"
        @click="router.push('/employee-actions')"
      />
      <div
        class="
          text-h2 text-uppercase text-center
          q-mb-xl
          q-mb-lg-lg
          q-mb-xs-sm
          q-pt-sm-sm
          q-pt-xs-sm
        "
      >{{ $t('selective_inventory') }}</div>

      <div
        class="
          row justify-between
          q-mb-md-sm
          q-mb-xs-sm
        "
      >
        <div class="text-h3 text-capitalize">
          {{ $t('remaining_goods') }}
        </div>
        <div class="row date_style text-h3">
          <span>{{ formattedDate }}</span>
          <span>№{{ selectiveInventoryStore.selectedInventory?.inventoryNumStr }}</span>
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <div>
        <ol class="bg-white text-black relative-position q-pl-none">
          <ListItem
            v-for="inv in selectiveInventoryStore.selectedInventory?.items"
            :key="inv.id"
            :actual_quantity="inv.quant"
            :good_name="inv.title"
            :estimated_quantity="inv.stock"
            :not_equal="inv.stock !== inv.quant"
            :class="{ 'highlighted': inv.confirmed }"
            @itemConfirm="inv.confirmed = !inv.confirmed"
            @resetActualQuantity="inv.quant = 0"
            :id="inv.id"
          />
        </ol>
      </div>
    </div>
    <div>
      <DividerBold
        class="
          q-mb-lg-lg
          q-mb-md-sm
          q-mb-xs-sm
        "
      />
      <div
        class="
          row justify-between items-center
          q-mb-lg-xl
          q-mb-md-md
          q-mb-xs-sm
        "
      >
        <div class="row text-h3">
          <span class="q-mr-xs-xs">{{$t('total')}}</span>
          <span class="q-mr-xs-xs">{{selectiveInventoryStore.selectedInventory?.items.length}}</span>
          <span class="q-mr-xs-xs">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: selectiveInventoryStore.selectedInventory?.items.length}) }}</span>
        </div>

        <div class="text-h3 text-weight-regular row q-gutter-x-sm">
          <div class="q-mr-xs-xs">{{$t('estimated_quantity')}}</div>
          <div class="q-mr-xs-xs">{{selectiveInventoryStore.selectedInventory?.totalStock}}</div>
          <div class="q-mr-xs-xs">{{ $t('pc', {count: selectiveInventoryStore.selectedInventory?.totalStock}) }}</div>
          <q-separator color="secondary" vertical class="q-mr-xs-xs" size="0.2rem" />
          <div class="q-mr-xs-xs">{{$t('actual_quantity')}}</div>
          <div class="q-mr-xs-xs">{{ selectiveInventoryStore.totalQuant }}</div>
          <div>{{ $t('pc', {count: selectiveInventoryStore.totalQuant}) }}</div>
        </div>
      </div>
      <div class="row justify-evenly">
        <RectangularButton
          name="confirm"
          class="col-5 button_style_confirm"
          @click="confirmInventory"
        />
        <RectangularButton
          color="warning"
          :name="$t('declare_discrepancy')"
          class="col-5 button_style_confirm"
          @click="confirmInventory"
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

</style>
