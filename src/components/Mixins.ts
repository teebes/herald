import { Component, Vue } from "vue-property-decorator";

// Mixin meant to implement an "onShow"-like hook for nested components
// under a keepalive
@Component
export class KeepAliveFetch extends Vue {
  async fetch() {}

  async mounted() {
    if (this.fetch) return await this.fetch();
  }
}
