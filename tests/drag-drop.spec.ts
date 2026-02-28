import { test, expect } from '@playwright/test'

test.describe('Drag & Drop Challenge', () => {
  test('displays sortable list and kanban board', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Verify sortable list section using heading and item text
    await expect(page.getByRole('heading', { name: /Section 1: Sortable List/ })).toBeVisible()
    await expect(page.getByText('Item 1')).toBeVisible()
    await expect(page.getByText('Item 2')).toBeVisible()
    await expect(page.getByText('Item 3')).toBeVisible()
    await expect(page.getByText('Item 4')).toBeVisible()
    await expect(page.getByText('Item 5')).toBeVisible()

    // Verify kanban board section using column headings
    await expect(page.getByRole('heading', { name: 'Todo' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible()

    // Verify tasks are present using their titles (scoped to kanban columns)
    const todoColumn = page.getByRole('group', { name: 'Todo' })
    await expect(todoColumn.getByText('Write tests')).toBeVisible()
    await expect(todoColumn.getByText('Fix bugs')).toBeVisible()
    await expect(todoColumn.getByText('Deploy app')).toBeVisible()

    const progressColumn = page.getByRole('group', { name: 'In Progress' })
    await expect(progressColumn.getByText('Review PR')).toBeVisible()
  })

  test('can reorder sortable items', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Get the initial order of items in the sortable list
    const list = page.getByRole('list', { name: 'Sortable items' })
    const initialItems = await list.getByRole('listitem').allTextContents()

    // Drag first item (Item 3 in default state) to after second item (Item 1)
    await list.getByRole('listitem', { name: /Item 3/ })
      .dragTo(list.getByRole('listitem', { name: /Item 1/ }))

    // Verify items have been reordered (the order should have changed)
    const reorderedItems = await list.getByRole('listitem').allTextContents()
    expect(reorderedItems).not.toEqual(initialItems)
  })

  test('shows success when sortable items are correctly ordered', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Success message should not be visible initially
    await expect(page.getByText('[CORRECT ORDER!]')).not.toBeVisible()

    // Reorder items to correct order (1, 2, 3, 4, 5)
    // Initial order: 3, 1, 5, 2, 4
    // Target order: 1, 2, 3, 4, 5
    const list = page.getByRole('list', { name: 'Sortable items' })

    // Swap 3 and 1: drag item 1 to item 3's position
    await list.getByRole('listitem', { name: /Item 1/ })
      .dragTo(list.getByRole('listitem', { name: /Item 3/ }))
    // Now: 1, 3, 5, 2, 4

    // Move 2 to position after 1 (before 3)
    await list.getByRole('listitem', { name: /Item 2/ })
      .dragTo(list.getByRole('listitem', { name: /Item 3/ }))
    // Now: 1, 2, 3, 5, 4

    // Move 4 to position before 5
    await list.getByRole('listitem', { name: /Item 4/ })
      .dragTo(list.getByRole('listitem', { name: /Item 5/ }))
    // Now: 1, 2, 3, 4, 5

    // Success message should be visible
    await expect(page.getByText('[CORRECT ORDER!]')).toBeVisible()
  })

  test('can drag tasks between kanban columns', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Task "Write tests" should initially be in Todo column
    const todoColumn = page.getByRole('group', { name: 'Todo' })
    await expect(todoColumn.getByText('Write tests')).toBeVisible()

    // Drag task to Done column
    const doneColumn = page.getByRole('group', { name: 'Done' })
    await todoColumn.getByText('Write tests').dragTo(doneColumn)

    // Task should now be in Done column
    await expect(doneColumn.getByText('Write tests')).toBeVisible()
  })

  test('shows success when all kanban tasks are in Done column', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Success message should not be visible initially
    await expect(page.getByText('[ALL TASKS DONE!]')).not.toBeVisible()

    // Drag all tasks to Done column
    const todoColumn = page.getByRole('group', { name: 'Todo' })
    const progressColumn = page.getByRole('group', { name: 'In Progress' })
    const doneColumn = page.getByRole('group', { name: 'Done' })

    await todoColumn.getByText('Write tests').dragTo(doneColumn)
    await todoColumn.getByText('Fix bugs').dragTo(doneColumn)
    await progressColumn.getByText('Review PR').dragTo(doneColumn)
    await todoColumn.getByText('Deploy app').dragTo(doneColumn)

    // Success message should be visible
    await expect(page.getByText('[ALL TASKS DONE!]')).toBeVisible()
  })

  test('reset sortable button works', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Get initial items from sortable list
    const list = page.getByRole('list', { name: 'Sortable items' })
    const initialItems = await list.getByRole('listitem').allTextContents()

    // Reorder an item
    await list.getByRole('listitem', { name: /Item 1/ })
      .dragTo(list.getByRole('listitem', { name: /Item 3/ }))

    // Verify order changed
    const reorderedItems = await list.getByRole('listitem').allTextContents()
    expect(reorderedItems).not.toEqual(initialItems)

    // Click reset using button role
    await page.getByRole('button', { name: 'Reset Order' }).click()

    // Order should be back to initial
    const resetItems = await list.getByRole('listitem').allTextContents()
    expect(resetItems).toEqual(initialItems)
  })

  test('reset kanban button works', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Drag a task to Done column
    const todoColumn = page.getByRole('group', { name: 'Todo' })
    const doneColumn = page.getByRole('group', { name: 'Done' })
    await todoColumn.getByText('Write tests').dragTo(doneColumn)

    // Verify task is in Done column
    await expect(doneColumn.getByText('Write tests')).toBeVisible()

    // Click reset using button role
    await page.getByRole('button', { name: 'Reset Board' }).click()

    // Task should be back in Todo column
    await expect(todoColumn.getByText('Write tests')).toBeVisible()
  })

  test('nav link exists and works', async ({ page }) => {
    await page.goto('/')

    // Click the nav link using role
    await page.getByRole('link', { name: 'Drag' }).click()

    // Should be on the drag-drop page
    await expect(page).toHaveURL('/challenges/drag-drop')
    await expect(page.getByRole('heading', { name: 'Drag & Drop Challenge' })).toBeVisible()
  })

  test('challenge appears in home page catalog', async ({ page }) => {
    await page.goto('/')

    // Verify the challenge row exists using role and text filtering
    const challengeRow = page.getByRole('row').filter({ hasText: 'Drag & Drop' })
    await expect(challengeRow).toBeVisible()
    await expect(challengeRow.getByRole('cell', { name: 'Interactions', exact: true })).toBeVisible()
  })

  test('sortable items can be reordered with keyboard', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // Get initial order
    const sortableList = page.getByRole('list', { name: 'Sortable items' })
    const initialItems = await sortableList.getByRole('listitem').allTextContents()
    // Initial order: Item 3, Item 1, Item 5, Item 2, Item 4

    // Focus the first item (Item 3) and press ArrowDown to move it down
    await sortableList.getByRole('listitem').first().focus()
    await page.keyboard.press('ArrowDown')

    // Item 3 should have moved from position 1 to position 2
    const afterMove = await sortableList.getByRole('listitem').allTextContents()
    expect(afterMove[0]).toBe('Item 1')
    expect(afterMove[1]).toBe('Item 3')

    // Press ArrowUp to move Item 3 back to position 1
    await page.keyboard.press('ArrowUp')
    const afterMoveBack = await sortableList.getByRole('listitem').allTextContents()
    expect(afterMoveBack).toEqual(initialItems)
  })

  test('kanban tasks can be moved between columns with keyboard', async ({ page }) => {
    await page.goto('/challenges/drag-drop')

    // "Write tests" task starts in Todo column
    const todoColumn = page.getByRole('group', { name: 'Todo' })
    await expect(todoColumn.getByText('Write tests')).toBeVisible()

    // Focus the task and press ArrowRight to move it to In Progress
    await todoColumn.getByText('Write tests').focus()
    await page.keyboard.press('ArrowRight')

    // Task should now be in In Progress column
    const progressColumn = page.getByRole('group', { name: 'In Progress' })
    await expect(progressColumn.getByText('Write tests')).toBeVisible()

    // Press ArrowRight again to move to Done
    await page.keyboard.press('ArrowRight')
    const doneColumn = page.getByRole('group', { name: 'Done' })
    await expect(doneColumn.getByText('Write tests')).toBeVisible()

    // Press ArrowLeft to move back to In Progress
    await page.keyboard.press('ArrowLeft')
    await expect(progressColumn.getByText('Write tests')).toBeVisible()
  })
})
