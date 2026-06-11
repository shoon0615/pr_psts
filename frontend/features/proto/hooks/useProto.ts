import {
  useSuspenseQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { protoSearchSchema } from '@/features/proto/schemas/search.schema'
import {
  brandQueryOptions,
  categoryQueryOptions
} from '@/features/common/queries/common.query'
import {
  protoKeys,
  protoListQueryOptions,
  protoDetailQueryOptions
} from '@/features/proto/queries/proto.query'
import {
  createProto,
  modifyProto,
  removeProto
} from '@/features/proto/actions/proto.action'
import { ProtoFormData } from '@/features/proto/types/proto.type'

/** 검색 */
export function useProtoSearchParams() {
  const [searchParams, setSearchParams] = useQueryStates(protoSearchSchema)
  return { searchParams, setSearchParams }
}

/** 검색(조건) */
export function useProtoSearchOptions() {
  const brandsQuery = useSuspenseQuery(brandQueryOptions())
  const categoriesQuery = useSuspenseQuery(categoryQueryOptions())

  return {
    brands: brandsQuery.data,
    categories: categoriesQuery.data
  }
}

/** 조회(목록) */
export function useProtoList() {
  const { searchParams } = useProtoSearchParams()
  return useSuspenseQuery(protoListQueryOptions(searchParams))
}

/** 조회(상세) */
export function useProtoDetail(id: string) {
  /* return {
    data: useSuspenseQuery(protoDetailQueryOptions(id)).data,
    ...useProtoSearchOptions()
  } */
  return useSuspenseQuery(protoDetailQueryOptions(id))
}

/** 생성 */
export function useProtoCreate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProto,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: protoKeys.lists() })
  })
}

/** 수정 */
export function useProtoModify() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: ProtoFormData }) =>
      modifyProto(id, params),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: protoKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: protoKeys.lists() })
    }
  })
}

/** 삭제 */
export function useProtoRemove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeProto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: protoKeys.lists() })
    }
  })
}
