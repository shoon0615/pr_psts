import { setupServer } from 'msw/node'
import { handlers } from '@/shared/tests/handlers'

export const server = setupServer(...handlers)
