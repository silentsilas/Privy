import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Ionic } from '@ionic/vue';

Vue.config.productionTip = false;

Vue.use(Ionic);
new Vue({
  router,
  render: (h) => h(App),
  mounted() {
    // Prevent blank screen in Electron builds
    this.$router.push('/');
  },
}).$mount('#app');
