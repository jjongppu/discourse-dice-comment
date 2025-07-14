import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-comment-checkbox",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      // 1. 저장 시 custom_fields로 값 전달
      api.modifyClass("controller:composer", {
        pluginId: "discourse-dice-comment",

        actions: {
          publish() {
            if (this.model.action === "createTopic") {
              this.model.set("dice_only", this.model.dice_only ?? false);
              this.model.set("dice_max", this.model.dice_max ?? 100);
            }
            return this._super(...arguments);
          },
        },

        init() {
          this._super(...arguments);
          if (this.model.creatingTopic) {
            if (this.model.dice_only === undefined) this.model.dice_only = false;
            if (this.model.dice_max === undefined) this.model.dice_max = 100;
          }
        },
      });

      // 2. composer UI에 요소 삽입 (위젯 기반)
      api.decorateWidget("composer-fields:after", (helper) => {
        const model = helper.widget.model;
        if (model.action !== "createTopic") return;

        const checkbox = helper.h("label.dice-only", [
          helper.h("input.dice-only-checkbox", {
            type: "checkbox",
            checked: model.dice_only,
            onchange: (e) => (model.dice_only = e.target.checked),
          }),
          helper.h("span", helper.widget._t("dice_comment.checkbox")),
        ]);

        const maxInput = model.dice_only
          ? helper.h("input.dice-max", {
              type: "number",
              value: model.dice_max,
              min: 0,
              onchange: (e) => (model.dice_max = parseInt(e.target.value, 10)),
            })
          : null;

        return helper.h("div.dice-only-wrapper", [checkbox, maxInput]);
      });
    });
  },
};
