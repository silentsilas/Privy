<template>
  <div>
    <q-collapsible icon="fingerprint" label="Key Space" sublabel="How difficult it is to guess">
      <q-item>
        <q-item-main>
          <q-item-tile label>Unique {{ type }}:</q-item-tile>
          <q-item-tile class="breakable" sublabel lines="3">{{ range }}</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Total Password Combinations:</q-item-tile>
          <q-item-tile class="breakable" sublabel lines="5">{{ combinations.toLocaleString() }}</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Entropy:</q-item-tile>
          <q-item-tile class="breakable" sublabel lines="3">{{ totalEntropy }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-collapsible>
    <hr class="q-hr q-my-lg">
    <q-collapsible icon="hourglass_empty" label="Crackability" sublabel="How fast it can be guessed">
      <q-collapsible icon="perm_identity" :label="guy.name">
        <div>
          <actor :name="guy.name" :guesses="guy.guesses" :combinations="combinations"></actor>
        </div>
      </q-collapsible>
      <q-collapsible icon="perm_identity" :label="company.name">
        <div>
          <actor :name="company.name" :guesses="company.guesses" :combinations="combinations"></actor>
        </div>
      </q-collapsible>
      <q-collapsible icon="perm_identity" :label="state.name">
        <div>
          <actor :name="state.name" :guesses="state.guesses" :combinations="combinations"></actor>
        </div>
      </q-collapsible>
      <q-collapsible icon="perm_identity" :label="world.name">
        <div>
          <actor :name="world.name" :guesses="world.guesses" :combinations="combinations"></actor>
        </div>
      </q-collapsible>
    </q-collapsible>
    <hr class="q-hr q-my-lg">
    <q-btn type="a" class="full-width q-py-sm q-px-xl" href="https://github.com/Poeticode/Privy/">
      <q-item-main label="View Source" sublabel="https://github.com/Poeticode/Privy" />
    </q-btn>
    <q-item>
      <q-item-main>
        Cracking calculations via <a href="http://i.imgur.com/e3mGIFY.png" target="_blank"><span>this chart.</span></a>
      </q-item-main>
    </q-item>
  </div>
</template>


<script lang="ts">
const path = require('path');
import { Component, Vue, Prop } from 'vue-property-decorator';
import Actor from '@/components/Actor.vue';
import { openURL } from 'quasar';

interface Attacker {
    name: string;
    guesses: number;
}

@Component({
    components: {
        Actor,
    },
})
export default class Entropy extends Vue {
    @Prop(Number) private length!: number;
    @Prop(Number) private range!: number;
    @Prop(String) private type!: string;

    private guy: Attacker = {
        name: 'That dude in a black hoodie at your local coffee shop',
        guesses: 100000000000,
    };

    private company: Attacker = {
        name: 'Evil Corp',
        guesses: 1000000000000,
    };

    private state: Attacker = {
        name: 'Big Brother',
        guesses: 100000000000000,
    };

    private world: Attacker = {
        name: 'The Illuminati',
        guesses: 1000000000000000,
    };

    private timescale = (seconds: number): string => {
        let scale: string = 'seconds';
        if (seconds > 60) {
            scale = 'minutes';
            seconds = seconds / 60;
        }
        if (seconds > 60) {
            scale = 'hours';
            seconds = seconds / 60;
        }
        if (seconds > 24) {
            scale = 'days';
            seconds = seconds / 24;
        }
        if (seconds > 365) {
            scale = 'years';
            seconds = seconds / 365;
        }
        if (seconds > 1000) {
            scale = 'millennia';
            seconds = seconds / 1000;
        }
        if (seconds > 1000) {
            scale = 'million years';
            seconds = seconds / 1000;
        }
        if (seconds > 1000) {
            scale = 'billion years';
            seconds = seconds / 1000;
        }
        if (seconds > 1000) {
            scale = 'trillion years';
            seconds = seconds / 1000;
        }
        return scale;
    }

    private guarantee = (combinations: number, guessesPerSecond: number) => {
        return combinations / guessesPerSecond;
    }

    get combinations(): number {
        return Math.pow(this.range, this.length);
    }

    private get entropyPerCharacter(): number {
        return Math.log2(this.range);
    }

    private get totalEntropy() {
        return this.entropyPerCharacter * this.length;
    }

}
</script>
<style lang="scss">
.breakable {
  // word-wrap: break-word;
  // max-width: vw;
  word-break: break-all;
}
</style>
