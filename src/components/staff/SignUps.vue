<template>
  <ElementList
    title="Sign Ups"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    :exclude_add="true"
  />
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ElementList from "@/components/elementlist/ElementList.vue";
import { STAFF_USER_INFO } from "@/router";

@Component({
  components: {
    ElementList
  }
})
export default class StaffSignUps extends Vue {
  get endpoint() {
    return `/staff/signups/`;
  }

  get resolve_route() {
    return user => {
      return {
        name: STAFF_USER_INFO,
        params: {
          user_id: user.id
        }
      };
    };
  }

  get list_schema() {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "Name" },
      { name: "email", label: "Email", light: true },
      { name: "date_joined_str", label: "Joined", light: true },
      { name: "send_newsletter", label: "Sub", light: true },
      { name: "is_confirmed", label: "Conf", light: true}
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>