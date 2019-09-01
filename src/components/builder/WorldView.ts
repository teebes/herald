import { Component, Vue, Watch, Mixins } from "vue-property-decorator";
import { BUILDER_ACTIONS, BUILDER_MUTATIONS } from "@/constants";
import { KeepAliveFetch } from "@/components/Mixins.ts";

@Component
export default class extends Mixins(KeepAliveFetch) {}
