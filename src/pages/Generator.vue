<template>
    <div class="generator">
        <q-radio v-model="passType" val="passphrase" label="Passphrase" v-on:input="showPassphrase" />
        <q-radio v-model="passType" val="password" label="Password" v-on:input="showPassword" />

        <div v-if="showingPassword">
            <Password></Password>
        </div>
        <div v-if="showingPassphrase">
            <Passphrase></Passphrase>
        </div>

        <a href="https://github.com/Poeticode/Passwork">View Source</a>

    </div>
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
