<template>
  <div id="mob-teaching">
    <h3>SKILLS</h3>
    <div class="color-text-70">
      <p>Mobs can use skills, as well as teach skills to players.</p>
    </div>

    <div v-if="template.teaches" class="color-text-70">

      <p>This mob teaches the following skills to players in their room:</p>
      <ul class="list color-text">
        <li v-for="skill in template.teaches.split(' ')" :key="skill">{{ skill }}</li>
      </ul>
      <div v-if="template.teaching_conditions">
        <p>Provided the following condition is true:</p>
        <div>
          <code>{{ template.teaching_conditions }}</code>
        </div>
      </div>
    </div>

    <div v-if="template.unlearns" class="color-text-70">
      <p>
        <template v-if="template.unlearns === 'all'">This mob allows players to forget all skills.</template>
        <template v-else>This mob allows players to forget the following skills: <span class='color-text'>{{ template.unlearns }}</span>.</template>
        <template v-if="template.unlearn_cost > 0">Players will be charged {{ template.unlearn_cost }} gold per skill unlearned.</template>
      </p>
    </div>

    <div v-if="template.use_abilities" class='color-text-70'>
      <div v-if="template.combat_script">
        <p>Use of abilities is enabled.</p>
        <p>In combat, this mob executes the following script:</p>
        <ol class="list color-text">
        <li v-for="(line, index) in template.combat_script.split('\n')" :key="index">{{ line }}</li>
      </ol>
      </div>
      <div v-else>
        <p v-if="template.archetype">Use of abilities is enabled. This mob will randomly use one of its {{ template.archetype }} skills in combat.</p>
        <p v-else>This mob is set to use abilities but does not specify a combat script. Please include a combat script with at least one ability.</p>
      </div>
    </div>


    <button class="btn-thin" @click="editTeaching">EDIT</button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { CONDITIONS } from "@/core/forms";

const store = useStore();

const template = computed(() => store.state.builder.worlds.mob_template);


const editTeaching = () => {
  const archetype = template.value.archetype;

  let use_abilities_help;
  if (!archetype) {
    use_abilities_help = `Check this box if you want this mob to use abilities. Specify which abilities to use in the combat script below.`;
  } else {
    use_abilities_help = `Check this box if you want this mob to use abilities. If no combat script is specified, the mob will randomly use one of its abilities base don its archetype.`;
  }

  const modal = {
    data: template.value,
    schema: [
      {
        children: [
          {
            attr: "teaches",
            label: "Teaches Skills",
            help: "Space-separated list of skills to teach. If this field has skills listed, the 'learn' command will be enabled in this mob's room."
          },
          {
            attr: "teaching_conditions",
            label: "Teaching Conditions",
            help: CONDITIONS.help,
          }
        ],
      },
      {
        children: [
          {
            attr: "unlearns",
            label: "Unlearns Skills",
            help: `If set, will enable the 'unlearn' command for players in the mob's room.<br><br>Set to 'all' for all skills to be unlearned via this mob. To restrict, enter space-seperated list of skills to unlearn.`,
          },
          {
            attr: "unlearn_cost",
            label: "Cost to Unlearn a Skill",
            help: "How much gold the mob will charge per skill to unlearn."
          },
        ]
      },
      {
        attr: "use_abilities",
        label: "Use Abilities",
        widget: "checkbox",
        help: use_abilities_help,
      },
      {
        attr: "combat_script",
        label: "Combat Script",
        widget: "textarea",
        help: `This script is execucted by the mob, line by line, when it is in combat. It will cycle back to the start after it has reached the end.`
      }
    ],
    action: "builder/worlds/mob_template_save"
  }
  store.commit('ui/modal/open_form', modal);
};
</script>
