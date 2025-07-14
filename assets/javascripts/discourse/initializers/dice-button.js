import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-comment-button",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateWidget("topic-footer-main-buttons:after", (helper) => {
        const topic = helper.getModel();
        if (!topic?.dice_only) return;

        const button = helper.h(
          "button",
          {
            className: "btn btn-primary roll-dice",
            onclick: () => {
              fetch(`/dice/roll-dice/${topic.id}.json`, { method: "POST" }).then(
                () => window.location.reload()
              );
            },
          },
          "🎲 주사위!"
        );

        return helper.h("div.dice-comment-buttons", [button]);
      });
    });
  },
};
