<template>
    <div class="password">
        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
                <h2>Passphrase Settings</h2>
                <div id="settings">
                    <div class="slider" ref="wordsSliderEl"></div>
                    <span>
                        Characters Per Word: {{ min }} - {{ max }}<br /> 
                        Total Words: {{ totalWords }}
                    </span>
                    <div class="slider" ref="phraseSliderEl"></div>
                    <span>
                        # of Words in Phrase: {{ phraseLength }}
                    </span>
                </div>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>
        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
            <button class="btn btn-b btn-sm smooth" @click="generatePassphrase">Regenerate!</button>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>  
        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
                <div id="output">{{ output }}</div><br />
                <entropy v-bind:range="totalWords" v-bind:length="phraseLength"></entropy>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'nouislider/distribute/nouislider.css';
import * as noUiSlider from 'nouislider';
import Entropy from '@/components/Entropy.vue';
import Words from '@/words.ts';

@Component({
    components: {
        Entropy,
    },
})
export default class Passphrase extends Vue {
//   @Prop() private msg!: string;
    private words!: Words;
    private wordsSlider!: noUiSlider.noUiSlider;
    private phraseSlider!: noUiSlider.noUiSlider;
    private min: number = 4;
    private max: number = 31;
    private phraseLength: number = 5;
    private totalWords: number = 0;
    private output: string = '';

    private mounted() {
        this.words = new Words();

        this.wordsSlider = noUiSlider.create(this.$refs.wordsSliderEl as HTMLElement, {
            start: [this.min, this.max],
            connect: true,
            range: {
                min: 1,
                max: 31,
            },
        });

        this.phraseSlider = noUiSlider.create(this.$refs.phraseSliderEl as HTMLElement, {
            start: [this.phraseLength],
            connect: false,
            range: {
                min: 1,
                max: 10,
            },
        });

        this.words = new Words();
        this.wordsSlider.on('update', (values, handle) => {
            const newMin = Math.round(values[0]);
            const newMax = Math.round(values[1]);
            if (newMin !== this.min || newMax !== this.max) {
                this.min = newMin;
                this.max = newMax;
                let newTotalWords = 0;

                for (let idx = this.min - 1; idx < this.max; idx++) {
                    newTotalWords += this.words.wordLengths[idx];
                }
                this.totalWords = newTotalWords;
                this.generatePassphrase();
            }

        });
        this.phraseSlider.on('update', (values) => {
            const newValue: number = Math.round(values[0]);
            if (newValue !== this.phraseLength) {
                this.phraseLength = newValue;
                this.generatePassphrase();
            }
        });
        this.generatePassphrase();
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