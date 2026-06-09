// schema/post.schema.ts
import { z } from 'zod'

export const createSnackSchema = z.object({
  title: z
    .string()
    .min(2, 'title must be at least 2 characters.')
    .max(32, 'title must be at most 32 characters.'),
  brand: z.string().min(1, 'Please select your brand.'),
  category: z.string().min(1, 'Please select your category.'),
  contents: z.string().optional(),
  price: z.coerce.number().min(1, 'price must be at least 1')
  /* price: z.number().min(1, 'price must be at least 1'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(100, 'Description must be at most 100 characters.') */
})

export type CreateSnackInput = z.infer<typeof createSnackSchema>
/* export type CreateSnackInput = z.input<typeof createSnackSchema>
export type CreateSnackOutput = z.output<typeof createSnackSchema> */

export const createSnackArraySchema = z.array(
  z.object({
    id: z.number(),
    title: z.string()
  })
)

export type SnackArrayInput = z.infer<typeof createSnackArraySchema>

/**
 * snackDefaultValues: CreateSnackInput → title(string) 추론
 * satisfies CreateSnackInput → title(string) '' 까지 추론
 */
// export const snackDefaultValues: Readonly<CreateSnackInput> = {
export const snackDefaultValues = {
  title: '',
  brand: '',
  category: '',
  contents: '',
  price: 0
} satisfies CreateSnackInput

/** TODO: */
export function onSubmit(data: CreateSnackInput) {
  /* toast("You submitted the following values:", {
    description: (
      <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    position: "bottom-right",
    classNames: {
      content: "flex flex-col gap-2",
    },
    style: {
      "--border-radius": "calc(var(--radius)  + 4px)",
    } as React.CSSProperties,
  }) */
}

// service
/* export async function createPostService(data: PostInput) {
  const validated = PostSchema.parse(data) // 🔥 런타임 검증

  return db.post.create({
    data: validated,
  })
} */
