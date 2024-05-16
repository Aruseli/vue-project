<script setup lang="ts">
  import { t } from 'i18next';
import { useQuasar } from 'quasar';
import { printCheck } from 'src/services';
import { useAppStore } from 'src/stores/app';
import { useOrdersStore } from 'src/stores/orders';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../../dividers/divider-bold.vue';
import DividerThin from '../../dividers/divider-thin.vue';
import BackButton from '../buttons/back-button.vue';
import OrderCard from './order-card.vue';
import Bin from './bin.vue';
import DialogDelete from './dialog-delete.vue';
import { showDialog } from 'src/services/dialogs';

  const $q = useQuasar();
  const appStore = useAppStore();
  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();

  const confirmOrder = async () => {
    const doc = ordersStore.currentOrderDocument
    if(!doc) {
      return;
    }
    await ordersStore.confirmCurrentOrderIssue()
    await printCheck({documentId: doc.id, $q, appStore})
    router.push('/issued-order');
  }

  const allowConfirm = computed(() => {
    return ordersStore.currentOrder?.items?.every(i => i.issued == i.quant)
  });

  onMounted(async () => {
    try {
      await ordersStore.selectOrder(typeof route.params.id === 'string' ? route.params.id : route.params.id[0])
    } catch (err) {
      console.error('ordersStore.selectOrder error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_order'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })

  const paymentMethod = (option: 'cash' | 'card') => {
    if (ordersStore.currentOrder) {
      ordersStore.currentOrder.payment = option;
    }
  }

  const deleteProduct = async (id: string) => {
    await ordersStore.deleteGoodInCurrentOrder(id);
  }

  const openDialog = ref(false);
  const openReason = ref(false);
  const reason = ref('because I want')
  const open = () => {
    openDialog.value = true;
  }
  const deletionReason = () => {
    openReason.value = true;
  }
  const deleteOrder = async (id: string) => {
    await ordersStore.deleteOrder(id);
    router.go(-1);
  }
</script>

<template>
  <div class="main_container full-height">
    <div class="row justify-center relative-position q-mb-xl px-40 pt-60">
      <BackButton @click="router.push('/issuing-order')" class="back_button_class" />
      <div class="text-h2 text-uppercase text-center mr-20">
        {{ $t('order') }}&ensp;№{{ ordersStore.currentOrder?.orderNumStr }}
      </div>
      <Bin @click="open" class="px-0" :round="false" />
    </div>
    <DividerThin class="mb-60 bg-grey-1" />
    <div class="scroll_area px-40">
      <div class="orders_container">
        <transition-group name="list" tag="div">
          <div v-for="order in ordersStore.currentOrder?.items.filter(i => !i.deleted)" :key="order.id" class="ghost">
            <OrderCard
              :good="order"
              @deleteProduct="deleteProduct(order.id)"
            />
          </div>
        </transition-group>
      </div>
    </div>
    <DividerBold class="mb-30" />
    <div class="px-40 pb-20">
      <div class="column">
        <div class="mb-20 text-h2 text-uppercase">{{ $t('total') }}</div>

        <div class="row justify-between">
          <div class="text-h3 row q-gutter-x-sm text-weight-bold">
            <span>{{ $t('order') }}</span>
            <span>{{ ordersStore.currentOrder?.totalCount }}</span>
            <span>{{ $t('product') }}</span>
            <span>{{ $t('units', { count: ordersStore.currentOrder?.totalCount }) }}</span>
          </div>
          <div class="text-h2"> {{ ordersStore.currentOrder?.totalPrice }}&ensp;&#3647</div>
        </div>
      </div>
    </div>
    <DividerThin class="bg-grey-2 mb-40" />
    <div class="column items-center px-100 pb-40 full-width buttons_container">
      <RectangularButton
        :name="$t('cash_payment')"
        @click="paymentMethod('cash')"
        :color="allowConfirm ? 'grey-3' : 'grey'"
        :textColor="ordersStore.currentOrder?.payment == 'cash' ? 'green' : 'white'"
        :disable="!allowConfirm"
        class="cash_class"
      />
      <RectangularButton
        :color="allowConfirm ? 'grey-3' : 'grey'"
        :name="$t('card_payment')"
        :textColor="ordersStore.currentOrder?.payment == 'card' ? 'green' : 'white'"
        @click="paymentMethod('card')"
        :disable="!allowConfirm"
        class="card_class"
      />
      <RectangularButton
        :name="$t('confirm')"
        @click="confirmOrder"
        :color="ordersStore.currentOrder?.payment !== '' ? 'grey-3' : 'grey'"
        :disable="ordersStore.currentOrder?.payment == ''"
        class="full-width confirm_class"
      />
    </div>
  </div>
  <DialogDelete :modelValue="openDialog"
    :title="openReason == false ? 'delete_order' : 'reason for deletion'"
  >
    <template #content>
      <div v-if="openReason == false" class="text-center text-uppercase text-h3 mb-20">{{ ordersStore.currentOrder?.orderNumStr }}</div>
      <div v-else>
        <div class="text-left text-h4 mb-20 column">
          <q-radio
            v-model="reason"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            :val="$t('because I want')"
            :label="$t('because I want')"
            color="black"
            keep-color
          />
          <q-radio
            v-model="reason"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            :val="$t('because I can')"
            :label="$t('because I can')"
            color="black"
            keep-color
          />
          <q-radio
            v-model="reason"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            :val="$t('because it is necessary')"
            :label="$t('because it is necessary')"
            color="black"
            keep-color
          />
        </div>
        <RectangularButton
          :name="$t('delete')"
          @click="deleteOrder(ordersStore.currentOrder?.id ?? '')"
        />
      </div>
    </template>
    <template #actions v-if="openReason == false">
      <RectangularButton
        :name="$t('no')"
        @click="openDialog = false"
        />
      <RectangularButton
      :name="$t('yes')"
      @click="openReason = true"
      />
    </template>
  </DialogDelete>
</template>

<style scoped lang="scss">
.main_container {
  display: grid;
  grid-template-rows: repeat(2, max-content) 1fr repeat(2, max-content);
  background-color: white;
}
.orders_container > *:not(:last-of-type) {
  margin-bottom: var(--px30);
}
.buttons_container {
  display: grid;
  grid-template-areas: "cash card"
                       "confirm confirm";
  column-gap: var(--px60);
  row-gap: var(--px30);
}
.cash_class {
  grid-area: cash;
}
.card_class {
  grid-area: card;
}
.confirm_class {
  grid-area: confirm;
}

.selected {
  background-color: var(--q-primary);
  color: white;
}


.bounce-enter-from {
  opacity: 0;
}
.bounce-enter-to {
  opacity: 1;
}
.bounce-enter-active {
  transition: opacity 2s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.bounce-leave-active {
  transition: opacity 3s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.ghost {
  transition: all 1s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-enter {
  transform: translateY(30%);
}

.list-leave-to {
  transform: translateX(300%);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
