<script setup lang="ts">
import type { Stat } from 'api'

const props = defineProps<{ data: Stat }>()

function getRatio(a = 0, b = 0) {
  if (b === 0)
    return '0.00'

  return ((a / b) * 100).toFixed(2)
}

function getDropRatio(item?: Stat) {
  if (!item)
    return '0.00'
  if (item.isBlueTreasure)
    return getRatio(item.targetItemCount, item.blueChest)
  else
    return getRatio(item.targetItemCount, item.total)
}

const msg = computed(() => {
  if (!props.data)
    return 'お気に入り登録後に更新してデータを取得してください'

  const itemObj: { [key: string]: string } = {
    '17_20004': 'ヒヒイロカネ',
    '10_215': '刻の流砂',
  }

  const itemName = itemObj[props.data.targetItemKey]

  if (props.data.targetItemCount === 0)
    return `${itemName}はまだドロップしていません`

  const type = props.data.isBlueTreasure ? '青箱' : '戦'
  const prefix = props.data.lastDropTake ? `前回ドロップから${props.data.lastDropTake}${type}、` : ''
  return `${prefix}現在${props.data.lastDropCount}${type}ハマり`
})
</script>

<template>
  <el-card h-full w-300px>
    <div flex gap-10px text-sm>
      <div w-90px shrink-0>
        <img w-full draggable="false" :src="getQuestImg(data.questId, 'lobby')">
        <div mt-2px fc gap-2px>
          <div i-game-icons:crossed-swords />
          <div text-orange font-black>
            {{ data?.total?.toLocaleString() }}
          </div>
          <div i-game-icons:crossed-swords />
        </div>
      </div>
      <div fc flex-1 flex-col>
        <div w-full flex items-center justify-around>
          <div v-if="data.isBlueBox" class="desc-item">
            <el-badge :value="data?.blueChest" type="danger" :max="999999">
              <img w-40px draggable="false" :src="getLocalImg('blueChest')">
            </el-badge>

            <div text-xs>
              {{ getRatio(data?.blueChest, data?.total) }}%
            </div>
          </div>

          <div v-else class="desc-item">
            <img w-40px brightness-40 draggable="false" :src="getLocalImg('blueChest')">
          </div>

          <div class="desc-item">
            <el-badge :value="data?.targetItemCount" type="danger" :max="999999">
              <img w-40px draggable="false" :src="getLocalImg(data.targetItemKey, 'item')">
            </el-badge>

            <div text-xs>
              {{ getDropRatio(data) }}%
            </div>
          </div>
        </div>
        <div text-center text-xs text-gray>
          {{ msg }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.desc-item {
  width: 60px;
  height: 60px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
}
</style>
