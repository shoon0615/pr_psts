import { render, screen } from '@testing-library/react'
import React from 'react'

import TodoApp from '@/features/todo/components/todo-app'
import {
  readTodosFromStorage,
  resetTodoStoreCache,
  seedTodos,
  STORAGE_KEY,
  writeTodos
} from '@/features/todo/lib/todo-store'

describe('todo-store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetTodoStoreCache()
  })

  it('returns the same snapshot reference while storage is unchanged', () => {
    const first = readTodosFromStorage()
    const second = readTodosFromStorage()

    expect(first).toBe(second)
    expect(first).toBe(seedTodos)
  })

  it('updates the snapshot reference only after storage changes', () => {
    const nextTodos = [
      {
        id: 'todo-next',
        title: 'snapshot cache check',
        completed: false,
        createdAt: '2026-06-19T12:00:00.000Z'
      }
    ]

    const beforeWrite = readTodosFromStorage()
    writeTodos(nextTodos)
    const afterWrite = readTodosFromStorage()
    const repeatedRead = readTodosFromStorage()

    expect(afterWrite).toEqual(nextTodos)
    expect(afterWrite).toBe(repeatedRead)
    expect(afterWrite).not.toBe(beforeWrite)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify(nextTodos)
    )
  })

  it('renders without the getSnapshot infinite loop warning', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(React.createElement(TodoApp))

    expect(
      screen.getByText('하루 일정을 한 화면에서 정리하는 Todo App')
    ).toBeInTheDocument()
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('The result of getSnapshot should be cached')
    )

    errorSpy.mockRestore()
  })
})
