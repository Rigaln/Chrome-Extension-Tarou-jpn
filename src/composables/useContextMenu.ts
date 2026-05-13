export default function useContextMenu() {
  function registerContextMenu() {
    chrome.contextMenus.create({ id: 'openSidePanel', title: 'サイドパネルを開く', contexts: ['all'] })
    chrome.contextMenus.create({ id: 'openWindowPanel', title: 'ウィンドウを開く', contexts: ['all'] })
    chrome.contextMenus.create({ id: 'pushInTargetItem', title: 'ドロップ監視に追加', contexts: ['image'] })
  }

  function openSidePanel(tab: chrome.tabs.Tab) {
    chrome.sidePanel.open({ tabId: tab.id! }).catch((err) => {
      createNotification({ message: String(err) })
    })
  }

  function openWindowPanel(tab: chrome.tabs.Tab) {
    openPopupWindow(`WindowPanel${tab.id}`)
  }

  return { registerContextMenu, openSidePanel, openWindowPanel }
}
