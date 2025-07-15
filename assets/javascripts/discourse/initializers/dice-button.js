import { withPluginApi } from "discourse/lib/plugin-api";

function initialize(api) {
  api.onPageChange(() => {
    const topicController = api.container.lookup("controller:topic");
    const topic = topicController?.model;

    if (!topic || !(topic.dice_only === true || topic.dice_only === "true")) return;

    // 🔒 댓글창 숨김
    const composerEl = document.querySelector(".composer-container");
    if (composerEl) {
      composerEl.style.display = "none";
    }

    // 🔒 기존 댓글 버튼 비활성화
    const replyButtons = document.querySelectorAll("button.create, button.reply");
    replyButtons.forEach((btn) => {
      btn.disabled = true;
      btn.title = "이 토픽은 주사위댓글 전용입니다.";
    });

    // 🧼 인용/댓글 버튼 숨김
    const postActions = document.querySelectorAll(".post-controls .reply, .post-controls .quote");
    postActions.forEach((btn) => {
      btn.style.display = "none";
    });

    // 💬 안내 문구
    const timelineEl = document.querySelector(".topic-timeline");
    if (timelineEl && !document.querySelector(".dice-only-notice")) {
      const notice = document.createElement("div");
      notice.className = "dice-only-notice";
      notice.style = "margin: 1em 0; padding: 1em; background: #f5f5f5; border-radius: 6px;";
      notice.innerText = "이 토픽은 주사위댓글 전용입니다. 직접 댓글을 작성할 수 없습니다.";
      timelineEl.parentNode.insertBefore(notice, timelineEl);
    }

    // 🎲 "주사위 굴리기" 버튼 추가 (댓글 버튼 옆에)
    const composerActionRow = document.querySelector(".composer-actions .reply-control");
    if (composerActionRow && !document.querySelector(".dice-roll-button")) {
      const diceBtn = document.createElement("button");
      diceBtn.className = "btn dice-roll-button";
      diceBtn.innerText = "🎲 주사위 굴리기";
      diceBtn.disabled = true;
      diceBtn.style.marginLeft = "8px";
      composerActionRow.appendChild(diceBtn);
    }
  });
}

export default {
  name: "dice-button",
  initialize() {
    withPluginApi("0.8.7", initialize);
  },
};
