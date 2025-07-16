import { withPluginApi } from "discourse/lib/plugin-api";

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(`Timeout: ${selector} not found`);
    }, timeout);
  });
}

function initialize(api) {
  api.onPageChange(() => {
    const topicController = api.container.lookup("controller:topic");
    const topic = topicController?.model;

    if (!topic || topic.dice_only?.toString() !== "true") return;

    // 🔒 댓글창 숨김
    const composerContainer = document.querySelector(".composer-container");
    if (composerContainer) {
      composerContainer.style.display = "none";
    }

    // 🔒 댓글 버튼 및 인용/답글 숨김
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

    // 🎲 주사위 굴리기 버튼 생성
    waitForElement(".topic-footer-main-buttons")
      .then((actionArea) => {
        if (!document.querySelector(".dice-roll-button")) {
          const diceBtn = document.createElement("button");
          diceBtn.className = "btn btn-primary dice-roll-button";
          diceBtn.innerText = "🎲 주사위 굴리기";
          diceBtn.style.marginLeft = "1em";

          diceBtn.addEventListener("click", () => {
            const topicId = topic.id;

            if (!topicId) {
              alert("토픽 ID를 찾을 수 없습니다.");
              return;
            }

            fetch("/dice/roll", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": api.csrfToken(),
              },
              body: JSON.stringify({ topic_id: topicId }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("주사위 실패");
                return res.json();
              })
              .then(() => {
                alert("🎲 주사위 결과가 댓글로 등록되었어요!");
                location.reload(); // 자동 반영 (댓글 새로고침)
              })
              .catch(() => {
                alert("❌ 주사위 굴리기에 실패했습니다.");
              });
          });

          actionArea.appendChild(diceBtn);
        }
      })
      .catch((err) => {
        console.warn("🛑 dice-roll 버튼 생성 실패:", err);
      });
  });
}

export default {
  name: "dice-button",
  initialize() {
    withPluginApi("0.8.7", initialize);
  },
};
