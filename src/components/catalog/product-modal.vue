<script setup>
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { ionEllipse } from '@quasar/extras/ionicons-v6';
import { t } from 'i18next';
import { useQuasar } from 'quasar';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import IconButton from '../buttons/icon-button.vue';
import Modal from '../overlay/modal.vue';


  const $q = useQuasar();
  const slide = ref(0);
  const openDialog = ref(false);

  const cartStore = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  const props = defineProps({
    good: {
      type: Object,
      default: function () { return {} }
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

  const addGoodToCart = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }

  const decrease = (good) => {
    cartStore.decreaseItemsCount(good);
  }

  const increase = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }
  const emit = defineEmits(['click']);
</script>

<template>
  <Modal :isOpen="props.isOpen" @click="emit('click')">
    <div class="dialog_container">
      <q-card class="dialog_card">
        <q-btn round color="primary" icon="close" class="close_button text-white" @click="goodsStore.openDialog = false" />

        <q-card-section class="q-mb-xs-xs">
          <q-carousel
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            v-model="slide"
            control-color="primary"
            :navigation-icon="ionEllipse"
            navigation
            infinite
            padding
            class="bg-transparent round-borders fit"
          >
            <q-carousel-slide
              v-for="(image, index) in props.good.images"
              :key="index"
              :name="index"
              class="column no-wrap flex-center"
            >
              <div class="img_container_dialog">
                <q-img
                  :src="image.image"
                  :ratio="4/3"
                  class="dialog_img"
                >
                  <template #loading>
                    <div class="text-subtitle1 text-black">
                      Loading...
                    </div>
                  </template>
                </q-img>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
        <q-card-section class="q-mb-lg-sm q-mb-xs-xs">
          <div class="text-h3">
            {{ props.good.name }}
          </div>
        </q-card-section>
        <q-card-section class="q-mb-lg-sm q-mb-xs-xs">
          <div class="text-h2">
            &#3647&ensp;{{ props.good.price }}
          </div>
        </q-card-section>
        <q-separator color="secondary" class="q-mb-lg-sm q-mb-xs-xs" />
        <q-card-section class="q-pt-none q-mb-sm">
          <div class="text-h4 text-capitalize q-mb-lg-sm q-mb-xs-xs">{{ $t('description') }}</div>
          <div class="text-body1" v-html="props.good.description"/>
        </q-card-section>
        <q-card-section>
          <div class="full-width">
            <q-btn
              v-if="!goodInCart"
              class="full-width text_style"
              unelevated
              rounded
              no-caps
              color="primary"
              text-color="white"
              @click="addGoodToCart(good)"
              >
              <div class="text-h4 text-center text-weight-bold text-white q-py-lg-sm q-py-sm-xs text-uppercase">
                {{ $t('buy') }}
              </div>
            </q-btn>
            <div class="row justify-between items-center" v-else>
              <IconButton
                :icon="evaMinusOutline"
                @click="decrease(good)"
                class="q-pa-lg-sm q-pa-sm-xs"
              />
              <div class="text-h4 no-margin">{{ goodInCart.quant }}</div>
              <IconButton
                :icon="evaPlusOutline"
                @click="increase(good)"
                class="q-pa-lg-sm q-pa-sm-xs"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
  .img_container_dialog {
    width: 100%;
    height: 100%;
    border-radius : var(--px30);
    overflow: hidden;
    border: thin solid var(--q-accent);
  }
  .text_style {
    font-weight: bold;
  }
  .dialog_container {
    width: 50vw;
    max-width: 60vw;
    height: max-content;
  }

  .dialog_img {
    width: 100%;
    border: thin solid var(--q-accent);
  }

  .close_button {
    position: absolute;
    top: 0;
    right: -3rem;
  }
</style>
