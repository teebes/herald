<template>
  <div v-if="loader" id="loader-details">
    <h2 class="entity-title">{{ loader.name }}</h2>

    <div class="basic-info mb-8">
      <div class="description mt-2 color-text-50">
        <div v-if="loader.description">{{ loader.description }}</div>
        <div v-else>Loader has no description.</div>
      </div>

      <div class="conditions mt-2" v-if="loader.conditions">
        <div class="color-text-50">This load will only run if the following condition(s) evaluate to true:</div>
        <code class="my-2">{{ loader.conditions }}</code>
      </div>

      <div class="loader-condition mt-2" v-if="loader.loader_condition">
        Zone data condition:<br/>
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

            <div class='mb-2'>
              <label>
                <input type="checkbox" :checked="loader.inherit_zone_wait" @input="onChangeInherit" />
                Inherit from Zone ({{ zone_respawn_wait_label }})
              </label>
            </div>

            <div v-if="!loader.inherit_zone_wait">
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
  </div>
  <div v-else>Loading...</div>
</template>

<script lang='ts' setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import axios from "axios";
import { BUILDER_FORMS } from "@/core/forms.ts";
import LoaderRule from "@/components/builder/zone/LoaderRule.vue";

const store = useStore();
const route = useRoute();

const adding = ref(false);
const rules = ref<any[]>([]);

const respawns = computed(() => store.state.builder.zones.loader.respawn_wait >= 0);
const loader = computed(() => store.state.builder.zones.loader);

onMounted(async () => {
  const world_id = route.params.world_id;
  const loader_id = route.params.loader_id;

  const loader_promise = store.dispatch("builder/zones/loader_fetch", loader_id);
  const rules_promise = axios.get(`/builder/worlds/${world_id}/loaders/${loader_id}/rules/?page_size=100`);

  const [, rules_resp] = await Promise.all([loader_promise, rules_promise]);

  rules.value = rules_resp.data.results;
});

const zone_respawn_wait_label = computed(() => {
  const zone_wait = store.state.builder.zones.loader.zone_wait;
  if (!zone_wait) {
    return "respawn immediately";
  } else if (zone_wait === -1) {
    return "never respawn";
  } else {
    return `wait ${zone_wait} seconds`;
  }
});

const editInfo = () => {
  const entity = loader.value;
  const modal = {
    title: `Loader ${entity.id}`,
    data: entity,
    schema: BUILDER_FORMS.LOADER_INFO,
    action: "builder/zones/loader_save",
    name: 'modal_loader_info'
  };
  store.commit('ui/modal/open_form', modal);
};

const editRespawns = () => {
  const entity = loader.value;
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
    name: 'modal_loader_info'
  };
  store.commit('ui/modal/open_form', modal);
};

const onChangeRespawns = (event) => {
  const checked = event.target.checked;
  if (!checked) {
    store.dispatch("builder/zones/loader_save", {
      respawn_wait: -1
    });
  } else {
    store.dispatch("builder/zones/loader_save", {
      respawn_wait: 300
    });
  }
};

const onChangeInherit = (event) => {
  store.dispatch("builder/zones/loader_save", {
    inherit_zone_wait: event.target.checked
  });
};

const onClickAdd = () => {
  adding.value = true;
};

const onClickDelete = async () => {
  const loader_id = loader.value.id;

  const c = confirm(`Are you sure you want to delete Loader ${loader_id}?`);
  if (!c) return;

  await store.dispatch("builder/zones/loader_delete");
  store.commit('ui/notification_set', `Deleted Loader ${loader_id}`);
};

const onNewRule = (rule) => {
  rules.value.push(rule);
  adding.value = false;
};

const onRuleChange = (rule) => {
  const index = rules.value.findIndex(r => r.id == rule.id);
  if (index === -1) return;
  rules.value.splice(index, 1, rule);
};

const onRuleRemove = (rule) => {
  const index = rules.value.findIndex(r => r.id == rule.id);
  if (index === -1) return;
  rules.value.splice(index, 1);
};
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/fonts.scss";
@import "@/styles/layout.scss";

#loader-details {
  width: 100%;

  .basic-info { margin-bottom: 40px;  }

  @media ($desktop-site) {
    .config-and-rules {
      .config {
        margin-left: 30px;
      }
      .loader-rules {
        margin-right: 30px;
        flex: 2;
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
