import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-indicator",
  initialize() {
    withPluginApi("1.2.0", (api) => {
      api.modifyClass("controller:topic", {
        pluginId: "dice-post-indicator",

        postMenuButtons(buttons, post) {
          if (post?.custom_fields?.is_dice !== "t") {
            return buttons;
          }

          return [
            ...buttons,
            {
              icon: "gamepad",
              label: "주사위 댓글",
              className: "dice-post-icon",
              title: "이 댓글은 주사위 결과입니다",
              position: "second-last",
              // action 없이, 단순 표시용!
            },
          ];
        },
      });

      // action 생략! 표시만 할 거니까 attachWidgetAction도 필요 없음
    });
  },
};
