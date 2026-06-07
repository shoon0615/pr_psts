import { getSession } from '@/shared/actions/auth'
import { redirect } from 'next/navigation'
import { updateUser } from '@/shared/actions/user'

export default async function MyPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/signin')
  }

  return (
    <>
      <form action={updateUser}>
        <label>
          사용자 이름
          <input
            name="displayName"
            type="text"
            defaultValue={session?.user?.name || ''}
          />
        </label>
        <button type="submit">수정</button>
      </form>
    </>
  )
}
