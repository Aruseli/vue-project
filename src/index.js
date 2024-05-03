export default function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of Quasar App CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite === true) {
    api.compatibleWith('@quasar/app-vite', '^2.0.0-beta.1')
  }
  else { // api.hasWebpack === true
    api.compatibleWith('@quasar/app-webpack', '^4.0.0-beta.1')
  }

  // Here we extend the /quasar.config file, so we can add
  // a boot file which registers our new Vue directive;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf(extendConf)
}

function extendConf (conf, api) {
  // make sure my-directive boot file is registered
  conf.boot.push('~quasar-app-extension-my-directive/src/boot/register-directive.js')

  // @quasar/app-vite does not need this
  if (api.hasVite !== true) {
    // make sure boot & other files get transpiled
    conf.build.transpileDependencies.push(/quasar-app-extension-my-directive[\\/]src/)
  }
}
