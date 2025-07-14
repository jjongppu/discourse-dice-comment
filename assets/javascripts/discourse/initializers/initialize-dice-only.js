import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {
  api.addComposerFields({ dice_only: false, dice_min: 1, dice_max: 100 });

  api.modifyClass('controller:composer', {
    pluginId: 'discourse-dice-comment',
    actions: {
      publish() {
        if (this.get('model.action') === 'createTopic') {
          this.get('composer').set('dice_only', this.get('model.fields.dice_only'));
          this.get('composer').set('dice_min', this.get('model.fields.dice_min'));
          this.get('composer').set('dice_max', this.get('model.fields.dice_max'));
        }
        return this._super(...arguments);
      }
    }
  });

  api.decorateComposer((composer) => {
    composer.addField('dice_only');
    composer.addField('dice_min');
    composer.addField('dice_max');
  });
}

export default {
  name: 'discourse-dice-comment',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
