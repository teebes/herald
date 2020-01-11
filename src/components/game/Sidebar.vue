<template>
  <div id="sidebar">
    <!-- Who list -->
    <div class="sidebar-element who-list">
      <h3 v-if="who_list && who_list['players']" @click="onClickWho">
        <span v-if="expanded === 'who'">-</span>
        <span v-else>+</span>
        {{ who_list["players"].length }}
        <template
          v-if="who_list['players'].length == 1"
        >player</template>
        <template v-else>players</template>
        in world
      </h3>
      <div v-if="expanded === 'who'" class="who-list-detail">
        <div
          v-for="player in who_list.players"
          :key="player.key"
        >{{ player.name }} ({{ player.level }})</div>
      </div>
    </div>

    <!-- Quest Log -->
    <div class="sidebar-element logs">
      <h3>LOGS</h3>
      <div class="mt-4">
        <button class="btn-small mb-1 button-gray" @click="onClickQuestLog">QUEST LOG</button>
        <button class="btn-small button-gray" @click="onClickCommunicationLog">COMMUNICATION LOG</button>
      </div>
    </div>

    <!-- Focus -->
    <div class="sidebar-element focus">
      <h3>
        FOCUS
        <Help :help="focus_help" />
      </h3>
      <!-- <div>{{ player.focus || "none set" }}</div> -->
      <Focus class="mt-2" />
    </div>

    <div class="sidebar-element flex-skills">
      <h3>FLEX SKILLS</h3>
    </div>

    <div class="sidebar-element flex-skills">
      <h3>FEATS</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Help from "@/components/Help.vue";
import QuestLog from "@/components/game/QuestLog.vue";
import ComLog from "@/components/game/sidebar/ComLog.vue";
import Focus from "@/components/game/sidebar/Focus.vue";
import { UI_MUTATIONS } from "@/constants.ts";

@Component({
  components: {
    Help,
    QuestLog,
    ComLog,
    Focus
  }
})
export default class Sidebar extends Vue {
  expanded: string = "";

  get who_list() {
    return this.$store.state.game.who_list;
  }

  get player() {
    return this.$store.state.game.player;
  }

  get focus_help() {
    return `Set an item or character as the focus of another command.<br/>
    <br/>
    Enter 'help focus' for more information.`;
  }

  onClickWho() {
    if (this.expanded === "who") {
      this.expanded = "";
    } else {
      this.expanded = "who";
    }
  }

  onClickQuestLog() {
    const modal = {
      component: QuestLog
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  onClickCommunicationLog() {
    const modal = { component: ComLog };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
#sidebar {
  background: $color-background-light;
  border-left: 2px solid $color-background-very-light;
  width: 250px;

  .sidebar-element {
    padding: 15px;
    &:not(:last-child) {
      border-bottom: 1px solid $color-background-very-light;
    }

    h3 {
      text-transform: uppercase;
    }
  }

  .who-list {
    &:hover {
      cursor: pointer;
    }
    span {
      width: 10px;
      display: inline-block;
    }
  }
  .who-list-detail {
    padding-left: 20px;
  }
}
</style>
