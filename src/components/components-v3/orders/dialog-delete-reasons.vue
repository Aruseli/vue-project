<script setup lang="ts">
  import Modal from '../../overlay/modal.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    orderNum: {
      type: String,
      required: true,
    },
    option: {
      type: String,
    },
    orderStatus: {
      type: Boolean,
      default: true,
    }
  })
  const emit = defineEmits(['updateReason', 'deletionWithReason', 'closeReasons']);
  // const reasonOption = ref(props.option);
  // watch(reasonOption, (newValue) => {
  //   emit('update:props.option', newValue);
  // });

  const reasons = ['mistaking_order', 'no_confirming_age', 'buyer_left_without_placing_an_order', 'problems_with_payment', 'changes_in_terms_of_sale', 'order_cannot_be_completed_due_to_technical_reasons', 'products_are_out_of_stock'];
  const selectedReason = ref(reasons[0]);
  const updateReason = (value: string) => {
    emit('updateReason', value);
  };
  const deletionMethod = (reason: string) => {
    // Вызываем событие 'delete-order' и передаем аргумент 'reason'
    emit('deletionWithReason', reason);
  };
</script>

<template>
  <Modal :isOpen="props.modelValue" to="#reason-dialog" contentBlockStyle="top: 50%; transform: translateY(-50%);">
    <div class="modal_container pa-40 column bg-white relative-position">
      <q-icon name="clear" size="3rem" color="grey" @click="emit('closeReasons')" class="absolute clear_icon" />
      <div class="column">
        <div class="px-120 pt-40 text-h2 text-center text-uppercase mb-10 line_height">
          {{ $t('reason_for_deletion') }}
        </div>
        <div class="mt-90 px-40">
          <div class="text-left text-h4 mb-20 column text-weight-regular mb-90">
            <q-radio
              v-for="r in reasons"
              checked-icon="img:/radio-check.svg"
              unchecked-icon="img:/radio.svg"
              v-model="selectedReason"
              @update="updateReason"
              :val="$t(r)"
              :label="$t(r)"
              class="mb-15"
            />
          </div>
          <RectangularButton
            :name="$t('confirm')"
            textColor="black"
            color="green"
            @click="deletionMethod(selectedReason)"
            classTitle="text-lowercase"
          />
        </div>
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
</style>
