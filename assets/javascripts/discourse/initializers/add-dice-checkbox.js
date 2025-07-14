import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-comment-checkbox",
  initialize() {
    withPluginApi("0.8.7", (api) => {

      // 1. 저장 시 값 전달
      api.addComposerSaveOptionsCallback((model, saveOptions) => {
        if (model.creatingTopic) {
          saveOptions.dice_only = model.dice_only;
          saveOptions.dice_max = model.dice_max;
        }
      });

      // 2. composer model 확장 및 DOM 삽입
      api.modifyClass("controller:composer", {
        pluginId: "discourse-dice-comment",
        didInsertElement() {
          this._super(...arguments);

          if (!this.model.creatingTopic) return;
          if (this.model.dice_only === undefined) this.model.dice_only = false;
          if (this.model.dice_max === undefined) this.model.dice_max = 100;

          setTimeout(() => {
            const composerFields = document.querySelector(".composer-fields");
            if (!composerFields || document.querySelector(".dice-only-wrapper")) return;

            const wrapper = document.createElement("div");
            wrapper.className = "dice-only-wrapper";
            wrapper.innerHTML = `
              <label>
                <input type="checkbox" class="dice-only-checkbox" />
                주사위댓글 전용
              </label>
              <input type="number" class="dice-max" value="${this.model.dice_max}" min="0" style="margin-left: 1em;">
            `;
            composerFields.appendChild(wrapper);

            wrapper.querySelector(".dice-only-checkbox").addEventListener("change", (e) => {
              this.model.dice_only = e.target.checked;
            });

            wrapper.querySelector(".dice-max").addEventListener("change", (e) => {
              this.model.dice_max = parseInt(e.target.value, 10);
            });
          }, 100);
        },
      });
    });
  },
};
