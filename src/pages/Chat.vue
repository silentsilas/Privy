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
export default class Chat extends Vue {
  private message: string = "Once you've created a key-pair, you'll be able to securely communicate with a friend here.";
}
</script>
