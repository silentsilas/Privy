<template>
    <div class="actor">
      <q-list link no-border>
        <q-item tag="label">
          <q-item-main>
            <q-item-tile label>Guaranteed:</q-item-tile>
            <q-item-tile class="breakable" sublabel lines="4">{{ timescale(1) }}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-main>
            <q-item-tile label>Average:</q-item-tile>
            <q-item-tile class="breakable" sublabel lines="4">{{ timescale(2) }}</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Actor extends Vue {

    @Prop(String) private name!: string;
    @Prop(Number) private guesses!: number;
    @Prop(Number) private combinations!: number;

    private timescale(divider: number): string {
        let scale: string = 'seconds';
        let guarantee: number = (this.combinations / this.guesses) / divider;
        if (guarantee > 60) {
            scale = 'minutes';
            guarantee = guarantee / 60;
        }
        if (guarantee > 60) {
            scale = 'hours';
            guarantee = guarantee / 60;
        }
        if (guarantee > 24) {
            scale = 'days';
            guarantee = guarantee / 24;
        }
        if (guarantee > 365) {
            scale = 'years';
            guarantee = guarantee / 365;
        }
        if (guarantee > 1000) {
            scale = 'millennia';
            guarantee = guarantee / 1000;
        }
        if (guarantee > 1000) {
            scale = 'million years';
            guarantee = guarantee / 1000;
        }
        if (guarantee > 1000) {
            scale = 'billion years';
            guarantee = guarantee / 1000;
        }
        if (guarantee > 1000) {
            scale = 'trillion years';
            guarantee = guarantee / 1000;
        }
        return `${guarantee.toLocaleString()} ${scale}`;
    }
}
</script>
<style lang="scss">
.breakable {
  word-wrap: break-word;
}
</style>
