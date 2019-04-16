<template>
    <div class="chart_wrapper">
        <img :src="chartPath" class="chart img-zoomable" />
        <p>
            Entropy: {{entropy}}
        </p>
        <router-link to="/"><button class="btn btn-b btn-sm smooth">Return</button></router-link>
    </div>
</template>
<script lang="ts">
const path = require('path');
import { Component, Vue, Prop } from 'vue-property-decorator';
import Zooming from 'zooming';

@Component
export default class Chart extends Vue {
    @Prop(Number) private entropy!: number;
    private chartPath: string = path.join(process.env.BASE_URL, 'cracking_chart.png');

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
    height: auto;
}
</style>
