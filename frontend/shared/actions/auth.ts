'use server'

import { auth, signIn, signOut, update } from '@/shared/lib/auth'
import { redirect } from 'next/navigation'

/**
 * 자격 증명 공급자(Credentials)를 사용 → 회원가입 및 로그인 구현
 */
const signInWithCredentials = async (formData: FormData) => {
  await signIn('credentials', {
    displayName: formData.get('displayName') || '', // `'null'` 문자 방지
    email: formData.get('email') || '',
    password: formData.get('password') || '',
    redirectTo: '/snack' // 로그인 후 메인 페이지로 이동!
  })
}

/* export const signInWithCredentials = async (
  initialState: { message: string },
  formData: FormData
) => {
  try {
    await signIn('credentials', {
      displayName: formData.get('displayName'),
      email: formData.get('email'),
      password: formData.get('password')
      // redirectTo: '/' // 로그인 후 메인 페이지로 이동! → try 문 안에서 동작하지 않습니다!
    })
  } catch (error) {
    return { message: error.cause.err.message }
  }
  redirect('/')
} */

const signInWithGoogle = async () => {
  await signIn('google', {
    /* 옵션 */
    redirectTo: '/'
  })
  // ...
}

const signInWithGitHub = async () => {
  await signIn('github', {
    /* 옵션 */
  })
  // ...
}

const signOutWithForm = async (formData: FormData) => {
  await signOut()
}

export {
  auth as getSession,
  update as updateSession,
  signInWithCredentials,
  signInWithGoogle,
  signInWithGitHub,
  signOutWithForm
}
