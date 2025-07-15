import { withPluginApi } from "discourse/lib/plugin-api";

function initialize(api) {
  api.onPageChange(() => {
    const topicController = api.container.lookup("controller:topic");
    const topic = topicController?.model;

    if (!topic || topic.dice_only?.toString() !== "true") return;

    // 🔒 댓글 composer 완전 제거
    const composerContainer = document.querySelector(".composer-container");
    if (composerContainer) {
      composerContainer.style.display = "none";
    }

    // 🔒 댓글 버튼 및 인용/답글 등 모두 제거
    const replyButtons = document.querySelectorAll(
      "button.create, button.reply, .post-controls .reply, .post-controls .quote"
    );
    replyButtons.forEach((btn) => {
      btn.style.display = "none";
    });

    // 💬 안내 문구 삽입
    const timelineEl = document.querySelector(".topic-timeline");
    if (timelineEl && !document.querySelector(".dice-only-notice")) {
      const notice = document.createElement("div");
      notice.className = "dice-only-notice";
      notice.style =
        "margin: 1em 0; padding: 1em; background: #f5f5f5; border-radius: 6px; text-align: center;";
      notice.innerText =
        "🎲 이 토픽은 주사위 댓글 전용입니다. 일반 댓글을 작성할 수 없습니다.";
      timelineEl.parentNode.insertBefore(notice, timelineEl);
    }

    // 🎲 "주사위 굴리기" 버튼 생성
    const actionArea = document.querySelector(".topic-footer-buttons");
    if (actionArea && !document.querySelector(".dice-roll-button")) {
      const diceBtn = document.createElement("button");
      diceBtn.className = "btn btn-primary dice-roll-button";
      diceBtn.innerText = "🎲 주사위 굴리기";
      diceBtn.style.marginLeft = "1em";
      diceBtn.addEventListener("click", () => {
        alert("주사위 굴리기 기능은 아직 구현되지 않았습니다!");
      });
      actionArea.appendChild(diceBtn);
    }
  });
}

export default {
  name: "dice-button",
  initialize() {
    withPluginApi("0.8.7", initialize);
  },
};
