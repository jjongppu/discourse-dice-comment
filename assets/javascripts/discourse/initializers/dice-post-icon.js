// dice-post-icon.js
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-icon",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      api.decorateWidget("post-contents:after", (dec) => {
        const post = dec.getModel();

        if (post.custom_fields?.is_dice) {
          return dec.h("div.dice-post-icon", { title: "주사위 댓글" }, "🎲 이 댓글은 주사위로 생성됐어요!");
        }

        return null;
      });
    });
  },
};
