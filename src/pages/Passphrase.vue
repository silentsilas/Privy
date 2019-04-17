<template>
  <q-page class="row justify-center" :padding="true">
    <div style="width: 500px; max-width: 90vw;">
      <q-list link no-border>
        <q-item>
          <q-item-main label="Settings:" />
        </q-item>
        <q-item>
          <q-item-main>
            <q-range
              v-model="wordValues"
              :min="1"
              :max="31"
              :step="1"
              v-on:input="handleNewWords"
            />
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-main>
            <q-item-tile label>
              Characters Per Word:
            </q-item-tile>
            <q-item-tile sublabel>
              {{ min }} - {{ max }}
            </q-item-tile>
          </q-item-main>
        </q-item>

        <q-item tag="label">
          <q-item-main>
            <q-item-tile label>
              Total Words:
            </q-item-tile>
            <q-item-tile sublabel>
              {{ totalWords }}
            </q-item-tile>
          </q-item-main>
        </q-item>

        <q-item>
          <q-item-main>
            <q-slider v-model="phraseValue" :min="1" :max="10" :step="1" v-on:input="handleNewPhrase" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>
              # of Words in Phrase:
            </q-item-tile>
            <q-item-tile sublabel>
              {{ phraseLength }}
            </q-item-tile>
          </q-item-main>
        </q-item>
        <hr class="q-hr q-my-lg">
        <q-item>
          <q-item-main>
            <q-btn color="primary" class="q-py-sm q-px-xl full-width" label="Regenerate!" @click="generatePassphrase" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            {{ output }}
          </q-item-main>
        </q-item>
      </q-list>
      <entropy v-bind:range="totalWords" v-bind:length="phraseLength" type="Words"></entropy>
    </div>
  </q-page>
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
