<template>
    <div class="generator">

        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
                <label>
                    <input type="radio" id="phrase" name="passType" value="passphrase" @click="showPassphrase" />
                    <span>Passphrase</span>
                </label>
                <label>
                    <input type="radio" id="word" name="passType" value="password" @click="showPassword" checked />
                    <span>Password</span>
                </label>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>

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
@import '@/_min.scss';

html {
    box-sizing: border-box;
    height: 100%;
}

*, *:before, *:after {
    box-sizing: inherit;
}

html, body {
    margin: 0;
    padding: 0;
}

.options {
    float: left;
    max-width: 400px;
}

.slider {
    margin: 4em;
}

label {
    display: block;
}

body {
    // padding: 12px;
    font-size: 14px;
    word-wrap: break-word;
}

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