<script setup lang="ts">
  import { ref } from 'vue';
  import DividerThin from '../../dividers/divider-thin.vue';
  import Bin from './bin.vue';
  import DialogDeleteReasons from './dialog-delete-reasons.vue';
  import { showDialog } from 'src/services/dialogs';
  import { t } from 'i18next';


  const props = defineProps({
    order: {
      type: Object,
      required: true,
    },
    option: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['click', 'deleteOrder']);
  const deleteOrder = (reason: string) => {
    emit('deleteOrder', reason);
  }

  const isDisabled = ref(false);

  const openDialog = ref(false);
  const openReasons = ref(false);
  const open = () => {
    showDialog({
      text: `${t('delete_product')} ${props.order.orderNumStr}`,
      buttons: [{
        name: "not", type: "equal", handler: async () => openDialog.value = false
      }, {
        name: "yes", type: "equal", handler: async () => openReasons.value = true
      }],
    })
  }
  const closeReasons = () => {
    openReasons.value = false;
    openDialog.value = false;
  }
</script>

<template>
  <div class="order_item column justify-between bg-white pa-20 mb-20" v-bind="$attrs" @click="emit('click')">
    <div class="row justify-between items-center mb-10">
      <div class="text-h3">
        № {{ props.order.orderNumStr }}
      </div>
      <div class="text-h2">
        &#3647&ensp;{{ props.order.totalPrice }}
      </div>
    </div>
    <DividerThin class="bg-grey-1 mb-10" />
    <div class="row justify-between items-center">
      <div class="text-h4 text-weight-regular">
        {{ props.order.allTitles }}
      </div>
      <Bin @click="open" class="px-0" :round="false" :disable="isDisabled" />
    </div>
  </div>
  <DialogDeleteReasons
    :modelValue="openReasons"
    :orderNum="props.order.orderNumStr"
    @deletionWithReason="(reason) => deleteOrder(reason)"
    @closeReasons="closeReasons"
  />
</template>

<style scoped lang="scss">
.order_item {
  width: 100%;
  height: max-content;
  border-radius: var(--border-xxs);
  box-shadow: var(--border-shadow);
}

</style>
