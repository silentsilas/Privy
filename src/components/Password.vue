<template>
    <div class="password">

        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
                <h2>Password Settings</h2>
                <div id="settings">
                    <label>
                        <input class="nes-checkbox" type="checkbox" v-model="uppercase" checked />
                        <span>Uppercase</span>
                    </label>
                    
                    <label>
                        <input class="nes-checkbox" type="checkbox" v-model="lowercase" checked />
                        <span>Lowercase</span>
                    </label>
                    
                    <label>
                        <input class="nes-checkbox" type="checkbox" v-model="digits" checked />
                        <span>Digits</span>
                    </label>

                    <div class="slider" ref="sliderEl"></div>
                    Length: <span>{{ charLength }}</span>
                </div>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>

        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
            <button class="btn btn-b btn-sm smooth" @click="generatePassword">Regenerate!</button>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>  
        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
                <div id="output">{{ output }}</div><br />
                <entropy v-bind:range="range" v-bind:length="sliderValue"></entropy>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'nouislider/distribute/nouislider.css';
import * as noUiSlider from 'nouislider';
import Settings from '@/settings.ts';
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
    private output: string = '';
    private slider!: noUiSlider.noUiSlider;

    private sliderValue: number = 16;
    private get charLength(): number {
        return this.sliderValue;
    }

    private mounted() {
        this.slider = noUiSlider.create(this.$refs.sliderEl as HTMLElement, {
            start: [this.charLength],
            range: {
                min: [1],
                max: [64],
            },
        });
        this.slider.on('update', (values, handle) => {
            const newValue: number = Math.round(values[0]);
            if (newValue !== this.sliderValue) {
                this.sliderValue = newValue;
                this.generatePassword();
            }
        });
        this.generatePassword();
    }

    private get allowedChars(): number[] {
        // get our array of valid unicode values that we can choose from
        let allowed: number[] = [];
        allowed = this.uppercase ? allowed.concat(Settings.uppercase.UNICODES) : allowed;
        allowed = this.lowercase ? allowed.concat(Settings.lowercase.UNICODES) : allowed;
        allowed = this.digits ? allowed.concat(Settings.digits.UNICODES) : allowed;

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
        newRange += Settings.uppercase.allowed ? Settings.uppercase.COUNT : 0;
        newRange += Settings.lowercase.allowed ? Settings.lowercase.COUNT : 0;
        newRange += Settings.digits.allowed ? Settings.digits.COUNT : 0;
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
}
</script>