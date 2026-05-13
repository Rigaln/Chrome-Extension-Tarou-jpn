import { notificationItem } from '~/logic'

export function setupContextMenuListener() {
  const { openSidePanel, openWindowPanel } = useContextMenu()

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!isGamePage(tab?.url)) {
      createNotification({ message: 'ゲーム画面で操作してください' })
      return
    }

    if (!tab?.id) {
      createNotification({ message: 'ゲーム画面で操作してください' })
      return
    }

    switch (info.menuItemId) {
      case 'openSidePanel':{
        openSidePanel(tab)
        break
      }
      case 'openWindowPanel':{
        openWindowPanel(tab)
        break
      }
      case 'pushInTargetItem':
        if (info.srcUrl) {
          const itemKey = imgSrcToKey(info.srcUrl)

          if (!itemKey) {
            createNotification({ message: 'このアイテムは追加できません' })
            return
          }
          if (notificationItem.value.includes(itemKey)) {
            createNotification({ message: 'このアイテムは既に追加されています' })
            return
          }

          notificationItem.value.push(itemKey)
          createNotification({
            message: '追加しました',
            iconUrl: `https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sp/assets${itemKey}`,
            sound: 'tip',
          })
        }
        break
    }
  })
}
