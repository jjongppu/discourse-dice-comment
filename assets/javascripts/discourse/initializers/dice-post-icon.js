import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dice-post-icon",
  initialize() {
    withPluginApi("1.34.0", (api) => {
      api.registerValueTransformer(
        "post-menu-buttons",
        ({ value: dag, context: { post, buttonKeys } }) => {
          if (!post?.is_dice) {
            return;
          }

          const key = "dice-post-indicator";
          if (dag.has(key)) {
            return;
          }

          dag.addAfter(
            buttonKeys.REPLY,
            key,
            {
              id: key,
              translatedLabel: "dice_comment.dice_post",
              className: "dice-post-icon",
              title: "dice_comment.dice_post",
            }
          );
        }
      );
    });
  },
};
