'use server'

import { ProtoFormData } from '@/features/proto/types/proto.type'
import { protoService as service } from '@/features/proto/services/proto.service'

export async function createProto(params: ProtoFormData) {
  return await service.create(params)
}

export async function modifyProto(id: string, params: ProtoFormData) {
  return await service.modify(id, params)
}

export async function removeProto(id: string) {
  return await service.remove(id)
}
