import type { BuildResponse, DropInfo, StartJsonBoss, Stat } from 'api'
import type { Quest } from 'extension'
import request from './request'

// 引き継ぎコードの更新
export function updateCode(data: { code: string }) {
  return request<{ code: string }>('/ext/code', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// ドロップ情報の送信
export function sendDropInfo(data: DropInfo) {
  return request('/ext/drop', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// ドロップ情報の一括送信
export function sendMultiDropInfo(data: DropInfo[]) {
  return request('/ext/multiDrop', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// startJsonのボス情報を送信
export function sendBossInfo(data: StartJsonBoss) {
  return request('/ext/startJson', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// クエスト情報の取得
export function listQuest() {
  return request<{ data: (Omit<Quest, 'visible'> & { deprecated?: boolean })[] }>('/ext/quest', {
    method: 'get',
  })
}

// ドロップ統計情報の取得
export function listDrop(questIds: string[]) {
  return request<{ data: Stat[] }>('/ext/stat', {
    method: 'post',
    body: JSON.stringify(questIds),
  })
}

// 編成情報のアップロード
export function uploadBuild(data: any) {
  return request<{ key: string }>('/ext/build', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// 編成情報の検索
export function listBuild(data: { questId: string, npcFilter: number[] }) {
  return request<{ data: { list: BuildResponse[], total: number } }>('/ext/getBuild', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// ユーザー設定のアップロード
export function setConfig(data: any) {
  return request('/ext/config/set', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

// ユーザー設定の取得
export function getConfig() {
  return request<{ data: any }>('/ext/config/get', {
    method: 'post',
  })
}
