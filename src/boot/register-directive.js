import LazyLoad from '../directive/lazy-load.js'

// We globally register our directive with Vue;
// Remember that all directives in Vue will start with 'v-'
// but that should not be part of your directive name
// https://vuejs.org/guide/custom-directive.html#custom-directives
// 'my-directive' will be used as 'v-my-directive'
export default ({ app }) => {
  app.directive('lazyload', LazyLoad)
}
