<template>
  <EditableCollection
    title="Social"
    registration_name="socials"
    :endpoint="endpoint"
    :display_component="display_component"
    :schema="schema"
    :page_size="100">

    <p>
      Socials are custom commands defined by builders that players and mobs can use to emote in a standardized way. Examples of typical socials: nod, shrug, wave, smile, laugh, sigh, shake, slap.
    </p>

    <p>For more information, refer to the <a href='https://docs.writtenrealms.com/building/socials'>documentation page.</a></p>

</EditableCollection>
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SocialDetails from "@/components/builder/world/SocialDetails.vue";
import EditableCollection from "@/components/editablecollection/EditableCollection.vue";
import { FormElement } from "@/core/forms.ts";

const route = useRoute();

const endpoint = `/builder/worlds/${route.params.world_id}/socials/`;

const display_component = SocialDetails;

const schema = computed<any[]>(() => {
  const cmd: FormElement = {
    attr: "cmd",
    label: "Command",
    required: true,
    help: `The command that players will type to use the social. For example, if the command is 'wave', players would type 'wave' to use the social.`
  }
  // const priority: FormElement = {
  //   attr: "priority",
  //   label: "Priority",
  //   default: 0,
  //   help: `The priority of the social. Socials that start with the same letter will use the priority value to determine which is first selected for a partial match. Priority 0 means that the priority will be purely alphabetical.`
  // }

  const msg_targetless_self: FormElement = {
    attr: "msg_targetless_self",
    label: "Message (Standalone, Self)",
    help: `The message that the player will see when they use the social without a target.`
  }
  const msg_targetless_other: FormElement = {
    attr: "msg_targetless_other",
    label: "Message (Standalone, Other)",
    help: `The message that other players will see when a player uses the social without a target.`
  }
  const msg_targeted_self: FormElement = {
    attr: "msg_targeted_self",
    label: "Message (Targeted, Self)",
    help: `The message that the player will see when they use the social with a target.`
  }
  const msg_targeted_target: FormElement = {
    attr: "msg_targeted_target",
    label: "Message (Targeted, Target)",
    help: `The message that the target will see when a player uses the social with a target.`
  }
  const msg_targeted_other: FormElement = {
    attr: "msg_targeted_other",
    label: "Message (Targeted, Other)",
    help: `The message that other players will see when a player uses the social with a target.`
  }

  return [
    cmd,
    msg_targetless_self,
    msg_targetless_other,
    msg_targeted_self,
    msg_targeted_target,
    msg_targeted_other,
  ];
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
