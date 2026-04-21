'use client'

// route 이용 방법(HTTP 요청)
import { api } from '@/shared/lib/axios'

/** TODO: */
// server actions 이용 방법
import {
  getSnackList,
  createSnack
} from '@/features/snack/actions/snack.action'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useSnacks() {
  return useQuery({
    queryKey: ['snack'],
    /* queryFn: async () => {
      const { data } = await api.get('/boards?')
      return data
    }
    queryFn: () => api.get('/boards?').then(res => res.data) */
    queryFn: getSnackList
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
