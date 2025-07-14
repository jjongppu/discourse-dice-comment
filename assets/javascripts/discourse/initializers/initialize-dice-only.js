import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {

  api.modifyClass('controller:composer', {
    pluginId: 'discourse-dice-comment',
    actions: {
      publish() {
        if (this.get('model.action') === 'createTopic') {
          this.get('composer').set('dice_only', this.get('model.dice_only'));
          this.get('composer').set('dice_min', this.get('model.dice_min'));
          this.get('composer').set('dice_max', this.get('model.dice_max'));
        }
        return this._super(...arguments);
      }
    }
  });

  api.decorateComposer((composer) => {
    composer.addField('dice_only');
    composer.addField('dice_min');
    composer.addField('dice_max');
    if (composer.dice_only === undefined) composer.dice_only = false;
    if (composer.dice_min === undefined) composer.dice_min = 1;
    if (composer.dice_max === undefined) composer.dice_max = 100;
  });
}

export default {
  name: 'discourse-dice-comment',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
