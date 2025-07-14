import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {

  api.decorateWidget('composer-controls:after', helper => {
    const model = helper.widget.model;
    if (model.dice_only === undefined) model.dice_only = false;
    if (model.dice_min === undefined) model.dice_min = 0;
    if (model.dice_max === undefined) model.dice_max = 100;

    const checkbox = helper.h('label.dice-only', [
      helper.h('input.dice-only-checkbox', {
        type: 'checkbox',
        checked: model.dice_only,
        onchange: event => (model.dice_only = event.target.checked)
      }),
      helper.h('span', helper.widget._t('dice_comment.checkbox'))
    ]);

    const maxInput = model.dice_only
      ? helper.h('div.dice-range', [
          helper.h('input.dice-max', {
            type: 'number',
            value: model.dice_max,
            min: 0,
            onchange: e => (model.dice_max = parseInt(e.target.value, 10))
          })
        ])
      : null;

    return helper.h('div.dice-only-wrapper', [checkbox, maxInput]);
  });
}

export default {
  name: 'dice-comment-checkbox',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
