<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ja from 'element-plus/es/locale/lang/ja'
import { eventList, obTabId } from '~/logic'

const componentMap: Record<string, Component> = (() => {
  const modules = import.meta.glob('./views/*/index.vue')
  const map: Record<string, Component> = {}

  for (const path in modules) {
    const componentName = path.split('/')[2]
    map[componentName] = defineAsyncComponent(modules[path] as any)
  }

  return map
})()

const { width } = useWindowSize()
const currentView = ref('dashboard')
const tabId = computed(() => Number(document.URL.split('?')[1]))
const inBattle = computed(() => eventList.value.find(e => e.type === 'teamraid')?.isActive)

const upViewList = computed(() => [
  { key: 'dashboard', label: 'ダッシュボード', icon: 'material-symbols:dashboard' },
  { key: 'drop', label: 'ドロップ統計', icon: 'game-icons:gold-stack' },
  { key: 'artifact', label: 'アーティファクト', icon: 'game-icons:glowing-artifact' },
  { key: 'party', label: 'パーティ情報', icon: 'ri:team-fill' },
  { key: 'build', label: '構成検索', icon: 'material-symbols:document-search' },
  { key: 'combat', label: 'バトル情報', icon: 'game-icons:battle-axe' },
  { key: 'history', label: 'バトル履歴', icon: 'game-icons:scroll-unfurled' },
  { key: 'patient', label: 'ブックマーク', icon: 'material-symbols:patient-list' },
  { key: 'gacha', label: 'ガチャシミュ', icon: 'game-icons:mimic-chest' },
  { key: 'battle', label: '接戦', icon: 'game-icons:crossed-swords', hidden: !inBattle.value },
].filter(m => !m.hidden))

const downViewList = [
  { key: 'info', label: 'ユーザー情報', icon: 'carbon:information-filled' },
  { key: 'setting', label: '設定', icon: 'carbon:settings' },
]

watchEffect(() => {
  const contentEl: HTMLDivElement | null = document.querySelector('#content')

  if (!contentEl)
    return
  const scale = width.value / 360
  contentEl.style.transform = `scale(${scale})`
  contentEl.style.transformOrigin = '0 0'
  contentEl.style.width = `${100 / scale}%`
  contentEl.style.height = `${100 / scale}%`
}, { flush: 'post' })

onMounted(() => {
  chrome.runtime.getContexts({}).then((ctx) => {
    if (ctx.filter(c => c.documentUrl?.includes('src/views/sidePanel/main.html')).length > 1) {
      createNotification({ message: 'サイドパネルは複数開けません' })
      window.close()
      return
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabInfo = tabs[0]
      if (!tabInfo) {
        window.close()
        return
      }

      obTabId.value = tabId.value || tabInfo.id
    })
  })
})
</script>

<template>
  <el-config-provider :locale="ja">
    <div id="content" h-full w-full flex>
      <el-scrollbar w-full>
        <div p-10px>
          <keep-alive>
            <component :is="componentMap[currentView]" />
          </keep-alive>
        </div>
      </el-scrollbar>

      <div class="bg-#3C3C3C" w-40px flex shrink-0 flex-col justify-between p-5px>
        <el-scrollbar>
          <div flex flex-col items-center gap-10px>
            <el-tooltip v-for="view in upViewList" :key="view.key" effect="dark" :show-after="1000" :content="view.label" placement="left">
              <div h-30px w-30px fc cursor-pointer rounded-md hover:bg-neutral-6 :class="{ 'bg-neutral-8!': view.key === currentView }" @click="currentView = view.key">
                <Icon :icon="view.icon" text-20px />
              </div>
            </el-tooltip>
          </div>
        </el-scrollbar>
        <div flex flex-col items-center gap-10px>
          <el-tooltip v-for="view in downViewList" :key="view.key" effect="dark" :show-after="1000" :content="view.label" placement="left">
            <div h-30px w-30px fc cursor-pointer rounded-md hover:bg-neutral-6 :class="{ 'bg-neutral-8!': view.key === currentView }" @click="currentView = view.key">
              <Icon :icon="view.icon" text-20px />
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>
