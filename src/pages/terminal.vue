<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { t } from 'i18next';
  import { useQuasar } from 'quasar';
  import Logo from '../components/logo/logo.vue';
  import LogoSvg from '../components/logo/logo-svg.vue';
  import { useAppStore } from 'src/stores/app';
  import { computed } from 'vue';
  import Rectangular from 'src/components/buttons/rectangular-button.vue';
  import TestZone from '../components/components-v3/test-zone.vue';
  import * as usersService from 'src/services/users';
import Image from 'src/components/components-v3/image.vue';
import LogoCube from 'src/components/logo/logo-cube.vue';
import { settings, terminalCode, terminalParams } from 'src/services/terminal';

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
      await usersService.login(state.userName, state.userPassword)
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
  let statusIsGlobalError = computed(() => appStore.kioskState.status == 'GlobalError')
  let statusIsReady = computed(() => appStore.kioskState.status == 'Ready')
</script>

<template>
  <router-view v-if="statusIsReady" />
  <q-page v-if="!statusIsReady" class="flex flex-center relative bg-secondary" style="height: 100%; width: 100%">
    <div class="pa-40 items-center row full-height">
      <div v-if="statusIsGlobalError">
        <q-card class='bg-secondary no-box-shadow'>
          <q-card-section>
            <div class="text-h2 text-white text-center">{{ $t('unrecoverable_error') }}</div>
            <div class="text-h2 text-white text-center mt-50">{{ appStore.kioskState.globalError?.message }}</div>
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
            <div class="text-h3 q-ma-sm text-center">
              {{ $t('waiting_terminal_registration') }}
            </div>
            <div>
              <div class="text-h3 text-center q-mb-md text-weight-bold">
                Код терминала <code style="font-family: 'Courier New', monospace">{{ terminalCode }}</code>
              </div>
              <div
                v-if="terminalParams?.terminal_id"
                class="q-mx-auto q-mb-md"
                style="width: 300px; height: 300px"
              >
                <qrcode-vue
                  :value="terminalParams?.terminal_id"
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

      <div v-if="statusIsUnauthenticated" class="full-height column items-center justify-center container">

        <Logo class="logo_column" v-show="settings?.keyboard_login_enabled">
          <LogoSvg fill="#FAFAFA" />
        </Logo>
        <LogoCube v-show="!settings?.keyboard_login_enabled" />

        <q-form
          class="text-text fit"
          @submit.prevent="onSubmitLogin"
          v-if="settings?.keyboard_login_enabled"
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
            clearable
            autocomplete="username"
            bg-color="white"

            class="q-mb-lg-md q-mb-xs-sm text-h3"
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
            class="q-mb-lg-md q-mb-xs-sm text-h3"
            bg-color="white"
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
            <Rectangular name="authorization" type="submit" unelevated class="full-width text-h3 auth_button_style" />
            <!-- <q-btn label="authorization" unelevated type="submit" color="primary" class="fit" /> -->
          </div>
        </q-form>

        <div v-else class="row items-center justify-center">
          <Image src="/barcode_scanner-white.svg" />
          <div class="text-white text-h2">{{ $t('scan_badge') }}</div>
        </div>
        <!-- <TestZone class="mt-90" /> -->
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.container > *:first-child {
  margin-bottom: 7rem;
  @media (max-width: 1300px) {
    margin-bottom: 3rem;
  }
}
.auth_button_style {
  height: clamp(2rem, 0.4167rem + 5.4167vi, 8.5rem);
}
.barcodeEnable_logo_position {
  position: absolute;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
}
.barcodeEnable_logo {
  width: 5rem !important;
}
</style>
