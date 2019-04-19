<template>
  <div>
    <coming-soon :message="message"></coming-soon>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ComingSoon from '@/components/ComingSoon.vue';
@Component({
  components: {
    ComingSoon
  }
})
export default class Hash extends Vue {
  private message: string = "Here you'll learn what a 'hash' is, and use it to verify that the data you received wasn't modified.";
}
</script>
