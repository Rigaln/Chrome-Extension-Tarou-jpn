<script setup lang="ts">
import { userInfo } from '~/logic'
</script>

<template>
  <el-descriptions :column="2" :border="true" direction="vertical" w-300px size="small">
    <el-descriptions-item label="武勲の輝き" label-width="200" :rowspan="2">
      <div>
        <div flex justify-between>
          <span>デイリー</span>
          <NumberLimitDisplay :value="userInfo.mbp?.daily" />
        </div>
        <div flex justify-between>
          <span>ウィークリー</span>
          <NumberLimitDisplay :value="userInfo.mbp?.weekly" />
        </div>
        <div flex flex-1 justify-between>
          <span>Rボーナス</span>
          <NumberLimitDisplay :value="userInfo.mbp?.bonus.r" />
        </div>
        <div flex flex-1 justify-between>
          <span>SRボーナス</span>
          <NumberLimitDisplay :value="userInfo.mbp?.bonus.sr" />
        </div>
        <div flex justify-between>
          <span>所持数</span>
          <NumberLimitDisplay :value="userInfo.mbp?.total" />
        </div>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="FP">
      <div>
        <div flex justify-between>
          <span>ウィークリー</span>
          <NumberLimitDisplay :value="userInfo.followPoint?.weekly" />
        </div>
        <div flex justify-between>
          <span>所持数</span>
          <NumberLimitDisplay :value="userInfo.followPoint?.total" />
        </div>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="神器">
      <div flex justify-between>
        <span>ドロップUP</span>
        <NumberLimitDisplay :value="userInfo.artifact" />
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="栄誉の輝き">
      <div>
        <div flex justify-between>
          <span>ウィークリー</span>
          <NumberLimitDisplay :value="userInfo.hmbp?.weekly" />
        </div>
        <div flex justify-between gap-2>
          <div flex flex-1 justify-between>
            <span>騎空団ボーナス</span>
            <NumberLimitDisplay :value="userInfo.hmbp?.bonus.crew" />
          </div>
        </div>
        <div flex justify-between>
          <span>所持数</span>
          <NumberLimitDisplay :value="userInfo.hmbp?.total" />
        </div>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="アーカルム" label-width="200">
      <div>
        <div flex justify-between>
          <span>パスポート</span>
          <NumberLimitDisplay :value="userInfo.arcarum?.passport" />
        </div>
        <div flex justify-between>
          <span>ウィークリー</span>
          <NumberLimitDisplay :value="userInfo.arcarum?.point.weekly" />
        </div>
        <div flex justify-between>
          <span>所持数</span>
          <NumberLimitDisplay :value="userInfo.arcarum?.point.total" />
        </div>
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>
