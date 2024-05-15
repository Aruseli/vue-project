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
  const cbg = props.good.props.find((prop: any) => prop.prop_name === "CBG")?.prop_value
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
  const emit = defineEmits(['click']);
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
            <div class="text-grey mb-14">{{ $t('variety') }}</div>
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

            <div class="text-grey mb-14">{{ $t('technical_specifications') }}</div>
            <div class="text-white q-mb-lg text-capitalize">
              <p style="margin-bottom: 15px;">{{ $t('relaxation') }}</p> 
              <p style="margin-bottom: 15px;">{{ $t('calm') }}</p>
              <div
                class="row items-center intensity_icons_container mr-10"
                style="align-items: baseline"
                :class="[app.lang_dir == 'rtl' ? 'intensity_icons_container_rtl' : '']"
              >
              <p style="margin-bottom: 15px;">{{ $t('thc') + ' ' + thc + '%' }}</p> 

                <div 
                  v-if="!isNaN(strength)"
                  v-for="n in strength" 
                  :key="n" 
                  class="intensity_icon bg-red"
                />
              </div>
              <p style="margin-bottom: 0;">{{ $t('cbg') + ' ' + cbg + '%' }}</p>
            </div>

            <div class="text-grey mb-14">{{ $t('set') }}</div>
            <div class="text-white q-mb-lg text-capitalize">
              <span>{{ $t('product') }} 1:</span>&ensp;
              <span class="text-green">{{ $t('calm') }}</span> &#183;
              <span class="text-green">{{ $t('happy') }}</span>
            </div>
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
        <div class="row justify-between items-center" v-else>
          <IconButton
            :rounded="false"
            :icon="evaMinusOutline"
            color="white"
            textColor="grey-1"
            @click="decrease(props.good  as Good)"
            class="operator_button"
            iconStyle="font-size: 1rem !important"
          />
          <div class="text-h2 no-margin text-white">{{ goodInCart.quant }}</div>
          <IconButton
            :rounded="false"
            color="white"
            textColor="grey-1"
            :icon="evaPlusOutline"
            @click="increase(props.good as Good)"
            class="operator_button"
            :disable="goodInCart.quant >= goodInCart.stock"
          />
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

</style>
