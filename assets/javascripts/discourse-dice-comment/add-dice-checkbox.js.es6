import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {
  api.addComposerFields({ dice_only: false });

  api.decorateWidget('composer-fields:after', helper => {
    const model = helper.widget.model;
    return helper.h('label.dice-only', [
      helper.h('input.dice-only-checkbox', {
        type: 'checkbox',
        checked: model.dice_only,
        onchange: event => (model.dice_only = event.target.checked)
      }),
      helper.h('span', helper.widget._t('dice_comment.checkbox'))
    ]);
  });
}

export default {
  name: 'dice-comment-checkbox',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
