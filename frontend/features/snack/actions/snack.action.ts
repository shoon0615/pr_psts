'use server'

/** TODO: */
/*import { SnackService } from '@/features/snack/services/snack.service'
export async function getSnackList() {
  return await SnackService.getSnackList()
}*/

import { z } from 'zod'
import {
  selectAllSnack,
  selectSnack,
  insertSnack,
  updateSnack,
  deleteSnack
} from '@/features/snack/services/snack.service'
import {
  createSnackSchema,
  CreateSnackInput
} from '@/features/snack/schema/snack.schema'
import { Snack } from '@/features/snack/types/snack.type'

// export async function createSnack(params: CreateSnackInput): Promise<Snack> {
export async function createSnack(params: CreateSnackInput) {
  try {
    // const payload = createSnackSchema.parse(params)
    // const payload = createSnackSchema.safeParse(query)

    // revalidatePath('/snack')

    return await insertSnack(params)
  } catch (error) {
    console.error(error)

    /* if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: 'Invalid request', errors: z.treeifyError(error) },
          { status: 400 }
        )
      }
  
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      ) */
  }
}

export async function modifySnack(id: number) {
  return await updateSnack(id)
}

export async function removeSnack(id: number) {
  return await deleteSnack(id)
}
