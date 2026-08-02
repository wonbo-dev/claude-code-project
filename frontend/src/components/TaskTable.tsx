// 태스크 상태 — 순환 전이(pending → in_progress → completed → pending)
export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: number
  title: string
  status: TaskStatus
  description: string
}

interface TaskTableProps {
  tasks: Task[]
  onStatusChange: (id: number, nextStatus: TaskStatus) => void
  onDeleteTask: (id: number) => void
}

// 현재 상태의 다음 상태를 반환
const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
}

function TaskTable({ tasks, onStatusChange, onDeleteTask }: TaskTableProps) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500">
          <th className="px-3 py-2 font-medium">제목</th>
          <th className="px-3 py-2 font-medium">상태</th>
          <th className="px-3 py-2 font-medium">설명</th>
          <th className="px-3 py-2 font-medium">작업</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b border-gray-100">
            <td className="px-3 py-2 text-gray-900">{task.title}</td>
            <td className="px-3 py-2 text-gray-700">{task.status}</td>
            <td className="px-3 py-2 text-gray-500">{task.description}</td>
            <td className="px-3 py-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status])}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  상태 변경
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TaskTable
