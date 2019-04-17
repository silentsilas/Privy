<template>
    <q-page class="generator row justify-center" :padding="true">
      <q-list class="q-mt-md" no-border>
        <q-list-header>Pick Your Poison</q-list-header>
        <q-item link tag="label">
          <q-item-side>
            <q-radio v-model="passType" val="passphrase" v-on:input="showPassphrase" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Passphrase</q-item-tile>
            <q-item-tile sublabel>
              Randomly generate a string of words from the English dictionary.
            </q-item-tile>
          </q-item-main>
        </q-item>
        <q-item link tag="label">
          <q-item-side>
            <q-radio v-model="passType" val="password" v-on:input="showPassword" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Password</q-item-tile>
            <q-item-tile sublabel>
              Randomly generate a string of alphanumeric characters.
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>

      <div v-if="showingPassword">
          <Password></Password>
      </div>
      <div v-if="showingPassphrase">
          <Passphrase></Passphrase>
      </div>

      <a href="https://github.com/Poeticode/Passwork">View Source</a>

    </q-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Password from '@/components/Password.vue';
import Passphrase from '@/components/Passphrase.vue';

@Component({
  components: {
    Password, Passphrase,
  },
})
export default class Generator extends Vue {
  private passType: string = "password";
  private showingPassword: boolean = true;
  private showingPassphrase: boolean = false;
  private showPassword() {
    this.showingPassword = true;
    this.showingPassphrase = false;
  }
  private showPassphrase() {
    this.showingPassphrase = true;
    this.showingPassword = false;
  }
}
</script>
<style lang="scss">

#results {
    font-size: 14px;
}

.crack_container {
    // float: left;
    // left: 50%;
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    // transform: translateX(-50%);
    border: 10px solid #efefef;
    // max-width: 300px;
}
.crack_header {
    // font-weight: 600;
    padding-bottom: 4px;
}

</style>
