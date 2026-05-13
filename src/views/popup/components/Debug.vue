<script setup lang="ts">
import copy from 'copy-text-to-clipboard'

const key = ref('')
const keyList = ref<string[]>([])
const text = ref('')

function handleCommand(command: 'get' | 'set' | 'copy' | 'reset') {
  switch (command) {
    case 'get':
      chrome.storage.local.get([key.value]).then((result) => {
        try {
          text.value = JSON.stringify(JSON.parse(result[key.value]), null, 2)
        }
        catch (error) {
          text.value = result[key.value]
        }
        finally {
          ElMessage.success('取得完了')
        }
      })
      break
    case 'set':
      try {
        console.log(JSON.parse(text.value))
        chrome.storage.local.set({ [key.value]: text.value }).then(() => {
          ElMessage.success('更新完了')
        })
      }
      catch (error) {
        ElMessage.error('データ形式が不正です')
      }
      break
    case 'copy':
      if (copy(text.value))
        ElMessage.success(`コピーしました`)
      break
    case 'reset':
      chrome.storage.local.remove(key.value).then(() => {
        ElMessage.success('リセット完了')
        handleCommand('get')
      })
      break
  }
}

onMounted(() => {
  chrome.storage.local.getKeys((keys) => {
    keyList.value = keys
  })
})
</script>

<template>
  <div fc flex-wrap gap-3 p-10>
    <div h-600px w-500px>
      <el-alert type="error" :closable="false" center>
        デバッグ機能です。不用意に操作しないでください！
      </el-alert>
      <div mt-2 fc gap-2 p-2>
        <el-select v-model="key" style="width: 200px" placeholder="" size="small" filterable @change="handleCommand('get')">
          <el-option v-for="item in keyList" :key="item" :label="item" :value="item" />
        </el-select>

        <TheButton ml-2 @click="handleCommand('set')">
          更新
        </TheButton>
        <TheButton @click="handleCommand('copy')">
          コピー
        </TheButton>
        <TheButton @click="handleCommand('reset')">
          リセット
        </TheButton>
      </div>

      <el-input v-model="text" type="textarea" :rows="25" />
    </div>
  </div>
</template>
