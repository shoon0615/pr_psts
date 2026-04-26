'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  useForm,
  useController,
  type Resolver,
  type UseFormProps,
  type UseFormReturn,
  type SubmitHandler,
  type SubmitErrorHandler
} from 'react-hook-form'
import {
  ErrorMessage,
  FieldValuesFromFieldErrors
} from '@hookform/error-message'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/shared/lib/utils'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/input'

// const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    formState,
    ...fieldState
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}>
      {body}
    </p>
  )
}

/** @deprecated 테스트해봤으나 부적합 */
function FormMessageCustom({ className, ...props }: React.ComponentProps<'p'>) {
  const {
    name,
    formMessageId,
    formState: { errors }
  } = useFormField()

  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p
          data-slot="form-message"
          id={formMessageId}
          className={cn('text-destructive text-sm', className)}
          {...props}>
          {message}
        </p>
      )}
    />
  )
}

/** @deprecated 부적합 */
function FormMessageMultiCustom({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()

  return (
    <ErrorMessage
      errors={error}
      name={formMessageId}
      render={({ messages }) =>
        messages &&
        Object.entries(messages).map(([type, message]) => (
          <p
            key={type}
            data-slot="form-message"
            id={`${formMessageId}${type}`}
            className={cn('text-destructive text-sm', className)}
            {...props}>
            {message}
          </p>
        ))
      }
    />
  )
}

type FormProps<TFormValues extends FieldValues> = {
  id?: string
  options?: UseFormProps<TFormValues>
  schema: z.ZodType<TFormValues, TFormValues>
  className?: string
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode
  onSubmit: SubmitHandler<TFormValues>
  onError?: SubmitErrorHandler<TFormValues>
}

const Form = <TFormValues extends FieldValues>({
  onSubmit,
  onError,
  children,
  className,
  options,
  id,
  schema
}: FormProps<TFormValues>) => {
  /* const form = useForm<TFormValues>({
    ...options,
    resolver: zodResolver(schema) as Resolver<TFormValues>,
  }) */
  const form = useForm({ ...options, resolver: zodResolver(schema) })

  return (
    <FormProvider {...form}>
      <form
        className={cn('space-y-4', className)}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        id={id}>
        {children(form)}
      </form>
    </FormProvider>
  )
}

interface FormInputProps extends React.ComponentProps<typeof Input> {
  name: string
  label?: string
  description?: string
}

function FormInput({ name, label, description, ...props }: FormInputProps) {
  const { control } = useFormContext() // FormProvider 내부에서 사용됨
  const { field } = useController({ name, control })

  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input
            {...props}
            {...field}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </FormFieldContext.Provider>
  )
}

export {
  useFormField,
  Form,
  FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormInput
}
