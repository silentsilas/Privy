import { RouteConfig } from 'vue-router';
import Password from '@/pages/Password.vue';
import Passphrase from '@/pages/Passphrase.vue';
import Chart from '@/pages/Chart.vue';

const routes: [RouteConfig] = [
  {
    path: '/',
    name: 'password',
    component: Password,
  },
];

routes.push({
  path: '/passphrase',
  name: 'passphrase',
  component: Passphrase,
});

routes.push({
    path: '/chart/:entropy',
    name: 'chart',
    component: Chart,
});

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    name: 'pages.errors.e404',
    path: '*',
    component: () => import('@/pages/Error404.vue'),
  });
}

export default routes;
