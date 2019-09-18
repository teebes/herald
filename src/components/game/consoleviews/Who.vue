<template>
  <div>
    <div>Players online:</div>
    <div
      v-for="player in message.data.players"
      :key="player.id"
      :class="{'color-secondary': player.name_recognition}"
    >
      <span v-if="player.is_immortal">~</span>
      {{ player.name }} {{ player.title }}
      ({{ player.level }})
      <span
        v-if="player.display_faction"
      >[{{ player.display_faction }}]</span>
      <span v-if="player.is_invisible" class='ml-1 color-text-50'>[invisible]</span>
    </div>

    <div v-for="(grapevine_player, index) in grapevine_who" :key="index">{{grapevine_player}}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class GameWho extends Vue {
  @Prop() message!: any;

  get grapevine_who() {
    const grapevine_who: string[] = [];
    const PER_GAME_LIMIT = 5;

    const gplayers: {} = this.message.data.grapevine || {};

    // Sample input:
    // var gplayers = {
    //     Akrios: [],
    //     Apotheosis: ["Shaitan"],
    //     Atlantis: [],
    //     DumDevelopment: [],
    //     EF: ["Tim"],
    //     MidMUD: [],
    //     MoltenShores: [],
    //     NeonMOO: ["Crisis", "McAllister"],
    //     Olympia: [],
    //     SIGINT: [],
    //     Sindome: ["Barrien", "femmefatale", "Viper272", "Mirino", "Reganza", "thomavich", "ReeferMadness", "tr1cky", "Grizzly666", "villa", "Fris", "Rangerkrauser", "MongOfTheWeek", "0x1mm", "mindkontrol", "theziwen", "Kyrius00", "Johnny", "Misbiopy", "Non_Sequitur_Snowman", "poppyj", "Dawnshot", "Elise-7322", "Ironmanticore", "Hour", "Evie", "RealHumanBean", "Brozilla", "Grey0", "Baguette", "Jade1202", "DMODP", "pfh", "RheaGhe", "HolyChrome", "Halyon", "Varolokkur", "Dreamer", "Kisaki", "BCingyou", "SenatorDankstrong", "Bogrin", "Dvar", "eggsaresides", "floored", "Pinklepop", "Napoleon", "peemant", "Kiwi"],
    //     Snakelines: [],
    //     UtEclipse: [],
    //     hmrmud: [],
    //     myelinalpha: [],
    //     zenos: ["SwiftAusterity"],
    // }

    for (const game in gplayers) {
      const players: string[] = gplayers[game];
      if (!players.length) continue;

      for (let i = 0; i < players.length; i++) {
        var player = players[i];

        grapevine_who.push(`${player}@${game}`);

        if (i === PER_GAME_LIMIT - 1 && player.length >= i) {
          const more_players: number = players.length - i;
          grapevine_who.push(
            "(" + more_players + " more " + game + " players)"
          );
          break;
        }
      }
    }

    return grapevine_who;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>

