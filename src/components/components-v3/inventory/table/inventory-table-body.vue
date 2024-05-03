<script setup lang="ts">
  import { ref } from 'vue';
import ConfirmButton from '../../buttons/confirm-button.vue';
import Bin from '../../orders/bin.vue';

  const switchModal = ref(false);
  const props = defineProps({
    good_title: {
      type: String,
      required: true,
    },
    good_stock: {
      type: Number,
      required: true,
    },
    good_quant: {
      type: Number,
      required: true,
    },
    good_number: {
      type: Number,
      required: true,
    },
  })

  const emit = defineEmits(['resetActualQuantity', ]);

</script>

<template>
  <tr v-bind="$attrs">
    <td>
      <div class="row items-center">
        <Bin @click="emit('resetActualQuantity')" />
        <div class="text-h4">{{ props.good_number }}</div>
      </div>
    </td>
    <td>{{ props.good_title }}</td>
    <td class="pcs">{{ props.good_stock ?? 0 }}</td>
    <td class="pcs">{{ props.good_quant }}</td>
    <td>
      <div class="flex no-wrap justify-end items-center relative-position">
        <q-img src="/state.svg" v-show="props.good_stock !== props.good_quant" class="mr-10 icon_notequal_style" />
        <q-img src="/state.svg" class="mr-10 icon_notequal_style__opacity" />
      </div>
    </td>
  </tr>

</template>

<style scoped lang="scss">
.icon_notequal_style {
  width: 3rem;
  @media (max-width: 1300px) {
    width: 1.5rem;
  }
  &__opacity {
    opacity: 0;
    position: absolute;
  }
}
.buttons_container {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: var(--px60);
}
table {
  width: 100%;
}

table td + td { border-left:2px solid black; }
td:first-child, th:first-child {
  border-left: none;
}
tr td,
table {
    /* border:1px solid black; */
    border-collapse: collapse;
}
table tr {
  border-right: 1px solid #000;
  border-bottom: none;
  border-top: none;
}

table td {
  border-right: 1px solid #000;
  height: 1.5rem;

}
thead {
  border-top: 2px solid rgb(38, 38, 38);
  border-bottom: 2px solid rgb(38, 38, 38);
  text-align: center;
}
thead > tr > th {
  border-right: 2px solid rgb(38, 38, 38);
}

td {
  font-size: clamp(1.15rem, 1.3vw + 0.5rem, 1.5rem);
  text-align: center;
  padding: 0 1rem;
}
td:nth-child(2) {
  text-align: left;
}
td:nth-child(n+3) {
  text-align: right;
}
.highlight:hover {
  background-color: red;
}

</style>
