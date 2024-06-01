<template>
  <div class="room-actions" ref="outsideClickRef">
    <template v-for="directionData in directionDataList" :key="directionData.direction">
      <div>
        <div
          class="room-action"
          :direction="directionData.direction"
          :action="directionData.action"
          @click="onClickRoomAction(directionData.direction, directionData.action)"
        >
          <span v-if="directionData.canCreate">Create new room</span>
          <span v-else-if="directionData.canDisconnect">Unlink room</span>
          <span v-else>Link room</span>
        </div>

        <div
          class="room-connection"
          :direction="directionData.direction"
          type="one-way"
          v-if="directionData.isOneWay"
        ></div>

        <div
          class="room-connection"
          :direction="directionData.direction"
          type="two-way"
          v-if="directionData.isTwoWay"
        ></div>

        <div
          class="room-plus-sign hover"
          :direction="directionData.direction"
          @click="onClickPlusSign(directionData.direction)"
        ></div>

        <div :class="'room-plus-actions-' + directionData.direction + '-region'">
          <div
            class="room-plus-actions"
            :direction="directionData.direction"
            v-if="plusActions[directionData.direction]"
            ref="open_actions"
          >
            <div
              class="room-plus-action make-one-way"
              v-if="directionData.canOneWay"
              @click="onClickRoomAction(directionData.direction, 'one_way')"
            >make one-way</div>
            <div
              class="room-plus-action make-two-way"
              v-if="directionData.isOneWay"
              @click="onClickRoomAction(directionData.direction, 'two_way')"
            >make two-way</div>
            <div
              class="room-plus-action goto-exit"
              v-if="directionData.canDisconnect"
              @click="onClickRoomAction(directionData.direction, 'goto_exit')"
            >go to exit</div>
            <div
              class="room-plus-action set-room-exit"
              @click="onClickRoomAction(directionData.direction, 'set_exit')"
            >set room exit</div>
            <div
              class="room-plus-action set-door"
              @click="onClickRoomAction(directionData.direction, 'set_door')"
              v-if="directionData.canDisconnect"
            >set door</div>
            <div
              class="room-plus-action clear-door"
              v-if="room.doors && room.doors[directionData.direction]"
              @click="onClickRoomAction(directionData.direction, 'clear_door')"
            >clear door</div>
          </div>
        </div>
      </div>
    </template>

    <div class="up-label">Up</div>
    <div class="up-down-line">|</div>
    <div class="down-label">Down</div>
    <div class="center"></div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { DIRECTIONS } from "@/constants";
import { DIRECTION } from "@/core/forms.ts";
import { onOutsideClick } from "@/composables/onOutsideClick";

const store = useStore();
const route = useRoute();
const router = useRouter();

const plusActions = ref({});

const room = computed(() => store.state.builder.room);

const directionDataList = computed<any[]>(() => {
  let directionsData: {}[] = [];
  for (const direction in DIRECTIONS) {
    let data = {
      direction: direction,
      ...store.getters["builder/getDirectionActions"](
        store.state.builder.room,
        direction
      ),
      action: "",
      isOneWay: false,
      isTwoWay: false
    };

    if (data.canCreate) {
      data.action = "create";
    } else if (data.canConnect) {
      data.action = "connect";
    } else if (data.canDisconnect) {
      data.action = "disconnect";
      if (data.canOneWay) {
        data.isTwoWay = true;
      } else {
        data.isOneWay = true;
      }
    }
    directionsData.push(data);
  }
  return directionsData;
});

const outsideClickRef = onOutsideClick(() => {
  plusActions.value = {};
});

const onClickPlusSign = (direction) => {
  if (plusActions.value[direction]) {
    plusActions.value = {};
  } else {
    plusActions.value = {};
    plusActions.value[direction] = true;
  }
};

