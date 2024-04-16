<script setup lang="ts">
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
  import { computed, ref } from 'vue';
  import { useAppStore } from '../../../stores/app';
  import { useCartStore } from '../../../stores/cart';
  import { Good } from '../../../stores/goods';
  import IconButton from '../../buttons/icon-button.vue';
  import Modal from '../../overlay/modal.vue';

  const cartStore = useCartStore();
  const app = useAppStore();

  const props = defineProps({
    good: {
      type: Object,
      default: {
        id: String,
        title: String,
        description: String,
        price: Number,
        stock: Number,
        images: Array as () => {
          id: String,
          image?: String,
        }[],
        code: String,
      }
    },
    isOpen: {
      type: Boolean,
      required: true,
      default:false,
    }
  })


  const goodInCart = computed(() => cartStore.cart.find((item) => item.id === props.good.id))

const addGoodToCart = (good: Good) => {
  cartStore.increaseItemsCount(good);
};

  const decrease = (good: Good) => {
    cartStore.decreaseItemsCount(good);
  }

  const increase = (good: Good) => {
    cartStore.increaseItemsCount(good);
  }
  const emit = defineEmits(['click']);
</script>

<template>
  <Modal :isOpen="props.isOpen" @click="emit('click')">
    <div class="dialog_container column bg-grey-3 q-pa-xl relative-position">
      <IconButton
        icon="close"
        textColor="grey"
        :rounded="false"
        :round="true"
        :flat="true"
        size="xl"
        @click="emit('click')"
      />
      <div class="text-h2 text-green mb-74">
        {{ props.good.name }}
      </div>

      <!-- carousel + characteristics -->
      <div class="mb-74 slider_grid">
        <slot name="carousel" />
        <div class="column text-body1">
          <div class="text-grey q-mb-lg text-h3">
            {{ $t('characteristics') }}
          </div>

          <div class="text-grey mb-14">{{ $t('variety') }}</div>
          <div class="text-white q-mb-lg">
            <span>{{ $t('hybrid') }}</span> &#183;
            <span>{{ $t('sativa') }}</span> &#183;
            <span>{{ $t('indica') }}</span> &#183;
            <span>{{ $t('indica') }}</span> &#183;
            <span>{{ $t('indica') }}</span> &#183;
          </div>

          <div class="text-grey mb-14">{{ $t('taste') }}</div>
          <div class="text-white q-mb-lg">
            <span>{{ $t('fruity') }}</span> &#183;
            <span>{{ $t('fresh') }}</span> &#183;
            <span>{{ $t('mint') }}</span>
          </div>

          <div class="text-grey mb-14">{{ $t('effects') }}</div>
          <div class=" text-white q-mb-lg">
            <span>{{ $t('relaxation') }}</span> &#183;
            <span>{{ $t('calm') }}</span>
          </div>

          <div class="text-grey mb-14">{{ $t('technical_specifications') }}</div>
          <div class=" text-white">
            <span>{{ $t('relaxation') }}</span> &#183;
            <span>{{ $t('calm') }}</span>
          </div>
        </div>
        <slot name="slider-navigation" />
      </div>

      <!-- description -->
      <div class="text-grey text-h3 q-mb-lg">
        {{ $t('description') }}
      </div>

      <!-- add to cart -->
      <div class="text-h4 text-white q-mb-lg text-weight-regular" v-html="props.good.description"/>
      <div class="full-width">
        <q-btn
          v-if="!goodInCart"
          class="full-width"
          unelevated
          no-caps
          color="white"
          @click="addGoodToCart(props.good  as Good)"
        >
          <div class="text-h2 text-center text-black q-py-sm-xs">
            {{ $t('add_to_cart') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :rounded="false"
            :icon="evaMinusOutline"
            color="white"
            textColor="grey-1"
            @click="decrease(props.good  as Good)"
            class="pa-21"
          />
          <div class="text-h2 no-margin text-grey">{{ goodInCart.quant }}</div>
          <IconButton
            :rounded="false"
            color="white"
            textColor="grey-1"
            :icon="evaPlusOutline"
            @click="increase(props.good  as Good)"
            class="pa-21"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>

  .dialog_container {
    width: 50vw;
    max-width: 60vw;
    height: max-content;
    @media (max-width: 1500px) {
      width: 85vw;
      max-width: 95vw;
    }
  }
  .slider_grid {
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    grid-template-rows: 35rem max-content;
    column-gap: var(--px20);
    row-gap: var(--px20);
    width: 100%;
  }
  .close_button {
    right: var(--px20);
  }
</style>
