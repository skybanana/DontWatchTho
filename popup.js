const HIDE_SHORTS_KEY = 'hideShortsEnabled';
const hideShortsToggle = document.getElementById('hideShortsToggle');

/**
 * 저장된 쇼츠 차단 상태를 읽어서 토글 UI에 반영한다.
 */
function loadToggleState() {
  chrome.storage.local.get({ [HIDE_SHORTS_KEY]: true }, (result) => {
    hideShortsToggle.checked = result[HIDE_SHORTS_KEY];
  });
}

/**
 * 토글 변경 상태를 저장한다.
 */
function saveToggleState() {
  chrome.storage.local.set({ [HIDE_SHORTS_KEY]: hideShortsToggle.checked });
}

hideShortsToggle.addEventListener('change', saveToggleState);
loadToggleState();
