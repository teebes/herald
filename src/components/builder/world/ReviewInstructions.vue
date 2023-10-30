<template>
  <div class="my-4">
    <div>
      Once per month, you can request for your world to be reviewed for publication. Please review the <a href='https://docs.writtenrealms.com/building/worlds/publishing'>World Publishing Guidelines</a> and provide a description for your world below.</div>

      <div class="mt-4">You can describe your world however you'd like, but if you're looking for ideas, try to answer some of the following questions in it:<br/>
        <ul class="ml-4">
          <li>What is your world about?</li>
          <li>Does your world tell a particular story, or is it a sandbox? Is there an endgame loop?</li>
          <li>Do you have a particular audience in mind?</li>
          <li>What does your world do well? What are its selling points?</li>
          <li>Is the world in a finished state? Or do you plan to develop it further?</li>
        </ul>
      </div>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>