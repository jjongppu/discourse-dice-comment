import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {
  api.addComposerFields({ dice_only: false });

  api.modifyClass('controller:composer', {
    pluginId: 'discourse-dice-comment',
    actions: {
      publish() {
        if (this.get('model.action') === 'createTopic') {
          this.get('composer').set('dice_only', this.get('model.fields.dice_only'));
        }
        return this._super(...arguments);
      }
    }
  });

  api.decorateComposer((composer) => {
    composer.addField('dice_only');
  });
}

export default {
  name: 'discourse-dice-comment',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
