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
export default class Keys extends Vue {
  private message: string = "You will learn step-by-step how to generate your very own RSA key, and use it to securely talk to a friend in the Chat tab!";
}
</script>
