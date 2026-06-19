export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export const STORAGE_KEY = 'default-layout-todos'
export const STORAGE_EVENT = 'default-layout-todos-updated'

export const seedTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Next 기본 레이아웃에 Todo 화면 구성하기',
    completed: false,
    createdAt: '2026-06-19T09:00:00.000Z'
  },
  {
    id: 'todo-2',
    title: '오늘 처리할 작업 3개만 남기고 정리하기',
    completed: false,
    createdAt: '2026-06-19T09:30:00.000Z'
  },
  {
    id: 'todo-3',
    title: '완료한 항목은 바로 체크해서 흐름 유지하기',
    completed: false,
    createdAt: '2026-06-19T10:00:00.000Z'
  }
]

let cachedRaw: string | null | undefined
let cachedSnapshot: Todo[] = seedTodos

export function getServerTodos() {
  return seedTodos
}

export function readTodosFromStorage() {
  if (typeof window === 'undefined') return seedTodos

  const saved = window.localStorage.getItem(STORAGE_KEY)

  if (saved === cachedRaw) {
    return cachedSnapshot
  }

  if (!saved) {
    cachedRaw = null
    cachedSnapshot = seedTodos
    return cachedSnapshot
  }

  try {
    const parsed = JSON.parse(saved) as Todo[]
    cachedRaw = saved
    cachedSnapshot = Array.isArray(parsed) ? parsed : seedTodos
    return cachedSnapshot
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    cachedRaw = null
    cachedSnapshot = seedTodos
    return cachedSnapshot
  }
}

export function subscribeTodos(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const onChange = () => callback()

  window.addEventListener('storage', onChange)
  window.addEventListener(STORAGE_EVENT, onChange)

  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(STORAGE_EVENT, onChange)
  }
}

export function writeTodos(todos: Todo[]) {
  if (typeof window === 'undefined') return

  const serialized = JSON.stringify(todos)
  cachedRaw = serialized
  cachedSnapshot = todos
  window.localStorage.setItem(STORAGE_KEY, serialized)
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

export function resetTodoStoreCache() {
  cachedRaw = undefined
  cachedSnapshot = seedTodos
}
