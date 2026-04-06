const HIDE_SHORTS_KEY = 'hideShortsEnabled';
let hideShortsEnabled = true;

/**
 * 현재 상태에 맞게 html의 hide-shorts 옵션 값을 설정한다.
 */
function applyHideShortsState() {
  const nextValue = hideShortsEnabled ? 'true' : 'false';
  if (document.documentElement.getAttribute('hide-shorts') !== nextValue) {
    document.documentElement.setAttribute('hide-shorts', nextValue);
  }
}

/**
 * 저장된 쇼츠 차단 상태를 불러와 화면에 반영한다.
 */
function loadHideShortsState() {
  chrome.storage.local.get({ [HIDE_SHORTS_KEY]: true }, (result) => {
    hideShortsEnabled = result[HIDE_SHORTS_KEY];
    applyHideShortsState();
  });
}

/**
 * popup에서 상태가 바뀌면 바로 반영한다.
 */
function bindStorageChangeListener() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
      return;
    }

    if (changes[HIDE_SHORTS_KEY]) {
      hideShortsEnabled = changes[HIDE_SHORTS_KEY].newValue;
      applyHideShortsState();
    }
  });
}

/**
 * 유튜브가 속성을 덮어써도 선택된 상태를 유지한다.
 */
function bindAttributeObserver() {
  const observer = new MutationObserver(() => {
    applyHideShortsState();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['hide-shorts'],
  });
}

loadHideShortsState();
bindStorageChangeListener();
bindAttributeObserver();
