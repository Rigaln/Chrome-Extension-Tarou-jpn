<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import { defaultWidget } from '~/constants'
import { buildNpcFilter, notificationItem, notificationSetting, widgetList } from '~/logic'

function handleDelete(item: string) {
  const index = notificationItem.value.findIndex(i => i === item)
  notificationItem.value.splice(index, 1)
}

function updateNpcFilter(item: number) {
  const index = buildNpcFilter.value.findIndex(b => b === item)
  if (index !== -1)
    buildNpcFilter.value.splice(index, 1)
}

onMounted(() => {
  for (const widget of defaultWidget) {
    const hit = widgetList.value.find(w => w.key === widget.key)
    if (!hit)
      widgetList.value.push({ ...widget })
  }
  widgetList.value = widgetList.value.filter(widget =>
    defaultWidget.some(defaultWidget => defaultWidget.key === widget.key),
  )
})
</script>

<template>
  <el-alert :closable="false">
    <template #title>
      <div w-268px>
        <el-tooltip content="クリックまたはドラッグで設定" placement="top-start">
          <span>
            ホーム設定
          </span>
        </el-tooltip>
      </div>
    </template>
  </el-alert>

  <VueDraggableNext v-model="widgetList" my-10px flex flex-col gap-10px px-10px>
    <transition-group name="draglist">
      <div
        v-for="widget in widgetList" :key="widget.key"
        :class=" { 'bg-neutral-6!': !widget.visible }"
        cursor-grab select-none rounded-lg bg-teal-6 text-center text-14px leading-loose
        @click="widget.visible = !widget.visible"
      >
        {{ widget.name }}
      </div>
    </transition-group>
  </VueDraggableNext>

  <el-alert :closable="false">
    <template #title>
      <div w-268px flex items-center justify-between gap-2>
        <div>
          ポップアップ通知
        </div>
        <VolumeControl />
      </div>
    </template>
  </el-alert>
  <div flex flex-col pl-5>
    <el-checkbox v-model="notificationSetting.battleWin" label="戦闘終了通知" />
    <el-checkbox v-model="notificationSetting.battleLose" label="全滅通知" />
    <el-checkbox v-model="notificationSetting.replicardEvent" label="砂箱宝箱通知" />
    <el-checkbox v-model="notificationSetting.appearanceQuest" label="HELL出現通知" />
    <el-checkbox v-model="notificationSetting.itemGoal" label="アイテム目標数達成通知" />
    <el-checkbox v-model="notificationSetting.sampoFinish" label="探検完了通知" />
    <el-checkbox v-model="notificationSetting.checkUpdate" label="アップデート確認" />
    <el-checkbox v-model="notificationSetting.pointReach" label="ライン到達通知" />
    <el-checkbox v-model="notificationSetting.actionTrigger" label="アクション実行通知" />
  </div>
  <el-alert :closable="false">
    <template #title>
      <div w-268px flex items-center justify-between gap-2>
        <el-tooltip content="アイテム画像を右クリックしてドロップ監視に追加" placement="top-start">
          <div>
            ドロップ通知
          </div>
        </el-tooltip>
        <el-switch v-model="notificationSetting.targetItemDrop" />
      </div>
    </template>
  </el-alert>
  <el-card my-10px>
    <div grid grid-cols-5 gap-10px>
      <div v-for="item in notificationItem" :key="item" relative fc flex-col select-none class="group">
        <img :src="`https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sp/assets${item}`">
        <div absolute hidden h-full w-full fc bg-black opacity-70 group-hover:flex>
          <div i-carbon:close-filled absolute icon-btn @click="handleDelete(item)" />
        </div>
      </div>
    </div>
  </el-card>
  <el-alert :closable="false">
    <template #title>
      <div w-268px>
        <el-tooltip content="構成比較内のキャラをクリックして設定" placement="top-start">
          <span>
            未所持キャラ
          </span>
        </el-tooltip>
      </div>
    </template>
  </el-alert>
  <div v-if="buildNpcFilter.length" px-5>
    <el-card my-10px>
      <div flex flex-wrap gap-12px>
        <div v-for="item in buildNpcFilter" :key="item" relative fc flex-col select-none class="group">
          <img :src="getAssetImg('npc', `${item}_01`, 's')" h-50px w-50px>
          <div absolute hidden h-full w-full fc bg-black opacity-70 group-hover:flex>
            <div i-carbon:close-filled absolute icon-btn @click="updateNpcFilter(item)" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
