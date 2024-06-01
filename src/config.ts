/*
const defaultConfig = {
  API_BASE: 'https://writtenrealms.com/forge/api/v1/',
  FORGE_WS_URI: 'wss://writtenrealms.com/ws/forge/',
  INTRO_WORLD_ID: "217",
  MAP_CONFIG: {
    UNIT: 8
  }
};

let localConfig = {};

if (process.env.NODE_ENV === 'local') {
  try {
    localConfig = require('./config.local');
    console.log(localConfig);
  } catch (e) {
    console.log('no ;')
    console.warn('Local configuration file not found, using default configuration.');
  }
}

const config = { ...defaultConfig, ...localConfig };

export const { API_BASE, FORGE_WS_URI, INTRO_WORLD_ID, MAP_CONFIG } = config;
*/

export const API_BASE = import.meta.env.VITE_API_BASE;
export const FORGE_WS_URI = import.meta.env.VITE_FORGE_WS_URI;
export const INTRO_WORLD_ID = "217";
export const MAP_CONFIG = {
  UNIT: 8
};
