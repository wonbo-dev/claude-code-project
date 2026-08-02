import { useEffect, useState, type FormEvent } from 'react'
import {
  listTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  type Task,
  type TaskStatus,
} from '../lib/api'

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: '대기중',
  in_progress: '진행중',
  completed: '완료',
}

const STATUS_OPTIONS: TaskStatus[] = ['pending', 'in_progress', 'completed']

function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  // 생성 모달
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 상태 변경 드롭다운 (열려 있는 태스크 id)
  const [statusMenuId, setStatusMenuId] = useState<number | null>(null)

  // 삭제 확인 다이얼로그 대상 id
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  // 최초 로드 시 태스크 목록 조회
  useEffect(() => {
    listTasks()
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const created = await createTask({ title, description })
    setTasks((prev) => [...prev, created])
    setTitle('')
    setDescription('')
    setShowCreate(false)
  }

  const handleChangeStatus = async (id: number, status: TaskStatus) => {
    const updated = await updateTaskStatus(id, status)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    setStatusMenuId(null)
  }

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return
    await deleteTask(deleteTargetId)
    setTasks((prev) => prev.filter((t) => t.id !== deleteTargetId))
    setDeleteTargetId(null)
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">대시보드</h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          새 태스크 추가
        </button>
      </header>

      {/* 태스크 목록 */}
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="task-item flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-50">{task.title}</span>
              {task.description && (
                <span className="text-sm text-gray-500">{task.description}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 상태 변경 드롭다운 */}
              <div className="relative">
                <button
                  type="button"
                  data-testid={`status-${task.status}`}
                  onClick={() => setStatusMenuId((cur) => (cur === task.id ? null : task.id))}
                  className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  {STATUS_LABEL[task.status]}
                </button>
                {statusMenuId === task.id && (
                  <ul className="absolute right-0 z-10 mt-1 w-24 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    {STATUS_OPTIONS.map((status) => (
                      <li key={status}>
                        <button
                          type="button"
                          onClick={() => handleChangeStatus(task.id, status)}
                          className="block w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-50"
                        >
                          {STATUS_LABEL[status]}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 삭제 버튼 */}
              <button
                type="button"
                data-testid="delete-button"
                onClick={() => setDeleteTargetId(task.id)}
                className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-center text-sm text-gray-500">등록된 태스크가 없습니다.</p>
      )}

      {/* 생성 모달 */}
      {showCreate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6"
        >
          <form
            onSubmit={handleCreate}
            className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-gray-900">새 태스크</h2>

            <div className="flex flex-col gap-1">
              <label htmlFor="task-title" className="text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                id="task-title"
                name="taskTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="task-description" className="text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                id="task-description"
                name="taskDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {deleteTargetId !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6"
        >
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-xl">
            <p className="text-sm text-gray-800">정말 이 태스크를 삭제하시겠습니까?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default DashboardPage
