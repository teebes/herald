<template>
  <div v-if="loader" id="loader-details">
    <h2 class="entity-title">{{ loader.name }}</h2>

    <div class="basic-info">
      <div class="description">
        <div v-if="loader.description">{{ loader.description }}</div>
        <div v-else>Loader has no description.</div>
      </div>
      <div class="loader-condition" v-if="loader.loader_condition">
        Condition:
        <code>{{ loader.loader_condition }}</code>
      </div>
      <div>
        <button class="btn-thin" @click="editInfo">EDIT</button>
        <button class="btn-thin" @click="onClickDelete">DELETE</button>
      </div>
    </div>

    <div class="config-and-rules flex">
      <div class="loader-rules hlist flex-2">
        <div class="rules-top hlist-header">
          <h3>RULES</h3>
          <div>
            <button class="btn-small" @click="onClickAdd">ADD</button>
          </div>
        </div>
        <LoaderRule
          class="hlist-item"
          v-if="adding"
          :rules="rules"
          :new_rule="true"
          @cancel="adding = false"
          @added="onNewRule"
        />
        <template v-if="rules && rules.length">
          <LoaderRule
            class="hlist-item"
            v-for="rule in rules"
            :key="rule.id"
            :rule="rule"
            :rules="rules"
            @input="onRuleChange"
            @remove="onRuleRemove"
          />
        </template>
        <template v-else-if="!adding">
          <div class="hlist-item color-text-50">
            <div>Rules are directives to load templates (items or mobs) into the world.</div>
            <div>A rule can target a room, a zone, a path, or the output of a previous rule.</div>
            <div class="mt-4">To start using loaders, add a rule.</div>
          </div>
        </template>
      </div>

      <div class="config flex-1">
        <div class="respawn-frequency hlist">
          <div class="hlist-header">
            <h3>RESPAWN FREQUENCY</h3>
          </div>
          <div class="hlist-item">
            <label>
              <input type="checkbox" :checked="respawns" @input="onChangeRespawns" />
              Respawns
            </label>

            <div class="respawn-wait mt-2" v-if="respawns">
              <div>
                <span
                  v-if="loader.respawn_wait"
                >Wait {{ loader.respawn_wait }} seconds before respawning.</span>
                <span v-else>Respawns immediately.</span>
              </div>
              <button class="btn-thin" @click="editRespawns">EDIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import ZoneView from "@/components/builder/zone/ZoneView";
import axios from "axios";
import {
  BUILDER_ACTIONS,
  BUILDER_MUTATIONS,
  UI_MODALS,
  UI_MUTATIONS
} from "@/constants";
import InColumnList from "@/components/incolumnlist/List.vue";
import { BUILDER_FORMS } from "@/core/forms.ts";
import LoaderRule from "./LoaderRule.vue";

@Component({
  components: {
    LoaderRule
  }
})
export default class extends Mixins(ZoneView) {
  adding: boolean = false;
  rules: any = null;

  // So that when we re-check the respawns checkbox we return to
  //

  get respawns() {
    return this.$store.state.builder.zones.loader.respawn_wait >= 0;
  }

  get loader() {
    return this.$store.state.builder.zones.loader;
  }

  async mounted() {
    const world_id = this.$route.params.world_id;
    const loader_id = this.$route.params.loader_id;

    const loader_promise = this.$store.dispatch(
      "builder/zones/loader_fetch",
      loader_id
    );
    const rules_promise = axios.get(
      `/builder/worlds/${world_id}/loaders/${loader_id}/rules/?page_size=100`
    );

    const [loader_resp, rules_resp] = await Promise.all([
      loader_promise,
      rules_promise
    ]);

    this.rules = rules_resp.data.results;
  }

  editInfo() {
    const entity = this.loader;
    const modal = {
      title: `Loader ${entity.id}`,
      data: entity,
      schema: BUILDER_FORMS.LOADER_INFO,
      action: "builder/zones/loader_save",
      name: UI_MODALS.LOADER_INFO
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  editRespawns() {
    const entity = this.loader;
    const modal = {
      data: entity,
      schema: [
        {
          attr: "respawn_wait",
          label: "Respawn Wait",
          help: "How long to wait before re-running this loader, in seconds."
        }
      ],
      action: "builder/zones/loader_save",
      name: UI_MODALS.LOADER_INFO
    };
    this.$store.commit(UI_MUTATIONS.MODAL_SET, modal);
  }

  onChangeRespawns(event) {
    const checked = event.target.checked;
    if (!checked) {
      this.$store.dispatch("builder/zones/loader_save", {
        respawn_wait: -1
      });
    } else {
      this.$store.dispatch("builder/zones/loader_save", {
        respawn_wait: 300
      });
    }
  }

  onClickAdd() {
    this.adding = true;
  }

  async onClickDelete() {
    const loader_id = this.loader.id;

    const c = confirm(`Are you sure you want to delete Loader ${loader_id}?`);
    if (!c) return;

    await this.$store.dispatch("builder/zones/loader_delete");
    this.$store.commit(
      UI_MUTATIONS.SET_NOTIFICATION,
      `Deleted Loader ${loader_id}`
    );
  }

  onNewRule(rule) {
    this.rules.push(rule);
    this.adding = false;
  }

  onRuleChange(rule) {
    const index = this.rules.findIndex(r => r.id == rule.id);
    if (index === -1) return;
    this.rules.splice(index, 1, rule);
  }

  onRuleRemove(rule) {
    const index = this.rules.findIndex(r => r.id == rule.id);
    if (index === -1) return;
    this.rules.splice(index, 1);
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

#loader-details {
  width: 100%;

  .basic-info {
    margin-bottom: 40px;

    .description {
      margin-top: 10px;
      color: $color-text-hex-50;
    }
  }

  @media ($desktop-site) {
    .config-and-rules {
      .config {
        margin-left: 30px;
      }
      .loader-rules {
        margin-right: 30px;
      }
    }
  }

  @media ($mobile-site) {
    .config-and-rules {
      flex-direction: column;

      .config {
        order: 1;
        margin-bottom: 40px;
      }

      .loader-rules {
        order: 2;
      }
    }
  }
}
</style>
