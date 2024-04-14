<script setup lang="ts">
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { t } from 'i18next';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { Good } from '../../stores/goods';
import IconButton from '../buttons/icon-button.vue';
import Modal from '../overlay/modal.vue';


  const $q = useQuasar();
  const slide = ref(0);
  const openDialog = ref(false);

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

  const showNotify = () => {
    $q.notify({
      timeout: 1000,
      multiLine: true,
      color: 'primary',
      classes: 'full-width notification_styles',
      actions: [
        {
          label: t('placing_an_order'),
          color: 'white',
          'aria-label': 'Move to cart',
          handler: () => app.openDrawerCart(true)
        },
      ]
    })
  }

  const goodInCart = computed(() => cartStore.cart.find((item) => item.id === props.good.id))

const addGoodToCart = (good: Good) => {
  cartStore.increaseItemsCount(good);
  showNotify();
};

  const decrease = (good: Good) => {
    cartStore.decreaseItemsCount(good);
  }

  const increase = (good: Good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
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
        class="close_button absolute-top-right"
        @click="openDialog = false"
      />
      <div class="text-h3 text-green mb-74">
        {{ props.good.name }}
      </div>

      <!-- carousel + characteristics -->
      <div class="mb-74 slider_grid">
        <slot name="carousel" />
        <div class="column text-body1">
          <div class="text-grey q-mb-lg text-h5">
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
      <div class="text-grey text-h5 q-mb-lg">
        {{ $t('description') }}
      </div>
      <div class="text-body1 text-white q-mb-lg" v-html="props.good.description"/>
      <div class="full-width">
        <q-btn
          v-if="!goodInCart"
          class="full-width"
          unelevated
          no-caps
          color="white"
          @click="addGoodToCart(props.good  as Good)"
        >
          <div class="text-h4 text-center text-black q-py-lg-sm q-py-sm-xs">
            {{ $t('add_to_cart') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :icon="evaMinusOutline"
            @click="decrease(props.good  as Good)"
            class="q-pa-lg-sm q-pa-sm-xs"
          />
          <div class="text-h4 no-margin">{{ goodInCart.quant }}</div>
          <IconButton
            :icon="evaPlusOutline"
            @click="increase(props.good  as Good)"
            class="q-pa-lg-sm q-pa-sm-xs"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss">

  .dialog_container {
    width: 45vw;
    max-width: 50vw;
    height: max-content;
    @media (max-width: 1500px) {
      width: 85vw;
      max-width: 95vw;
    }
  }
  .slider_grid {
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    grid-template-rows: 30rem max-content;
    column-gap: var(--px20);
    row-gap: var(--px20);
    width: 100%;
  }
  .close_button {
    width: var(--px54);
    top: var(--px20);
    right: var(--px20);
  }
</style>
