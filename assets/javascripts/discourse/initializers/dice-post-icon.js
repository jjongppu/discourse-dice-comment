import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-indicator",
  initialize() {
    withPluginApi("1.2.0", (api) => {
      api.decorateCookedElement(
        (elem, helper) => {
          const post = helper.getModel();

          if (post?.custom_fields?.is_dice === "t") {
            // 이미 붙어 있으면 중복 방지
            if (elem.querySelector(".dice-indicator")) return;

            const badge = document.createElement("span");
            badge.className = "dice-indicator";
            badge.innerText = "🎲 다이스";

            elem.appendChild(badge); // 본문 맨 아래에 추가
          }
        },
        { id: "dice-post-indicator", onlyStream: true }
      );
    });
  },
};
