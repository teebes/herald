<template>
  <div>
    <div class="configuration hlist">
      <div class="hlist-header">
        <h3>CONFIGURATION</h3>
      </div>

      <div class="hlist-item">
        Tied to
        <router-link
          :to="get_mob_link(quest.mob_template.id)"
          class="reference-link"
        >{{ quest.mob_template.name }}</router-link>.
        <div v-if="quest.level">Suggested level: {{ quest.level }}.</div>
        <div v-if="quest.requires_level">Requires level: {{ quest.requires_level }}</div>
        <div v-if="quest.max_level">Max level: {{ quest.max_level }}</div>

        <div v-if="quest.summary" class="mt-2">
          Quest Summary:
          <div v-for="(line, index) in quest.summary.split('\n')" :key="index" class="indented">
            <div>{{ line }}</div>
          </div>
        </div>

        <div v-if="quest.requires_quest">
          Requires completion of
          <router-link
            :to="get_quest_link(quest.requires_quest.id)"
            class="reference-link"
          >{{ quest.requires_quest.name }}</router-link>.
        </div>

        <div v-for="pre_quest in quest.required_by" :key="pre_quest.id">
          Required by
          <router-link
            :to="get_quest_link(pre_quest.id)"
            class="reference-link"
          >{{ pre_quest.name }}</router-link>
        </div>

        <div v-if="quest.conditions">
          Conditions: {{ quest.conditions }}
        </div>

        <div v-if="quest.notes">Notes: {{ quest.notes }}</div>

        <div v-if="quest.is_setup">Setup Quest</div>

        <button class="btn-thin" @click="editSource">EDIT</button>
        <button class="btn-thin" @click="deleteQuest">DELETE</button>
      </div>
    </div>

    <div class="requirements hlist">
      <div class="hlist-header">
        <h3>REPEAT</h3>
      </div>
      <div class="hlist-item">
        <label>
          <input type="checkbox" :checked="repeatable" @input="onChangeRepeat" />
          Quest is repeatable
        </label>

        <div class="repetable-after mt-2" v-if="repeatable">
          <div>
            <span
              v-if="quest.repeatable_after"
            >Repeatable after {{ quest.repeatable_after }} seconds.</span>
            <span v-else>Repeatable immediately.</span>
          </div>
          <button class="btn-thin" @click="editRepeat">EDIT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { BUILDER_ACTIONS, UI_MUTATIONS, UI_MODALS } from "@/constants";
import { Entity } from "@/core/interfaces.ts";
import FormField from "@/components/forms/FormField.vue";
import {
  FormElement,
  BUILDER_FORMS,
  NAME,
  MOB_TEMPLATE,
  ZONE,
  CONDITIONS,
} from "@/core/forms";
import EditableElement from "@/components/EditableElement.vue";
import {
  BUILDER_ZONE_QUEST_DETAIL,
  BUILDER_MOB_TEMPLATE_DETAILS,
} from "@/router";

@Component
export default class extends Vue {
  get quest() {
    return this.$store.state.builder.zones.quest;
  }

  get repeatable() {
    return this.$store.state.builder.zones.quest.repeatable_after >= 0;
  }

  get mob_template_schema() {
    const schema = BUILDER_FORMS.MOB_TEMPLATE;
    //schema.label = "Quest is tied to mob";
    return schema;
  }

  editSource() {
    const requires_quest: FormElement = {
      attr: "requires_quest",
      label: "Requires Quest",
      widget: "reference",
      references: "quest",
    };

    const requires_level: FormElement = {
      attr: "requires_level",
      label: "Requires Level",
    };

    const suggested_level: FormElement = {
      attr: "level",
      label: "Suggested Level",
    };

    const max_level: FormElement = {
      attr: "max_level",
      label: "Max Level",
    };

    const summary: FormElement = {
      attr: "summary",
      label: "Quest Summary",
      widget: "textarea",
      help: `Condensed version of the quest's instructions. If defined, the quest log will show this instead of the enquire commands.`,
    };

    const is_setup: FormElement = {
      attr: "is_setup",
      label: "Is Setup Quest",
      widget: "checkbox",
      default: false,
      help: `A setup quest required by an active quest will have its summary or completion commands shown in the quest log.`,
    };

    const is_logged: FormElement = {
      attr: "is_logged",
      label: "Logged Quest",
      widget: "checkbox",
      default: true,
      help: `If this is unchecked, the quest will not appear in the quest completion logs.`,
    };

    const schema = [
      NAME,
      {
        children: [ZONE, MOB_TEMPLATE],
      },
      summary,
      {
        children: [suggested_level, requires_level, max_level],
      },
      requires_quest,
      CONDITIONS,
      {
        children: [is_setup, is_logged],
      }
    ];
    const modal = {
      data: this.quest,
      schema: schema,
      action: "builder/zones/quest_save",
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  async deleteQuest() {
    const quest_id = this.quest.id;

    const c = confirm(`Are you sure you want to delete Quest ${quest_id}?`);
    if (!c) return;

    await this.$store.dispatch("builder/zones/quest_delete");
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted Quest ${quest_id}`
    );
  }

  editRepeat() {
    const entity = this.quest;
    const modal = {
      data: entity,
      schema: [
        {
          attr: "repeatable_after",
          label: "Repeatable After",
        },
      ],
      action: "builder/zones/quest_save",
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  onChangeRepeat(event) {
    const checked = event.target.checked;
    if (!checked) {
      this.$store.dispatch("builder/zones/quest_save", {
        repeatable_after: -1,
      });
    } else {
      this.$store.dispatch("builder/zones/quest_save", {
        repeatable_after: 300,
      });
    }
  }

  get_quest_link(quest_id) {
    return {
      name: BUILDER_ZONE_QUEST_DETAIL,
      params: {
        world_id: this.$route.params.world_id,
        zone_id: this.$route.params.zone_id,
        quest_id: quest_id,
      },
    };
  }

  get_mob_link(mob_template_id) {
    return {
      name: BUILDER_MOB_TEMPLATE_DETAILS,
      params: {
        world_id: this.$route.params.world_id,
        mob_template_id: mob_template_id,
      },
    };
  }
}
</script>
