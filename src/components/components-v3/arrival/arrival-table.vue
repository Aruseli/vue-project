<script setup lang="ts">
  import Bin from '../orders/bin.vue';
  import ModalButton from '../buttons/modal-button.vue';
  import { ref } from 'vue';
  import Modal from '../../overlay/modal.vue';
  import ConfirmButton from '../buttons/confirm-button.vue';

  const switchModal = ref(false);
  const props = defineProps({
    good: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['itemConfirm', 'resetActualQuantity']);

  const resetQuant = () => {
    emit('resetActualQuantity');
    switchModal.value = false;
  };
  console.log('AAAAAAA', props.good)
</script>

<template>
  <div class="table_container full-width">
    <table>
      <thead>
        <tr>
          <th class="text-h4">#</th>
          <th class="text-h4">{{ $t('product_name') }}</th>
          <th class="text-h4">{{ $t('estimated_quantity') }}
  (pcs)</th>
          <th class="text-h4">{{ $t('actual_quantity') }} (pcs)</th>
          <th class="text-h4"></th>
        </tr>
      </thead>

      <tbody>

        <tr v-for="(good, index) in props.good" :key="props.good.id">
            <td>
              <div class="row">
                <Bin @click="switchModal = true" />
                <div class="text-h4">{{ index + 1 }}</div>
              </div>
            </td>
            <td>{{ good.title }}</td>
            <td>{{ good.quant }}</td>
            <td>{{ good.issued }}</td>
            <td>
              <div class="flex no-wrap justify-end items-center">
                <q-img src="/state.svg" v-show="good.issued !== good.quant" class="mr-10 icon_notequal_style" />
                <ConfirmButton @click="emit('itemConfirm')" />
              </div>
            </td>
          </tr>
      </tbody>
    </table>
  </div>

  <Modal :isOpen="switchModal" class="bg-white">
    <div class="text-h2 mb-30 text-center">{{ $t('are_you_sure_you_want_to_rescan_the_product') }} <span class="text-italic">{{ props.good?.title }} ?</span></div>

    <div class="buttons_container">
      <ModalButton :name="$t('no')" color="transparent" class="pa-20" @click="switchModal = false" textColor="primary" />
      <ModalButton :name="$t('yes')" class="pa-20" @click="resetQuant" />
    </div>
  </Modal>
</template>

<style scoped>


.container_style {
  box-shadow: var(--box-shadow--product_cart);
  border-radius: var(--border-sm);
  padding: var(--px30);
  transition: all 0.5s ease-in-out;
  margin-bottom: 1.5rem;
  @media (max-width: 1300px) {
    padding: 1rem;
  }
}
.quant_style {
  width: max-content;
  box-shadow: inset 0 0 2px 3px rgba(0,0,0,0.25);
  height: max-content;
  font-size: 2.5rem;
  border-radius: 1.5rem
}
.icon_notequal_style {
  width: 3rem;
  @media (max-width: 1300px) {
    width: 1.5rem;
  }
}
.buttons_container {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: var(--px60);
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 15px;
}
thead {
  border-top: 2px solid rgb(38, 38, 38);
  border-bottom: 2px solid rgb(38, 38, 38);
  text-align: center;
  height: 6rem;
}

.border_row {
  border:1px solid black;
  border-radius: var(--border-xxs);
}

table tr
{
    border:1px solid black;
}

td {
  text-align: center;
  font-size: clamp(1.15rem, 1.3vw + 0.5rem, 1.5rem)
}
tbody tr {
  height: 5rem;
  border-spacing: 15px;
}
</style>
