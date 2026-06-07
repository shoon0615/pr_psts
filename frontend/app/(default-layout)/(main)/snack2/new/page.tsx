'use client'

import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { Field } from '@/shared/components/ui/field'
import {
  Form,
  FormInput,
  FormSelect,
  FormSelect2,
  FormTextarea
} from '@/shared/components/ui/custom/form'
import { SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

import {
  useSnackSearchOptions,
  useCreateSnack
} from '@/features/snack/hooks/useSnack'
import {
  createSnackSchema,
  CreateSnackInput,
  snackDefaultValues as defaultValues
} from '@/features/snack/schema/snack.schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/shared/lib/toast'

export default function SnackNew() {
  const { brands, categories } = useSnackSearchOptions()
  const { mutate, mutateAsync, isPending, isError, error } = useCreateSnack()
  const router = useRouter()

  /* const defaultValues = {
    title: '',
    brand: '',
    category: '',
    contents: '',
    price: 0
  } */

  /* const onSubmit: SubmitHandler<CreateSnackInput> = async formData => {
    // mutate(formData)
    // await mutateAsync(formData)

    // toast.success('제출 성공')
    // toast.successAction('제출 성공')

    // const promise = mutateAsync(formData)
    // toast.promise(promise)
    // toast.promise(promise, {
    //   loading: '등록 중...',
    //   // success: '등록 완료',
    //   success: (data: { brand: string }) =>
    //     `${data.brand} toast has been added`,
    //   error: (error: Error) => error.message
    // })

    try {
      // const data = await promise
      await promise

      // router.push(`${decodeURIComponent('/snack')}`)
      router.replace('/snack')
    } catch (err) {
      console.error('error', err)
      // toast.error(error.message)
      toast.error(err.message)
    }
  } */

  async function onSubmit(formData: CreateSnackInput) {
    console.log('formData', formData)
    /* await toast.promise(
      mutateAsync(formData, {
        onSuccess: () => {
          router.replace('/snack')
        }
      })
    ) */

    // 실패 시, Promise 를 reject(throw Error) 발생하여 Promise 하단 내용이 실행되지 않음
    await toast.promise(mutateAsync(formData))
    router.replace('/snack')
  }

  const onError: SubmitErrorHandler<CreateSnackInput> = formData => {
    console.log('Validation Errors:', formData)
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Form
          schema={createSnackSchema}
          onSubmit={onSubmit}
          onError={onError}
          id="form-snack-create"
          className="w-full sm:max-w-xl"
          options={{ defaultValues }}>
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
                <FormSelect2
                  name="category"
                  label="카테고리"
                  placeholder="- 선택 -"
                  items={categories}
                />
                <FormInput
                  name="price"
                  label="가격"
                  type="text"
                  inputMode="numeric"
                  placeholder="가격을 입력하세요"
                  onInput={e => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      ''
                    )
                  }}
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
                    form="form-snack-create"
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
