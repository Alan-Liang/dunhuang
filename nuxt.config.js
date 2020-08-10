export default {
  mode: 'spa',
  target: 'server',
  head: {
    title: 'Project Dunhuang',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.jsdelivr.net/npm/material-icons@0.3.1/iconfont/material-icons.css', integrity: 'sha256-zb3U63Oid7y/JBIhvtjDt7RE6yAk8/bxaoZzFp7cPgA=', crossorigin: 'anonymous' },
    ],
  },
  components: [
    '~/components',
    { path: '~/node_modules/@keeer/material-components-nuxt/components', prefix: 'm-' },
  ],
  build: { loaders: { scss: { additionalData: '@import \'~/assets/styles.scss\';\n' } } },
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
}
