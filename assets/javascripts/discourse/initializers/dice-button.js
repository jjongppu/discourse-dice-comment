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

    // 🎯 주사위 토픽이 아닌 경우 복원 처리
    if (!topic || topic.dice_only?.toString() !== "true") {
      // 💥 주사위 안내 문구 제거
      document.querySelector(".dice-only-notice")?.remove();

      // 💥 주사위 버튼 제거
      document.querySelector(".dice-roll-button")?.remove();

      return;
    }

    if (topic.current_user_has_dice_post) {
      document.querySelector(".dice-roll-button")?.remove();
      return;
    }


    // 🎲 주사위 굴리기 버튼 삽입
    waitForElement(".topic-footer-main-buttons")
      .then((actionArea) => {
        if (!document.querySelector(".dice-roll-button")) {
          const diceBtn = document.createElement("button");
          diceBtn.className = "btn btn-primary dice-roll-button";
          diceBtn.innerText = "🎲 주사위 굴리기";
          diceBtn.style.marginLeft = "1em";

          diceBtn.addEventListener("click", () => {
            fetch(`/dice/roll-dice/${topic.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": api.csrfToken,
              },
            })
              .then((res) => {
                if (!res.ok) {
                  if (res.status === 403) {
                    throw new Error("이미 주사위를 굴렸습니다.");
                  }
                  throw new Error("실패");
                }
                return res.json();
              })
              .then((data) => {
                const area = document.querySelector(".topic-footer-main-buttons");
                if (area) {
                  const resultEl = document.createElement("div");
                  resultEl.className = "dice-roll-result";
                  resultEl.innerText = data.raw || "";
                  //area.appendChild(resultEl);
                  //setTimeout(() => resultEl.remove(), 5000);
                }
                topic.current_user_has_dice_post = true;
                document.querySelector(".dice-roll-button")?.remove();
              })
              .catch((e) => {
                alert(`❌ ${e.message || "주사위 굴리기에 실패했습니다."}`);
              });
          });

          actionArea.appendChild(diceBtn);
        }
      })
      .catch((err) => {
        console.warn("❌ 주사위 버튼 추가 실패:", err);
      });
  });
}

export default {
  name: "dice-button",
  initialize() {
    withPluginApi("0.8.7", initialize);
  },
};
