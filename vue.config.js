// vue.config.js

module.exports = {
    pluginOptions: {
      electronBuilder: {
        win: {
          asar: false
        },
        chainWebpackRendererProcess: config => {
          // Chain webpack config for electron renderer process only
          // The following example will set IS_ELECTRON to true in your app

          config
            .plugin('env')
                .use(require.resolve('webpack/lib/ProvidePlugin'),[{
                    noUiSlider: 'nouislider'
                }]
            );
        },
        // Use this to change the entrypoint of your app's main process
        // mainProcessFile: 'src/myBackgroundFile.js',

        // Provide an array of files that, when changed, will recompile the main process and restart Electron
        // Your main process file will be added by default
        // mainProcessWatch: ['src/myFile1', 'src/myFile2'],

        // [1.0.0-rc.4+] Provide a list of arguments that Electron will be launched with during "electron:serve",
        // which can be accessed from the main process (src/background.js).
        // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
        // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
        // mainProcessArgs: ['--arg-name', 'arg-value']
      }
    }
  }
  