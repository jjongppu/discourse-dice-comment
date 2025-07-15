import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-comment-checkbox",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      // 💾 모델에 필드 바인딩
      api.modifyClass("controller:composer", {
        pluginId: "discourse-dice-comment",
        init() {
          this._super(...arguments);
          if (this.creatingTopic) {
            if (this.model.dice_only === undefined) {
              this.model.set("dice_only", false);
            }
          }
        },
      });

      // 🧩 글쓰기 창 열릴 때 DOM 삽입
      api.onAppEvent("composer:opened", () => {
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

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(span);
        composerEl.appendChild(checkboxLabel);

        // 🧠 모델 연동
        const composerController = api.container.lookup("controller:composer");
        checkbox.checked = composerController.model.dice_only || false;

        checkbox.addEventListener("change", (e) => {
          composerController.model.set("dice_only", e.target.checked);
        });
      });
    });
  },
};
