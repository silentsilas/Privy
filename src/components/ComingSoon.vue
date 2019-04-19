<template>
  <q-page class="text-center" :padding="true">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <h4>Coming soon!</h4>
    <p class="text-faded" style="padding: 0px 40px;">{{ message }}</p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="$router.push('/')"
    >Go back</q-btn>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class ComingSoon extends Vue {
  @Prop(String) private message!: string;
}
</script>
