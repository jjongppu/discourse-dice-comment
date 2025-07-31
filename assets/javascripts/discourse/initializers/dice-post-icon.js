import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-indicator",
  initialize() {
    withPluginApi("1.2.0", (api) => {
      api.decorateWidget("post-controls:after", (helper) => {
        const post = helper.getModel();

        if (post?.custom_fields?.is_dice === "t") {
          return helper.h("span.dice-indicator", "🎲 다이스");
        }

        return null;
      });
    });
  },
};
