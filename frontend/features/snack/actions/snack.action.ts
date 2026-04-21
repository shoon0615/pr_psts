'use server'

/** TODO: */
/*import { SnackService } from '@/features/snack/services/snack.service'
export async function getSnackList() {
  return await SnackService.getSnackList()
}*/

import {
  selectAllSnack,
  selectSnack,
  insertSnack,
  updateSnack,
  deleteSnack
} from '@/features/snack/services/snack.service'

export async function getSnackList() {
  alert('데이터를 가져옵니다.')
  return await selectAllSnack()
}

export async function getSnack(id: number) {
  return await selectSnack(id)
}

export async function createSnack() {
  return await insertSnack()
}

export async function modifySnack(id: number) {
  return await updateSnack(id)
}

export async function removeSnack(id: number) {
  return await deleteSnack(id)
}
