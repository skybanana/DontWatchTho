const HIDE_SHORTS_KEY = 'hideShortsEnabled';
const GUILD_ID_KEY = 'guildId';
const USER_ID_KEY = 'userId';
const guildIdInput = document.getElementById('guildIdInput');
const userIdInput = document.getElementById('userIdInput');
const refreshButton = document.getElementById('refreshButton');
const statusText = document.getElementById('statusText');

/**
 * 현재 저장된 차단 상태를 텍스트에 반영한다.
 */
function renderStatus(isHideEnabled) {
  statusText.textContent = isHideEnabled ? '현재 상태: 쇼츠 차단' : '현재 상태: 쇼츠 해제';
}

/**
 * 입력값과 차단 상태를 storage에서 읽어 popup UI에 반영한다.
 */
function loadPopupState() {
  chrome.storage.local.get(
    { [GUILD_ID_KEY]: '', [USER_ID_KEY]: '', [HIDE_SHORTS_KEY]: true },
    (result) => {
      guildIdInput.value = result[GUILD_ID_KEY];
      userIdInput.value = result[USER_ID_KEY];
      renderStatus(result[HIDE_SHORTS_KEY]);
    },
  );
}

/**
 * 현재 입력한 guildId, userId를 저장한다.
 */
function saveIds() {
  chrome.storage.local.set({
    [GUILD_ID_KEY]: guildIdInput.value.trim(),
    [USER_ID_KEY]: userIdInput.value.trim(),
  });
}

/**
 * API 해제 상태를 조회해서 쇼츠 차단 상태를 갱신한다.
 */
async function refreshUnblockStatus() {
  const guildId = guildIdInput.value.trim();
  const userId = userIdInput.value.trim();

  chrome.storage.local.set({ [GUILD_ID_KEY]: guildId, [USER_ID_KEY]: userId });

  const url = `http://localhost:3000/api/unblock-status?guildId=${encodeURIComponent(guildId)}&userId=${encodeURIComponent(userId)}`;
  const response = await fetch(url);
  const result = await response.json();
  const isUnblocked = Boolean(result.isAllAgreed);
  const hideShortsEnabled = !isUnblocked;

  chrome.storage.local.set({ [HIDE_SHORTS_KEY]: hideShortsEnabled }, () => {
    renderStatus(hideShortsEnabled);
  });
}

guildIdInput.addEventListener('input', saveIds);
userIdInput.addEventListener('input', saveIds);
refreshButton.addEventListener('click', refreshUnblockStatus);
loadPopupState();
