<template>
    <div class="chart_wrapper">
        <img :src="chartPath" class="chart img-zoomable" />
        <p>
            You'd look for your entropy ({{entropy}}) in the blue column,
            then check the right side to see how fast it would be cracked, depending on your attacker's capabilities.
        </p>
        <router-link to="/"><q-btn color="primary" class="q-py-sm q-px-xl full-width" label="Return!" /></router-link>
    </div>
</template>
<script lang="ts">
const path = require('path');
import { Component, Vue, Prop } from 'vue-property-decorator';
import Zooming from 'zooming';

@Component
export default class Chart extends Vue {
    @Prop(Number) private entropy!: number;
    private chartPath: string = '/statics/cracking_chart.png';

    private mounted() {
        this.entropy = Number.parseFloat(this.$route.params.entropy);
        const zoomer = new Zooming(
            {
                bgColor: 'rgb(33, 33, 33)',
                bgOpacity: 0.7,
            },
        );
        zoomer.listen('.img-zoomable');
    }
}
</script>
<style lang="scss" scoped>
.chart_wrapper {
    position: relative;
    padding: 20px;
}
.chart {
    width: 600px;
    max-width: 100%;
    height: auto;
}
</style>
