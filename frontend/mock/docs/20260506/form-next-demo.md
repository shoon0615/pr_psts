# Form Next Demo (Next.js Form)

이 예제는 `next/form`과 React의 `useActionState`를 사용하여 서버 액션과 연동하는 최신 방식입니다.

```tsx
"use client"

import * as React from "react"
import Form from "next/form"
import { toast } from "sonner"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group"
import { Spinner } from "@/shared/components/ui/spinner"

// 실제 구현 시 action 함수와 타입을 별도 파일에서 가져옵니다.
const demoFormAction = async (prevState: any, formData: FormData) => {
  // 서버 액션 로직 예시
  return { values: { title: "", description: "" }, errors: null, success: true }
}

export default function FormNextDemo() {
  const [formState, formAction, pending] = React.useActionState(demoFormAction, {
    values: { title: "", description: "" },
    errors: null,
    success: false,
  })
  const [descriptionLength, setDescriptionLength] = React.useState(0)

  React.useEffect(() => {
    if (formState.success) {
      toast("Thank you for your feedback", {
        description: "We'll review your report and get back to you soon.",
      })
    }
  }, [formState.success])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} id="bug-report-form">
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.title?.length}>
              <FieldLabel htmlFor="title">Bug Title</FieldLabel>
              <Input
                id="title"
                name="title"
                defaultValue={formState.values.title}
                disabled={pending}
                aria-invalid={!!formState.errors?.title?.length}
                placeholder="Login button not working on mobile"
                autoComplete="off"
              />
              {formState.errors?.title && (
                <FieldError>{formState.errors.title[0]}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!formState.errors?.description?.length}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="description"
                  name="description"
                  defaultValue={formState.values.description}
                  placeholder="I'm having an issue with the login button on mobile."
                  rows={6}
                  className="min-h-24 resize-none"
                  disabled={pending}
                  aria-invalid={!!formState.errors?.description?.length}
                  onChange={(e) => setDescriptionLength(e.target.value.length)}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {descriptionLength}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              {formState.errors?.description && (
                <FieldError>{formState.errors.description[0]}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" disabled={pending} form="bug-report-form">
            {pending && <Spinner />}
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
```
