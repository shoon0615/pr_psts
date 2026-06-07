import { z } from 'zod'

export const signinSchema = z.object({
  email: z.email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.')
})

export type SigninInput = z.infer<typeof signinSchema>

export const signinDefaultValues = {
  email: '',
  password: ''
} satisfies SigninInput

/* export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, '이름은 2자 이상 입력해주세요.')
      .max(30, '이름은 30자까지만 입력해주세요.'),
    email: z.email('올바른 이메일을 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(8)
    // image: z.string().url().optional().or(z.literal(''))
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  }) */

export const signupSchema = signinSchema
  .extend({
    // name: z
    displayName: z
      .string()
      .min(2, '이름은 2자 이상 입력해주세요.')
      .max(30, '이름은 30자까지만 입력해주세요.'),
    passwordConfirm: z.string().min(8)
    // image: z.string().url().optional().or(z.literal(''))
  })
  .refine(value => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.'
  })

export type SignupInput = z.infer<typeof signupSchema>

export const signupDefaultValues = {
  // name: '',
  displayName: '',
  email: '',
  password: '',
  passwordConfirm: ''
} satisfies SignupInput
