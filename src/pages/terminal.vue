<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { useI18n } from 'vue-i18n';
  import { useQuasar } from 'quasar';
  import { wsSendMessage } from '../services';
  import Logo from '../components/logo/logo.vue';
  import LogoSvgWhite from 'src/components/logo/logo-svg-white.vue';
  import { useAppStore, KioskStatus } from 'src/stores/app';
  import { apiReportsGetView } from 'src/services/api';

  const $q = useQuasar();
  const i18n = useI18n();

  const { t } = useI18n();
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
          message: t('UNSUCCESSFUL_LOGIN'),
          timeout: 2000,
        })
    }
    finally {
      $q.loading.hide();
    }
  }

  function kioskStatusIsUnknown() {
    return appStore.kioskState.status == KioskStatus.UNKNOWN
  }

  function kioskStatusIsUnboundTerminal() {
    return appStore.kioskState.status == KioskStatus.UNBOUND_TERMINAL
  }

  function kioskStatusIsUnauthenticated() {
    return appStore.kioskState.status == KioskStatus.UNAUTHENTICATED
  }

  function kioskStatusIsUnrecoverableError() {
    return appStore.kioskState.status == KioskStatus.UNRECOVERABLE_ERROR
  }

  onMounted(() => {
    console.log('i18n2', i18n.messages.value);
  })
</script>

<template>
  <q-page class="flex flex-center relative bg-secondary" style="100%">
    <div class="q-pa-xl items-center column" style="width: 50vw">
      <div v-if="kioskStatusIsUnrecoverableError()">
        <q-card>
          <q-card-section>
            <h2>{{ $t('UNRECOVERABLE_ERROR') }}</h2>
            <p>{{ appStore.kioskState.globalError?.message }}</p>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="kioskStatusIsUnknown()">
        <q-card>
          <q-card-section>
            <q-spinner/>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="kioskStatusIsUnboundTerminal()">
        <q-card dark class="flex column items-center">
          <q-card-section>
            <div class="text-h6 q-ma-sm text-center">
              Ожидание подтверждения регистрации в системе...
            </div>
            <div>
              <div class="text-h6 text-center q-mb-md text-weight-bold">
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

      <div v-if="kioskStatusIsUnauthenticated()" class="fit">

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
              (val: any) => !!val || t('field_is_required')
            ]"
            no-error-icon
            debounce="500"
            :dark="false"
            color="black"
            outlined
            bg-color="white"
            input-class="input_settings"
            class="q-mb-md"
          />
          <q-input
            v-model="state.userPassword"
            placeholder="password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val: any) => !!val || t('field_is_required'),
              (val: any) => val.length == 6 || t('password_consists_characters'),
            ]"
            counter
            no-error-icon
            :dark="false"
            color="black"
            outlined
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
