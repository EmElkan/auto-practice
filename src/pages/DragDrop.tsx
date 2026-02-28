import { useState, useEffect, type DragEvent } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type SortableItem = {
  id: number
  label: string
}

type KanbanTask = {
  id: number
  title: string
  column: 'todo' | 'progress' | 'done'
}

const initialSortableItems: SortableItem[] = [
  { id: 3, label: 'Item 3' },
  { id: 1, label: 'Item 1' },
  { id: 5, label: 'Item 5' },
  { id: 2, label: 'Item 2' },
  { id: 4, label: 'Item 4' },
]

const initialKanbanTasks: KanbanTask[] = [
  { id: 1, title: 'Write tests', column: 'todo' },
  { id: 2, title: 'Fix bugs', column: 'todo' },
  { id: 3, title: 'Review PR', column: 'progress' },
  { id: 4, title: 'Deploy app', column: 'todo' },
]

function DragDrop() {
  const { setStatus, getStatus } = useProgressStore()
  const [sortableItems, setSortableItems] = useState<SortableItem[]>(initialSortableItems)
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(initialKanbanTasks)
  const [draggedSortableId, setDraggedSortableId] = useState<number | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // Keyboard accessibility state
  const [focusItemId, setFocusItemId] = useState<number | null>(null)
  const [focusTaskId, setFocusTaskId] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const kanbanColumns: Array<'todo' | 'progress' | 'done'> = ['todo', 'progress', 'done']
  const columnLabels: Record<string, string> = { todo: 'Todo', progress: 'In Progress', done: 'Done' }

  // Focus management after keyboard reorder
  useEffect(() => {
    if (focusItemId !== null) {
      const el = document.querySelector(`[data-testid="sortable-item-${focusItemId}"]`) as HTMLElement
      el?.focus()
      setFocusItemId(null)
    }
  }, [focusItemId, sortableItems])

  useEffect(() => {
    if (focusTaskId !== null) {
      const el = document.querySelector(`[data-testid="task-${focusTaskId}"]`) as HTMLElement
      el?.focus()
      setFocusTaskId(null)
    }
  }, [focusTaskId, kanbanTasks])

  // Keyboard handler for sortable items (Arrow Up/Down to reorder)
  const handleSortableKeyDown = (e: React.KeyboardEvent, itemId: number) => {
    const index = sortableItems.findIndex(item => item.id === itemId)
    const item = sortableItems[index]
    if (!item) return

    let targetIndex = -1
    if (e.key === 'ArrowUp' && index > 0) {
      targetIndex = index - 1
    } else if (e.key === 'ArrowDown' && index < sortableItems.length - 1) {
      targetIndex = index + 1
    }

    if (targetIndex >= 0) {
      e.preventDefault()
      const newItems = [...sortableItems]
      const [removed] = newItems.splice(index, 1)
      if (removed) newItems.splice(targetIndex, 0, removed)
      setSortableItems(newItems)
      setFocusItemId(itemId)
      setAnnouncement(`Moved ${item.label} to position ${targetIndex + 1} of ${sortableItems.length}`)
    }
  }

  // Keyboard handler for kanban tasks (Arrow Left/Right to move between columns)
  const handleTaskKeyDown = (e: React.KeyboardEvent, taskId: number) => {
    const task = kanbanTasks.find(t => t.id === taskId)
    if (!task) return
    const colIndex = kanbanColumns.indexOf(task.column)

    let newColumn: 'todo' | 'progress' | 'done' | undefined
    if (e.key === 'ArrowRight' && colIndex < kanbanColumns.length - 1) {
      newColumn = kanbanColumns[colIndex + 1]
    } else if (e.key === 'ArrowLeft' && colIndex > 0) {
      newColumn = kanbanColumns[colIndex - 1]
    }

    if (newColumn) {
      e.preventDefault()
      const col = newColumn
      setKanbanTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, column: col } : t))
      setFocusTaskId(taskId)
      setAnnouncement(`Moved ${task.title} to ${columnLabels[col]}`)
    }
  }

  // Check if sortable list is in correct order (1-5)
  const isSortableCorrect = sortableItems.every((item, index) => item.id === index + 1)

  // Check if all kanban tasks are in "done" column
  const isKanbanComplete = kanbanTasks.every((task) => task.column === 'done')

  // Update progress when challenges are completed
  useEffect(() => {
    if ((isSortableCorrect || isKanbanComplete) && getStatus('drag-drop') === 'not_started') {
      setStatus('drag-drop', 'in_progress')
    }
  }, [isSortableCorrect, isKanbanComplete, getStatus, setStatus])

  // Sortable list handlers
  const handleSortableDragStart = (e: DragEvent<HTMLDivElement>, id: number) => {
    setDraggedSortableId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id.toString())
  }

  const handleSortableDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleSortableDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedSortableId === null) return

    const dragIndex = sortableItems.findIndex((item) => item.id === draggedSortableId)
    if (dragIndex === dropIndex) {
      setDraggedSortableId(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...sortableItems]
    const [draggedItem] = newItems.splice(dragIndex, 1)
    if (draggedItem) {
      newItems.splice(dropIndex, 0, draggedItem)
    }

    setSortableItems(newItems)
    setDraggedSortableId(null)
    setDragOverIndex(null)
  }

  const handleSortableDragEnd = () => {
    setDraggedSortableId(null)
    setDragOverIndex(null)
  }

  // Kanban handlers
  const handleTaskDragStart = (e: DragEvent<HTMLDivElement>, taskId: number) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId.toString())
  }

  const handleColumnDragOver = (e: DragEvent<HTMLDivElement>, column: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(column)
  }

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>, column: 'todo' | 'progress' | 'done') => {
    e.preventDefault()
    if (draggedTaskId === null) return

    setKanbanTasks((tasks) =>
      tasks.map((task) =>
        task.id === draggedTaskId ? { ...task, column } : task
      )
    )
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  const handleColumnDragLeave = () => {
    setDragOverColumn(null)
  }

  // Reset functions
  const resetSortable = () => {
    setSortableItems(initialSortableItems)
  }

  const resetKanban = () => {
    setKanbanTasks(initialKanbanTasks)
  }

  const getTasksByColumn = (column: 'todo' | 'progress' | 'done') => {
    return kanbanTasks.filter((task) => task.column === column)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Drag & Drop Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Practice testing drag and drop interactions using
        Playwright's <code>locator.dragTo()</code> method.
      </p>

      <hr />

      {/* Section 1: Sortable List */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">
          Section 1: Sortable List
          {isSortableCorrect && (
            <span className="retro-success ml-2" data-testid="sortable-success">
              [CORRECT ORDER!]
            </span>
          )}
        </h3>
        <p className="text-sm mb-4">
          Drag and drop to reorder the items so they are numbered 1 through 5, from top to bottom.
          <span className="block text-xs text-gray-500 mt-1">
            Keyboard: use Arrow Up/Down to reorder items.
          </span>
        </p>

        <div className="retro-panel p-4" data-testid="sortable-list" role="list" aria-label="Sortable items">
          {sortableItems.map((item, index) => (
            <div
              key={item.id}
              data-testid={`sortable-item-${item.id}`}
              role="listitem"
              tabIndex={0}
              aria-label={`${item.label}, position ${index + 1} of ${sortableItems.length}`}
              draggable
              onDragStart={(e) => handleSortableDragStart(e, item.id)}
              onDragOver={(e) => handleSortableDragOver(e, index)}
              onDrop={(e) => handleSortableDrop(e, index)}
              onDragEnd={handleSortableDragEnd}
              onKeyDown={(e) => handleSortableKeyDown(e, item.id)}
              className={`
                p-3 mb-2 cursor-move select-none
                retro-panel-raised
                ${draggedSortableId === item.id ? 'opacity-50' : ''}
                ${dragOverIndex === index && draggedSortableId !== item.id ? 'border-t-4 border-blue-500' : ''}
              `}
            >
              {item.label}
            </div>
          ))}
        </div>

        <button
          className="retro-button mt-2"
          onClick={resetSortable}
          data-testid="reset-sortable"
        >
          Reset Order
        </button>
      </div>

      <hr className="my-4" />

      {/* Section 2: Kanban Board */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">
          Section 2: Kanban Board
          {isKanbanComplete && (
            <span className="retro-success ml-2" data-testid="kanban-success">
              [ALL TASKS DONE!]
            </span>
          )}
        </h3>
        <p className="text-sm mb-4">
          Drag tasks between columns. Move all tasks to the "Done" column to complete.
          <span className="block text-xs text-gray-500 mt-1">
            Keyboard: use Arrow Left/Right to move tasks between columns.
          </span>
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* Todo Column */}
          <div
            className={`retro-panel p-2 min-h-[200px] ${dragOverColumn === 'todo' ? 'bg-blue-100' : ''}`}
            data-testid="column-todo"
            role="group"
            aria-label="Todo"
            onDragOver={(e) => handleColumnDragOver(e, 'todo')}
            onDrop={(e) => handleColumnDrop(e, 'todo')}
            onDragLeave={handleColumnDragLeave}
          >
            <h4 className="font-bold text-center mb-2 border-b pb-1">Todo</h4>
            {getTasksByColumn('todo').map((task) => (
              <div
                key={task.id}
                data-testid={`task-${task.id}`}
                tabIndex={0}
                aria-label={`${task.title}, in Todo. Use Arrow Left/Right to move.`}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task.id)}
                onDragEnd={handleTaskDragEnd}
                onKeyDown={(e) => handleTaskKeyDown(e, task.id)}
                className={`
                  p-2 mb-2 cursor-move select-none
                  retro-panel-raised text-sm
                  ${draggedTaskId === task.id ? 'opacity-50' : ''}
                `}
              >
                {task.title}
              </div>
            ))}
          </div>

          {/* In Progress Column */}
          <div
            className={`retro-panel p-2 min-h-[200px] ${dragOverColumn === 'progress' ? 'bg-yellow-100' : ''}`}
            data-testid="column-progress"
            role="group"
            aria-label="In Progress"
            onDragOver={(e) => handleColumnDragOver(e, 'progress')}
            onDrop={(e) => handleColumnDrop(e, 'progress')}
            onDragLeave={handleColumnDragLeave}
          >
            <h4 className="font-bold text-center mb-2 border-b pb-1">In Progress</h4>
            {getTasksByColumn('progress').map((task) => (
              <div
                key={task.id}
                data-testid={`task-${task.id}`}
                tabIndex={0}
                aria-label={`${task.title}, in In Progress. Use Arrow Left/Right to move.`}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task.id)}
                onDragEnd={handleTaskDragEnd}
                onKeyDown={(e) => handleTaskKeyDown(e, task.id)}
                className={`
                  p-2 mb-2 cursor-move select-none
                  retro-panel-raised text-sm
                  ${draggedTaskId === task.id ? 'opacity-50' : ''}
                `}
              >
                {task.title}
              </div>
            ))}
          </div>

          {/* Done Column */}
          <div
            className={`retro-panel p-2 min-h-[200px] ${dragOverColumn === 'done' ? 'bg-green-100' : ''}`}
            data-testid="column-done"
            role="group"
            aria-label="Done"
            onDragOver={(e) => handleColumnDragOver(e, 'done')}
            onDrop={(e) => handleColumnDrop(e, 'done')}
            onDragLeave={handleColumnDragLeave}
          >
            <h4 className="font-bold text-center mb-2 border-b pb-1">Done</h4>
            {getTasksByColumn('done').map((task) => (
              <div
                key={task.id}
                data-testid={`task-${task.id}`}
                tabIndex={0}
                aria-label={`${task.title}, in Done. Use Arrow Left/Right to move.`}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task.id)}
                onDragEnd={handleTaskDragEnd}
                onKeyDown={(e) => handleTaskKeyDown(e, task.id)}
                className={`
                  p-2 mb-2 cursor-move select-none
                  retro-panel-raised text-sm
                  ${draggedTaskId === task.id ? 'opacity-50' : ''}
                `}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>

        <button
          className="retro-button mt-4"
          onClick={resetKanban}
          data-testid="reset-kanban"
        >
          Reset Board
        </button>
      </div>

      <hr className="my-4" />

      {/* Mark Complete */}
      <div className="retro-panel p-4">
        <button
          className="retro-button"
          onClick={() => setStatus('drag-drop', 'completed')}
          data-testid="mark-complete-button"
        >
          Mark Challenge Complete
        </button>
      </div>

      {/* Screen reader announcements for keyboard reordering */}
      <div aria-live="polite" className="sr-only">{announcement}</div>

      <hr className="my-4" />

      <TestHints
        tips={[
          'Use <code>locator.dragTo(target)</code> for locator-based drag and drop',
          'Use <code>page.dragAndDrop(source, target)</code> with CSS selectors as an alternative',
          'Use <code>getByRole()</code> and <code>getByText()</code> for assertions',
          'Verify element order with <code>allTextContents()</code>',
          'Locate columns by their <code>role="group"</code> for clearer tests',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Drag and drop with locators:',
            code: `// Using locator.dragTo() (recommended)
await page.getByRole('listitem', { name: /Item 1/ })
  .dragTo(page.getByRole('listitem', { name: /Item 3/ }))

// Alternative: page.dragAndDrop() with CSS selectors
await page.dragAndDrop(
  '[data-testid="sortable-item-1"]',
  '[data-testid="sortable-item-3"]'
)`,
          },
          {
            title: 'Verify list order:',
            code: `const list = page.getByRole('list', { name: 'Sortable items' })
const items = await list.getByRole('listitem').allTextContents()
// items: ['Item 1', 'Item 2', ...]`,
          },
          {
            title: 'Verify task in column:',
            code: `// Locate column by its group role and aria-label
const doneColumn = page.getByRole('group', { name: 'Done' })
await expect(doneColumn.getByText('Write tests')).toBeVisible()

const todoColumn = page.getByRole('group', { name: 'Todo' })
await expect(todoColumn.getByText('Fix bugs')).toBeVisible()`,
          },
          {
            title: 'Check success messages:',
            code: `// After ordering items 1-5 correctly
await expect(page.getByText('[CORRECT ORDER!]')).toBeVisible()

// After moving all tasks to Done
await expect(page.getByText('[ALL TASKS DONE!]')).toBeVisible()`,
          },
          {
            title: 'Keyboard reordering (accessible alternative):',
            code: `// Focus a sortable item and use ArrowUp/Down to reorder
const list = page.getByRole('list', { name: 'Sortable items' })
await list.getByRole('listitem').first().focus()
await page.keyboard.press('ArrowDown')

// Verify the item moved
const items = await list.getByRole('listitem').allTextContents()
expect(items[1]).toBe('Item 3')

// For kanban: focus a task and use ArrowLeft/Right to move between columns
const todoColumn = page.getByRole('group', { name: 'Todo' })
await todoColumn.getByText('Write tests').focus()
await page.keyboard.press('ArrowRight')
// Task is now in "In Progress"
const progressColumn = page.getByRole('group', { name: 'In Progress' })
await expect(progressColumn.getByText('Write tests')).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default DragDrop
