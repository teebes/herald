<template>
  <div class="skills-region flex flex-col" v-if="player.archetype">
    <div class="skills-view flex flex-col">
      <div class="core-skills-region skills action-boxes" v-if="coreSkills.length">
        <div>
          <div class="label">
            Core Skills
            <span
              class="stance"
              v-if="player.archetype === 'assassin'"
            >{{ capfirst(player.stance) }}</span>
          </div>
          <div class="skill-boxes">
            <div class="box-row">
              <div
                class="box-item no-touch"
                :class="{ disabled: skill.is_disabled }"
                v-for="skill in coreSkills"
                :key="skill.cmd"
                @click="onClick(skill)"
              >
                <div class="box-overlay" :ref="el => skillRefs[`${skill.cmd}`] = el"></div>
                <span class="box-name unselectable">{{ skill.label }}</span>
                <span class="hotkey unselectable">{{ skill.hotKey }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex-skills-region skills action-boxes"
        v-if="flexSkills.length || featSkills.length"
      >
        <div>
          <div class="label">Flex Skills</div>
          <div class="skill-boxes">
            <div class="box-row">
              <div
                class="box-item no-touch"
                v-for="skill in flexSkills"
                :key="skill.cmd"
                @click="onClick(skill)"
              >
                <div class="box-overlay" :ref="el => skillRefs[`${skill.cmd}`] = el"></div>
                <span class="box-name unselectable">{{ skill.label }}</span>
                <span class="hotkey unselectable">{{ skill.hotKey }}</span>
              </div>
              <template v-if="featSkills.length">
                <div
                  class="box-item no-touch"
                  v-for="skill in featSkills"
                  :key="skill.cmd"
                  @click="onClick(skill)"
                >
                  <div class="box-overlay" :ref="el => skillRefs[`${skill.cmd}`] = el"></div>
                  <span class="box-name unselectable">{{ skill.label }}</span>
                  <span class="hotkey unselectable">{{ skill.hotKey }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div
        class="companion-skills-region skills action-boxes"
        v-if="companionSkills.length"
      >
        <div>
          <div class="label">Companion Skills</div>
          <div class="skill-boxes">
            <div class="box-row">
              <div
                class="box-item no-touch"
                v-for="skill in companionSkills"
                :key="skill.cmd"
                @click="onClick(skill)"
              >
                <div class="box-overlay" :ref="el => skillRefs[`${skill.cmd}`] = el"></div>
                <span class="box-name unselectable">{{ skill.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="skills-region flex flex-col" v-else>
    <div class="skills-view flex flex-col">
      <div class="core-skills-region skills action-boxes" v-if="customSkills1">
        <div class="skill-boxes">
            <div class="box-row">
              <div
                class="box-item no-touch"
                :class="{ disabled: skill.is_disabled }"
                v-for="skill in customSkills1"
                :key="skill.cmd"
                @click="onClick(skill)"
              >
                <div class="box-overlay" :ref="el => skillRefs[`${skill.cmd}`] = el"></div>
                <span class="box-name unselectable">{{ skill.label }}</span>
                <span class="hotkey unselectable">{{ skill.hotKey }}</span>
              </div>
            </div>
            <div class="box-row">
              <div
                class="box-item no-touch"
                :class="{ disabled: skill.is_disabled }"
                v-for="skill in customSkills2"
                :key="skill.cmd"
                @click="onClick(skill)"
              >
                <div class="box-overlay" :ref="el => skillRefs[`${skill.cmd}`] = el"></div>
                <span class="box-name unselectable">{{ skill.label }}</span>
                <span class="hotkey unselectable">{{ skill.hotKey }}</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { gsap } from "gsap";
import EventBus from "@/core/eventbus";
import { capfirst } from "@/core/utils";
import { getSubclass, findSkillData } from "@/core/subclass";

const store = useStore();

interface Cooldown {
  actor: string;
  duration: number;
  expires: number;
  skill: string;
  start: number;
  adjustment: number;
}

// Time that the 'cooldown is done' animation frame lasts
const COOLDOWN_FINISH = 125;

const activeAnimations = reactive<{ [key: string]: any }>({});
const finishedCooldowns = reactive<{ [key: string]: any }>({});

const skillRefs = reactive<any>({});

const cooldowns = computed(() => {
  return store.state.game.player_cooldowns;
});

const onClick = (skill) => {
  if (skill.is_disabled) return;
  store.dispatch("game/cmd", skill.cmd);
}

const player = computed(() => store.state.game.player);

const startCooldowns = () => {
  const currentCooldowns = cooldowns.value;

  for (const skill in currentCooldowns) {
    // Fix for flee's cooldown
    if (skill == "flee") continue;

    const overlay = skillRefs[skill] as HTMLElement;
    if (!overlay) continue;

    const cooldown: Cooldown = currentCooldowns[skill];

    const current = new Date().getTime();
    const adjustment = cooldown.adjustment || 0;
    const elapsed = current + adjustment * 1000 - cooldown.start;
    const duration = cooldown.duration * 1000;
    const remaining_time = duration - elapsed - COOLDOWN_FINISH;
    const remaining_perc = 100 - Math.round((100 * elapsed) / duration) + "%";

    if (activeAnimations[skill]) {
      activeAnimations[skill].kill();
    }

    if (remaining_time <= 0) {
      overlay.setAttribute('style', 'height: 0');
      onComplete(skill);
      continue;
    }

    overlay.setAttribute("style", `height: ${remaining_perc}`);
    const animation = gsap.to(overlay, {
      duration: remaining_time / 1000,
      height: "0%",
      ease: 'none',
      onComplete: onComplete,
      onCompleteParams: [skill]
    });
    activeAnimations[skill] = animation;
  }
}

const onComplete = (skill: string) => {
  const overlay = skillRefs[skill] as HTMLElement
  if (!overlay) return;
  overlay.setAttribute('style', 'height: 100%');
  overlay.classList.add('finished');

  finishedCooldowns[skill] = setTimeout(() => {
    overlay.classList.remove('finished');
    overlay.setAttribute('style', 'height: 0');
    delete finishedCooldowns[skill];
  }, COOLDOWN_FINISH);
};

const onCooldownAdjustment = (data: any) => {
  const cd_data = cooldowns.value[data.skill];
  if (!cd_data) return;

  const adjustment = cd_data.adjustment || 0,
    current = new Date().getTime(),
    elapsed = current + adjustment * 1000 - cd_data.start,
    duration = cd_data.duration * 1000,
    remaining_time = duration - elapsed - COOLDOWN_FINISH,
    remaining_perc = 100 - Math.round((100 * elapsed) / duration) + '%';

  const overlay = skillRefs[data.skill] as HTMLElement;
  if (!overlay) return;

  if (activeAnimations[data.skill]) {
    activeAnimations[data.skill].kill();
  }

  if (remaining_time > 0) {
    overlay.setAttribute('style', `height: ${remaining_perc}`);
    activeAnimations[data.skill] = gsap.to(overlay, {
      duration: remaining_time / 1000,
      height: '0%',
      ease: 'none',
      onComplete: onComplete,
      onCompleteParams: [data.skill],
    });
  } else {
    overlay.setAttribute('style', 'height: 0');
    onComplete(data.skill);
  }

};

const archetypeSkills = computed(() => {
  const archetype = player.value.archetype;
  let stance = player.value.stance;
  let skills = { ...store.state.game.world.skills[archetype] };

  // For assassins, modify the available skills based on stance
  if (archetype === 'assassin') {
    const core_asn_skills: string[] = [];
    for (const skill_code of skills.core) {
      const skill = skills[skill_code];

      // Mark the skill disabled if in a disabled stance
      if (skill.disabled.indexOf(stance) !== -1) {
        skill.is_disabled = true;
      } else {
        skill.is_disabled = false;
      }

      // If the player's stance is one of the allowed stances
      if (skill.stances.indexOf(stance) !== -1) {
        core_asn_skills.push(skill.code);
      }
    }
    skills.core = core_asn_skills;
  }

  return skills;
});

// Skills of the player's subclass, if any. Deliberately not merged into
// archetypeSkills: core skills stay own-archetype only, matching the server,
// which refuses cross-archetype core skills at use time. This resolves flex
// and feat selections plus effect-gated companion skills from the subclass;
// ordinary subclass core skills remain hidden.
const subclassSkills = computed(() => {
  const subclass = getSubclass(player.value);
  if (!subclass) return {};
  return store.state.game.world.skills[subclass] || {};
});

const coreSkills = computed(() => {
  const archetype = player.value.archetype;
  const player_level = player.value.level;

  let hotKey = 1;
  const skills: any[] = [];
  for (const skillCode of archetypeSkills.value.core) {
    const skillData = archetypeSkills.value[skillCode];
    if (skillData.requires_effect) continue;
    if (player_level >= skillData.level) {
      skills.push({
        label: skillData.name,
        cmd: skillData.code,
        hotKey: hotKey,
        is_disabled: skillData.is_disabled
      });
    }
    hotKey += 1;
  }

  // Hack, insert a disabled box in slot 2 while player is less than level 9
  if (archetype === 'assassin' && player_level < 9) {
    skills.splice(1, 0, {
      label: '',
      cmd: '',
      hotkey: 2,
      is_disabled: true
    });
  }
  return skills;
});

const activeEffectCodes = computed(() => {
  const playerEffects = store.state.game.effects[player.value.key] || [];
  return new Set(playerEffects.map(effect => effect.code));
});

const companionSkills = computed(() => {
  const skills: any[] = [];
  const seen = new Set<string>();

  for (const skillSet of [archetypeSkills.value, subclassSkills.value]) {
    for (const skillCode of skillSet.core || []) {
      const skillData = skillSet[skillCode];
      if (!skillData || !skillData.requires_effect) continue;
      if (!activeEffectCodes.value.has(skillData.requires_effect)) continue;
      if (player.value.level < skillData.level || seen.has(skillData.code)) continue;

      skills.push({ label: skillData.name, cmd: skillData.code });
      seen.add(skillData.code);
    }
  }

  return skills;
});

const flexSkills = computed(() => {
  let hotKey = 6;
  const skills: any[] = [];
  for (const flexNumber of [1, 2, 3]) {
    const skillCode = player.value.skills.flex[flexNumber];
    if (skillCode) {
      const skillData = findSkillData(
        skillCode, archetypeSkills.value, subclassSkills.value);
      if (!skillData) continue;
      if (player.value.level >= skillData.level) {
        skills.push({
          label: skillData.name,
          cmd: skillData.code,
          hotKey: hotKey
        });
      }
    }
    hotKey += 1;
  }
  return skills;
});

const featSkills = computed(() => {
  const skills: any[] = [];
  const selections = Object.entries(player.value.skills.feat || {})
    .sort(([left], [right]) => Number(left) - Number(right));

  for (const [, selection] of selections) {
    if (selection) {
      // May be a subclass feat, so fall back to the subclass skill set.
      const skillData = findSkillData(
        selection as string, archetypeSkills.value, subclassSkills.value);
      // Passive feats may share a code with an ordinary skill. Only render
      // abilities that the server explicitly identifies as feat skills.
      if (!skillData || !skillData.is_feat) continue;
      skills.push({
        label: skillData.name,
        cmd: skillData.code,
        // Feat skills have no numeric alias in Advent.
        hotKey: ''
      });
    }
  }
  return skills;
});

const playerCustomSkills = computed(() => player.value.skills.custom || {});

const worldCustomSkills = computed(() => store.state.game.world.skills.custom.definitions || {});


const customSkills1 = computed(() => {
  const skills: any[] = [];
  const skill_keys = Object.keys(playerCustomSkills.value);
  const first_half = skill_keys.slice(0, Math.ceil(skill_keys.length / 2));

  for (const skillNumber of first_half) {
    const skillCode = playerCustomSkills.value[skillNumber];
    if (skillCode) {
      const skill = worldCustomSkills.value[skillCode];
      skills.push({
        label: skill.name || capfirst(skill.skill),
        cmd: skill.skill,
        hotKey: skillNumber
      });
    }
  }

  return skills;
});

const customSkills2 = computed(() => {
  const skills: any[] = [];
  const skill_keys = Object.keys(playerCustomSkills.value);
  const second_half = skill_keys.slice(Math.ceil(skill_keys.length / 2));

  for (const skillNumber of second_half) {
    const skillCode = playerCustomSkills.value[skillNumber];
    if (skillCode) {
      const skill = worldCustomSkills.value[skillCode];
      skills.push({
        label: skill.name || capfirst(skill.skill),
        cmd: skill.skill,
        hotKey: skillNumber
      });
    }
  }

  return skills;
});

onMounted(() => {
  EventBus.on("cooldown-adjustment", onCooldownAdjustment);
  EventBus.on("cooldown-start", startCooldowns);
  startCooldowns();
});

onUnmounted(() => {
  EventBus.off("cooldown-adjustment", onCooldownAdjustment);
  EventBus.off("cooldown-start", startCooldowns);
  for (const animation in activeAnimations) {
    activeAnimations[animation].kill();
  }
});

</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.skills {
  padding: 0 20px;
}

.action-boxes {
  margin-top: 10px;

  .label {
    @include font-title-light;
    color: $color-secondary;
    font-size: 15px;
    line-height: 18px;
    padding-bottom: 2px;

    > span {
      font-size: inherit;
      color: $color-text-hex-70;
    }

    > .stance {
      text-transform: lowercase;
      margin-left: 35px;
      float: right;
      font-size: 17px;
    }
  }

  .box-row {
    display: flex;
    position: relative;
    .box-item {
      position: relative;

      flex: 1 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      flex-wrap: wrap;

      color: white;
      background: #828283;

      &.disabled {
        background: #3c3c3c;
      }

      height: 40px;
      max-width: 50%;

      font-size: 11px;
      line-height: 15px;

      &:not(:last-child) {
        border-right: 1px solid $color-background-black;
      }

      .hotkey {
        display: none;
      }
      &.no-touch {
        &:hover {
          cursor: pointer;
          &.disabled {
            cursor: default;
          }

          .hotkey {
            display: block;
            position: absolute;
            bottom: 1px;
            right: 4px;
            @include font-title-regular;
            color: $color-background-black;
            font-size: 10px;
          }
        }
      }
      &.disabled:hover > .hotkey {
        display: none;
      }

      &.cooldown {
        background: #3c3c3c;
        color: rgba(255, 255, 255, 0.3);
      }

      .box-name {
        @include font-text-regular;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        color: white;
      }
      &.disabled > .box-name {
        color: $color-text-hex-50;
      }

      .box-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #3c3c3c;
        width: 100%;
        height: 0;

        &.finished {
          background: #3c3c3c;
        }
      }
    }

    &:first-child {
      .box-item:first-child {
        border-top-left-radius: 2px;
        .box-overlay {
          border-top-left-radius: 2px;
        }
      }
      .box-item:last-child {
        border-top-right-radius: 2px;
        .box-overlay {
          border-top-right-radius: 2px;
        }
      }
    }
    &:last-child {
      .box-item:first-child {
        border-bottom-left-radius: 2px;
        .box-overlay {
          border-bottom-left-radius: 2px;
        }
      }
      .box-item:last-child {
        border-bottom-right-radius: 2px;
        .box-overlay {
          border-bottom-right-radius: 2px;
        }
      }
    }
    &:not(:only-child) {
      &:not(:last-child) {
        border-bottom: 1px solid $color-background-black;
      }
    }
  }
}
</style>
