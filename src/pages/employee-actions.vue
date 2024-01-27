<script setup>
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { ref, onMounted } from 'vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';

  const router = useRouter();
  const { t } = useI18n();
  const i18n = useI18n();
  const route = (path) => {
    router.push(path);
    console.log('path', path);
  }

  const routes = ref([
    {
      name: 'open_shift',
      path: () => route('hello'),
    },
    {
      name: 'close_shift',
      path: () => route(''),
    },
    {
      name: 'issue_order',
      path: () => route('issuing-order'),
    },
    {
      name:'selective_inventory',
      path: () => route('selective-inventory'),
    },
    {
      name: 'complete_inventory',
      path: () => route('complete-inventory'),
    },
    {
      name: 'arrival_goods',
      path: () => route('arrival-goods'),
    },
    {
      name: 'print_leftovers',
      path: () => route(''),
    },
    {
      name: 'list_active_orders',
      path: () => route(''),
    },
  ])
  onMounted(() => {
    console.log('i18n2', i18n.messages.value);
  })
</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-center full-height full-width container">
      <RectangularButton
        v-for="(route, index) in routes"
        :key="index"
        :name="route.name"
        @click="route.path"
      />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}
.container > *:not(:last-child) {
  margin-bottom: 2rem;
}
</style>
