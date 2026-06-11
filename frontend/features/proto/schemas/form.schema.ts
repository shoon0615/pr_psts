import { z } from 'zod'

/**
 * @param title 상품명
 * @param brand 브랜드
 * @param category 카테고리
 * @param price 가격
 * @param contents 기본 설명
 * @param description 상세 설명
 */
export const protoFormSchema = z.object({
  title: z
    .string()
    .min(2, 'title must be at least 2 characters.')
    .max(32, 'title must be at most 32 characters.'),
  brand: z.string().min(1, 'Please select your brand.'),
  category: z.string().min(1, 'Please select your category.'),
  price: z.coerce.number().min(1, 'price must be at least 1'),
  contents: z.string().optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters.')
    .optional()
  // .or(z.literal(''))
})

export const protoDataSchema = protoFormSchema.extend({ id: z.string() })

/** --- 이하 json-server 전용 로직 --- */

const commonSchema = z
  .object({
    id: z.string(),
    label: z.string()
  })
  .optional()

export const protoJsonSchema = protoDataSchema.extend({
  brandId: z.string(),
  categoryId: z.string(),
  brand: commonSchema,
  category: commonSchema
})

export const protoJsonListSchema = z.array(protoJsonSchema)
