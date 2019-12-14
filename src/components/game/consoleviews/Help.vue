<template>
  <div class="help indented">
    <div v-if="message.data.help">
      <div class="topic-help">
        <div class="name">
          {{ message.data.help.name }}
          -
          <span
            class="color-text-50 font-text-regular"
          >{{ message.data.help.format }}</span>
        </div>

        <div class="description">{{ message.data.help.description}}</div>

        <template v-if="message.data.help.examples && message.data.help.examples.length">
          <div>Examples:</div>
          <div class="examples editable-box">
            <div
              class="example"
              v-for="(example, index) in message.data.help.examples"
              :key="index"
            >{{ example }}</div>
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <div class="cmd-group basic-commands">
        <div class="group-title">Basic Commands</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('quit')">quit</div>
          <div class="cmd" @click="cmdHelp('save')">save</div>
          <div class="cmd" @click="cmdHelp('rest')">rest</div>
          <div class="cmd" @click="cmdHelp('stand')">stand</div>
          <div class="cmd" @click="cmdHelp('alias')">alias</div>
          <div class="cmd" @click="cmdHelp('roll')">roll</div>
          <div class="cmd" @click="cmdHelp('learn')">learn</div>
          <div
            class="cmd"
            @click="cmdHelp('title')"
            v-if="$store.state.game.world.players_can_set_title"
          >title</div>
        </div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('follow')">follow</div>
          <div class="cmd" @click="cmdHelp('unfollow')">unfollow</div>
          <div class="cmd" @click="cmdHelp('group')">group</div>
        </div>
      </div>

      <div class="cmd-group combat-commands">
        <div class="group-title">Combat Commands</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('kill')">kill</div>
          <div class="cmd" @click="cmdHelp('flee')">flee</div>
          <div class="cmd" @click="cmdHelp('focus')">focus</div>
        </div>
      </div>

      <div class="cmd-group information-commands">
        <div class="group-title">Information</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('look')">look</div>
          <div class="cmd" @click="cmdHelp('stats')">stats</div>
          <div class="cmd" @click="cmdHelp('inventory')">inventory</div>
          <div class="cmd" @click="cmdHelp('who')">who</div>
          <div class="cmd" @click="cmdHelp('where')">where</div>
          <div class="cmd" @click="cmdHelp('whois')">whois</div>
        </div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('factions')">factions</div>
          <div class="cmd" @click="cmdHelp('scan')">scan</div>
        </div>
      </div>

      <div class="cmd-group movement-commands">
        <div class="group-title">Movement</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('north')">north</div>
          <div class="cmd" @click="cmdHelp('east')">east</div>
          <div class="cmd" @click="cmdHelp('west')">west</div>
          <div class="cmd" @click="cmdHelp('south')">south</div>
          <div class="cmd" @click="cmdHelp('up')">up</div>
          <div class="cmd" @click="cmdHelp('down')">down</div>
          <div class="cmd" @click="cmdHelp('exits')">exits</div>
        </div>
      </div>

      <div class="cmd-group communication-commands">
        <div class="group-title">Communication</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('say')">say</div>
          <div class="cmd" @click="cmdHelp('chat')">chat</div>
          <div class="cmd" @click="cmdHelp('gossip')">gossip</div>
          <div class="cmd" @click="cmdHelp('emote')">emote</div>
          <div class="cmd" @click="cmdHelp('tell')">tell</div>
          <div class="cmd" @click="cmdHelp('reply')">reply</div>
          <div class="cmd" @click="cmdHelp('yell')">yell</div>
        </div>
      </div>

      <div class="cmd-group item-commands">
        <div class="group-title">Item Manipulation</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('get')">get</div>
          <div class="cmd" @click="cmdHelp('put')">put</div>
          <div class="cmd" @click="cmdHelp('drop')">drop</div>
          <div class="cmd" @click="cmdHelp('give')">give</div>
          <div class="cmd" @click="cmdHelp('wield')">wield</div>
          <div class="cmd" @click="cmdHelp('wear')">wear</div>
          <div class="cmd" @click="cmdHelp('remove')">remove</div>
          <div class="cmd" @click="cmdHelp('label')">label</div>
          <div class="cmd" @click="cmdHelp('upgrade')">upgrade</div>
        </div>
      </div>

      <div class="cmd-group quest-mobs">
        <div class="group-title">Mob Commands</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('list')">list</div>
          <div class="cmd" @click="cmdHelp('offer')">offer</div>
          <div class="cmd" @click="cmdHelp('buy')">buy</div>
          <div class="cmd" @click="cmdHelp('sell')">sell</div>
          <div class="cmd" @click="cmdHelp('enquire')">enquire</div>
          <div class="cmd" @click="cmdHelp('complete')">complete</div>
        </div>
      </div>

      <template v-if="archetype === 'warrior'">
        <div class="cmd-group">
          <div class="group-title">Warrior Core Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('bash')">bash</div>
            <div class="cmd" @click="cmdHelp('counter')">counter</div>
            <div class="cmd" @click="cmdHelp('ravage')">ravage</div>
            <div class="cmd" @click="cmdHelp('stomp')">stomp</div>
            <div class="cmd" @click="cmdHelp('punch')">punch</div>
          </div>
        </div>

        <div class="cmd-group">
          <div class="group-title">Warrior Flex Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('crash')">crash</div>
            <div class="cmd" @click="cmdHelp('cleave')">cleave</div>
            <div class="cmd" @click="cmdHelp('rage')">rage</div>
            <div class="cmd" @click="cmdHelp('slam')">slam</div>
            <div class="cmd" @click="cmdHelp('brace')">brace</div>
            <div class="cmd" @click="cmdHelp('smash')">smash</div>
          </div>
        </div>
      </template>

      <template v-if="archetype === 'mage'">
        <div class="cmd-group">
          <div class="group-title">Mage Core Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('spike')">spike</div>
            <div class="cmd" @click="cmdHelp('torrent')">torrent</div>
            <div class="cmd" @click="cmdHelp('freeze')">freeze</div>
            <div class="cmd" @click="cmdHelp('jolt')">jolt</div>
            <div class="cmd" @click="cmdHelp('burn')">burn</div>
          </div>
        </div>

        <div class="cmd-group">
          <div class="group-title">Mage Flex Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('sleep')">sleep</div>
            <div class="cmd" @click="cmdHelp('innervate')">innervate</div>
            <div class="cmd" @click="cmdHelp('barrier')">barrier</div>
            <div class="cmd" @click="cmdHelp('meteor')">meteor</div>
            <div class="cmd" @click="cmdHelp('shift')">shift</div>
            <div class="cmd" @click="cmdHelp('flare')">flare</div>
            <div class="cmd" @click="cmdHelp('combust')">combust</div>
          </div>
        </div>
      </template>

      <template v-if="archetype === 'cleric'">
        <div class="cmd-group">
          <div class="group-title">Cleric Core Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('heal')">heal</div>
            <div class="cmd" @click="cmdHelp('wrack')">wrack</div>
            <div class="cmd" @click="cmdHelp('mend')">mend</div>
            <div class="cmd" @click="cmdHelp('avatar')">avatar</div>
            <div class="cmd" @click="cmdHelp('shield')">shield</div>
          </div>
        </div>

        <div class="cmd-group">
          <div class="group-title">Cleric Flex Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('anathema')">anathema</div>
            <div class="cmd" @click="cmdHelp('ward')">ward</div>
            <div class="cmd" @click="cmdHelp('hush')">hush</div>
            <div class="cmd" @click="cmdHelp('purify')">purify</div>
            <div class="cmd" @click="cmdHelp('repent')">repent</div>
            <div class="cmd" @click="cmdHelp('compel')">compel</div>
          </div>
        </div>
      </template>

      <template v-if="archetype === 'assassin'">
        <div class="cmd-group">
          <div class="group-title">Assassin Core Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('quickstrike')">quickstrike</div>
            <div class="cmd" @click="cmdHelp('maelstrom')">maelstrom</div>
            <div class="cmd" @click="cmdHelp('heartstrike')">heartstrike</div>
            <div class="cmd" @click="cmdHelp('dancingslash')">dancingslash</div>
            <div class="cmd" @click="cmdHelp('hiltsmack')">hiltsmack</div>
            <div class="cmd" @click="cmdHelp('secondwind')">secondwind</div>
          </div>
        </div>

        <div class="cmd-group">
          <div class="group-title">Assassin Flex Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('flurry')">flurry</div>
            <div class="cmd" @click="cmdHelp('mistform')">mistform</div>
            <div class="cmd" @click="cmdHelp('knee')">knee</div>
            <div class="cmd" @click="cmdHelp('blind')">blind</div>
            <div class="cmd" @click="cmdHelp('sneak')">sneak</div>
            <div class="cmd" @click="cmdHelp('backstab')">backstab</div>
          </div>
        </div>
      </template>

      <template v-if="isBuilder">
        <div class="cmd-group">
          <div class="group-title">Builder Commands</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('load')">load</div>
            <div class="cmd" @click="cmdHelp('reset')">reset</div>
            <div class="cmd" @click="cmdHelp('geta')">geta</div>
            <div class="cmd" @click="cmdHelp('seta')">seta</div>
            <div class="cmd" @click="cmdHelp('regen')">regen</div>
            <div class="cmd" @click="cmdHelp('purge')">purge</div>
            <div class="cmd" @click="cmdHelp('masspurge')">masspurge</div>
            <div class="cmd" @click="cmdHelp('force')">force</div>
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('winvisible')">winvisible</div>
            <div class="cmd" @click="cmdHelp('repop')">repop</div>
            <div class="cmd" @click="cmdHelp('ping')">ping</div>
            <div class="cmd" @click="cmdHelp('jump')">jump</div>
            <div class="cmd" @click="cmdHelp('transfer')">transfer</div>
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('echo')">echo</div>
            <div class="cmd" @click="cmdHelp('gecho')">gecho</div>
            <div class="cmd" @click="cmdHelp('zecho')">zecho</div>
            <div class="cmd" @click="cmdHelp('send')">send</div>
            <div class="cmd" @click="cmdHelp('sendexcept')">sendexcept</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class GameHelp extends Vue {
  @Prop() message!: any;

  get archetype() {
    return this.$store.state.game.player.archetype;
  }

  get isBuilder() {
    return this.$store.state.game.player.is_immortal;
  }

  cmdHelp(cmd) {
    this.$store.dispatch("game/cmd", `help ${cmd}`);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

.help {
  .topic-help {
    .name,
    .description {
      margin-bottom: 8px;
    }

    .examples {
      margin-top: 3px;
    }
  }

  .cmd-group {
    &:not(:last-child) {
      margin-bottom: 8px;
    }

    .group-title {
      color: $color-text-hex-50;
      @include font-text-regular;
    }
    .cmds {
      display: flex;
      flex-wrap: wrap;
      //justify-content: space-between;
      .cmd:not(:last-child) {
        margin-right: 8px;
      }

      .cmd {
        //@include font-text-regular;
        //text-decoration: underline;
        border-bottom: 1px dotted #888;
        cursor: pointer;
      }
    }
  }
}
</style>