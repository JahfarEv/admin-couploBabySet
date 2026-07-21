import { Edit2, Plus, Trash2, X } from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { CategoriesContext } from '@/context/CategoriesContext'
import type { Category } from '@/types'

export default function CategoriesPage() {
  const categoriesContext = useContext(CategoriesContext)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  if (!categoriesContext) {
    throw new Error('CategoriesPage must be used within CategoriesProvider')
  }

  const { categories, addCategory, updateCategory, removeCategory } = categoriesContext

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  )

  function handleSaveCategory(category: Category) {
    if (editingCategory) {
      updateCategory(editingCategory.name, category)
    } else {
      addCategory(category)
    }
    setModalOpen(false)
    setEditingCategory(null)
  }

  function openAddCategory() {
    setEditingCategory(null)
    setModalOpen(true)
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category)
    setModalOpen(true)
  }

  function handleRemove(name: string) {
    removeCategory(name)
    if (editingCategory?.name === name) {
      setEditingCategory(null)
      setModalOpen(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Categories</h2>
          <p className="mt-1 text-ink-muted">Organize your catalog with reusable product groups.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-ink">Category library</h3>
            <p className="mt-1 text-sm text-ink-muted">Create and maintain categories with image, name, and description.</p>
          </div>
          <button
            type="button"
            onClick={openAddCategory}
            className="inline-flex items-center gap-2 rounded-full bg-mauve-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mauve-700"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={X}
              title="No categories yet"
              description="Create a category to start organizing your product catalog."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sortedCategories.map((category) => (
              <div key={category.name} className="rounded-2xl border border-black/5 bg-cream-soft p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-black/10"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blush-100 text-xl">
                          {category.name[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-ink">{category.name}</p>
                        <p className="mt-1 text-sm text-ink-muted">{category.description || 'Ready for new products'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditCategory(category)}
                        className="rounded-full p-2 text-ink-soft transition-colors hover:bg-white hover:text-mauve-600"
                        aria-label={`Edit ${category.name}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(category.name)}
                        className="rounded-full p-2 text-ink-soft transition-colors hover:bg-white hover:text-rose-500"
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setModalOpen(false)
            setEditingCategory(null)
          }}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  )
}

function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category?: Category | null
  onClose: () => void
  onSave: (category: Category) => void
}) {
  const [name, setName] = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [image, setImage] = useState(category?.image || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setName(category?.name || '')
    setDescription(category?.description || '')
    setImage(category?.image || '')
    setError('')
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category name is required')
      return
    }
    onSave({
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-panel max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {category ? 'Edit Category' : 'Add Category'}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              {category ? 'Update category details and image.' : 'Create a new category for your catalog.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-faint hover:text-ink-soft"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Category Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
              placeholder="e.g. Bloom Dresses"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-black/10 bg-cream-soft px-3.5 py-3 text-sm focus:border-mauve-400 focus:outline-none"
              placeholder="Add a short category description"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Category Image</label>
            <ImageUpload currentImage={image} onImageUpload={setImage} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-full bg-mauve-600 py-2.5 text-sm font-medium text-white hover:bg-mauve-700"
            >
              {category ? 'Save Category' : 'Add Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
