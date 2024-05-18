<script setup lang="ts">
  import Bin from './bin.vue';
  import DialogDelete from './dialog-delete.vue';
  import { ref } from 'vue';
  import Image from '../image.vue';

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
    :class="'cart_product_item row pa-10 mb-20 ' + (props.good.issued != props.good.quant ? 'bg-white' : 'bg-green')"
    v-bind="$attrs"
    @click="emit('click')">
    <div class="row">
      <div class="col-2 mr-40 img_container">
        <Image
          :src="props.good.image"
          class="img_style"
        />
      </div>
      <div class="column justify-evenly items-left">
        <div class="text-h3 text-weight-bold">
          {{ props.good.title }}
        </div>
        <div class="text-h2">
          &#3647&ensp;{{ props.good.price }}
        </div>
      </div>
    </div>
    <div class="column justify-between items-right">
      <Bin @click="open" class="px-0" :round="false" />
      <div class="text-h4 row q-gutter-x-sm">
        <span>{{ props.good.issued > 0 ? props.good.issued + ' / ' : '' }}</span>
        <span>{{ props.good.quant }}</span>
        <span>{{ $t('pc', {count: props.good.quant}) }}</span>
      </div>
    </div>
  </div>
  <DialogDelete
    :orderNum="props.good.title"
    :modelValue="openDialog"
    @deletion="emit('deleteProduct')"
    @open="openDialog = false"
  />
</template>

<style scoped lang="scss">
  .cart_product_item {
    width: 100%;
    height: max-content;
    justify-content: space-between;
    border-radius: var(--border-xxs);
    box-shadow: var(--border-shadow);
  }
  .img_container {
    width: 5.75rem;
    height: 5.75rem;
  }
  .img_style {
    border-radius: var(--border-xxs);
    width:  100%;
    height: 100%;
    aspect-ratio: 1;
  }
</style>
