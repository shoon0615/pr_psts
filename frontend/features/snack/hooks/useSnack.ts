'use client'

// route 이용 방법(HTTP 요청)
import { api } from '@/shared/lib/axios'

// server actions 이용 방법
import { createSnack } from '@/features/snack/actions/snack.action'

// service 이용 방법
import { selectAllSnack } from '@/features/snack/services/snack.service'

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

export function useSnacks() {
  return useSuspenseQuery({
    queryKey: ['snack'],
    // queryFn: api.get<Snack[]>(`${apiUrl}`).then(res => res.data)
    queryFn: selectAllSnack
  })
}

function CreateSnack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSnack,
    onSuccess: () => {
      // queryClient.invalidateQueries(['snack'])   // 자동 refetch
    }
    /* onMutate: async newSnack => {
      // 낙관적 업데이트
      await queryClient.cancelQueries(['snack'])

      const prev = queryClient.getQueryData(['snack'])

      queryClient.setQueryData(['snack'], old => [...old, newSnack])

      return { prev }
    } */
  })

  // <button onClick={() => mutation.mutate({ title: 'hi' })}>
}
