import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-comment-checkbox",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateWidget("composer-fields:after", (helper) => {
        const model = helper.widget.model;
        if (model.action !== "createTopic") return;

        const checkbox = helper.h("label.dice-only", [
          helper.h("input.dice-only-checkbox", {
            type: "checkbox",
            checked: model.dice_only || false,
            onchange: (e) => (model.dice_only = e.target.checked),
          }),
          helper.h("span", "주사위댓글 전용"),
        ]);

        return helper.h("div.dice-only-wrapper", [checkbox]);
      });
    });
  },
};
