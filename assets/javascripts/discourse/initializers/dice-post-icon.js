import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-icon",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateWidget("post-menu:before", (helper) => {
        const post = helper.getModel && helper.getModel();
        if (post?.custom_fields?.is_dice?.toString() === "true") {
          return helper.h("span.dice-post-icon", "\u{1F3B2}");
        }
      });
    });
  },
};
