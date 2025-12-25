<template>
  <div class="about single-page">
    <h1>About Written Realms</h1>

    <p>
      Written Realms is a platform for interactive fiction games. It is a modern take on
      <a
        href="https://en.wikipedia.org/wiki/MUD"
      >Multi-User Dungeons</a>, but web-based and using websockets rather than telnet for the connection protocol. This, combined with its responsive front-end, makes the worlds of Written Realms playable anywhere: on a mobile browser to pass 5 minutes of free time, or on a computer for challenging encounters and longer play sessions.
    </p>

    <p>
      Although largely inspired by the original design and mechanics that powered so many
      <a
        href="https://en.wikipedia.org/wiki/DikuMUD"
      >DikuMUDs</a> in the 90s (and many of them still!), Written Realms is an original creation. The code base was started in 2013 and is mostly written in Python, with a multi-socketed architecture built on top of ZeroMQ. We've drawn inspiration from both our text-based predecessors and contemporary role-playing games to create something new that we are excited to share. Our goal is to not only create compelling worlds, but to allow players to create unique characters and explore them in an engaging and meaningful way.
    </p>

    <h2>Team</h2>

    <div class="team">
      <!-- Thibaud -->
      <div class="team-member">
        <div class="member-top">
          <div class="member-avatar">
            <img src="@/assets/about/probe_orange-128.png" class="logo-badge" />
          </div>

          <div class="member-summary">
            <div class="member-name">Thibaud</div>
            <div class="member-title">Arch Builder</div>
          </div>
        </div>

        <div
          class="member-description"
        >Shoulders hunched over the keyboard, this little probe tirelessly builds world upon world, animating them with stories, quests and possibilities. It mostly beeps in English, though occasionally some of the instructions come out in French. Every once in a while, it coughs a little.</div>

        <div class="member-twitter">
          <a href="https://twitter.com/@thibaudm">
            @thibaudm
            <img src="@/assets/about/Twitter_Social_Icon_Circle_Color.svg" width="16px" />
          </a>
        </div>
      </div>

      <!-- Patrick -->
      <div class="team-member">
        <div class="member-top">
          <div class="member-avatar circle-avatar">
            <img src="@/assets/about/arch_pat-128.png" class="logo-badge" />
          </div>

          <div class="member-summary">
            <div class="member-name">Patrick</div>
            <div class="member-title">Designer, Builder, General Nerd</div>
          </div>
        </div>

        <div
          class="member-description"
        >Longtime student of fantasy gaming in its many wondrous forms, from Baldur’s Gate to Chrono Trigger to Magic: the Gathering. Interests include min/maxing, raiding Naxxramas, long walks on the beach, and being just a little too competitive about things that don’t matter.</div>

        <div class="member-twitter">
          <a href="https://twitter.com/@patpatomalley">
            @patpatomalley
            <img
              src="@/assets/about/Twitter_Social_Icon_Circle_Color.svg"
              width="16px"
            />
          </a>
        </div>
      </div>
    </div>

    <h2>Help Wanted</h2>

    <p>Whether you are interested in Written Realm's technology or want to get involved with game design and world building, now is a great time for it. The platform has only recently started to mature, remaining for the time being quite malleable. This is an ambitious project that is now in a phase where contributors can make a tremendous impact.</p>

    <h3>Wanted: Builders</h3>

    <p>Written Realms comes with a web-based world editor that can be used to create single and multi-player worlds. With it, you can create rooms, items, mobs, loaders and quests to create immersive narratives, puzzles and interactions.</p>

    <p>If you would like to build your own world or help us create our featured multi-player realm, The Unbroken World, please contact us on Discord.</p>

    <h3>Wanted: Coders</h3>

    <p>Written Realms is built on top of a number of open source components.</p>

    <p>
      The game engine itself is written in
      <a href="https://www.python.org/">Python</a>, storing the live game data in a
      <a href="http://redis.io/">Redis</a> Database. The game's "definition data", in other words the templates, configuration data and saved player data, is stored in
      <a
        href="https://www.postgresql.org/"
      >Postgres</a> and made available as a RESTful API via
      <a href="https://www.djangoproject.com/">Django</a>.
    </p>

    <p>
      The exchange of messages between the
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
      >WebSockets</a> connections and the various processes managing the game's life cycle (combat, zone loading, population control) is handled by
      <a
        href="http://zeromq.org/"
      >ZeroMQ</a>, and the websocket connections themselves are managed by
      <a
        href="http://www.tornadoweb.org/en/stable/"
      >Tornado</a>.
    </p>

    <p>
      The front-end is responsive, written with
      <a href="https://vuejs.org/">Vue.js</a> and
      <a href="https://sass-lang.com/">Sass</a> to render at viewports as small as 375 pixels.
    </p>

    <p>If any of the above sounds interesting to you, and if you'd like to contribute, make suggestions or even just hear more, please contact us on Discord.</p>

    <h2>Contact</h2>

    <p>
      If you have game-related questions, have game feedback, or would like to say hi, drop by our Discord channel here:
      <a
        href="https://discord.gg/a3u82tR"
      >https://discord.gg/a3u82tR</a>
    </p>

    <p>
      E-mail contact:
      <a href="mailto:contact@writtenrealms.com">contact@writtenrealms.com</a>
    </p>
  </div>
</template>

<script lang='ts' setup>
</script>

<style lang='scss'>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.about {
  h2 {
    margin: 10px 0;
  }
  h3 {
    margin-bottom: 5px;
  }

  .team {
    display: flex;
    flex-direction: row;

    @media ($mobile-site) {
      //@include media-breakpoint-down(xs) {
      flex-direction: column;
    }

    .team-member {
      flex: 1 0;
      padding: 30px;

      .member-top {
        display: flex;
        margin-bottom: 15px;

        .member-avatar {
          margin-right: 20px;

          flex-grow: 0;
          width: 64px;
          height: 64px;

          img {
            width: 64px;
            height: 64px;
          }

          &.circle-avatar > img {
            border-radius: 50%;
          }
        }

        .member-summary {
          flex-grow: 1;

          display: flex;
          flex-direction: column;
          justify-content: center;

          @include font-text-regular;
          .member-name {
          }
          .member-title {
            color: $color-text-hex-50;
          }
        }
      }

      .member-twitter {
        margin-top: 15px;
        img {
          margin-left: 7px;
          width: 16px;
        }
      }
    }
  }
}
</style>