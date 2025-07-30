import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-icon",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateWidget("post-menu:before", (helper) => {
        const post = helper.getModel && helper.getModel();
        if (post?.is_dice) {
          return helper.h(
            "li",
            { className: "dice-post-icon" },
            "🎲 주사위 댓글"
          );
        }
      });
    });
  },
};
