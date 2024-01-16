<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { useI18n } from 'vue-i18n';
  import { useQuasar } from 'quasar';
  import { wsSendMessage } from '../services';
  import Logo from '../components/logo.vue';
  import { useAppStore, KioskState } from 'src/stores/app';
  import { apiReportsGetView } from 'src/services/api';

  const $q = useQuasar();

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

  //=======================================
  // Printer example (temp)

  // const sessionToken = localStorage.getItem('sessionToken');

  // async function doAuth() {
  //   $q.loading.show();
  //   try {
  //     const authToken = await apiAuth('v.kakotkin@fait.gl', '1c8b6f9f-a29a');

  //     if (!authToken) {
  //       $q.notify({
  //         message: 'Auth error...',
  //         icon: 'warning',
  //         color: 'negative',
  //       });
  //     }
  //     else {
  //       localStorage.setItem('sessionToken', authToken);
  //     }
  //   }
  //   catch(e) {
  //     console.log(e);
  //     $q.notify({
  //       message: 'Error occured',
  //       icon: 'warning',
  //       color: 'warning',
  //     });
  //   }
  //   finally {
  //     $q.loading.hide();
  //   }
  // }

  const printText = ref('<print align="center" bold>text</print><printqr>hello world</printqr>');

  function sendWsCommand() {
    wsSendMessage('check-print', printText.value);
  }

  const check1ViewId = ref('c2db028c-bee9-4504-9302-379a888a1676');

  async function sendCatPrintCommand() {
    $q.loading.show();
    try {
      const viewData = await apiReportsGetView(check1ViewId.value);
      console.log(viewData);
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
  }
  //=======================================


  function kioskStateIsUnknown() {
    return appStore.kioskState == KioskState.UNKNOWN
  }

  function kioskStateIsUnboundTerminal() {
    return appStore.kioskState == KioskState.UNBOUND_TERMINAL
  }

  function kioskStateIsUnauthenticated() {
    return appStore.kioskState == KioskState.UNAUTHENTICATED
  }

  function kioskStateIsReady() {
    return appStore.kioskState == KioskState.READY
  }

  function kioskStateIsUnrecoverableError() {
    return appStore.kioskState == KioskState.UNRECOVERABLE_ERROR
  }
</script>

<template>
  <q-page class="flex flex-center relative bg-secondary" style="100%">
    <div class="q-pa-xl items-center column" style="width: 50vw">
      <div v-if="kioskStateIsUnrecoverableError()">
        <q-card>
          <q-card-section>
            <h2>{{ $t('UNRECOVERABLE_ERROR') }}</h2>
            <p>{{ appStore.globalError?.message }}</p>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="kioskStateIsUnknown()">
        <q-card>
          <q-card-section>
            <q-spinner/>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="kioskStateIsUnboundTerminal()">
        <q-card dark class="flex column items-center">
          <q-card-section>
            <div class="text-h6 q-ma-sm text-center">
              Ожидание подтверждения регистрации в системе...
            </div>
            <div>
              <div class="text-h6 text-center q-mb-md text-weight-bold">
                Код терминала <code style="font-family: 'Courier New', monospace">{{ appStore.terminal.code }}</code>
              </div>
              <div
                v-if="appStore.terminal.params?.terminal_id"
                class="q-mx-auto q-mb-md"
                style="width: 300px; height: 300px"
              >
                <qrcode-vue
                  :value="appStore.terminal.params?.terminal_id"
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

      <div v-if="kioskStateIsUnauthenticated()" class="fit">

        <Logo class="logo_column" />

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
            rounded
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
            rounded
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
      <div v-if="kioskStateIsReady()">
        <q-card dark class="flex column items-center">
          <h5>Temp page</h5>
          <p>Consider merging with employee-actions page</p>
          <q-card-section>
            <q-btn label="Go to actions" color="primary" to="/employee-actions" />
          </q-card-section>
        </q-card>
        <q-card>
          <h5>Printer example (will be removed in production)</h5>
          <div class="column full-width">
            <b>Custom device-provider command</b>
            <q-input v-model="printText" :dark="false" class="q-mb-sm" outlined />
            <q-btn label="test ws" rounded color="secondary" @click="sendWsCommand" />
          </div>
          <!-- <q-separator spaced inset />
          <div class="column full-width">
            <div><b>Auth</b> <span v-if="sessionToken">(already has a session token)</span></div>
            <q-btn label="authorize" rounded color="indigo-4" @click="doAuth" />
          </div> -->
          <q-separator spaced inset />
          <div class="column full-width">
            <b>Call to CAT API for building device-provider command</b>
            <q-input v-model="check1ViewId" :dark="false" class="q-mb-sm" outlined />
            <q-btn label="test print command" rounded color="secondary" @click="sendCatPrintCommand" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
