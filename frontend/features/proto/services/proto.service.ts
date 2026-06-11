// import { protoRepository as repository } from '@/features/proto/repositories/proto.api.repository'
import { protoRepository as repository } from '@/features/proto/repositories/proto.json.repository'
import {
  ProtoSearchParams,
  ProtoFormData
} from '@/features/proto/types/proto.type'

export const protoService = {
  getAll: async () => await repository.findAll(),

  getList: async (params: ProtoSearchParams) =>
    await repository.findMany(params),

  getOne: async (id: string) => await repository.findUnique(id),

  create: async (params: ProtoFormData) => await repository.insert(params),

  modify: async (id: string, params: ProtoFormData) =>
    await repository.update(id, params),

  remove: async (id: string) => await repository.delete(id)
}
