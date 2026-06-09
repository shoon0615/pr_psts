import SigninForm from '@/app/(default-layout)/(public)/_components/signin-form'
import LoginForm from '@/app/(default-layout)/(public)/_components/login-form'

export default function SigninPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm />
        {/* <LoginForm /> */}
      </div>
    </div>
  )
}
