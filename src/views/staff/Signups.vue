<template>
  <ElementList
    title="Sign Ups"
    :schema="list_schema"
    :endpoint="endpoint"
    :resolve_route="resolve_route"
    :exclude_add="true"
  />
</template>

<script lang='ts' setup>
import ElementList from "@/components/elementlist/ElementList.vue";

const endpoint = `/staff/signups/`;

const resolve_route = (user: any) => {
  return {
    name: "staff_user_info",
    params: {
      user_id: user.id
    }
  };
};

const list_schema: any[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "Name" },
  { name: "email", label: "Email", light: true },
  { name: "date_joined_str", label: "Joined", light: true },
  { name: "send_newsletter", label: "Sub", light: true },
  { name: "is_confirmed", label: "Conf", light: true}
];
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>