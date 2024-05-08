<script setup lang="ts">
  import i18next, { t } from 'i18next';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { printGoodsArrival, printInventory } from 'src/services';
import { useAppStore } from 'src/stores/app';
import { useArrivalsStore } from 'src/stores/arrivals';
import { useGoodsStore } from 'src/stores/goods';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DividerBold from '../../dividers/divider-bold.vue';
import BackButton from '../buttons/back-button.vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import ArrivalItem from './arrival-item.vue';
import { showDialog } from 'src/services/dialogs';

  const goodsStore = useGoodsStore();
  const documentId = ref<string | undefined>(undefined);

  const $q = useQuasar();

  const arrivalsStore = useArrivalsStore();
  const router = useRouter();
  const route = useRoute();
  const appStore = useAppStore();

  const allowConfirm = computed(() => {
    return arrivalsStore.arrival?.items?.every(i => i.issued == i.quant)
  });

  async function handlePrintConfirmation(printConfirmed: boolean) {
    $q.loading.show();
    try {
      if (printConfirmed) {
        if (documentId.value !== undefined) {
          await printGoodsArrival({documentId: arrivalsStore.arrivalDocument?.id ?? '', $q, appStore})
        } else {
          // Handle the case where documentId.value is undefined
          console.error("documentId is undefined");
        }
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
      router.push("/employee-actions");
      // TODO возможно стоит добавить диалоговое окно, перед редиректом, с информацией что товар добавлен
    }
  }

  const confirmArrival = async () => {
   const result =  await arrivalsStore.confirmArrivalGoodsIssue();
    if (result) {
      const { documentId: docId } = result;
      if (docId) {
        documentId.value = docId;
        await showDialog({
          text: t("print_inventory_results"),
          buttons: [{
            name: "not_print", type: "equal", handler: async () => handlePrintConfirmation(false)
          }, {
            name: "print", type: "equal", handler: async () => handlePrintConfirmation(true)
          }],
        })

      }
    }
    // router.push('/employee-actions');
    // TODO возможно стоит добавить диалоговое окно, перед редиректом, с информацией что товар добавлен
  }

  // Get the current date
  const date = new Date();
  // Format the date using Moment.js
  const formattedDate = moment(date).format('DD.MM.YY');
  const time = date.getTime();
  const formattedTime = moment(time).format('LT').slice(0, -3);

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language);
      await arrivalsStore.updateArrivals();
      await arrivalsStore.selectArrival(typeof route.params.id === 'string' ? route.params.id : route.params.id[0]);
    } catch (err) {
      console.error('arrivalsStore.selectArrival error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_order'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
    appStore.colorMode = 'light';
  })

  const reset = (id: string) => {
    const item = arrivalsStore.arrival?.items.find((i) => i.id === id);
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
          },
        }],
      })
    }
  }

</script>

<template>
  <div class="main_container full-height full-width">
    <div class="column justify-center relative-position q-mb-xl px-40 pt-60">
      <BackButton @click="router.push('/employee-actions')" class="back_button_class" />
      <div class="text-h2 text-uppercase text-center mb-100">
        {{ $t('arrival_goods') }}
      </div>

      <div class="row justify-between">
        <div class="text-h3 first_letter">
          {{ $t('received_goods') }}
        </div>
        <div class="text-h4 row q-gutter-x-sm text-weight-regular">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№{{ arrivalsStore.arrival?.arrivalNumStr }}</span>
        </div>
      </div>
    </div>

    <!-- header -->
    <div class="full-width px-40 py-10 justify-between header_class items-center">
      <div class="text-h4 text-weight-bold text-center">
        <div>
          #
        </div>
      </div>
      <div class="text-h4 text-weight-bold first_letter">
          {{ $t('product_name') }}
      </div>
      <div class="text-h4 text-weight-bold column">
        <span class="first_letter">{{ $t('estimated_quantity') }}</span>
        <span>({{$t('pcs')}})</span>
      </div>
      <div class="text-h4 text-weight-bold column">
        <span class="first_letter">{{ $t('actual_quantity') }}</span>
        <span>({{$t('pcs')}})</span>
      </div>
    </div>

    <div class="scroll_area_block pa-20">
      <div class="arrivals_container">
        <ArrivalItem v-for="(arrival, index) in arrivalsStore.arrival?.items"
          :key="arrival.id"
          :good_title="arrival.title"
          :good_stock="arrival.issued"
          :good_quant="arrival.quant"
          :good_number="index + 1"
          @resetActualQuantity="reset(arrival.id)"
        />
      </div>
    </div>
    <DividerBold class="mb-14" />
    <div class="column px-40 pb-40">
      <div class="row justify-between items-center mb-40">
        <div class="text-h3 row">
          <span class="mr-16">{{$t('total')}}</span>
          <span class="mr-16">{{arrivalsStore.arrival?.items.length}}</span>
          <span class="mr-16">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: arrivalsStore.arrival?.items.length}) }}</span>
        </div>

        <div class="text-h4 text-weight-regular row">
          <div class="mr-16">{{$t('estimated_quantity')}}</div>
          <div class="mr-16">{{arrivalsStore.arrival?.totalCount}}</div>
          <div class="mr-16">{{ $t('pc', {count: arrivalsStore.arrival?.totalCount}) }}</div>
          <q-separator color="secondary" vertical class="mr-16" size="0.2rem" />
          <div class="mr-16">{{$t('actual_quantity')}}</div>
          <div class="mr-16">{{ arrivalsStore.totalQuant }}</div>
          <div>{{ $t('pc', {count: arrivalsStore.totalQuant}) }}</div>
        </div>
      </div>
      <div class="full-width buttons_container px-100">
        <!-- <RectangularButton :name="$t('print')" :color="'secondary'" size="xl" class="q-pr-sm" @click="printGoodsArrival({documentId: arrivalsStore.arrivalDocument?.id ?? '', $q, appStore})" /> -->
        <RectangularButton
          @click="confirmArrival"
          color="warning"
          :name="$t('declare_discrepancy')"
        />
        <RectangularButton
          :name="$t('confirm')"
          class="fit button_style_confirm"
          @click="confirmArrival"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_container {
  display: grid;
  grid-template-rows: repeat(2, max-content) 1fr max-content 0.1fr;
}
.scroll_area_block {
  overflow-y: scroll;
  scrollbar-width: none;
}
.opacity_header {
  opacity: 0;
}
.header_class {
  display: grid;
  grid-template-columns: 15fr 77fr 58fr 52fr 5fr;
  column-gap: 2rem;
  border-bottom: 3px solid black;
  border-top: 3px solid black;
}
.arrivals_container {
  padding: 0.5rem;
}

.buttons_container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--px60);
}

</style>
