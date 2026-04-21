import { jsonRepository as repository } from '@/features/snack/repositories/snack.repository'

/** TODO: */
/* export const SnackService = {
  findMany: () => repository.get('/snack?').then(res => res.data),
  findUnique: (id: number) => repository.get('/snack?').then(res => res.data)
} */

export async function selectAllSnack() {
  return await repository.findMany()
}

export async function selectSnack(id: number) {
  return await repository.findUnique(id)
}

export async function insertSnack() {
  return await repository.create()
}

export async function updateSnack(id: number) {
  return await repository.update(id)
}

export async function deleteSnack(id: number) {
  return await repository.delete(id)
}

/** TODO: */
/* export async function createSnack(data: {
  title: string
  content: string
  userId: number
}) {
  // 1. validation
  if (!data.title || !data.content) {
    throw new Error('필수값 누락')
  }

  // 2. 정책
  const exist = await prisma.snack.findFirst({
    where: { title: data.title }
  })
  if (exist) {
    throw new Error('이미 존재하는 제목입니다.')
  }

  // 3. 트랜잭션 처리
  return prisma.$transaction(async tx => {
    const snack = await tx.snack.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId
      }
    })

    await tx.log.create({
      data: {
        action: 'CREATE_SNACK',
        userId: data.userId
      }
    })

    return snack
  })
} */

/** 심화 버전 */
/* import { revalidatePath } from 'next/cache'
import { createSnackSchema } from '../schema/create-snack.schema'
import { snackRepository } from '../api/snack.repository'

export async function createSnackAction(formData: FormData) {
  const parsed = createSnackSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  await snackRepository.create(parsed.data)

  revalidatePath('/snack')

  return { success: true }
} */
