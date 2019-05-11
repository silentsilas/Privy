<template>
  <div id="q-app">
  <q-layout>
    <!-- optional -->
    <q-layout-header>
      <q-toolbar>
        <q-toolbar-title>
          Pr1vy
          <span slot="subtitle">Speak the language.</span>
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs>
        <!-- <q-tab default slot="title" name="tab-1" v-on:select="toPassword" icon="font_downloaded" label="Word" /> -->
        <q-route-tab slot="title" to="/" replace label="Word" />
        <q-route-tab slot="title" to="/passphrase" replace label="Phrase" />
        <q-route-tab slot="title" to="/keys" replace label="Keys" />
        <q-route-tab slot="title" to="/hash" replace label="Hash" />
        <q-route-tab slot="title" to="/chat" replace label="Chat" />
      </q-tabs>
    </q-layout-header>

    <!-- REQUIRED -->
    <q-page-container>

        <router-view />

    </q-page-container>
  </q-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  // @ts-ignore
  meta () {
    return {
      titleTemplate: (title: any) => `Pr1vy - ${title}`,
      meta: {
        description: { name: 'description', content: 'Speak the language' },
        // Define the viewport depending on device (prevent zoom on mobile devices)
        viewport: {
          name: 'viewport',
          content: this.$q.platform.is.desktop
            ? 'width=device-width'
            : 'width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1' +
              (this.$q.platform.is.cordova ? ', viewport-fit=cover' : '')
        }
      }
    }
  }
})
export default class App extends Vue {
}
</script>

<style>
</style>
