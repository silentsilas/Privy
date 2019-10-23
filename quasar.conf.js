// Configuration for your app
const path = require('path')
const extendTypescriptToWebpack = (config) => {
  config.resolve
    .extensions
      .add('.ts')
  config.module
    .rule('typescript')
      .test(/\.tsx?$/)
      .use('typescript')
        .loader('ts-loader')
        .options({
          appendTsSuffixTo: [/\.vue$/],
          onlyCompileBundledFiles: true
        })
}

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    sourceFiles: {
      router: 'src/router/index.ts',
    },
    plugins: [
      'i18n',
      'axios'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      chainWebpack (config) {
        extendTypescriptToWebpack(config)
        config.resolve
          .alias
            .set('~', __dirname)
            .set('@', path.resolve(__dirname, 'src'))
      },
      // extendWebpack (cfg) {
      //   cfg.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /node_modules/
      //   })
      // }
    },
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      plugins: [
        'Notify'
      ],
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QRange',
        'QSelect',
        'QSlider',
        'QRadio',
        'QRouteTab',
        'QCheckbox',
        'QCollapsible',
        'QTable',
        'QTabs',
        'QTab',
        'QTh',
        'QTr',
        'QTd',
        'QTableColumns'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Meta',
        'Notify',
        'Screen'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        name: 'Passworker',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/android-chrome-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'Passworker',
        chainWebpackRendererProcess: config => {
          // Chain webpack config for electron renderer process only
          // The following example will set IS_ELECTRON to true in your app
        },

      }
    }
  }
}
