import { useState, useMemo } from 'react'
import { useProgressStore } from '../store/progressStore'
import TestHints from '../components/TestHints'

type Product = {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

const allProducts: Product[] = [
  { id: 1, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 150 },
  { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 89.99, stock: 75 },
  { id: 3, name: 'USB-C Hub', category: 'Electronics', price: 49.99, stock: 200 },
  { id: 4, name: 'Monitor Stand', category: 'Furniture', price: 79.99, stock: 50 },
  { id: 5, name: 'Desk Lamp', category: 'Furniture', price: 34.99, stock: 120 },
  { id: 6, name: 'Webcam HD', category: 'Electronics', price: 59.99, stock: 90 },
  { id: 7, name: 'Office Chair', category: 'Furniture', price: 199.99, stock: 25 },
  { id: 8, name: 'Notebook Pack', category: 'Supplies', price: 12.99, stock: 300 },
  { id: 9, name: 'Pen Set', category: 'Supplies', price: 8.99, stock: 500 },
  { id: 10, name: 'Desk Organizer', category: 'Supplies', price: 24.99, stock: 80 },
  { id: 11, name: 'Headphones', category: 'Electronics', price: 149.99, stock: 60 },
  { id: 12, name: 'Mouse Pad XL', category: 'Supplies', price: 19.99, stock: 200 },
]

type SortField = 'name' | 'category' | 'price' | 'stock'
type SortDirection = 'asc' | 'desc'

const PAGE_SIZE = 5

function DataTables() {
  const { setStatus, getStatus } = useProgressStore()
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterText, setFilterText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // Mark progress when user interacts
  const markProgress = () => {
    if (getStatus('data-tables') === 'not_started') {
      setStatus('data-tables', 'in_progress')
    }
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesText =
        filterText === '' ||
        product.name.toLowerCase().includes(filterText.toLowerCase()) ||
        product.category.toLowerCase().includes(filterText.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter
      return matchesText && matchesCategory
    })
  }, [filterText, categoryFilter])

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let comparison = 0
      if (sortField === 'name' || sortField === 'category') {
        comparison = a[sortField].localeCompare(b[sortField])
      } else {
        comparison = a[sortField] - b[sortField]
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredProducts, sortField, sortDirection])

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Get unique categories
  const categories = [...new Set(allProducts.map((p) => p.category))]

  const handleSort = (field: SortField) => {
    markProgress()
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleFilter = (text: string) => {
    markProgress()
    setFilterText(text)
    setCurrentPage(1)
  }

  const handleCategoryFilter = (category: string) => {
    markProgress()
    setCategoryFilter(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    markProgress()
    setCurrentPage(page)
  }

  const handleSelectRow = (id: number) => {
    markProgress()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    markProgress()
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedProducts.map((p) => p.id)))
    }
  }

  const handleReset = () => {
    setSortField('name')
    setSortDirection('asc')
    setFilterText('')
    setCategoryFilter('all')
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ''
    return sortDirection === 'asc' ? ' ▲' : ' ▼'
  }

  const allOnPageSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.has(p.id))

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Data Tables Challenge</h2>
      <p className="text-sm mb-4">
        <strong>Objective:</strong> Practice testing data tables with sorting,
        filtering, pagination, and row selection.
      </p>

      <hr />

      {/* Filters */}
      <div className="retro-panel p-4 mt-4">
        <h4 className="font-bold mb-2">Filters:</h4>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="search" className="block mb-1 text-sm">
              Search:
            </label>
            <input
              type="text"
              id="search"
              value={filterText}
              onChange={(e) => handleFilter(e.target.value)}
              className="retro-input w-48"
              placeholder="Filter by name..."
              data-testid="filter-input"
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-1 text-sm">
              Category:
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="retro-input"
              data-testid="category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            className="retro-button"
            onClick={handleReset}
            data-testid="reset-filters"
          >
            Reset All
          </button>

          <button
            className="retro-button"
            onClick={() => setStatus('data-tables', 'completed')}
            data-testid="mark-complete-button"
          >
            Mark Complete
          </button>
        </div>
      </div>

      {/* Selection info */}
      {selectedIds.size > 0 && (
        <div className="mt-4 retro-panel-raised p-2 bg-blue-100" data-testid="selection-info">
          <strong>{selectedIds.size}</strong> item(s) selected
          <button
            className="retro-button ml-4"
            onClick={() => setSelectedIds(new Set())}
            data-testid="clear-selection"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4">
        <table className="retro-table w-full" data-testid="products-table">
          <thead>
            <tr>
              <th className="w-8">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={handleSelectAll}
                  data-testid="select-all-checkbox"
                />
              </th>
              <th
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('name')}
                data-testid="header-name"
              >
                Name{getSortIndicator('name')}
              </th>
              <th
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('category')}
                data-testid="header-category"
              >
                Category{getSortIndicator('category')}
              </th>
              <th
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('price')}
                data-testid="header-price"
              >
                Price{getSortIndicator('price')}
              </th>
              <th
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('stock')}
                data-testid="header-stock"
              >
                Stock{getSortIndicator('stock')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4" data-testid="no-results">
                  No products found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  data-testid={`row-${product.id}`}
                  className={selectedIds.has(product.id) ? 'bg-blue-50' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => handleSelectRow(product.id)}
                      data-testid={`checkbox-${product.id}`}
                    />
                  </td>
                  <td data-testid={`name-${product.id}`}>{product.name}</td>
                  <td data-testid={`category-${product.id}`}>{product.category}</td>
                  <td data-testid={`price-${product.id}`}>${product.price.toFixed(2)}</td>
                  <td data-testid={`stock-${product.id}`}>{product.stock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm" data-testid="pagination-info">
          Showing {paginatedProducts.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
          {Math.min(currentPage * PAGE_SIZE, sortedProducts.length)} of {sortedProducts.length} items
        </div>
        <div className="flex gap-2">
          <button
            className="retro-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            data-testid="prev-page"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`retro-button ${currentPage === page ? 'bg-blue-200' : ''}`}
              onClick={() => handlePageChange(page)}
              data-testid={`page-${page}`}
            >
              {page}
            </button>
          ))}
          <button
            className="retro-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            data-testid="next-page"
          >
            Next
          </button>
        </div>
      </div>

      <hr className="my-4" />

      <TestHints
        tips={[
          'Use <code>getByRole("columnheader")</code> for table headers',
          'Use <code>getByLabel()</code> for search and filter inputs',
          'Use <code>getByRole("button")</code> for pagination controls',
          'Use <code>getByRole("row").filter()</code> to find specific rows',
          'Prefer user-facing locators over <code>getByTestId()</code>',
        ]}
        codeExamples={[
          {
            title: 'Sort by column:',
            code: `// Click header to sort ascending
await page.getByRole('columnheader', { name: 'Price' }).click()
// Click again to sort descending
await page.getByRole('columnheader', { name: 'Price' }).click()

// Verify sort indicator
await expect(page.getByRole('columnheader', { name: /Price/ })).toContainText('▼')`,
          },
          {
            title: 'Filter data:',
            code: `// Text filter
await page.getByLabel('Search:').fill('keyboard')
await expect(page.getByRole('row').filter({ hasText: 'Mechanical Keyboard' })).toBeVisible()

// Category filter
await page.getByLabel('Category:').selectOption('Electronics')`,
          },
          {
            title: 'Test pagination:',
            code: `// Navigate pages
await page.getByRole('button', { name: 'Next' }).click()
await page.getByRole('button', { name: '2' }).click()

// Verify pagination info
await expect(page.getByText(/6-10 of/)).toBeVisible()`,
          },
          {
            title: 'Select rows:',
            code: `// Select individual row by finding checkbox in that row
const row = page.getByRole('row').filter({ hasText: 'Wireless Mouse' })
await row.getByRole('checkbox').check()
await expect(page.getByText('1 item(s) selected')).toBeVisible()

// Select all using header checkbox
await page.getByRole('row').first().getByRole('checkbox').check()`,
          },
          {
            title: 'Test no results state:',
            code: `// Search for something that doesn't exist
await page.getByLabel('Search:').fill('xyznonexistent')
await expect(page.getByText('No products found matching your criteria.')).toBeVisible()`,
          },
        ]}
      />
    </div>
  )
}

export default DataTables
