<script setup lang="ts">
  import Bin from './bin.vue';
  import DialogDelete from './dialog-delete.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import { ref } from 'vue';

  const props = defineProps({
    good: {
      type: Object,
      required: true,
    },
  })

  const openDialog = ref(false);
  const open = () => {
    openDialog.value = true;
  }
  const emit = defineEmits(['click', 'deleteProduct']);
</script>

<template>
  <div
    :class="'cart_product_item row pa-30 ' + (props.good.issued != props.good.quant ? 'bg-white' : 'bg-green')"
    v-bind="$attrs"
    @click="emit('click')">
    <div class="col-1 mr-40">
      <q-img
        :src="props.good.image"
        ration="1"
        class="img_style"
        fit="none"
      >
        <template #loading>
          <div class="text-subtitle1 text-black">
            Loading...
          </div>
        </template>
      </q-img>
    </div>
    <div class="column justify-evenly col">
      <div class="row justify-between items-center">
        <div class="text-h3 text-weight-bold">
          {{ props.good.title }}
        </div>
        <Bin @click="open" />
      </div>
      <div class="row justify-between items-center">
        <div class="text-h2">
          &#3647&ensp;{{ props.good.price }}
        </div>
        <div class="text-h2 row q-gutter-x-sm">
          <span>{{ props.good.issued > 0 ? props.good.issued + ' / ' : '' }}</span>
          <span>{{ props.good.quant }}</span>
          <span>{{ $t('pc', {count: props.good.quant}) }}</span>
        </div>
      </div>
    </div>
  </div>
  <DialogDelete :modelValue="openDialog" title="delete_order">
    <template #content>
      <div class="text-center text-uppercase text-h3 mb-20">{{ props.good.title }}</div>
    </template>
    <template #actions>
      <RectangularButton
        :name="$t('no')"
        @click="openDialog = false"
        />
        <RectangularButton
        :name="$t('yes')"
        @click="emit('deleteProduct')"
        />
    </template>
  </DialogDelete>
</template>

<style scoped lang="scss">
.cart_product_item {
    width: 100%;
    height: max-content;
    justify-content: space-between;
    border-radius: var(--border-xxs);
    box-shadow: var(--border-shadow);
  }

  .img_style {
    border-radius: var(--border-xxs);
    width:  100%;
    height: 100%
  }
</style>
