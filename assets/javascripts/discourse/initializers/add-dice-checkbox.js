import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-comment-checkbox",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.modifyClass("controller:composer", {
        pluginId: "discourse-dice-comment",

        init() {
          this._super(...arguments);
          if (this.creatingTopic) {
            if (this.model.dice_only === undefined) {
              this.model.set("dice_only", false);
            }
            if (this.model.dice_max === undefined) {
              this.model.set("dice_max", 100);
            }
          }
        },

        save() {
          if (this.model.creatingTopic) {
            this.model.setProperties({
              dice_only: this.model.dice_only,
              dice_max: this.model.dice_max,
            });
          }
          return this._super(...arguments);
        },
        
        
      });

      api.serializeOnCreate("dice_only");
      api.serializeToDraft("dice_only");
      api.serializeToTopic("dice_only", "dice_only");

      api.serializeOnCreate("dice_max");
      api.serializeToDraft("dice_max");
      api.serializeToTopic("dice_max", "dice_max");

      api.onAppEvent("composer:opened", () => {

        // Topic 일 경우만 활성
        if (composerController.model.action !== "createTopic") return;


        const composerEl = document.querySelector(".composer-fields");
        if (!composerEl || composerEl.querySelector("#dice-only-checkbox")) return;

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "dice-only";
        checkboxLabel.style.display = "flex";
        checkboxLabel.style.alignItems = "center";
        checkboxLabel.style.gap = "6px";
        checkboxLabel.style.marginTop = "10px";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "dice-only-checkbox";

        const span = document.createElement("span");
        span.innerText = "주사위댓글 전용";

        const diceMaxInput = document.createElement("input");
        diceMaxInput.type = "number";
        diceMaxInput.min = "1";
        diceMaxInput.value = 100;
        diceMaxInput.placeholder = "최대값";
        diceMaxInput.id = "dice-max-input";
        diceMaxInput.style.marginLeft = "1em";
        diceMaxInput.style.width = "80px";
        diceMaxInput.style.display = "none";

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(span);
        checkboxLabel.appendChild(diceMaxInput);
        composerEl.appendChild(checkboxLabel);

        const composerController = api.container.lookup("controller:composer");

        checkbox.checked = composerController.model.dice_only || false;
        diceMaxInput.value = composerController.model.dice_max;
        diceMaxInput.style.display = checkbox.checked ? "inline-block" : "none";

        checkbox.addEventListener("change", (e) => {
          const checked = e.target.checked;
          composerController.model.set("dice_only", checked);
          diceMaxInput.style.display = checked ? "inline-block" : "none";
        });

        diceMaxInput.addEventListener("change", (e) => {
          composerController.model.set("dice_max", parseInt(e.target.value, 10));
        });
      });
    });
  },
};
