import { RouteConfig } from 'vue-router'
import Generator from '@/pages/Generator.vue';
import Chart from '@/pages/Chart.vue';

const routes: [RouteConfig] = [
  {
    path: '/',
    name: 'generator',
    component: Generator,
  }
]

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
    component: () => import('@/pages/Error404.vue')
  })
}

export default routes
