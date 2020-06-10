import Vue from "vue";

const EventBus = new Vue();

export default EventBus;

/*
  Events:
  - cooldown-start (message_data)
  - cooldown-adjustment (message_data)
  - new-message (message_data)
  - scroll-down (no args)

  Sample usage:
  import eventbus from "@/core/eventbus.ts";
  eventbus.$emit("scroll-down");
*/
