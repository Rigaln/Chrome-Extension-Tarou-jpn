<script setup lang="ts">
import type { EventInfo, TeamraidAdditional } from 'extension'
import { Icon } from '@iconify/vue'
import { getEventGachaBoxNum } from '~/constants/event'
import { eventList } from '~/logic'

type TeamraidInfo = EventInfo & { additional: TeamraidAdditional }
const eventInfo = computed(() => eventList.value.find(event => event.type === 'teamraid') as TeamraidInfo)
const token = computed(() => eventInfo.value.additional.hasSpReward ? eventInfo.value.additional.gachaPoint : eventInfo.value.additional.gachaPoint + eventInfo.value.additional.honor / 1000000 * 60)

function onSetTarget() {
  ElMessageBox.prompt('目標貢献度を入力してください', {
    confirmButtonText: '確認',
    cancelButtonText: 'キャンセル',
    inputPattern: /^\d+$/,
    inputErrorMessage: '正しい数値を入力してください',
    inputPlaceholder: eventInfo.value.additional.targetHonor ? `現在の目標: ${eventInfo.value.additional.targetHonor.toLocaleString()}` : '',
  })
    .then(({ value }) => {
      eventInfo.value.additional.targetHonor = Number(value)
    })
    .catch(() => { })
}
</script>

<template>
  <el-card v-if="eventInfo && eventInfo.isActive && eventInfo.additional" h-full w-300px>
    <template #header>
      <div flex justify-between>
        <div>
          決戦！星の古戦場({{ getEventGachaBoxNum({ eventType: eventInfo.type, currentToken: token, drawnBox: eventInfo.additional.drawnBox }) }}箱)
        </div>
        <el-tooltip content="最終更新日時" placement="top">
          {{ formatEventDate(eventInfo.updateTime) }}
        </el-tooltip>
      </div>
    </template>
    <div flex flex-col gap-3 text-12px>
      <div flex items-start justify-between>
        <div fc gap-1>
          <Icon
            :icon="eventInfo.additional.lottery.number >= eventInfo.additional.lottery.limit ? 'material-symbols:check-box' : 'material-symbols:check-box-outline-blank'"
            color="#f0cb4f"
            size="5"
          />
          <div>
            果報の古箱
          </div>
        </div>
        <NumberLimitDisplay :value="{ number: eventInfo.additional.lottery.number, limit: eventInfo.additional.lottery.limit }" />
      </div>
      <MissionList :mission-list="eventInfo.mission" />

      <div flex items-center justify-between text-12px>
        <div fc gap-1>
          <Icon icon="game-icons:medal" size="5" />
          <div>
            {{ eventInfo.additional.honor.toLocaleString() }}
          </div>
        </div>
        <el-tooltip content="クリックして目標貢献度を設定し、差分を表示" placement="top">
          <TheButton link @click="onSetTarget">
            {{ eventInfo.additional.targetHonor ? (eventInfo.additional.targetHonor - eventInfo.additional.honor).toLocaleString() : '目標設定' }}
          </TheButton>
        </el-tooltip>
      </div>
    </div>
  </el-card>
</template>
