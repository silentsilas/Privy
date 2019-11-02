<template>
  <div>
    <q-collapsible 
      :opened="true" 
      :icon="complete ? 'done' : ''" 
      :label="`Step ${index}`" 
      :sublabel="title"
      :ref="`collapsible${index}`"
    >
      <q-item tag="label">
        <q-item-main>
          <q-item-tile v-if="complete" v-html="completeText">
          </q-item-tile>
          <q-item-tile v-else-if="!working">
            <div v-html="workText">
            </div>
          </q-item-tile>
          <q-item-tile v-else v-html="workingText">
          </q-item-tile>
        </q-item-main>
      </q-item>
    </q-collapsible>
    <q-item v-if="!working && !complete">
      <q-btn color="primary" class="q-py-sm q-px-xl full-width" :label="workButtonText != null ? workButtonText : `Calculate!`" @click="work" />
    </q-item>
    <q-item v-if="showNextAction && complete && !showingNext">
      <q-item-main>
        <q-btn color="primary" class="q-py-sm q-px-xl full-width" label="Next!" @click="showNext" />
      </q-item-main>
    </q-item>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class KeyStep extends Vue {
  @Prop(Number) private index!: number;
  @Prop(String) private title!: string;
  @Prop(String) private completeText!: string;
  @Prop(String) private workingText!: string;
  @Prop(String) private workText!: string;
  @Prop(String) private workButtonText?: string;
  @Prop(Function) private action!: Function; 
  @Prop(Function) private showNextAction?: Function;

  private complete: boolean = false;
  private working: boolean = false;
  private showingNext: boolean = false;

  private async work() {
    this.working = true;
    this.action(() => {
      this.working = false;
      this.complete = true;
    });
  }

  private showNext() {
    if (this.showNextAction) {
      this.showNextAction();
    }
    const collapseRef = <any> this.$refs[`collapsible${this.index}`];
    collapseRef.hide();

    this.showingNext = true;
  }
}
</script>
<style lang="scss">
.stepPadding {
  padding-bottom: 20px;
}
</style>