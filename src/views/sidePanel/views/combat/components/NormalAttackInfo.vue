<script setup lang="ts">
import type { NormalAttackInfo } from 'battle'

defineProps<{ normalAttackInfo: NormalAttackInfo }>()
</script>

<template>
  <div m-2 fc flex-wrap gap-2>
    <el-tag type="primary" effect="dark" size="small">
      {{ `hit: ${normalAttackInfo.hit}` }}
    </el-tag>
    <el-tag type="warning" effect="dark" size="small">
      {{ `奥義${normalAttackInfo.chain ? `(${normalAttackInfo.chain}c)` : ''}: ${normalAttackInfo.special.toLocaleString()}` }}
    </el-tag>
    <el-tag type="success" effect="dark" size="small">
      {{ `アビダメ: ${normalAttackInfo.ability.toLocaleString()}` }}
    </el-tag>
    <el-tag type="danger" effect="dark" size="small">
      {{ `合計ダメージ: ${normalAttackInfo.total.toLocaleString()}` }}
    </el-tag>
  </div>
</template>
