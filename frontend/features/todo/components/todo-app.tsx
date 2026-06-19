'use client'

import { useDeferredValue, useState, useSyncExternalStore } from 'react'
import {
  CheckCheckIcon,
  CircleDashedIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon
} from 'lucide-react'

import { Badge } from '@/shared/components/shadcn/ui/badge'
import { Button } from '@/shared/components/shadcn/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/shadcn/ui/card'
import { Checkbox } from '@/shared/components/shadcn/ui/checkbox'
import { Input } from '@/shared/components/shadcn/ui/input'
import { cn } from '@/shared/lib/utils'
import {
  getServerTodos,
  readTodosFromStorage,
  subscribeTodos,
  writeTodos
} from '@/features/todo/lib/todo-store'

type Filter = 'all' | 'active' | 'completed'

export default function TodoApp() {
  const todos = useSyncExternalStore(
    subscribeTodos,
    readTodosFromStorage,
    getServerTodos
  )
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const deferredSearch = useDeferredValue(search)
  const normalizedSearch = deferredSearch.trim().toLowerCase()

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active' && todo.completed) return false
    if (filter === 'completed' && !todo.completed) return false
    if (normalizedSearch && !todo.title.toLowerCase().includes(normalizedSearch))
      return false
    return true
  })

  const totalCount = todos.length
  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = totalCount - completedCount
  const completionRate =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  function addTodo() {
    const nextTitle = title.trim()
    if (!nextTitle) return

    writeTodos([
      {
        id: crypto.randomUUID(),
        title: nextTitle,
        completed: false,
        createdAt: new Date().toISOString()
      },
      ...todos
    ])
    setTitle('')
  }

  function toggleTodo(id: string, checked: boolean) {
    writeTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: checked } : todo
      )
    )
  }

  function removeTodo(id: string) {
    writeTodos(todos.filter(todo => todo.id !== id))
  }

  function clearCompleted() {
    writeTodos(todos.filter(todo => !todo.completed))
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.08),_transparent_38%),linear-gradient(180deg,_rgba(0,0,0,0.02),_transparent_28%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-0 bg-[linear-gradient(135deg,_rgba(17,24,39,0.98),_rgba(55,65,81,0.92))] text-white shadow-2xl ring-white/10">
            <CardHeader className="gap-3">
              <Badge className="bg-white/12 text-white hover:bg-white/12">
                <SparklesIcon />
                Focus Board
              </Badge>
              <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                하루 일정을 한 화면에서 정리하는 Todo App
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-white/72">
                기본 레이아웃 안에서 바로 사용할 수 있는 로컬 Todo 앱입니다.
                빠르게 추가하고, 완료 상태를 추적하고, 검색과 필터로 오늘 할
                일을 압축할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="전체"
                value={totalCount}
                tone="soft"
              />
              <MetricCard
                label="진행 중"
                value={activeCount}
                tone="bright"
              />
              <MetricCard
                label="완료율"
                value={`${completionRate}%`}
                tone="soft"
              />
            </CardContent>
          </Card>

          <Card className="border-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,244,245,0.92))] shadow-xl ring-black/5">
            <CardHeader>
              <CardTitle className="text-xl">빠른 입력</CardTitle>
              <CardDescription>
                생각난 일을 바로 적고 현재 집중할 목록만 남기세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={title}
                onChange={event => setTitle(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') addTodo()
                }}
                placeholder="예: 회의 전에 API 명세 다시 확인"
                className="h-11 bg-white"
              />
              <Button
                onClick={addTodo}
                className="h-11 w-full justify-center">
                <PlusIcon />
                할 일 추가
              </Button>
              <div className="rounded-xl border border-black/8 bg-black/3 p-4 text-sm text-muted-foreground">
                브라우저 로컬 스토리지에 자동 저장됩니다.
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-0 shadow-lg ring-black/5">
            <CardHeader>
              <CardTitle className="text-xl">작업 흐름</CardTitle>
              <CardDescription>
                필요한 항목만 남기도록 검색과 상태 필터를 바로 적용합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="할 일 검색"
                  className="h-11 pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'completed'] as const).map(option => (
                  <Button
                    key={option}
                    variant={filter === option ? 'default' : 'outline'}
                    onClick={() => setFilter(option)}
                    className="capitalize">
                    {option === 'all' && '전체'}
                    {option === 'active' && '진행 중'}
                    {option === 'completed' && '완료'}
                  </Button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StatusCard
                  title="실행할 항목"
                  value={activeCount}
                  icon={<CircleDashedIcon className="size-4" />}
                />
                <StatusCard
                  title="끝낸 항목"
                  value={completedCount}
                  icon={<CheckCheckIcon className="size-4" />}
                />
              </div>

              <Button
                variant="outline"
                onClick={clearCompleted}
                disabled={completedCount === 0}
                className="w-full">
                완료 항목 비우기
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg ring-black/5">
            <CardHeader>
              <CardTitle className="text-xl">Todo List</CardTitle>
              <CardDescription>
                최신 항목이 위에 오며, 체크 상태와 검색 결과가 즉시 반영됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-muted/40 px-6 text-center">
                  <p className="text-base font-medium">조건에 맞는 할 일이 없습니다.</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    새 항목을 추가하거나 필터를 변경해 보세요.
                  </p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <article
                    key={todo.id}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border px-4 py-4 transition-colors',
                      todo.completed
                        ? 'border-emerald-200 bg-emerald-50/70'
                        : 'border-black/8 bg-white'
                    )}>
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={checked => toggleTodo(todo.id, checked === true)}
                      aria-label={`${todo.title} 완료 여부`}
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-sm font-medium sm:text-base',
                          todo.completed && 'text-muted-foreground line-through'
                        )}>
                        {todo.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={todo.completed ? 'secondary' : 'outline'}>
                          {todo.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(todo.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeTodo(todo.id)}
                      aria-label={`${todo.title} 삭제`}>
                      <Trash2Icon />
                    </Button>
                  </article>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

function MetricCard({
  label,
  value,
  tone
}: {
  label: string
  value: number | string
  tone: 'soft' | 'bright'
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-4 backdrop-blur-sm',
        tone === 'bright'
          ? 'border-white/20 bg-white/12'
          : 'border-white/12 bg-black/12'
      )}>
      <div className="text-xs uppercase tracking-[0.24em] text-white/60">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  )
}

function StatusCard({
  title,
  value,
  icon
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-muted/30 p-4">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        {icon}
        {title}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
