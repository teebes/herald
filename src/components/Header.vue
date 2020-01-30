<template>
  <div id="header">
    <div class="header-view">
      <div class="logo">
        <router-link to="/home">
          <img alt="Written Realms logo" src="../assets/logo/logo-black.svg" class="logo-badge" />
          <img alt="Written Realms text" src="../assets/logo/written-realms.svg" class="logo-title" />
        </router-link>
        <!-- <a href="/" v-else>
          <img alt="Written Realms logo" src="../assets/logo/logo-black.svg" class="logo-badge" />
          <img alt="Written Realms text" src="../assets/logo/written-realms.svg" class="logo-title" />
        </a>-->
      </div>

      <div class="menu" v-if="showMenu">
        <template v-if="isAuthenticated">
          <router-link to="/lobby" :class="{ 'selected': isActive('lobby') }">Worlds</router-link>
          <a href="#" @click.prevent="editAccount">Account</a>
          <a href="https://docs.writtenrealms.com">Docs</a>
          <!-- <router-link to="/help" :class="{ 'selected': isActive('help') }">Help</router-link> -->
          <a href="#" @click.prevent="logout">Log Out</a>
        </template>

        <template v-else>
          <router-link to="/login">Log In</router-link>
          <router-link to="/signup">Sign Up</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AUTH_ACTIONS, AUTH_MUTATIONS } from "@/constants";
import { mapGetters } from "vuex";
import { UI_MUTATIONS } from "@/constants";
import { FormElement, FIRST_NAME, LAST_NAME } from "@/core/forms";

@Component({
  computed: mapGetters(["isAuthenticated"])
})
export default class Header extends Vue {
  get isDev() {
    if (window.location.href.indexOf("localhost") >= 0) return true;
    return false;
  }

  async logout() {
    this.$store.dispatch("auth/logout");
    this.$router.push({ name: "home" });
  }

  get showMenu() {
    // Hide the menu if we're in the complete world screen
    if (this.$route.name === "lobby_world_complete_signup") return false;
    return true;
  }

  isActive(section) {
    if (section === "help") {
      if (this.$route.fullPath.startsWith("/help/")) return true;
      else return false;
    }

    if (this.$route.name === section) {
      return true;
    }

    return false;
  }

  editAccount() {
    const SEND_NEWSLETTER: FormElement = {
      attr: "send_newsletter",
      label:
        "Receive infrequent (less than monthly) updates about new game features.",
      widget: "checkbox"
    };

    const ACCESSIBILITY: FormElement = {
      attr: "accessibility_mode",
      label: "Use Accessibility Layout",
      widget: "checkbox"
    };

    const USE_GRAPEVINE: FormElement = {
      attr: "use_grapevine",
      label: "Use Grapevine",
      widget: "checkbox"
    };

    const edit_account_schema = [
      {
        attr: "name",
        label: "Username"
      },
      {
        children: [FIRST_NAME, LAST_NAME]
      },
      SEND_NEWSLETTER,
      ACCESSIBILITY,
      USE_GRAPEVINE
    ];

    const modal = {
      data: this.$store.state.auth.user,
      title: this.$store.state.auth.user.email,
      schema: edit_account_schema,
      action: "auth/account_save"
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";

#header {
  background-color: $color-background-header;

  .header-view {
    max-width: $site-max-width;
    box-sizing: border-box;
    margin: 0 auto;
    height: 80px;
    padding: 0 15px;

    @media ($mobile-site) {
      height: 50px;
    }

    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      a {
        text-decoration: none;
      }

      .logo-title {
        margin-bottom: 2px;
        margin-left: 3px;

        @media ($mobile-site) {
          display: none;
        }
      }
    }

    .menu {
      text-align: right;

      @media ($mobile-site) {
        text-align: center;
      }

      a {
        @include font-title-light;
        font-size: 18px;
        color: $color-text;
        line-height: 18px;
        margin-left: 1em;
        opacity: 0.3;

        &:hover {
          color: $color-primary;
          opacity: 1;
          text-decoration: underline;
        }

        &.selected {
          color: $color-text;
          opacity: 1;

          &:hover {
            cursor: default;
            text-decoration: none;
          }
        }

        // &.is_active {
        //   color: $color-text !important;
        // }
      }
    }
  }
}
</style>
