<template>
  <q-page class="row justify-center" :padding="true">
    <div style="width: 500px; max-width: 90vw;">
      <q-list no-border>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="uppercase" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Uppercase</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile>26 Characters</q-item-tile>
          </q-item-side>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="lowercase" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Lowercase</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile>26 Characters</q-item-tile>
          </q-item-side>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="digits" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Digits</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile>10 Characters</q-item-tile>
          </q-item-side>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox v-model="punctuation" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>
              ! " # $ % &amp; ' ( ) * + , - . / : ; &lt; &gt; = ? @ [ ] \ ^ _
            </q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile>27 Characters</q-item-tile>
          </q-item-side>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>
              <q-slider v-model="wordLength" :min="1" :max="64" :step="1" v-on:input="handleNewWord" />
            </q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile>Length of Password: {{ charLength }}</q-item-tile>
          </q-item-main>
        </q-item>
        <hr class="q-hr q-my-lg">
        <q-item>
          <q-item-main>
            <q-btn color="primary" class="q-py-sm q-px-xl full-width" label="Regenerate!" @click="generatePassword" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>Output:</q-item-tile>
            <q-item-tile style="word-break: break-all;" sublabel lines="3">{{ output }}</q-item-tile>
            <input type="hidden" ref="output" v-model="output" />
          </q-item-main>
          <q-item-side right icon="file_copy" @click.native="copyPassword" />
        </q-item>
        <hr class="q-hr q-my-lg">
        <entropy v-bind:range="range" v-bind:length="sliderValue" type="Characters"></entropy>
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Settings from '@/assets/settings.ts';
import Entropy from '@/components/Entropy.vue';

@Component({
  components: {
    Entropy,
  },
})
export default class Password extends Vue {

  private uppercase: boolean = true;
  private lowercase: boolean = true;
  private digits: boolean = true;
  private punctuation: boolean = true;
  private output: string = '';

  private sliderValue: number = 16;
  private wordLength: number = 16;

  private get charLength(): number {
    return this.sliderValue;
  }

  private mounted() {
    this.generatePassword();
  }

  private handleNewWord(newValue: number) {
      if (newValue !== this.sliderValue) {
        this.sliderValue = newValue;
        this.generatePassword();
      }
  }

  private get allowedChars(): number[] {
    // get our array of valid unicode values that we can choose from
    let allowed: number[] = [];
    allowed = this.uppercase ? allowed.concat(Settings.uppercase.UNICODES) : allowed;
    allowed = this.lowercase ? allowed.concat(Settings.lowercase.UNICODES) : allowed;
    allowed = this.digits ? allowed.concat(Settings.digits.UNICODES) : allowed;
    allowed = this.punctuation ? allowed.concat(Settings.punctuation.UNICODES) : allowed;

    // if no checkboxes were checked, then we have no unicode values to choose from
    if (allowed.length <= 0) {
      const errorMsg = 'Must enable at least one type of character.';
      this.output = errorMsg;
      throw new Error(errorMsg);
    }
    return allowed;
  }

  private get range(): number {
    let newRange: number = 0;
    newRange += this.uppercase ? Settings.uppercase.COUNT : 0;
    newRange += this.lowercase ? Settings.lowercase.COUNT : 0;
    newRange += this.digits ? Settings.digits.COUNT : 0;
    newRange += this.punctuation ? Settings.punctuation.COUNT : 0;
    return newRange;
  }

  private generatePassword() {

    // create an array of cryptographically-random values
    const random = new Uint8Array(this.charLength);
    window.crypto.getRandomValues(random);

    // now we create the password string
    let password = '';
    for (let idx = 0; idx < this.charLength; idx++) {
      // use the next random value to choose a unicode character
      const validIdx = random[idx] % this.allowedChars.length;
      password += String.fromCharCode(this.allowedChars[validIdx]);
    }
    this.output = `${password}`;
  }

  private copyPassword() {
    const outputEl: HTMLInputElement = (<HTMLInputElement> this.$refs.output);
    outputEl.setAttribute('type', 'text');
    outputEl.select();
    try {
      const successful:boolean = document.execCommand('copy');
      const msg:string = successful ? 'successful' : 'unsuccessful';

      this.$q.notify({
        message: "Successfully copied to clipboard!",
        position: 'bottom', // 'top', 'left', 'bottom-left' etc.
      });

    } catch (err) {
      this.$q.notify({
        message: `Unable to copy to clipboard: ${err}`,
        position: 'bottom', // 'top', 'left', 'bottom-left' etc.
      });
    }

    outputEl.setAttribute('type', 'hidden')
  }
}
</script>
