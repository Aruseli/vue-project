<script setup>
  import CompleteInventory from '../components/inventory/complete-inventory.vue';
  import { useAppStore } from '../stores/app';
  import RedirectDialog from '../components/dialog/redirect-dialog.vue';
  import RectangularButton from '../components/buttons/rectangular-button.vue';

  const app = useAppStore();

</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width container">
      <CompleteInventory />
    </div>
    <RedirectDialog
      :modelValue="app.redirectDialogState"
      title="you_are_inactive"
    >
      <template #content>
        <div class="text-h5 text-center">
          <div class="text-h5">{{$t('the_session_will_end_in')}}</div>
          <span>{{ app.countdown }}</span>&ensp;{{ $t('seconds', {count: app.countdown}) }}
        </div>
      </template>
      <template #actions>
        <RectangularButton :name="$t('complete')" color="transparent" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="app.redirect" textColor="primary" />
        <RectangularButton :name="$t('continue')" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="app.closeRedirectDialog" />
      </template>
    </RedirectDialog>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 3.75rem;
  @media (max-width: 1300px) {
    padding: 1.5rem;
  }
  @media (max-width: 899px) {
    padding: 1rem;
  }
}
</style>
