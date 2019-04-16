<template>
    <div class="password">

      <h2>Passphrase Settings</h2>
      <q-range
        v-model="wordValues"
        :min="1"
        :max="31"
        :step="1"
        v-on:input="handleNewWords"
      />
      <span>
          Characters Per Word: {{ min }} - {{ max }}<br />
          Total Words: {{ totalWords }}
      </span>
      <q-slider v-model="phraseValue" :min="1" :max="10" :step="1" v-on:input="handleNewPhrase" />
      <span>
          # of Words in Phrase: {{ phraseLength }}
      </span>
      <q-btn label="Regenerate!" @click="generatePassphrase" />

      <h6>{{ output }}</h6>
      <entropy v-bind:range="totalWords" v-bind:length="phraseLength"></entropy>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Entropy from '@/components/Entropy.vue';
import Words from '@/assets/words.ts';

interface RangeValues {
    min: number;
    max: number;
}

@Component({
    components: {
        Entropy,
    },
})
export default class Passphrase extends Vue {
//   @Prop() private msg!: string;
    private words!: Words;
    private min: number = 4;
    private max: number = 31;
    private phraseLength: number = 5;
    private totalWords: number = 0;
    private output: string = '';

    private wordValues: RangeValues = {
      min: 4,
      max: 31
    };

    private phraseValue: number = 4;

    private mounted() {
        this.words = new Words();
        this.updateTotal();
        this.generatePassphrase();
    }

    private handleNewWords(newVal: RangeValues) {
      if (newVal.min !== this.min || newVal.max !== this.max) {
        this.min = newVal.min;
        this.max = newVal.max;
        this.updateTotal();
        this.generatePassphrase();
      }
    }

    private handleNewPhrase(newValue: number) {
      if (newValue !== this.phraseLength) {
          this.phraseLength = newValue;
          this.generatePassphrase();
      }
    }

    private updateTotal() {
      let newTotalWords = 0;
      for (let idx = this.min - 1; idx < this.max; idx++) {
          newTotalWords += this.words.wordLengths[idx];
      }
      this.totalWords = newTotalWords;
    }

    private generatePassphrase() {

        // we'll go through and concat all of our words into one array to choose from
        const validWordsArr = [];
        for (let idx = this.min; idx < this.max; idx++) {
            validWordsArr.push(this.words.wordLists[idx]);
        }
        const validWords = Array.prototype.concat.apply([], validWordsArr);

        // create an array of cryptographically-random values
        const random = new Uint32Array(this.phraseLength);
        window.crypto.getRandomValues(random);

        // now we create the password string
        let passphrase = '';
        for (let idx = 0; idx < this.phraseLength; idx++) {
            const validIdx = random[idx] % validWords.length;
            passphrase += validWords[validIdx] + ' ';
        }
        this.output = `${passphrase}`;
    }
}
</script>
