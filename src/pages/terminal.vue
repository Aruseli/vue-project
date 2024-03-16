<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { t } from 'i18next';
  import { useQuasar } from 'quasar';
  import Logo from '../components/logo/logo.vue';
  import LogoSvgWhite from 'src/components/logo/logo-svg-white.vue';
  import { useAppStore } from 'src/stores/app';
  import { computed } from 'vue';

  const $q = useQuasar();
  const appStore = useAppStore();

  let isPwd = ref(true);

  let state = reactive({
    userName: '',
    userPassword: '',
  });

  async function onSubmitLogin() {
    $q.loading.show();
    try {
      await appStore.login(state.userName, state.userPassword)
    }
    catch(e) {
      console.log(e)
      $q.notify({
          color: 'warning',
          icon: 'warning',
          position: 'center',
          message: t('unsuccessful_login_attempt'),
          timeout: 2000,
        })
    }
    finally {
      $q.loading.hide();
    }
  }

  // statuses are here because I wasn't able to force type safety for enum in v-if
  let statusIsUnknown = computed(() => appStore.kioskState.status == 'Unknown')
  let statusIsUnboundTerminal = computed(() => appStore.kioskState.status == 'UnboundTerminal')
  let statusIsUnauthenticated = computed(() => appStore.kioskState.status == 'Unauthenticated')
  let statusIsUnrecoverableError = computed(() =>
    appStore.kioskState.status == 'UnrecoverableError'
      || appStore.kioskState.status == 'Ready'
      // We don't have anything to show for READY state
      // TODO: Consider moving employee actions or even router to this page with v-if="statusIsReady"
  )
</script>

<template>
  <q-page class="flex flex-center relative bg-secondary" style="height: 100%; width: 100%">
    <div class="q-pa-lg items-center column" style="width: 50vw">
      <div v-if="statusIsUnrecoverableError">
        <q-card class='bg-secondary no-box-shadow'>
          <q-card-section>
            <div class="text-h2 text-white text-center">{{ $t('unrecoverable_error') }}</div>
            <p>{{ appStore.kioskState.globalError?.message }}</p>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="statusIsUnknown">
        <q-card>
          <q-card-section>
            <q-spinner/>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="statusIsUnboundTerminal">
        <q-card dark class="flex column items-center">
          <q-card-section>
            <div class="text-h5 q-ma-sm text-center">
              {{ $t('waiting_terminal_registration') }}
            </div>
            <div>
              <div class="text-h5 text-center q-mb-md text-weight-bold">
                Код терминала <code style="font-family: 'Courier New', monospace">{{ appStore.kioskState.code }}</code>
              </div>
              <div
                v-if="appStore.kioskState.params?.terminal_id"
                class="q-mx-auto q-mb-md"
                style="width: 300px; height: 300px"
              >
                <qrcode-vue
                  :value="appStore.kioskState.params?.terminal_id"
                  level="M"
                  render-as="svg"
                  :size="300"
                  foreground="#234141"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="statusIsUnauthenticated" class="fit">

        <Logo class="logo_column">
          <LogoSvgWhite />
        </Logo>

        <q-form
          class="text-text fit"
          @submit.prevent="onSubmitLogin"
        >
          <q-input
            v-model="state.userName"
            placeholder="login"
            type="email"
            autofocus
            :rules="[
              (val: any) => !!val || $t('field_is_required')
            ]"
            no-error-icon
            debounce="500"
            :dark="false"
            color="black"
            outlined
            autocomplete="username"
            bg-color="white"
            input-class="input_settings"
            class="q-mb-md"
          />
          <q-input
            v-model="state.userPassword"
            placeholder="password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val: any) => !!val || $t('field_is_required'),
              (val: any) => val.length == 6 || $t('password_consists_characters'),
            ]"
            counter
            no-error-icon
            :dark="false"
            color="black"
            outlined
            autocomplete="current-password"
            class="q-mb-lg"
            bg-color="white"
            input-class="input_settings"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="text-center">
            <q-btn label="authorization" unelevated size="xl" type="submit" color="primary" class="fit" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