const onClickRoomAction = async (direction, action) => {
  plusActions.value = {};
  const ROOM_ACTION = "builder/room_dir_action";

  if (action == "connect" || action == "two_way") {
    await store.dispatch(ROOM_ACTION, {
      direction: direction,
      action: "set_mutual_exit"
    });
  } else if (action == "disconnect") {
    await store.dispatch(ROOM_ACTION, {
      direction: direction,
      action: "set_no_exit"
    });
  } else if (action == "one_way") {
    await store.dispatch(ROOM_ACTION, {
      direction: direction,
      action: "set_one_way"
    });
  } else if (action == "create") {
    const resp_data = await store.dispatch(ROOM_ACTION, {
      direction: direction,
      action: "create_room"
    });

    const new_room = resp_data["exit"];
    store.dispatch('builder/room_select', new_room);

    router.push({
      name: 'builder_room_index',
      params: {
        world_id: route.params.world_id,
        //zone_id: route.params.zone_id,
        room_id: new_room.id
      }
    });
  } else if (action == "set_exit") {
    const modal = {
      title: `${direction} exit`,
      data: store.state.builder.room,
      schema: [
        {
          attr: direction,
          label: direction,
          widget: "reference",
          references: "room"
        }
      ],
      action: "builder/room_save"
    };
    store.commit('ui/modal/open_form', modal);
  } else if (action == "goto_exit") {
    const exit_room_id = store.state.builder.room[direction].id;
    router.push({
      name: 'builder_room_index',
      params: {
        world_id: route.params.world_id,
        room_id: exit_room_id
      }
    });
  } else if (action === "set_door") {
    let data, title;
    if (store.state.builder.room.doors[direction]) {
      data = store.state.builder.room.doors[direction];
      title = `Edit ${direction} Door`;
    } else {
      data = store.state.builder.room.doors[direction] || {
        name: "door",
        direction: direction,
        default_state: "closed",
        key: null,
        destroy_key: false
      };
      title = `Add ${direction} Door`;
    }

    // Make the direction element readonly
    const direction_schema = { ...DIRECTION };
    direction_schema.readonly = true;

    const modal = {
      action: "builder/door_set",
      title: title,
      data: data,
      schema: [
        {
          attr: "name",
          label: "Name"
        },
        direction_schema,
        {
          attr: "default_state",
          label: "Default State",
          options: [
            {
              value: "open",
              label: "Open"
            },
            {
              value: "closed",
              label: "Closed"
            },
            {
              value: "locked",
              label: "Locked"
            }
          ]
        },
        {
          attr: "key",
          label: "Door Key",
          widget: "reference",
          references: "item_template",
          context: "key"
        },
        {
          attr: "destroy_key",
          label: "Destroy key on use",
          widget: "checkbox"
        }
      ]
    };
    store.commit('ui/modal/open_form', modal);
  } else if (action === "clear_door") {
    store.dispatch("builder/door_clear", direction);
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.room-actions {
  //border: 1px solid white;
  position: relative;
  height: 137px;
  width: 228px;

  @media ($mobile-site) {
    margin: 0 auto;
  }

  margin-top: 30px !important;
  @media ($desktop-site) {
    margin-left: 22px;
    margin-top: 50px !important;
  }

  .room-action {
    background: $color-primary;
    color: white;

    &[action="create"] {
      background: $color-text;
      color: $color-text-dark;
    }
    height: 39px;
    width: 39px;

    text-align: center;
    position: absolute;

    // For vertical align
    line-height: 39px;

    span {
      font-size: 10px;
      line-height: 10px;
      // For vertical align
      display: inline-block;
      vertical-align: middle;
    }

    &[direction="north"] {
      left: 49px;
    }
    &[direction="south"] {
      left: 49px;
      top: 98px;
    }
    &[direction="east"] {
      left: 98px;
      top: 49px;
    }
    &[direction="west"] {
      top: 49px;
    }
    &[direction="up"] {
      left: 198px;
      top: 9px;
    }
    &[direction="down"] {
      left: 198px;
      top: 89px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .up-label,
  .down-label,
  .up-down-line {
    position: absolute;
    font-size: 10px;
    line-height: 11px;
    opacity: 0.5;
    width: 39px;
    text-align: center;
    left: 198px;
  }
  .up-label {
    top: 51px;
  }
  .up-down-line {
    top: 64px;
  }
  .down-label {
    top: 76px;
  }

  .room-connection {
    position: absolute;
    width: 10px;
    height: 10px;

    &[direction="north"] {
      left: 64px;
      top: 39px;
      &[type="two-way"] {
        background: url("@/assets/builder/room-connection-two-way.png");
      }
      &[type="one-way"] {
        background: url("@/assets/builder/room-connection-one-way.png");
        transform: rotate(-90deg);
      }
    }

    &[direction="east"] {
      left: 88px;
      top: 64px;
      &[type="two-way"] {
        background: url("@/assets/builder/room-connection-two-way.png");
        transform: rotate(90deg);
      }
      &[type="one-way"] {
        background: url("@/assets/builder/room-connection-one-way.png");
      }
    }

    &[direction="south"] {
      left: 64px;
      top: 88px;
      &[type="two-way"] {
        background: url("@/assets/builder/room-connection-two-way.png");
      }
      &[type="one-way"] {
        background: url("@/assets/builder/room-connection-one-way.png");
        transform: rotate(90deg);
      }
    }
    &[direction="west"] {
      left: 39px;
      top: 64px;
      &[type="two-way"] {
        background: url("@/assets/builder/room-connection-two-way.png");
        transform: rotate(90deg);
      }
      &[type="one-way"] {
        background: url("@/assets/builder/room-connection-one-way.png");
        transform: rotate(180deg);
      }
    }
  }

  .room-plus-sign {
    position: absolute;
    background: url("@/assets/builder/room-actions-plus.png");
    height: 20px;
    width: 20px;

    &:hover {
      color: $color-primary;
    }

    &[direction="north"] {
      top: -12px;
      left: 59px;
    }
    &[direction="east"] {
      top: 58px;
      left: 129px;
    }
    &[direction="south"] {
      top: 129px;
      left: 59px;
    }
    &[direction="west"] {
      top: 58px;
      left: -12px;
    }
    &[direction="up"] {
      top: -3px;
      left: 209px;
    }
    &[direction="down"] {
      top: 120px;
      left: 209px;
    }
  }

  .room-plus-actions {
    position: absolute;
    width: 137px;
    background: $color-background-light;
    border: 1px solid #333;
    border-top: 0px;
    @include font-text-light;
    font-size: 13px;
    line-height: 26px;
    z-index: 1000;
    box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.3);

    .room-plus-action {
      border-top: 1px solid #333;
      padding-left: 8px;
      &:hover {
        cursor: pointer;
        color: $color-primary;
      }
    }

    &::before {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
    }

    &[direction="north"] {
      bottom: 157px;
      &::before {
        border-top: 8px solid #333;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 58px;
        bottom: -9px;
      }
    }
    &[direction="east"] {
      bottom: 54px;
      left: 157px;
      &::before {
        border-top: 10px solid transparent;
        border-right: 8px solid #333;
        border-bottom: 10px solid transparent;
        left: -9px;
        bottom: 3px;
      }
    }
    &[direction="south"] {
      top: 157px;
      &::before {
        border-bottom: 8px solid #333;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 58px;
        top: -8px;
      }
    }
    &[direction="west"] {
      bottom: 54px;
      left: -160px;
      &::before {
        border-top: 10px solid transparent;
        border-left: 8px solid #333;
        border-bottom: 10px solid transparent;
        left: 136px;
        bottom: 3px;
      }
    }
    &[direction="up"] {
      bottom: 148px;
      left: 150px;
      &::before {
        border-top: 8px solid #333;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 58px;
        bottom: -9px;
      }
    }
    &[direction="down"] {
      top: 149px;
      left: 150px;
      &::before {
        border-bottom: 8px solid #333;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        left: 58px;
        top: -8px;
      }
    }
  }

  .center {
    left: 49px;
    top: 49px;
    height: 39px;
    width: 39px;
    position: absolute;
    border: 3px solid $color-text;
  }
}
</style>