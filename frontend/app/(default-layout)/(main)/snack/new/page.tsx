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

import { Form, FormInput } from '@/shared/components/ui/custom/form'
import { SubmitErrorHandler } from 'react-hook-form'

import {
  createSnackSchema,
  CreateSnackInput
} from '@/features/snack/schema/snack.schema'
import { formAction } from '@/features/snack/actions/snack.action'

import { useToast } from '@/shared/hooks/use-toast'
import { toast as tt } from 'sonner'

export default function SnackNew() {
  const { toast } = useToast()
  const defaultValues = {
    title: '',
    brand: '',
    category: '',
    price: 0,
    description: ''
  }

  // const onSubmit: SubmitHandler<CreateSnackInput> = formData => {
  function onSubmit(formData: CreateSnackInput) {
    console.log('formData', formData)
    // tt('제출 성공', { position: 'top-center' })
    /* toast({
      title: '제출 성공',
      description: '과자가 성공적으로 등록되었습니다.'
    }) */
    formAction()
  }

  const onError: SubmitErrorHandler<CreateSnackInput> = formData => {
    console.log('Validation Errors:', formData)
    /* toast({
      variant: 'destructive',
      title: '입력 확인 필요',
      description: '모든 필드를 올바르게 입력해주세요.'
    }) */
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Form
          schema={createSnackSchema}
          onSubmit={onSubmit}
          onError={onError}
          id="form-rhf-demo"
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
              <CardContent>
                <FormInput
                  name="title"
                  label="상품명"
                  placeholder="과자 이름을 입력하세요 (5자 이상)"
                />
              </CardContent>
              <CardFooter>
                <Field
                  orientation="horizontal"
                  className="justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => methods.reset()}>
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    form="form-rhf-demo">
                    Submit
                  </Button>
                </Field>
              </CardFooter>
            </Card>
          )}
        </Form>
      </div>
    </div>
  )
}
