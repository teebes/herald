<template>
  <div class="help indented">
    <div v-if="message.data.help">
      <div class="topic-help">
        <div class="name">
          {{ message.data.help.name }}
          -
          <span class="color-text-50 font-text-regular">{{ message.data.help.format }}</span>
        </div>

        <div class="description">{{ message.data.help.description}}</div>

        <template v-if="message.data.help.examples && message.data.help.examples.length">
          <div>Examples:</div>
          <div class="examples editable-box">
            <div class="example" v-for="(example, index) in message.data.help.examples" :key="index">{{ example }}</div>
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <div class="cmd-group basic-commands">
        <div class="group-title">Basic Commands</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('quit')">quit</div>
          <div class="cmd" @click="cmdHelp('rest')">rest</div>
          <div class="cmd" @click="cmdHelp('stand')">stand</div>
          <div class="cmd" @click="cmdHelp('alias')">alias</div>
          <div class="cmd" @click="cmdHelp('roll')">roll</div>
          <div class="cmd" @click="cmdHelp('learn')">learn</div>
          <div class="cmd" @click="cmdHelp('forget')">forget</div>
          <div class="cmd" @click="cmdHelp('skills')">skills</div>
          <div class="cmd" @click="cmdHelp('title')" v-if="canSetTitle">title</div>
        </div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('follow')">follow</div>
          <div class="cmd" @click="cmdHelp('unfollow')">unfollow</div>
          <div class="cmd" @click="cmdHelp('group')">group</div>
          <div class="cmd" @click="cmdHelp('ungroup')">ungroup</div>
          <div class="cmd" @click="cmdHelp('socials')">socials</div>
        </div>
      </div>

      <div class="cmd-group combat-commands">
        <div class="group-title">Combat Commands</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('kill')">kill</div>
          <div class="cmd" @click="cmdHelp('flee')">flee</div>
          <div class="cmd" @click="cmdHelp('focus')">focus</div>
          <div class="cmd" @click="cmdHelp('ambush')">ambush</div>
          <div class="cmd" @click="cmdHelp('assist')">assist</div>
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
          <div class="cmd" @click="cmdHelp('track')">track</div>
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
          <div class="cmd" @click="cmdHelp('mute')">mute</div>
        </div>
      </div>

      <div class="cmd-group clan-commands">
        <div class="group-title">Clan Commands</div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('cc')">cc</div>
          <div class="cmd" @click="cmdHelp('cjoin')">cjoin</div>
          <div class="cmd" @click="cmdHelp('cquit')">cquit</div>
          <div class="cmd" @click="cmdHelp('cregister')">cregister</div>
          <div class="cmd" @click="cmdHelp('cpassword')">cpassword</div>
          <div class="cmd" @click="cmdHelp('cmembers')">cmembers</div>
          <div class="cmd" @click="cmdHelp('cpromote')">cpromote</div>
          <div class="cmd" @click="cmdHelp('ckick')">ckick</div>
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
        </div>
        <div class="cmds">
          <div class="cmd" @click="cmdHelp('label')">label</div>
          <div class="cmd" @click="cmdHelp('upgrade')">upgrade</div>
          <div class="cmd" @click="cmdHelp('craft')">craft</div>
          <div class="cmd" @click="cmdHelp('compare')">compare</div>
          <div class="cmd" @click="cmdHelp('eat')">eat</div>
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
          <div class="cmd" @click="cmdHelp('order')">order</div>

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
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('dancingslash')">dancingslash</div>
            <div class="cmd" @click="cmdHelp('hiltsmack')">hiltsmack</div>
            <div class="cmd" @click="cmdHelp('secondwind')">secondwind</div>
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('sneak')">sneak</div>
            <div class="cmd" @click="cmdHelp('backstab')">backstab</div>
            <div class="cmd" @click="cmdHelp('skullcrack')">skullcrack</div>
          </div>
        </div>

        <div class="cmd-group">
          <div class="group-title">Assassin Flex Skills</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('flurry')">flurry</div>
            <div class="cmd" @click="cmdHelp('mistform')">mistform</div>
            <div class="cmd" @click="cmdHelp('knee')">knee</div>
            <div class="cmd" @click="cmdHelp('blind')">blind</div>
            <div class="cmd" @click="cmdHelp('knockout')">knockout</div>
          </div>
        </div>
      </template>

      <template v-if="isBuilder">
        <div class="cmd-group">
          <div class="group-title">Builder Commands</div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('/load')">/load</div>
            <div class="cmd" @click="cmdHelp('reset')">reset</div>
            <div class="cmd" @click="cmdHelp('geta')">geta</div>
            <div class="cmd" @click="cmdHelp('seta')">seta</div>
            <div class="cmd" @click="cmdHelp('regen')">regen</div>
            <div class="cmd" @click="cmdHelp('/purge')">/purge</div>
            <div class="cmd" @click="cmdHelp('masspurge')">masspurge</div>
            <div class="cmd" @click="cmdHelp('force')">force</div>
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('/invisible')">/invisible</div>
            <div class="cmd" @click="cmdHelp('/repop')">/repop</div>
            <div class="cmd" @click="cmdHelp('ping')">ping</div>
            <div class="cmd" @click="cmdHelp('jump')">jump</div>
            <div class="cmd" @click="cmdHelp('transfer')">transfer</div>
            <div class="cmd" @click="cmdHelp('find')">find</div>
            <div class="cmd" @click="cmdHelp('/award')">/award</div>
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('/at')">/at</div>
            <div class="cmd" @click="cmdHelp('/damage')">/damage</div>
            <div class="cmd" @click="cmdHelp('/echo')">/echo</div>
            <div class="cmd" @click="cmdHelp('/gecho')">/gecho</div>
            <div class="cmd" @click="cmdHelp('/zecho')">/zecho</div>
            <div class="cmd" @click="cmdHelp('send')">send</div>
            <div class="cmd" @click="cmdHelp('sendexcept')">sendexcept</div>
          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('facts')">facts</div>
            <div class="cmd" @click="cmdHelp('setfact')">setfact</div>
            <div class="cmd" @click="cmdHelp('clearfact')">clearfact</div>
            <div class="cmd" @click="cmdHelp('mark')">mark</div>
            <div class="cmd" @click="cmdHelp('unmark')">unmark</div>
            <div class="cmd" @click="cmdHelp('/kill')">/kill</div>
            <div class="cmd" @click="cmdHelp('/kick')">/kick</div>

          </div>
          <div class="cmds">
            <div class="cmd" @click="cmdHelp('/open')">/open</div>
            <div class="cmd" @click="cmdHelp('/close')">/close</div>
            <div class="cmd" @click="cmdHelp('/lock')">/lock</div>
            <div class="cmd" @click="cmdHelp('/chat')">/chat</div>
            <div class="cmd" @click="cmdHelp('/take')">/take</div>
            <div class="cmd" @click="cmdHelp('/kill')">/kill</div>
            <div class="cmd" @click="cmdHelp('/ban')">/ban</div>
            <div class="cmd" @click="cmdHelp('/mute')">/mute</div>
            <div class="cmd" @click="cmdHelp('/nochat')">/nochat</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script lang='ts' setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
defineProps<{ message: any }>();

const archetype = computed(() => store.state.game.player.archetype);
const isBuilder = computed(() => store.state.game.player.is_immortal);
const canSetTitle = computed(() => store.state.game.world.players_can_set_title);
const cmdHelp = (cmd) => {
  store.dispatch("game/cmd", `help ${cmd}`);
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