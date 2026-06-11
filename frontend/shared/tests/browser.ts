import { setupWorker } from 'msw/browser'
import { handlers } from '@/shared/tests/handlers'

export const worker = setupWorker(...handlers)
