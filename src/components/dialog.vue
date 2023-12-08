<script setup>
  import { ref } from 'vue';
  import { productsStore } from '../stores/store';
  import { evaMinusCircleOutline } from '@quasar/extras/eva-icons';
  import { evaPlusCircleOutline } from '@quasar/extras/eva-icons';
  import { evaRadioButtonOffOutline } from '@quasar/extras/eva-icons';

  const store = productsStore();

  const openDialog = ref(false);
  let slide=ref(0);

  const props = defineProps({
    images: [],
    alt: String,
    title: String,
    price: Number,
    description: String,
    productId: Number
  })

</script>

<template>
  <q-dialog
    v-model="openDialog"
    transition-hide="fade"
    transition-show="fade"
    transition-duration="1.8"
  >
    <div class="dialog-container">
      <q-card class="dialog_card">
        <q-card-section>
          <q-carousel
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            v-model="slide"
            control-color="primary"
            :navigation-icon="evaRadioButtonOffOutline"
            navigation
            padding
            class="bg-white shadow-1 round-borders fit"
          >
            <q-carousel-slide v-for="(image, index) in selectedProduct.images" :key="index" :name="index" class="column no-wrap flex-center">
              <div class="imgContainer bg-red">
                <q-img
                  :src="image"
                  style="width: 200px; height: 200px;"
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
        <q-card-section>
          <div class="text-h5 text-weight-regular">
            {{ selectedProduct.title }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1 text-weight-regular">
            {{ selectedProduct.description }}
          </div>
        </q-card-section>
      </q-card>
      <!-- <q-btn unelevated round @click="closeDrawer" class="button-close-dialog">
        <q-icon class="round-button-dark_green" :name="evaCloseOutline" />
      </q-btn> -->
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
$calc_width: calc(var(--width_coefficient) + var(--coefficient));

.imgContainer {
  max-width: $calc_width;
  max-height: $calc_width;
  border-radius : 1.875rem;
  padding: 1.3rem;
  overflow: hidden;
}

  // .dialog-container {
  //   /* position: relative; */
  //   width: 60vw;
  //   height: max-content;
  // }

  // .button-close-dialog {
  //   /* position: absolute; */
  //   /* right: 0 */
  // }
</style>
