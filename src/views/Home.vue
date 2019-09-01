<template>
  <div class="front-page" ref="frontpage">
    <div class="container-fluid">
      <div class="top-section" style="display: auto">
        <div class="gradient-background"></div>

        <div class="top-logo">
          <img src="@/assets/logo/logo-black-tower.svg" class="logo-badge" />
          <img src="@/assets/logo/written-realms-black.svg" class="logo-title" />
        </div>

        <div class="top-actions">
          <template v-if="this.$store.getters.isAuthenticated">
            <router-link to="/lobby" class="lobby">Lobby</router-link>
            <a href="#" @click.prevent="logout">Log Out</a>
          </template>
          <template v-else>
            <router-link :to="loginLink" class="login">Log In</router-link>
            <router-link :to="signupLink" class="signup">Sign Up</router-link>
          </template>
        </div>

        <div class="town" :style="{backgroundPosition: townPos}"></div>
        <div class="mountains" :style="{backgroundPosition: mountainPos}"></div>
        <div class="rocks"></div>

        <div class="center">
          <div class="subtext font-text-light">Immersive text-based adventure games</div>
          <button class="play-demo btn btn-medium" @click="play">PLAY</button>
          <div class="cross-platform">
            <span class="chrome-logo">&nbsp;</span> Works in your browser
          </div>
        </div>
      </div>

      <div class="lead">
        <div
          class="first-paragraph"
        >WrittenRealms are interactive fiction games. To play through a small introduction world, click the Play button above. Once you fight your way out of the cave, you will be taken to the multiplayer world, where more adventure awaits.</div>

        <div class="highlights">
          <div
            class="highlight"
          >Free to play! no ads, no paywalls, no annoying popups. Let yourself get fully immersed in another world.</div>

          <div
            class="highlight"
          >Features a rich combat system with three playable classes, each with distinct skills and character customizations.</div>

          <div
            class="highlight"
          >Play on any device, anywhere: the game offers a different layout and interface for desktop and mobile.</div>

          <div
            class="highlight"
          >Different worlds to progress through, some singleplayer and some multiplayer. You can even build your own.</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="augmented-ui">
        <div class="aui-title">A powerful augmented text interface</div>

        <div
          class="aui-subtitle"
        >Written Realms provides a helpful User Interface that augments the text and makes it more easily interactable via pointer or touch controls.</div>
      </div>

      <div class="features">
        <div class="game-feature">
          <div class="feature-box-wrapper">
            <div class="feature-box aui-map">
              <div class="arrow arrow-1"></div>
            </div>
          </div>

          <div class="feature-text">
            <div>Interactive map: find your way across the worlds with a visual map that updates itself everytime you move.</div>
          </div>
        </div>

        <div class="game-feature">
          <div class="feature-box-wrapper">
            <div class="feature-box aui-text-popups">
              <div class="arrow arrow-2"></div>
            </div>
          </div>

          <div class="feature-text">
            <div>Text popups: hover, click or tap over significant blocks of text to view contextual information and actions.</div>
          </div>
        </div>

        <div class="game-feature">
          <div class="feature-box-wrapper">
            <div class="feature-box aui-combat">
              <div class="arrow arrow-3"></div>
            </div>
          </div>

          <div class="feature-text">
            <div>Assisted combat: use the action bar, aliases or hotkeys to trigger abilities and skills.</div>
          </div>
        </div>

        <div class="game-feature">
          <div class="feature-box-wrapper">
            <div class="feature-box aui-world-editor">
              <div class="arrow arrow-4"></div>
            </div>
          </div>
          <div class="feature-text">
            <div>Build your own worlds: powerful World Editor interface, no programming needed!</div>
          </div>
        </div>
      </div>

      <div class="bottom-cta">
        <div class="cave">
          <div class="cave-text">Try it</div>
          <div>
            <button class="play-demo btn btn-medium">PLAY</button>
          </div>
        </div>
      </div>

      <!--
      <div class='quote'>
          <div class='quote-text'>"This platform has so much potential"</div>
          <div class='quote-author'>Teebes</div>
      </div>
      -->

      <div class="patreon">
        <div class="callout-text">Loving Written Realms?</div>
        <div class="patreon-button">
          <a href="https://www.patreon.com/bePatron?u=17624243">
            <img src="@/assets/patreon/become_a_patron_button@2x.png" width="216px" />
          </a>
        </div>

        <div class="current-patrons">
          <div>Thank you to our generous Patrons, we are immensely grateful for your support:</div>
          <div class="patrons">
            <ul v-for="patron_group in patron_groups" :key="patron_groups.indexOf(patron_group)">
              <li v-for="patron in patron_group" :key="patron.id">{{ patron.name.toUpperCase() }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bottom-section">
        <img src="@/assets/logo/written-realms.svg" class="bottom-wr-title" />
        <div class="bottom-links">
          <a href="https://discord.gg/a3u82tR">
            <img src="@/assets/frontpage/Discord-Logo-Color.svg" width="24px" />
          </a>
          <router-link to="/about">About</router-link>
          <router-link to="/help">Help</router-link>
          <router-link to="/terms">Terms</router-link>
          <router-link to="/privacy">Privacy</router-link>
          <a href="https://twitter.com/Written_Realms">
            <img src="@/assets/about/Twitter_Social_Icon_Circle_Color.svg" width="16px" />
          </a>
        </div>
      </div>

      <div class="copyright">&copy; 2019 Morel Software, LLC</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import _ from "lodash";
import { LOGIN, LOBBY, SIGNUP } from "@/router";
import Intro from "@/components/game/Intro.vue";
import { UI_MUTATIONS } from "@/constants.ts";

@Component
export default class Home extends Vue {
  patrons: {}[] = [];
  patron_groups: [][] = [];

  townOffset: number = 0;
  mountainOffset: number = 0;

  townPos: string = "50% calc(50%)";
  mountainPos: string = "50% calc(50%)";

  get loginLink() {
    return { name: LOGIN };
  }

  get signupLink() {
    return { name: SIGNUP };
  }

  async created() {
    const patrons_promise = axios.get("/users/patrons/");
    const user_promise = axios.get("/user/");

    const promises = [patrons_promise, user_promise];

    // Since one of the promises might fail (the user fetching endpoint), we have to do a
    // little extra work in parsing the results.
    const results = await Promise.all(promises.map(p => p.catch(e => e)));
    const validResults = results.filter(result => !(result instanceof Error));

    if (validResults.length > 0) {
      const patrons_resp = validResults[0];
      this.patrons = patrons_resp.data.data;

      // Create groups of patrons
      const size = 3;
      for (let i = 0; i < this.patrons.length; i += size) {
        const group: any = this.patrons.slice(i, i + size);
        this.patron_groups.push(group);
      }
    }

    if (validResults.length > 1) {
      const user_resp = validResults[1];
      if (user_resp.status === 200) {
        this.$store.commit("auth/user_set", user_resp.data);
        if (this.$route.name == "home") {
          this.$router.push({ name: LOBBY });
          return;
        }
      }
    }

    window.addEventListener("scroll", this.onScroll);
  }

  async play() {
    this.$store.commit(UI_MUTATIONS.MODAL_SET, {
      component: Intro,
      options: {
        overlayClasses: ["opaque"]
      }
    });
    this.$store.dispatch("game/play");
  }

  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onScroll() {
    const scrollTop = window.scrollY;
    const townFactor = 3,
      mountainsFactor = 6;

    const townDistance = scrollTop / townFactor,
      mountainsDistance = scrollTop / mountainsFactor;

    this.townPos = `50% calc(50% + ${townDistance}px)`;
    this.mountainPos = `50% calc(50% + ${mountainsDistance}px)`;
  }

  async logout() {
    this.$store.dispatch("auth/logout");
    this.$router.push({ name: "home" });
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

$color-primary-frontpage: #d97600;
$breakpoint-up-sm: "min-width: 576px";
$breakpoint-up-md: "min-width: 768px";
$breakpoint-up-lg: "min-width: 992px";
$breakpoint-up-xl: "min-width: 1200px";

$breakpoint-down-xs: "max-width: 1199.98px";
$breakpoint-down-lg: "max-width: 991.98px";
$breakpoint-down-md: "max-width: 767.98px";
$breakpoint-down-sm: "max-width: 575.98px";

.front-page {
  margin: 0 auto;

  a:hover {
    text-decoration: none;
  }

  .divider {
    padding: 100px 0;
  }

  .container-fluid {
    max-width: 1400px;
    background: $color-text-dark;
    padding-left: 0;
    padding-right: 0;

    .play-demo {
      background: $color-primary-frontpage;
      width: 170px;
      padding: 1.1rem 1.5rem;
      font-size: 15px;
      letter-spacing: 0.92px;
      line-height: 12px;
      margin-top: 30px;
    }

    .top-section {
      position: relative;
      width: 100%;
      height: 950px;
      background: #ccc;

      .gradient-background {
        position: absolute;

        background: linear-gradient(
          to bottom,
          rgba(252, 238, 217, 1),
          rgba(245, 201, 131, 1) 80%
        );
        width: 100%;
        height: 100%;
      }

      .top-actions {
        @include font-title-regular;
        position: absolute;
        right: 10%;
        top: 30px;
        font-size: 19px;
        font-weight: 19px;
        line-height: 22px;

        a {
          color: $color-background;
          &:hover {
            color: $color-primary;
          }

          &.login,
          &.lobby {
            margin-right: 20px;
          }
        }
      }

      .top-logo {
        position: absolute;
        top: 30px;
        left: 10%;

        .logo-title {
          @media ($mobile-site) {
            display: none;
          }
        }

        .logo-badge {
          margin-right: 3px;
        }
      }

      text-align: center;

      .center {
        @include font-text-regular;

        color: $color-text-dark;
        position: absolute;
        top: 230px;
        width: 100%;
        padding: 0 15px;

        font-size: 30px;
        line-height: 42px;

        .cross-platform {
          color: $color-text-dark;
          opacity: 0.4;
          font-size: 13px;
          line-height: 18px;
          margin-top: 30px;

          .chrome-logo {
            background-image: url("~@/assets/frontpage/chrome-logo.png");
            background-size: 18px;
            height: 18px;
            width: 18px;
            display: inline-block;
          }
        }
      }

      .town {
        position: absolute;
        bottom: 50px;
        width: 100%;
        height: 459px;
        background-image: url("../assets/frontpage/town-8bit.png");
        background-size: 1440px;
        background-position: center;
        background-repeat: no-repeat;
      }

      .mountains {
        @media ($breakpoint-up-lg) {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 512px;

          background-image: url("../assets/frontpage/mountains-8bit.png");
          background-size: 1440px;
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      .rocks {
        position: absolute;
        bottom: -1px;
        height: 536px;
        width: 100%;
        background-image: url("../assets/frontpage/rocks-tree-8bit.png");
        background-position: right;
        background-repeat: no-repeat;
        background-size: 1440px;

        @media ($breakpoint-down-md) {
          background-position: right -50px bottom 0;
        }

        @media ($breakpoint-down-sm) {
          background-position: right -100px bottom 0;
        }

        @media ($breakpoint-down-xs) {
          background-position: right -150px bottom 0;
        }
      }
    }

    .features,
    .features-title {
      margin: 0 auto;
    }

    .lead {
      max-width: 950px;
      margin: 0 auto;
      padding: 0 10px;

      @include font-text-light;

      .first-paragraph {
        color: $color-secondary;
        line-height: 33px;

        font-size: 25px;

        @media ($breakpoint-down-md) {
          font-size: 23px;
        }
      }

      .highlights {
        margin-top: 30px;

        font-size: 18px;
        line-height: 27px;

        display: flex;
        flex-wrap: wrap;

        .highlight {
          width: 50%;
          flex-grow: 1;
          margin-top: 15px;
          padding: 0 25px 15px 0;
        }
      }
    }

    .augmented-ui {
      .aui-title {
        @include font-title-light;

        color: $color-secondary;
        line-height: 38px;
        text-align: center;
        font-size: 32px;

        @media ($breakpoint-down-md) {
          font-size: 28px;
        }

        margin-bottom: 15px;
      }

      .aui-subtitle {
        text-align: center;
      }
    }

    .features,
    .features-title,
    .features-subtitle {
      max-width: 1150px;
      margin: 0 auto;
    }

    .features-title {
      @include font-title-light;

      color: $color-secondary;
      line-height: 38px;
      text-align: center;

      font-size: 32px;
      @media ($breakpoint-down-md) {
        font-size: 28px;
      }
    }

    .features-subtitle {
      text-align: center;
      @include font-text-light;
      color: #f2f2f2;
      font-size: 19px;
      line-height: 29px;

      @media ($breakpoint-down-md) {
        font-size: 18px;
      }
    }

    .features {
      margin-top: 70px;
      padding: 0 20px;

      display: flex;
      flex-direction: row;
      @media ($breakpoint-down-md) {
        flex-direction: column;
      }
      flex-wrap: wrap;

      .game-feature {
        flex: 1;

        @media ($breakpoint-up-md) {
          flex-basis: 50%;
        }

        @media ($breakpoint-up-xl) {
          display: flex;
          flex-direction: row;
          &:nth-child(even) {
            flex-direction: row-reverse;
          }
          > div {
            flex: 1;
          }

          .feature-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            > div {
              padding: 40px;
            }
          }
        }
      }

      .feature-box {
        position: relative;

        height: 274px;
        width: 274px;
        border-radius: 137px;
        border: 11px solid rgba(35, 35, 35, 1);
        margin: 0 auto;
        margin-bottom: 50px;

        &.aui-map {
          background-image: url("../assets/frontpage/augmented-ui-map.jpg");
          background-size: 274px;
        }

        &.aui-text-popups {
          background-image: url("../assets/frontpage/augmented-ui-text-popups.jpg");
          background-size: 274px;
        }

        &.aui-world-editor {
          background-image: url("../assets/frontpage/augmented-ui-world-editor.jpg");
          background-size: 274px;
        }

        &.aui-combat {
          background-image: url("../assets/frontpage/augmented-ui-combat.jpg");
          background-size: 274px;
        }

        .arrow {
          position: absolute;
          top: 235px;
          left: 60px;

          @media ($breakpoint-up-xl) {
            right: -40px;
            top: 80px;
            left: auto;
          }

          &.arrow-1 {
            transform: rotate(130deg);
            background-image: url("../assets/frontpage/arrow-1.png");
            background-size: 92px;
            width: 92px;
            height: 37px;

            @media ($breakpoint-up-xl) {
              transform: rotate(0);
            }
          }

          &.arrow-2 {
            transform: rotate(-90deg);
            background-image: url("../assets/frontpage/arrow-2.png");
            background-size: 111px;
            width: 111px;
            height: 50px;
            @media ($breakpoint-up-xl) {
              transform: rotate(0);
              left: -40px;
              right: auto;
            }
          }

          &.arrow-3 {
            transform: rotate(130deg);
            background-image: url("../assets/frontpage/arrow-3.png");
            background-size: 85px;
            width: 85px;
            height: 53px;
            @media ($breakpoint-up-xl) {
              transform: rotate(0);
            }
          }

          &.arrow-4 {
            transform: rotate(-90deg);
            background-image: url("../assets/frontpage/arrow-4.png");
            background-size: 86px;
            width: 86px;
            height: 43px;
            @media ($breakpoint-up-xl) {
              transform: rotate(0);
              left: -40px;
              right: auto;
            }
          }
        }
      }

      .feature-text {
        font-weight: 18px;
        color: #f3f3f3;
        line-height: 27px;
        margin-bottom: 50px;

        @media ($breakpoint-down-sm) {
          text-align: center;
        }

        > div {
          max-width: 350px;
          margin: 0 auto;
          @media ($breakpoint-up-xl) {
            margin-top: 20px;
          }
        }
      }

      @media ($breakpoint-up-xl) {
        .xl-order-2 {
          order: 2;
        }
        .xl-order-1 {
          order: 1;
        }
      }
    }

    .bottom-cta {
      .cave {
        text-align: center;
        margin: 0 auto;
        background-position: center;
        background-repeat: no-repeat;

        background-image: url("../assets/frontpage/cave-335.png");
        width: 335px;
        height: 308px;
        background-size: 335px;

        @media ($breakpoint-up-md) {
          width: 685px;
          height: 308px;
          background-size: 685px;
          background-image: url("../assets/frontpage/cave-685.png");
        }
        @media ($breakpoint-up-xl) {
          width: 1156px;
          height: 468px;
          background-image: url("../assets/frontpage/cave.png");
          background-size: 1156px;
        }

        padding-top: 80px;
        @media ($breakpoint-up-xl) {
          padding-top: 180px;
        }

        .cave-text {
          @include font-title-regular;
          color: $color-text-dark;
          font-size: 32px;
          line-height: 38px;
        }
      }
    }

    .patreon {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 15px;

      .callout-text {
        color: $color-text-hex-70;
        margin-bottom: 1rem;
      }

      .current-patrons {
        margin-top: 100px;
        max-width: 375px;

        .patrons {
          margin-top: 1em;

          ul {
            margin: 0 0 10px 0;
            padding: 0;

            li {
              list-style-type: none;
              display: inline;
              color: $color-secondary;
              @include font-title-regular;
              font-size: 1.2em;

              &:not(:first-child):before {
                content: " \00a0 \25CF \00a0 \00a0";
                color: $color-text-hex-50;
                font-size: 1em;
              }
            }
          }
        }
      }
    }

    .quote {
      @include font-text-light;
      color: #f2f2f2;
      text-align: center;

      max-width: 418px;
      margin: 0 auto;

      margin-top: 70px;

      .quote-text {
        font-size: 28px;
        line-height: 37px;
      }

      .quote-author {
        opacity: 0.5;
        font-size: 20px;
        line-height: 26px;
      }
    }

    .bottom-section {
      padding: 100px 0 50px 0;

      display: flex;
      flex-direction: column;
      justify-content: center;

      a {
        //-webkit-font-smoothing: antialiased;
        color: $color-text-hex-40;
      }

      .bottom-wr-title {
        display: block;
        margin-bottom: 20px;
      }

      .bottom-links {
        display: flex;
        justify-content: center;

        a {
          margin: 0 1em;
          color: $color-text-hex-40;

          &:hover {
            color: $color-primary;
          }
        }
      }
    }

    .copyright {
      margin: 0 auto;
      padding-bottom: 30px;
      color: $color-text-hex-30;
      text-align: center;
    }
  }
}
</style>