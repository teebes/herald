<template>
  <div v-if="!edit_mode" class="display-mode">
    <div v-if="reward.type == 'item'">
      Receive {{ reward.qty }} copies of
      <router-link
        :to="get_profile_link(reward.profile)"
        class="reference-link"
      >{{ reward.profile.name }}</router-link>.
    </div>
    <div v-if="reward.type == 'exp'">Receive {{ reward.qty }} experience.</div>
    <div v-if="reward.type == 'gold'">Receive {{ reward.qty }} gold.</div>
    <div v-if="reward.type == 'glory'">Receive {{ reward.qty }} glory.</div>
    <div
      v-if="reward.type == 'faction'"
    >Receive {{ reward.qty }} standing with {{ reward.profile.name }}.</div>

    <div class="actions">
      <button class="btn-thin" @click="edit">EDIT</button>
      <button class="btn-thin" @click="remove">DELETE</button>
    </div>
  </div>
  <div v-else class="edit-mode">
    <div class="reward-selection">
      <div class="reward-type-selection">
        <FormField
          :elementSchema="reward_type_selection_schema"
          v-model="reward_type"
          :formErrors="formErrors"
        />
      </div>

      <div class="reward-data">
        <FormField
          v-if="reward_type === 'item'"
          :elementSchema="item_template_schema"
          v-model="reward_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="reward_type === 'profile'"
          :elementSchema="profile_schema"
          v-model="reward_data"
          :formErrors="formErrors"
        />

        <FormField
          v-else-if="reward_type === 'faction'"
          :elementSchema="faction_schema"
          v-model="reward_data"
          :formErrors="formErrors"
        />

        <FormField :elementSchema="quantity_schema" v-model="quantity" :formErrors="formErrors" />
      </div>
    </div>

    <div class="actions">
      <button class="btn-medium" @click="save">SAVE</button>
      <button class="btn-thin" @click="cancel">CANCEL</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import ZoneView from "@/components/builder/ZoneView";
import FormField from "@/components/forms/FormField.vue";
import { Entity } from "@/core/interfaces.ts";
import { FormElement, BUILDER_FORMS } from "@/core/forms";
import {
  BUILDER_ITEM_TEMPLATE_DETAILS,
  BUILDER_MOB_TEMPLATE_DETAILS,
  BUILDER_WORLD_RANDOM_PROFILES
} from "@/router";
import { BUILDER_ACTIONS } from "@/constants";

@Component({
  components: {
    FormField
  }
})
export default class extends Mixins(ZoneView) {
  /*
        Reward types:
            REWARD_TYPE_ITEM = 'item'
            REWARD_TYPE_EXP = 'exp'
            REWARD_TYPE_GOLD = 'gold'
            REWARD_TYPE_FACTION = 'faction'
    */

  edit_mode: boolean = false;
  reward_type: string = "gold";
  reward_data: Entity | null = null;
  formErrors: {} = {};
  quantity: number = 1;

  @Prop() new_reward!: boolean;
  @Prop() reward!: any;

  constructor() {
    super();

    if (this.reward !== undefined) {
      this.reward_type = this.reward.type;
      // For random item profiles, we create a frontend-only 'profile' type so
      // it can be differentiated from templated items.
      if (this.reward.type === "item") {
        if (this.reward.profile.model_type === "randomitemprofile") {
          this.reward_type = "profile";
        }
      }

      this.quantity = this.reward.qty;
      this.reward_data = this.reward.profile;
    } else if (this.new_reward) {
      this.edit_mode = true;
    }
  }

  @Watch("reward_type")
  onChangeRewardType(reward_type) {
    this.reward_data = null;
  }

  get_profile_link(profile) {
    if (profile.model_type === "randomitemprofile") {
      return {
        name: BUILDER_WORLD_RANDOM_PROFILES,
        params: {
          world_id: this.$route.params.world_id
        }
      };
    } else if (profile.model_type === "itemtemplate") {
      return {
        name: BUILDER_ITEM_TEMPLATE_DETAILS,
        params: {
          world_id: this.$route.params.world_id,
          item_template_id: profile.id
        }
      };
    }
    return "";
  }

  get_mob_link(mob_template_id) {
    return {
      name: BUILDER_MOB_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        mob_template_id: mob_template_id
      }
    };
  }

  get quantity_schema() {
    const quantity_schema: FormElement = {
      attr: "qty",
      label: "Quantity"
    };
    return quantity_schema;
  }

  get item_template_schema() {
    return BUILDER_FORMS.ITEM_TEMPLATE;
  }

  get faction_schema() {
    const faction_schema: FormElement = {
      attr: "faction",
      label: "Faction Standing",
      widget: "reference",
      references: "faction"
    };
    return faction_schema;
  }

  get profile_schema() {
    const profile_schema: FormElement = {
      attr: "profile",
      label: "Random Profile",
      widget: "reference",
      references: "randomitemprofile"
    };
    return profile_schema;
  }

  get reward_type_selection_schema() {
    const reward_type_selection_schema: FormElement = {
      attr: "type",
      label: "Reward Type",
      widget: "select",
      options: [
        {
          value: "item",
          label: "Item"
        },
        {
          value: "profile",
          label: "Random Item"
        },
        {
          value: "exp",
          label: "Experience"
        },
        {
          value: "gold",
          label: "Gold"
        },
        {
          value: "glory",
          label: "Glory"
        },
        {
          value: "faction",
          label: "Faction Standing"
        }
      ]
    };
    return reward_type_selection_schema;
  }

  edit() {
    this.edit_mode = true;
  }

  cancel() {
    if (!this.new_reward) this.edit_mode = false;
    this.$emit("cancel");
  }

  async save() {
    const save_data = {
      qty: this.quantity,
      profile: this.reward_data,
      type: this.reward_type
    };
    if (this.reward_type === "profile") save_data.type = "item";

    if (this.new_reward) {
      const objective = await this.$store.dispatch(
        "builder/zones/quest_reward_create",
        save_data
      );
      this.$emit("added");
    } else {
      const objective = await this.$store.dispatch(
        "builder/zones/quest_reward_save",
        {
          reward_id: this.reward.id,
          data: save_data
        }
      );
      this.edit_mode = false;
    }
  }

  remove() {
    this.$store.dispatch("builder/zones/quest_reward_delete", this.reward.id);
  }
}
</script>

<style lang='scss' scoped>
.reward-selection {
  display: flex;
  > div {
    flex: 1;
    &.quantity {
      flex: 0.2;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
</style>