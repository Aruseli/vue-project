<script setup lang="ts">
  import { computed } from 'vue';
import { useAppStore } from '../../../stores/app';
import { useCartStore } from '../../../stores/cart';
import { Good } from '../../../stores/goods';
import IconButton from '../../buttons/icon-button.vue';
import Modal from '../../overlay/modal.vue';
import RectangularButton from '../buttons/rectangular-button.vue';

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
        props: {
          prop_id: Number,
          prop_value: Number,
          prop_name: String
        }
      }
    },
    isOpen: {
      type: Boolean,
      required: true,
      default:false,
    }
  })

  const thc = props.good.props.find((prop: any) => prop.prop_name === "THC")?.prop_value
  const cbd = props.good.props.find((prop: any) => prop.prop_name === "CBG")?.prop_value
  const strength = parseInt(props.good.props.find((prop: any) => prop.prop_name === "strength")?.prop_value)

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
  const emit = defineEmits(['click', 'goToCart']);
</script>

<template>
  <Modal :isOpen="props.isOpen" @click="emit('click')">
    <div class="dialog_container bg-grey-3 q-pa-xl relative-position">
      <IconButton
        icon="close"
        textColor="grey"
        :rounded="false"
        :round="true"
        :flat="true"
        size="xl"
        @click="emit('click')"
        class="absolute-top-right text-h3"
      />
      <div class="text-h2 text-green text-uppercase mb-60">
        {{ props.good.name }}
      </div>

      <!-- carousel + characteristics -->
      <div class="mb-40 slider_grid">

        <!-- carousel -->
        <slot name="carousel" />

        <!-- characteristics -->
        <div class="column text-body1">
          <div class="text-grey q-mb-lg text-h3">
            {{ $t('characteristics') }}
          </div>

          <!-- characteristics for cannabis bud -->
          <div>
            <!-- <div class="text-grey mb-14">{{ $t('variety') }}</div>
            <div class="text-white q-mb-lg text-capitalize">
              <span>{{ $t('hybrid') }}</span> &#183;
              <span>{{ $t('sativa') }}</span> &#183;
              <span>{{ $t('indica') }}</span>
            </div>

            <div class="text-grey mb-14">{{ $t('taste') }}</div>
            <div class="text-white q-mb-lg text-capitalize">
              <span>{{ $t('fruity') }}</span> &#183;
              <span>{{ $t('fresh') }}</span> &#183;
              <span>{{ $t('mint') }}</span>
            </div>

            <div class="text-grey mb-14">{{ $t('technical_specifications') }}</div> -->
            <div class="text-white q-mb-lg text-capitalize">
              <!-- <div class="mb-15">{{ $t('relaxation') }}</div>
              <div class="mb-15">{{ $t('calm') }}</div>
              <div
                class="row items-center intensity_icons_container mr-10"
                style="align-items: baseline"
                :class="[app.lang_dir == 'rtl' ? 'intensity_icons_container_rtl' : '']"
              > -->
              <div class="text-uppercase mb-15 row">{{ $t('thc') + ' ' + thc + '%' }}
                <div
                  v-if="!isNaN(strength)"
                  class="row items-center px-10 q-gutter-x-xs"
                >
                  <div
                    v-for="n in strength"
                    :key="n"
                    :class="['intensity_icon', strength == 1 ? 'bg-green' : strength == 2 ? 'bg-yellow' : 'bg-red']"
                  />
                </div>
              </div>

              <div class="text-uppercase">{{ $t('cbd') + ' ' + cbd + '%' }}</div>
            </div>
            <!-- </div> -->

            <!-- <div class="text-grey mb-14">{{ $t('set') }}</div>
            <div class="text-white q-mb-lg text-capitalize">
              <span>{{ $t('product') }} 1:</span>&ensp;
              <span class="text-green">{{ $t('calm') }}</span> &#183;
              <span class="text-green">{{ $t('happy') }}</span>
            </div> -->
          </div>
        </div>
        <slot name="slider-navigation" />
      </div>

      <!-- description -->
      <div class="column mb-20">
        <div class="text-grey text-h3 mb-20">
          {{ $t('description') }}
        </div>
        <div class="text-h4 text-white text-weight-regular line_height content_description" v-html="props.good.description"/>
      </div>

      <!-- add to cart -->
      <div class="full-width">
        <q-btn
          v-if="!goodInCart"
          class="full-width add_button"
          unelevated
          no-caps
          color="white"
          @click="addGoodToCart(props.good  as Good)"
        >
          <div class="text-h2 text-center text-black q-py-sm row justify-between items-center full-width">
            <div>
              &#3647&ensp;{{ props.good.price }}
            </div>
            <div>
              {{ $t('add_to_cart') }}
            </div>
          </div>
        </q-btn>
        <div class="justify-between items-center buttons_grid" v-else>
          <div class="row items-center justify-between bg-white">
            <IconButton
              :rounded="false"
              icon="img:/minus.svg"
              color="transparent"
              textColor="grey-1"
              @click="decrease(props.good  as Good)"
              class="operator_button"
              size='1rem'
            />
            <div class="text-h2 no-margin text-black">{{ goodInCart.quant }}</div>
            <IconButton
              :rounded="false"
              color="transparent"
              textColor="grey-1"
              icon="img:/plus.svg"
              size='1rem'
              @click="increase(props.good as Good)"
              class="operator_button"
              :disable="goodInCart.quant >= goodInCart.stock"
            />
          </div>
          <RectangularButton :name="$t('go_to_cart')" color="green" textColor="black" @click="emit('goToCart')" class="text-lowercase" />
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>

  .dialog_container {
    width: 48.75rem;
    height: 65.6rem;
    display: grid;
    grid-template-rows: repeat(2, max-content) 1fr max-content;
  }
  .content_description {
    max-height: 180px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #5d5d5d transparent;
  }
  .add_button {
    height: 80px;
  }
  .operator_button {
    height: 80px;
    width: 80px;
  }
  .slider_grid {
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    grid-template-rows: minmax(25rem, 1fr) max-content;
    column-gap: var(--px20);
    row-gap: var(--px20);
    width: 100%;
  }
  .close_button {
    right: var(--px20);
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
  .buttons_grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    column-gap: 5rem;
    width: 100%;
  }
  .icon_style > img {
    width: 1rem;
  }
</style>
