<script setup>
  import { onMounted, reactive } from 'vue';
  import { productsStore } from '../stores/store';
  import ProductCard from '../components/product-card.vue';
  import { liveQuery } from "dexie";
  import { useObservable } from "@vueuse/rxjs";
  import { db } from '../local-db.js';

  const store = productsStore();

  const state = reactive({
    products: []
  });

  async function loadDataFromServerAndSaveToDexie() {
    try {

      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();

      const transformedData = data.products.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        images: [...item.images],
        alt: item.title,
        count: item.stock
      }));


      await db.products.bulkAdd(transformedData);

      state.products = await db.products.toArray();
      console.log('state.products', state.products)
      console.log('Данные успешно загружены и сохранены в хранилище Dexie.');
    } catch (error) {
      console.error('Произошла ошибка при загрузке данных и сохранении их в хранилище Dexie:', error);
    }
  }

  onMounted(async () => {
    loadDataFromServerAndSaveToDexie();
  });

  //  onMounted(async() => {
    //     await  store.fetchDataFromDB();
    //   })const products = ref([]);


    // onMounted(async() => {
    //   await useObservable(
    //     liveQuery(() => db.products.toArray())
    //   );
    // })
</script>

<template>
  <q-tab-panels v-model="store.tab" animated swipeable class="fit">
    <q-tab-panel name="food" dark>
      <div class="image-grid">
        <q-intersection
          v-for="(product, index) in state.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection-card-settings"
          style="width: max-content; height: 830px"
        >
          <ProductCard
            :images="product.images"
            :alt="product.title"
            :title="product.title"
            :price="product.price"
            :count="product.count"
            :description="product.description"
            :productId="product.id"
          />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="roll_sets" dark>
      <div class="image-grid">
        <q-intersection
          v-for="(product, index) in state.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection-card-settings"
          style="width: max-content; height: 830px"
        >
          <ProductCard
            :images="product.images"
            :alt="product.title"
            :title="product.title"
            :price="product.price"
            :count="product.count"
            :description="product.description"
            :productId="product.id"
          />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="weight_sets">
      <div class="image-grid">
        <q-intersection
          v-for="(product, index) in state.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection-card-settings"
          style="width: max-content; height: 830px"
        >
          <ProductCard
            :images="product.images"
            :alt="product.title"
            :title="product.title"
            :price="product.price"
            :count="product.count"
            :description="product.description"
            :productId="product.id"
          />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="consumption_sets">
      <div class="image-grid">
        <q-intersection
          v-for="(product, index) in state.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection-card-settings"
          style="width: max-content; height: 830px"
        >
          <ProductCard
            :images="product.images"
            :alt="product.title"
            :title="product.title"
            :price="product.price"
            :count="product.count"
            :description="product.description"
            :productId="product.id"
          />
        </q-intersection>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss" scoped>
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));
  $calc_gap: calc(1.875rem + var(--coefficient_gap));

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, $calc_width);
  gap: $calc_gap;
  width: 100%;
  height: 100%;
  padding: 0 3.75rem;
  justify-content: center;
  margin-top: 5rem;
}
.intersection-card-settings{
  min-height: 46rem;
}
</style>
