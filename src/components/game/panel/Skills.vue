<template>
  <div class="skills-region flex flex-col">
    <div class="skills-view flex flex-col">
      <div class="core-skills-region skills action-boxes" v-if="coreSkills.length">
        <div>
          <div class="label">Core Skills</div>
          <div class="skill-boxes">
            <div class="box-row">
              <div
                class="box-item no-touch"
                v-for="skill in coreSkills"
                :key="skill.cmd"
                @click="onClick(skill)"
              >
                <div class="box-overlay" :ref="skill.cmd + '-overlay'"></div>
                <span class="box-name">{{ skill.label }}</span>
                <span class="hotkey">{{ skill.hotKey }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-skills-region skills action-boxes" v-if="flexSkills.length">
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
                <div class="box-overlay" :ref="skill.cmd + '-overlay'"></div>
                <span class="box-name">{{ skill.label }}</span>
                <span class="hotkey">{{ skill.hotKey }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TweenLite, Linear } from "gsap";
import EventBus from "@/core/eventbus.ts";

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

@Component
export default class PanelSkills extends Vue {
  activeCooldowns: {} = {};
  activeAnimations: {} = {};
  finishedCooldowns: {} = {};

  mounted() {
    EventBus.$on("cooldown-adjustment", this.onCooldownAdjustment);
    this.startCooldowns();
  }

  destroyed() {
    EventBus.$off("cooldown-adjustment", this.onCooldownAdjustment);
    for (const animation in this.activeAnimations) {
      this.activeAnimations[animation].kill();
    }
  }

  @Watch("cooldowns")
  onCooldownsChange(cooldowns) {
    this.startCooldowns();
  }

  startCooldowns() {
    const cooldowns = this.cooldowns;
    for (const skill in cooldowns) {
      if (!this.activeCooldowns[skill]) {
        const overlay = this.$refs[`${skill}-overlay`] as HTMLElement;
        const cooldown: Cooldown = cooldowns[skill];

        const current = new Date().getTime();
        const adjustment = cooldown.adjustment || 0;
        const elapsed = current + adjustment * 1000 - cooldown.start;
        const duration = cooldown.duration * 1000;
        const remaining_time = duration - elapsed - COOLDOWN_FINISH;
        const remaining_perc =
          100 - Math.round((100 * elapsed) / duration) + "%";

        overlay[0].setAttribute("style", `height: ${remaining_perc}`);
        const animation = TweenLite.to(overlay, remaining_time / 1000, {
          height: "0%",
          onComplete: this.onComplete,
          onCompleteParams: [skill],
          ease: Linear.easeNone
        });
        this.activeAnimations[skill] = animation;
      }
    }
    this.activeCooldowns = { ...cooldowns };
  }

  onComplete(skill) {
    const overlay = this.$refs[`${skill}-overlay`] as HTMLElement;
    overlay[0].setAttribute("style", "height: 100%");
    overlay[0].classList.add("finished");

    this.finishedCooldowns[skill] = setTimeout(() => {
      overlay[0].classList.remove("finished");
      overlay[0].setAttribute("style", "height: 0");
      delete this.finishedCooldowns[skill];
    }, COOLDOWN_FINISH);
  }

  onCooldownAdjustment(data) {

    const cd_data = this.activeCooldowns[data.skill],
      previous_adjustment = cd_data.adjustment || 0,
      adjustment = previous_adjustment + data.adjustment,
      current = new Date().getTime(),
      elapsed = current + adjustment * 1000 - cd_data.start,
      duration = cd_data.duration * 1000,
      remaining_time = duration - elapsed - COOLDOWN_FINISH,
      remaining_perc = 100 - Math.round((100 * elapsed) / duration) + "%";

    const overlay = this.$refs[`${data.skill}-overlay`] as HTMLElement;

    this.activeAnimations[data.skill].kill();    

    if (remaining_time > 0) {
      overlay[0].setAttribute("style", `height: ${remaining_perc}`);
      this.activeAnimations[data.skill] = TweenLite.to(
        overlay,
        remaining_time / 1000,
        {
          height: "0%",
          ease: Linear.easeNone
        }
      );
    } else {
      overlay[0].setAttribute("style", "height: 0");
      this.onComplete(data.skill);
    }

    this.$store.commit("game/player_cooldown_adjust", {
      skill: data.skill,
      adjustment: adjustment
    });
  }

  get cooldowns() {
    return this.$store.state.game.player_cooldowns;
  }

  onClick(skill) {
    this.$store.dispatch("game/cmd", skill.cmd);
  }

  get player() {
    return this.$store.state.game.player;
  }

  get archetypeSkills() {
    const archetype = this.player.archetype;
    return this.$store.state.game.world.skills[archetype];
  }

  get coreSkills() {
    let hotKey = 1;
    let skills: {}[] = [];
    for (const skillCode of this.archetypeSkills.core) {
      const skillData = this.archetypeSkills[skillCode];
      if (this.player.level >= skillData.level) {
        skills.push({
          label: skillData.name,
          cmd: skillData.code,
          hotKey: hotKey
        });
      }
      hotKey += 1;
    }
    return skills;
  }

  get flexSkills() {
    let hotKey = 6;
    let skills: {}[] = [];
    for (const flexNumber of [1, 2, 3]) {
      const skillCode = this.player.skills.flex[flexNumber];
      if (skillCode) {
        const skillData = this.archetypeSkills[skillCode];
        if (this.player.level >= skillData.level) {
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
  }
}
</script>

<style lang="scss">
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

      background: #828283;
      height: 40px;
      max-width: 50%;

      color: white;
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

      .box-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #3c3c3c;
        width: 100%;
        height: 0;

        &.finished {
          background: $color-primary;
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