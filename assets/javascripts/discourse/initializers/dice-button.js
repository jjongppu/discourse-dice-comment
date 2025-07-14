import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {
  api.onPageChange(() => {
    const topicController = api.container.lookup('controller:topic');
    const topic = topicController?.model;
    const footer = document.querySelector('.topic-footer-main-buttons');
    if (!topic || !footer) { return; }

    if (topic.dice_only) {
      document.body.classList.add('dice-only-topic');
      const replyBtn = footer.querySelector('button.create');
      if (replyBtn) replyBtn.style.display = 'none';

      if (!footer.querySelector('.roll-dice')) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary roll-dice';
        btn.textContent = I18n.t('dice_comment.roll');
        btn.addEventListener('click', () => {
          btn.disabled = true;
          fetch(`/dice/roll-dice/${topic.id}.json`, { method: 'POST' })
            .then(() => window.location.reload());
        });
        footer.appendChild(btn);
      }
    } else {
      document.body.classList.remove('dice-only-topic');
    }
  });
}

export default {
  name: 'dice-button',
  initialize() {
    withPluginApi('0.8.7', initialize);
  }
};
