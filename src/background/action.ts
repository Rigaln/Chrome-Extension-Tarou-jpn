export function setupActionListener() {
  const { openSidePanel } = useContextMenu()

  chrome.action.onClicked.addListener((tab) => {
    if (!isGamePage(tab?.url)) {
      createNotification({ message: 'ゲーム画面で操作してください' })
      return
    }
    openSidePanel(tab)
  })
}
