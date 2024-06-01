import { Commit, Dispatch } from 'vuex';

export interface ActionMethods {
  commit: Commit;
  dispatch: Dispatch;
}