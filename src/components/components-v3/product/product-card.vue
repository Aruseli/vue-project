<script setup lang="ts">
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { computed, ref } from 'vue';
import { useAppStore } from '../../../stores/app';
import { useCartStore } from '../../../stores/cart';
import { Good } from '../../../stores/goods';
import OperatorButton from '../buttons/operator-button.vue';
import ProductBinButton from '../buttons/product-bin-button.vue';
import ScrollArrows from '../carousel/carousel-arrows.vue';
import Carousel from '../carousel/carousel.vue';
import Slide from '../carousel/slide.vue';
import AttentionIcon from '../icons/attention-icon.vue';
import BinIcon from '../icons/bin-icon.vue';
import Image from '../image.vue';
import ProductModal from './product-modal.vue';

  const cartStore = useCartStore();
  const app = useAppStore();
  const openDialog = ref(false)

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
        props: {
          prop_id: Number,
          prop_value: Number,
          prop_name: String
        }
      },
      required: true,
    },
  })

  const thc = props.good.props.find((prop: any) => prop.prop_name === "THC")?.prop_value
  const strength = parseInt(props.good.props.find((prop: any) => prop.prop_name === "strength")?.prop_value)

  const goodInCart = computed(() => cartStore.cart.find((item) => item.id === props.good.id))

  const addGoodToCart = (good: Good) => {
    cartStore.increaseItemsCount(good);
    // cartStore.ctaShow();
  }

  const decrease = (good: Good) => {
    cartStore.decreaseItemsCount(good);
  }

  const increase = (good: Good) => {
    cartStore.increaseItemsCount(good);
  }

  const currentSlide = ref(0);
  const setCurrentSlide = (index: number) => {
    currentSlide.value = index;
  };
  const goToCart = () => {
    app.openDrawerCart(true);
    openDialog.value = false;
  }
</script>


<template>
  <div
    :class="[props.good && props.good.stock <= 0 && 'disabled no-pointer-events disabled_class', 'card_setting_v3 bg-grey-2 pa-14 relative-position']"
    v-bind="$attrs"
    @click="openDialog = true"
  >
    <div v-if="props.good && props.good.stock <= 0" class="text-h4 absolute full-width full-height flex items-center justify-center notavailable_class"><p>{{ $t('not_available') }}</p></div>
    <div class="row justify-between items-center mb-10">
      <AttentionIcon />
      <div class="text-subtitle1 row">
        <div
          class="row items-center intensity_icons_container px-10"
          :class="[app.lang_dir == 'rtl' ? 'intensity_icons_container_rtl' : '']"
        >
          <div
            v-if="!isNaN(strength)"
            v-for="n in strength"
            :key="n"
            :class="['intensity_icon', strength == 1 ? 'bg-green' : strength == 2 ? 'bg-yellow' : 'bg-red']"
          />
        </div>
        <div v-if="thc > 0">{{thc}}% THC</div>
      </div>
    </div>

    <!-- main image -->
    <div class="img_container mb-10 relative-position">

      <Image
        :src="props.good?.images[0]?.image"
        :alt="props.good?.title"

      />
      <div class="absolute-top-right product_img_angle_top" />
      <div class="absolute-bottom-left product_img_angle_bottom" />
    </div>

    <!-- title + price + buttons -->
    <div class="column no-wrap justify-between items-start">
      <div class="mb-14 ellipsis text-capitalize text-body1 text-left text-green">
        {{ props.good?.title }}
      </div>
      <div class="row justify-between items-center full-width">
        <div class="text-h4">&#3647&ensp;{{ props.good?.price }}</div>
        <ProductBinButton @click="addGoodToCart(props.good as Good)">
          <BinIcon :quantity="cartStore.totalQuantity" width="1rem" height="1rem" class="product_bin" />
        </ProductBinButton>
      </div>

      <transition name="slide-fade">
        <div class="bg-grey-2 row justify-between items-center absolute-bottom-left full-width" v-show="goodInCart">
          <OperatorButton
            round
            class="bg-transparent"
            :icon="evaMinusOutline"
            @click="decrease(props.good as Good)"
          />
          <div
          class='text-h4 text-white q-mx-lg-md q-mx-xs-sm q-my-none'
          >{{ goodInCart?.quant }}</div>
          <OperatorButton
            round
            :icon="evaPlusOutline"
            @click="cartStore.increaseItemsCount(props.good as Good)"
            :disabled="(goodInCart?.quant ?? 0) >= (goodInCart?.stock ?? 0)"
          />
        </div>
      </transition>
    </div>

  </div>

  <!-- product modal card with description -->
  <template>
    <ProductModal
      :good="props.good"
      :isOpen="openDialog"
      @click="openDialog = false"
      @goToCart="goToCart"
    >
      <template #carousel>
        <Carousel>
          <div class="carousel_img">
            <Slide
              v-for="(images, index) in props.good.images"
              :key="index"
              class="absolute"
            >
              <template #slide>
                <div class="img_container_main">
                  <Image
                    :src="images.image"
                    class="slide_img"
                    v-show="currentSlide === index"
                  />
                </div>
              </template>
            </Slide>
          </div>
        </Carousel>
      </template>
      <template #slider-navigation>
        <ScrollArrows>
          <Slide
            v-for="(images, index) in props.good.images"
            :key="index"
            @click="setCurrentSlide(index)"
            class="relative-position"
            :dot_slide="true"
            :activeState="currentSlide === index"
          >
            <template #slide>
              <div class="img_container_mini">
                <Image
                  :src="images.image"
                  class="slide_img"
                />
              </div>
            </template>
          </Slide>
        </ScrollArrows>
      </template>
    </ProductModal>
  </template>

</template>

<style lang="scss" scoped>
  $calc_width: calc(15em + 6vmax);
  $calc_width_alt: calc(12em + 4.5vmax);
  .disabled_class {
    filter: grayscale(1);
  }
  .notavailable_class {
    z-index: 1;
  }
  .img_angle_top_main {
    top: 4px;
    right: 4px;
    width: 5rem;
    height: 5rem;
  }
  .carousel_img {
    width: 25rem;
    height: 25rem;
    position: relative;
  }
  .active {
    opacity: 1
  }
  .non_active {
    opacity: 0
  }
  .slide_img {
    border-radius: 0 !important;
    scale: 0.9;
    width: 100%;
    height: 100%;
  }
  .card_setting_v3 {
    border-radius: var(--border-xxs);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    box-shadow: var(--box-shadow--product_cart_v3);
  }
  .intensity_icons_container > *:not(:last-child) {
    margin-right: 0.25rem;
  }
  .intensity_icons_container_rtl > *:not(:first-child) {
    margin-right: 0.25rem;
  }
  .intensity_icon {
    width: var(--px11);
    height: var(--px11);
    border-radius: var(--px11);
  }

  .img_container {
    width: 57.5%;
    overflow: hidden;
    align-self: center;
    aspect-ratio: 1;
    display: flex;
  }
  .img_container_main {
    width: 25rem;
    height: 25rem;
    overflow: hidden;
    align-self: center;
    aspect-ratio: 1;
    display: flex;
  }
  .img_container_mini {
    width: 3.75rem;
    height: 3.75rem;
    aspect-ratio: 1;
  }
  .product_bin {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
