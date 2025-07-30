import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-icon",
  initialize() {
    withPluginApi("0.8.13", (api) => {
      api.addPostMenuButton("dice-post-indicator", (post) => {
        if (!post?.is_dice) {
          return;
        }

        return {
          action: "dicePostIndicator",
          icon: "gamepad",
          label: "dice_comment.dice_post",
          className: "dice-post-icon",
          title: "dice_comment.dice_post",
          position: "second-last",
        };
      });

      api.attachWidgetAction("post", "dicePostIndicator", function () {
        alert("\ud83c\udfb2 \uc8fc\uc0ac\uc704 \uad74\ub9ac\uae30!");
      });

      api.onPageChange(() => {
        const topicController = api.container.lookup("controller:topic");
        const posts = topicController?.model?.postStream?.posts;
        posts?.forEach((p) => {
          // eslint-disable-next-line no-console
          console.log(`[dice] post ${p.id} is_dice=${p.is_dice}`);
        });
      });
    });
  },
};
