<script setup lang="ts">
import type { RemovableRef } from '@vueuse/shared'
import copy from 'copy-text-to-clipboard'
import { getConfig, setConfig, updateCode } from '~/api'
import { artifactRuleIndex, artifactRuleList, buildNpcFilter, code, combatPanelSetting, gachaRecord, markedUserList, notificationItem, notificationSetting, questConfig, questSetting, recoveryItemList, saveStoneDate, specBossBuff, specPlayerBuff, userInfo, volume, widgetList } from '~/logic/storage'

const { checkCode } = useUser()

const info = ref({
  permission: {
    notifications: 'granted',
  },
  version: '',
  userAgent: '',
})

function showSupport() {
  if (!userInfo.value.imgPc) {
    ElMessage.info('サポ石情報が取得されていません')
    return
  }
  openPopupWindow('SupportSummon')
}

function handleCopy() {
  if (copy(code.value))
    ElMessage.success(`引き継ぎコードをコピーしました`)
}

function changeCode() {
  if (!code.value) {
    ElMessage.info(`引き継ぎコードが生成されていません`)
    return
  }

  ElMessageBox.prompt('新しい引き継ぎコードを入力してください', {
    confirmButtonText: '確認',
    cancelButtonText: 'キャンセル',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm' && instance.inputValue) {
        instance.confirmButtonLoading = true
        updateCode({ code: instance.inputValue }).then((data) => {
          code.value = data.code
          done()
        }).catch(() => {
          ElMessage.error('移行失敗')
        }).finally(() => {
          instance.confirmButtonLoading = false
        })
      }
      else {
        done()
      }
    },
  })
    .then(() => {
      ElMessage.success('移行完了')
    })
    .catch(() => {})
}

const configMap: Record<string, RemovableRef<any>> = {
  volume,
  notificationSetting,
  notificationItem,
  gachaRecord,
  saveStoneDate,
  recoveryItemList,
  widgetList,
  specBossBuff,
  specPlayerBuff,
  questSetting,
  questConfig,
  markedUserList,
  artifactRuleIndex,
  artifactRuleList,
  buildNpcFilter,
  combatPanelSetting,
}

function handleGetConfig() {
  getConfig().then(({ data }) => {
    for (const key in configMap) {
      configMap[key].value = data[key] ?? configMap[key].value
    }
    ElMessage.success('同期完了')
  }).catch((err) => {
    ElMessage.error(err.message)
  })
}

function handleSetConfig() {
  const config: Record<string, any> = {}
  for (const key in configMap) {
    config[key] = configMap[key].value
  }

  setConfig(config).then(() => {
    ElMessage.success('アップロード完了')
  }).catch((err) => {
    ElMessage.error(err.message)
  })
}

onMounted(() => {
  checkCode()

  chrome.notifications.getPermissionLevel((level) => {
    info.value.permission.notifications = level
  })
  const manifest = chrome.runtime.getManifest()
  info.value.version = manifest.version
  info.value.userAgent = window.navigator.userAgent
})
</script>

<template>
  <el-descriptions :column="1" :border="true" direction="vertical" w-300px>
    <el-descriptions-item label="プレイヤーID">
      <template #label>
        <div flex justify-between>
          <div>プレイヤーID</div>
          <TheButton @click="showSupport">
            サポ石
          </TheButton>
        </div>
      </template>
      {{ userInfo.uid ? userInfo.uid : '未取得' }}
    </el-descriptions-item>
    <el-descriptions-item label="引き継ぎコード">
      <template #label>
        <div flex justify-between>
          <div>引き継ぎコード</div>
          <TheButton @click="changeCode">
            移行
          </TheButton>
        </div>
      </template>
      <div hover="text-teal-6" cursor-pointer @click="handleCopy">
        {{ code ? code : '未生成' }}
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="権限">
      <div flex flex-col>
        <div flex justify-between>
          <div>通知権限</div>
          <el-tag :type="info.permission.notifications === 'granted' ? 'success' : 'danger'">
            {{ info.permission.notifications === 'granted' ? '正常' : '無効' }}
          </el-tag>
        </div>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="拡張機能バージョン">
      {{ info.version }}
    </el-descriptions-item>
    <el-descriptions-item label="UserAgent">
      {{ info.userAgent }}
    </el-descriptions-item>
    <el-descriptions-item label="関連リンク">
      <div flex flex-col>
        <div>
          <el-link href="https://waaatanuki.github.io/tarou-docs" target="_blank">
            太郎使用マニュアル
          </el-link>
        </div>
        <div>
          <el-link href="https://github.com/Waaatanuki/Chrome-Extension-Tarou" target="_blank">
            GitHub リポジトリ
          </el-link>
        </div>
        <div>
          <el-link href="https://gbf.pub" target="_blank">
            Granblue Master
          </el-link>
        </div>
        <div>
          <el-link href="https://bbs.nga.cn/read.php?tid=30999435" target="_blank">
            NGA主題歌（中国語）
          </el-link>
        </div>
        <div>
          <el-link>QQ交流群: 194260754</el-link>
        </div>
      </div>
    </el-descriptions-item>
  </el-descriptions>

  <div my-10px flex items-center justify-between px-4>
    <el-tooltip content="拡張機能の設定をサーバーにアップロードします">
      <TheButton class="w-1/2" @click="handleSetConfig">
        設定をアップロード
      </TheButton>
    </el-tooltip>
    <el-tooltip content="サーバーから拡張機能の設定を取得します">
      <TheButton class="w-1/2" @click="handleGetConfig">
        設定を同期
      </TheButton>
    </el-tooltip>
  </div>

  <el-popover placement="bottom" width="300">
    <template #reference>
      <div hover="text-teal-6" m-auto mt-20px w-150px fc cursor-pointer gap-2>
        <div i-carbon:help-filled @click="openPopupWindow('Debug')" />
        <div>FAQ / トラブルシューティング</div>
      </div>
    </template>
    <img :src="getLocalImg('reload')">
  </el-popover>

  <div m-auto mt-10px w-150px text-12px>
    <a href="https://afdian.com/a/tarou" target="_blank" class="group">
      <div fc gap-1 rounded-lg px-4 py-2 group-hover=" text-yellow">
        <div
          i-ph-lightning-duotone group-hover="i-ph-lightning-fill"
          transition-all
        />
        <div>
          開発者を支援する
        </div>
      </div>
    </a>
  </div>
</template>
