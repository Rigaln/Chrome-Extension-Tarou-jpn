<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { snapdom } from '@zumer/snapdom'
import { battleExportData, deckList, userInfo } from '~/logic'
import ActionList from '../../sidePanel/views/combat/components/ActionList.vue'
import DamageRecord from '../../sidePanel/views/combat/components/DamageRecord.vue'
import Npc from '../../sidePanel/views/party/components/Npc.vue'
import Summon from '../../sidePanel/views/party/components/Summon.vue'
import Weapon from '../../sidePanel/views/party/components/Weapon.vue'

const deck = computed(() => deckList.value[0])

async function exportToImg() {
  try {
    const element = document.querySelector(`#record-container`)!
    const result = await snapdom(element)
    await result.download({ scale: 1.5, type: 'png', filename: `バトル記録${Date.now()}`, backgroundColor: '#131313' })
    ElMessage.success('保存しました')
  }
  catch (error) {
    createNotification({ message: String(error) })
  }
}
</script>

<template>
  <div fixed right-20px top-300px h-40px w-40px fc cursor-pointer rounded-full hover:bg-teal-9 @click="exportToImg">
    <Icon icon="streamline-flex:screenshot" text-25px text-teal-6 />
  </div>
  <div id="record-container" p-4>
    <div v-if="battleExportData" m-auto w-620px fc gap-10px rounded p-10px ring-1 ring-neutral-7>
      <div flex flex-col gap-10px>
        <el-card w-300px body-style="padding: 5px !important">
          <el-descriptions size="small" direction="vertical" :column="3" border>
            <el-descriptions-item label="クエスト" label-width="60" :rowspan="2" align="center">
              <img h-44px w-44px :src="getBossImg('enemy', battleExportData.bossImage!, 's')">
            </el-descriptions-item>
            <el-descriptions-item label="合計ダメージ" label-width="113" align="center">
              {{ battleExportData.damage }}
            </el-descriptions-item>
            <el-descriptions-item label="経過時間/速度" align="center">
              {{ battleExportData.realSpeed }}
            </el-descriptions-item>
            <el-descriptions-item label="貢献度" align="center">
              {{ battleExportData.point ? Math.floor(battleExportData.point).toLocaleString() : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="ターン数" align="center">
              {{ battleExportData.turn }}
            </el-descriptions-item>
          </el-descriptions>
          <div mt-5px text-end text-xs>
            {{ `${userInfo.name} @ ${useDateFormat(battleExportData.startTime! * 1000, 'MM-DD HH:mm:ss').value}` }}
          </div>
        </el-card>
        <DamageRecord v-if="battleExportData.detail" m-auto :player-info="battleExportData.detail.player" :is-export="true" />
      </div>
      <div v-if="deck" flex flex-col gap-10px>
        <Npc :leader="deck.leader" :npcs="deck.npcs" :priority="deck.priority" />
        <Weapon :weapons="deck.weapons" />
        <Summon :summons="deck.summons" />
      </div>
    </div>
    <div v-if="battleExportData.detail" m-auto mt-20px w-610px>
      <ActionList :action-queue="battleExportData.detail.actionQueue" :is-export="true" mode="horizontal" />
    </div>
  </div>
</template>
