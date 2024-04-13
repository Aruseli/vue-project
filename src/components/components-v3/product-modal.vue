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
  import Carousel from '../carousel/carousel.vue';
  import Slide from '../carousel/slide.vue';


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
    <div class="dialog_container column bg-grey-3 q-pa-xl">
      <div class="text-h3 text-green">
        {{ props.good.name }}
      </div>
      <div class="row q-mb-lg">
        <Carousel>
          <Slide>Hello</Slide>
        </Carousel>
        <div class="column text-body1">
          <div class="text-grey q-mb-lg">{{ $t('characteristics') }}</div>

          <div class="text-grey q-mb-sm">{{ $t('variety') }}</div>
          <div class="text-white q-mb-lg">
            <span>{{ $t('hybrid') }}</span>
            <span>{{ $t('sativa') }}</span>
            <span>{{ $t('indica') }}</span>
          </div>

          <div class="text-grey q-mb-sm">{{ $t('taste') }}</div>
          <div class="text-white q-mb-lg">
            <span>{{ $t('fruity') }}</span>
            <span>{{ $t('fresh') }}</span>
            <span>{{ $t('mint') }}</span>
          </div>

          <div class="text-grey q-mb-sm">{{ $t('effects') }}</div>
          <div class=" text-white q-mb-lg">
            <span>{{ $t('relaxation') }}</span>
            <span>{{ $t('calm') }}</span>
          </div>

          <div class="text-grey q-mb-sm">{{ $t('technical_specifications') }}</div>
          <div class=" text-white">
            <span>{{ $t('relaxation') }}</span>
            <span>{{ $t('calm') }}</span>
          </div>
        </div>
      </div>
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
          @click="addGoodToCart(good)"
          >
          <div class="text-h4 text-center text-black q-py-lg-sm q-py-sm-xs">
            {{ $t('add_to_cart') }}
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
      <!-- <q-card class="dialog_card">
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

        </q-card-section>
        <q-card-section class="q-mb-lg-sm q-mb-xs-xs">
          <div class="text-h2">
            &#3647&ensp;{{ props.good.price }}
          </div>
        </q-card-section>
      </q-card> -->
    </div>
  </Modal>
</template>

<style scoped lang="scss">
$close_size: calc(3em + 2.7262vmin);

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
    top: -3.8rem;
    right: -3.8rem;
    width: $close_size;
    height: $close_size;
    box-shadow: var(--box-shadow);
  }
</style>
