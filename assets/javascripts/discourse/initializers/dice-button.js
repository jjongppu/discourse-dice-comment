import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {
  api.onPageChange(() => {
    const topicController = api.container.lookup('controller:topic');
    const topic = topicController?.model;

    if (!topic) return;

    if (topic.dice_only) {
      alert("diceOnly");
    }
  });
}

export default {
  name: 'dice-button',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
