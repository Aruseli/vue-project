<script setup>
  import Modal from '../../overlay/modal.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import { ref } from 'vue';

  const emit = defineEmits(['deleteOrder', 'open']);

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
    orderNum: {
      type: String,
      required: true,
    },
  })

  const option = ref();
  const reasons = ['mistaking_order', 'no_confirming_age', 'buyer_left_without_placing_an_order', 'problems_with_payment', 'changes_in_terms_of_sale', 'order_cannot_be_completed_due_to_technical_reasons', 'products_are_out_of_stock']
  const reasonDeletion = ref(false);
  const openDeletion = () => {
    emit('open');
    reasonDeletion.value = false;
  }
</script>

<template>
  <Modal :isOpen="props.modelValue" to="#redirect-dialog">
    <div
      :class="[reasonDeletion == false ? 'modal_container__delete pa-20' : 'modal_container pa-40', 'column bg-white relative-position']">
      <q-icon name="clear" size="3rem" color="grey" @click="openDeletion" class="absolute clear_icon" v-if="reasonDeletion == true" />
      <div class="column">
        <div
          :class="[reasonDeletion == false ? '' : 'px-120 pt-40', 'text-h2 text-center text-uppercase mb-10 line_height']">
          {{ $t(reasonDeletion == false ? 'delete_order' : 'reason_for_deletion') }}
        </div>
        <div v-if="reasonDeletion == false" class="text-center text-uppercase text-h3 mb-40">
          {{ props.orderNum }}
        </div>
        <div v-else class="mt-90 px-40">
          <div class="text-left text-h4 mb-20 column text-weight-regular mb-90">
            <q-radio
              v-for="r in reasons"
              checked-icon="img:/radio-check.svg"
              unchecked-icon="img:/radio.svg"
              v-model="option"
              :val="$t(r)"
              :label="$t(r)"
              class="mb-15"
            />
          </div>
          <RectangularButton
            :name="$t('confirm')"
            textColor="black"
            color="green"
            @click="emit('deleteOrder')"
            classTitle="text-lowercase"
          />
        </div>
      </div>
      <div class="buttons_class justify-center full-width" v-if="reasonDeletion == false">
        <RectangularButton
          :name="$t('no')"
          @click="emit('open')"
        />
        <RectangularButton
          :name="$t('yes')"
          @click="reasonDeletion = true"
        />
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.modal_container {
  width: 80vw;
  border-radius: var(--border-xxs);
  height: max-content;
  @media (max-width: 899px) {
    width: 90vw;
  }
  &__delete {
    width: 50vw;
  }
}
.clear_icon {
  top: 1rem;
  right: 1rem;
}
.buttons_class {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: 2rem;
}

</style>
