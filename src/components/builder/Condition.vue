<template>

  <div class="form-subsection">
    <div>
      Condition <br>
      <FormField :elementSchema="elementSchema" :value="type" @update="onConditionTypeUpdate"/>
    </div>

    <div>Condition Type: {{ type }}</div>
  </div>

  
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import FormField from "@/components/forms/FormField.vue";

@Component({
  components: { FormField }
})
export default class Condition extends Vue {
  @Prop() value!: any;
  @Prop() conditions!: any;

  internalValue: string;

  constructor() {
    super();
    this.internalValue = this.value;
  }

  get type() {
    return this.internalValue.split(/\W+/)[0];
  }

  get elementSchema() {
    return {
      attr: "Condition Type",
      label: "Condition Type",
      options: this.conditions
    };
  }

  onConditionTypeUpdate(attr, value) {
    console.log("condition type update");
  }
}
</script>
