<script setup lang="ts">
  import i18next, { t } from 'i18next';
  import moment from 'moment';
  import { useQuasar } from 'quasar';
  import { useGoodsStore } from 'src/stores/goods';
  import { useSelectiveInventoryStore } from 'src/stores/selective-inventory';
  import { onMounted , ref} from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import DividerBold from '../../dividers/divider-bold.vue';
  import BackButton from '../buttons/back-button.vue';
  import ModalButton from '../buttons/modal-button.vue';
  import Modal from '../../overlay/modal.vue';
  import InventoryTableBody from './table/inventory-table-body.vue';
  import InventoryTable from './table/inventory-table.vue';
  import { useAppStore } from "src/stores/app";
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
    <div class="column justify-center relative-position mb-20 px-40 pt-40">
      <BackButton @click="router.push('/employee-actions')" class="absolute-top-left" />
      <div class="text-h2 text-uppercase text-center mb-100">
        {{ $t('selective_inventory') }}
      </div>

      <div class="row justify-between">
        <div class="text-h3 first_letter">
          {{ $t('received_goods') }}
        </div>
        <div class="text-h4 row q-gutter-x-sm text-weight-regular">
          <span>{{ formattedDate }}</span>
          <span>№{{ selectiveInventoryStore.selectedInventory?.inventoryNumStr  }}</span>
        </div>
      </div>
    </div>

    <div class="scroll_area">
      <InventoryTable>
        <InventoryTableBody
          v-for="(inv, index) in selectiveInventoryStore.selectedInventory?.items"
          :key="inv.id"
          :good_quant="inv.quant"
          :good_title="inv.title"
          :good_stock="inv.stock ?? 0"
          :good_number="index + 1"
          :class="{ 'highlighted': inv.confirmed }"
          @itemConfirm="inv.confirmed = !inv.confirmed"
          @resetActualQuantity="inv.quant = 0"
        />
      </InventoryTable>
    </div>

    <div>
      <DividerBold class="mb-30" />
      <div class="row justify-between items-center items-center px-40 mb-40">
        <div class="row text-h3">
          <span class="mr-16">{{$t('total')}}</span>
          <span class="mr-16">{{selectiveInventoryStore.selectedInventory?.items.length}}</span>
          <span class="mr-16">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: selectiveInventoryStore.selectedInventory?.items.length}) }}</span>
        </div>

        <div class="text-h3 text-weight-regular row">
          <div class="mr-16">{{$t('estimated_quantity')}}</div>
          <div class="mr-16">{{selectiveInventoryStore.selectedInventory?.totalStock}}</div>
          <div class="mr-16">{{ $t('pc', {count: selectiveInventoryStore.selectedInventory?.totalStock}) }}</div>
          <q-separator color="secondary" vertical class="mr-16" size="0.2rem" />
          <div class="mr-16">{{$t('actual_quantity')}}</div>
          <div class="mr-16">{{ selectiveInventoryStore.totalQuant }}</div>
          <div>{{ $t('pc', {count: selectiveInventoryStore.totalQuant}) }}</div>
        </div>
      </div>
      <div class="full-width buttons_container px-100 pb-40">
        <RectangularButton
          name="confirm"
          @click="confirmInventory"
        />
        <RectangularButton
          color="warning"
          :name="$t('declare_discrepancy')"
          @click="confirmInventory"
        />
      </div>
    </div>
  </div>
  <Modal :isOpen="isPrintConfirmationDialogVisible" class="bg-white">
    <div class="text-h2 mb-30 text-center first_letter">{{ $t('print') }}?</div>
    <div class="buttons_container">
      <ModalButton
        :name="$t('not_print')"
        color="transparent"
        textColor="black"
        @click="handlePrintConfirmation(false)"
      />
      <ModalButton
        :name="$t('print')"
        @click="handlePrintConfirmation(true)"
      />
    </div>
  </Modal>
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
