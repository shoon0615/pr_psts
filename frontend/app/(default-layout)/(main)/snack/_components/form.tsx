'use client'

import { useParams, useRouter, notFound } from 'next/navigation'
import {
  useSnackSearchOptions,
  useSnackDetail,
  useModifySnack
} from '@/features/snack/hooks/useSnack'
import {
  createSnackSchema,
  CreateSnackInput
} from '@/features/snack/schema/snack.schema'
import { toast } from '@/shared/lib/toast'

import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { Field } from '@/shared/components/ui/field'
import {
  Form,
  FormInput,
  FormSelect,
  FormTextarea
} from '@/shared/components/ui/custom/form'

export default function SnackForm() {
  // const { id } = useParams()
  const { id } = useParams<{ id: string }>()
  const { brands, categories } = useSnackSearchOptions()
  const { data } = useSnackDetail(id)
  const { mutateAsync, isPending, isError, error } = useModifySnack(id)
  const router = useRouter()

  if (!data) {
    notFound()
  }

  async function onSubmit(formData: CreateSnackInput) {
    // console.log('formData', formData)
    await toast.promise(mutateAsync(formData))
    router.replace('/snack')
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Form
          schema={createSnackSchema}
          onSubmit={onSubmit}
          id="form-snack-modify"
          className="w-full sm:max-w-xl"
          options={{ defaultValues: data }}>
          {methods => (
            <Card>
              <CardHeader>
                <CardTitle>
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    상품 등록
                  </h4>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="title"
                  label="상품명"
                  placeholder="과자 이름을 입력하세요 (5자 이상)"
                />
                <FormSelect
                  name="brand"
                  label="브랜드"
                  placeholder="- 선택 -"
                  items={brands}
                />
                <FormSelect
                  name="category"
                  label="카테고리"
                  placeholder="- 선택 -"
                  items={categories}
                />
                <FormTextarea
                  name="contents"
                  label="상품 설명"
                  placeholder="test"
                  className="resize-none"
                />
              </CardContent>
              <CardFooter>
                <Field
                  orientation="horizontal"
                  className="justify-center">
                  <Button
                    type="button"
                    form="form-snack"
                    variant="outline"
                    onClick={() => methods.reset()}>
                    초기화
                  </Button>
                  <Button
                    type="submit"
                    form="form-snack-modify"
                    disabled={isPending}>
                    {isPending ? '등록 중..' : '등록'}
                  </Button>
                  {/* {isError && <p>{error.message}</p>} */}
                </Field>
              </CardFooter>
            </Card>
          )}
        </Form>
      </div>
    </div>
  )
}
