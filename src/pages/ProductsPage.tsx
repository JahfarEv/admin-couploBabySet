

import { Package, Plus, Search, X, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'
import { useCategories } from '@/hooks/useCategories'
import { useProduct } from '@/hooks/useProduct'
import type { Category, Product, ProductCategory } from '@/types'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { categories } = useCategories()
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProduct()

  const categoryOptions = useMemo(
    () => ['All', ...categories.map((category) => category.name)],
    [categories],
  )

  useEffect(() => {
    if (category !== 'All' && !categories.some((item) => item.name === category)) {
      setCategory('All')
    }
  }, [categories, category])

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const normalizedQuery = searchQuery.toLowerCase()
      const matchesQuery =
        p.name.toLowerCase().includes(normalizedQuery) ||
        (p.description || '').toLowerCase().includes(normalizedQuery) ||
        (p.includes || []).some((item) => item.toLowerCase().includes(normalizedQuery))
      const matchesCategory = category === 'All' || p.category === category
      return matchesQuery && matchesCategory
    })
  }, [products, searchQuery, category])

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, category])

  // CRUD Operations
  async function handleAddProduct(product: Omit<Product, 'id'>) {
    try {
      await addProduct(product)
      setModalOpen(false)
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  async function handleEditProduct(product: Product) {
    try {
      await updateProduct(product)
      setEditingProduct(null)
      setModalOpen(false)
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  async function handleSaveProduct(product: Product | Omit<Product, 'id'>) {
    if ('id' in product) {
      await handleEditProduct(product)
      return
    }

    await handleAddProduct(product)
  }

  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id)
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  // Open edit modal
  function openEditModal(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Products</h2>
          <p className="mt-1 text-ink-muted">{products.length} items in your catalog.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null)
            setModalOpen(true)
          }}
          className="flex items-center gap-2 rounded-full bg-mauve-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mauve-700"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product inventory..."
            className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {categoryOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`flex-shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
                category === c ? 'bg-mauve-600 text-white' : 'bg-white text-ink-soft border border-black/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-card">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-sm">Loading products from Firebase...</p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <p className="mt-2 text-sm text-ink-muted">Please check your Firebase configuration and Firestore rules.</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchQuery || category !== 'All' ? "No products found" : "No products yet"}
            description={
              searchQuery || category !== 'All'
                ? "Try a different search term or category."
                : "Start adding products to your catalog."
            }
            action={
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null)
                  setModalOpen(true)
                }}
                className="rounded-full bg-mauve-600 px-4 py-2 text-sm font-medium text-white"
              >
                Add New Product
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="text-ink-muted">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Created Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="border-t border-black/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover border border-black/10"
                            />
                          ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blush-100 text-lg">
                              🧸
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-ink">{product.name}</p>
                            {product.description && (
                              <p className="mt-0.5 max-w-xs truncate text-xs text-ink-muted">{product.description}</p>
                            )}
                            {product.includes && product.includes.length > 0 && (
                              <div className="mt-1 flex max-w-xs flex-wrap gap-1">
                                {product.includes.slice(0, 3).map((item) => (
                                  <span
                                    key={item}
                                    className="rounded-full bg-mauve-50 px-2 py-0.5 text-[11px] text-mauve-700"
                                  >
                                    {item}
                                  </span>
                                ))}
                                {product.includes.length > 3 && (
                                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-ink-muted">
                                    +{product.includes.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                            {product.customizable && <p className="text-xs text-ink-muted">Customizable</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-soft">{product.category}</td>
                      <td className="px-6 py-4 font-medium text-ink">₹{product.price}</td>
                      <td className="px-6 py-4 text-ink-soft">{formatDate(product.createdAt)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-mauve-50 hover:text-mauve-600"
                            aria-label="Edit product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-black/5 px-6 py-4">
                <div className="text-sm text-ink-muted">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} items
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-ink-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-panel">
            <h3 className="font-display text-lg font-semibold text-ink">Delete Product</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          availableCategories={categories}
          onClose={() => {
            setModalOpen(false)
            setEditingProduct(null)
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}

// Product Modal Component
// function ProductModal({
//   product,
//   availableCategories,
//   onClose,
//   onSave,
// }: {
//   product?: Product | null
//   availableCategories: ProductCategory[]
//   onClose: () => void
//   onSave: (product: Product | Omit<Product, 'id'>) => Promise<void>
// }) {
//   const [name, setName] = useState('')
//   const [category, setCategory] = useState<ProductCategory>(availableCategories[0] ?? 'Onesies')
//   const [price, setPrice] = useState('')
//   const [stock, setStock] = useState('')
//   const [sold, setSold] = useState('')
//   const [status, setStatus] = useState<'Active' | 'Draft' | 'Out of Stock'>('Draft')
//   const [customizable, setCustomizable] = useState(false)
//   const [image, setImage] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

//   // Load product data for editing
//   useEffect(() => {
//     if (product) {
//       setName(product.name)
//       setCategory(product.category)
//       setPrice(String(product.price))
//       setStock(String(product.stock))
//       setSold(String(product.sold || 0))
//       setStatus(product.status)
//       setCustomizable(product.customizable || false)
//       setImage(product.image || '')
//     }
//   }, [product])

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!product) {
//       setName('')
//       setCategory(availableCategories[0] ?? 'Onesies')
//       setPrice('')
//       setStock('')
//       setSold('')
//       setStatus('Draft')
//       setCustomizable(false)
//       setImage('')
//       setError('')
//     }
//   }, [product, availableCategories])

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)

//     try {
//       if (!name.trim()) {
//         throw new Error('Product name is required')
//       }
//       const priceNum = Number(price)
//       if (!price || isNaN(priceNum) || priceNum <= 0) {
//         throw new Error('Price must be greater than 0')
//       }
//       const stockNum = Number(stock)
//       if (!stock || isNaN(stockNum) || stockNum < 0) {
//         throw new Error('Stock cannot be negative')
//       }

//       const productData = {
//         name: name.trim(),
//         category,
//         price: priceNum,
//         stock: stockNum,
//         sold: Number(sold) || 0,
//         status,
//         customizable,
//         image: image.trim() || '🧸',
//       }

//       if (product) {
//         // Editing existing product
//         await onSave({
//           id: product.id,
//           ...productData,
//         } as Product)
//       } else {
//         // Adding new product
//         await onSave(productData as Omit<Product, 'id'>)
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to save product')
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-panel max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between">
//           <h3 className="font-display text-lg font-semibold text-ink">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h3>
//           <button 
//             type="button" 
//             onClick={onClose} 
//             className="text-ink-faint hover:text-ink-soft" 
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {error && (
//           <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="mt-5 space-y-4">
//           <div>
//             <label className="mb-1.5 block text-sm text-ink-soft">Product Name *</label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g. Organic Cotton Onesie"
//               className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="mb-1.5 block text-sm text-ink-soft">Category *</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value as ProductCategory)}
//                 className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//               >
//                 {availableCategories.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="mb-1.5 block text-sm text-ink-soft">Price ($) *</label>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="mb-1.5 block text-sm text-ink-soft">Stock *</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="mb-1.5 block text-sm text-ink-soft">Sold</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={sold}
//                 onChange={(e) => setSold(e.target.value)}
//                 className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm text-ink-soft">Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value as 'Active' | 'Draft' | 'Out of Stock')}
//               className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//             >
//               <option value="Draft">Draft</option>
//               <option value="Active">Active</option>
//               <option value="Out of Stock">Out of Stock</option>
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-sm text-ink-soft">Image Emoji</label>
//             <input
//               value={image}
//               onChange={(e) => setImage(e.target.value)}
//               placeholder="e.g. 🧸"
//               className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
//             />
//           </div>

//           <label className="flex items-center gap-2 text-sm text-ink-soft">
//             <input
//               type="checkbox"
//               checked={customizable}
//               onChange={(e) => setCustomizable(e.target.checked)}
//               className="h-4 w-4 rounded border-black/20 text-mauve-500 focus:ring-mauve-400"
//             />
//             Allow customization
//           </label>

//           <div className="flex items-center gap-2 pt-1">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 rounded-full bg-mauve-600 py-2.5 text-sm font-medium text-white hover:bg-mauve-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Saving...' : product ? 'Update Product' : 'Save Product'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }



// In your ProductsPage component, import the ImageUpload
import { ImageUpload } from '@/components/ui/ImageUpload';

// Update the ProductModal component:
function ProductModal({
  product,
  availableCategories,
  onClose,
  onSave,
}: {
  product?: Product | null
  availableCategories: Category[]
  onClose: () => void
  onSave: (product: Product | Omit<Product, 'id'>) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [includesText, setIncludesText] = useState('')
  const [category, setCategory] = useState<ProductCategory>(availableCategories[0]?.name ?? 'Onesies')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [sold, setSold] = useState('')
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Out of Stock'>('Draft')
  const [customizable, setCustomizable] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load product data for editing
  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setIncludesText((product.includes || []).join('\n'))
      setCategory(product.category)
      setPrice(String(product.price))
      setStock(String(product.stock))
      setSold(String(product.sold || 0))
      setStatus(product.status)
      setCustomizable(product.customizable || false)
      setImages(product.images || (product.image ? [product.image] : []))
    }
  }, [product])

  // Reset form when modal closes
  useEffect(() => {
    if (!product) {
      setName('')
      setDescription('')
      setIncludesText('')
      setCategory(availableCategories[0]?.name ?? 'Onesies')
      setPrice('')
      setStock('')
      setSold('')
      setStatus('Draft')
      setCustomizable(false)
      setImages([])
      setError('')
    }
  }, [product, availableCategories])

  const handleImageUpload = (imageUrl: string, index: number) => {
    const newImages = [...images];
    if (imageUrl) {
      newImages[index] = imageUrl;
    } else {
      newImages.splice(index, 1);
    }
    setImages(newImages);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!name.trim()) {
        throw new Error('Product name is required')
      }
      const priceNum = Number(price)
      if (!price || isNaN(priceNum) || priceNum <= 0) {
        throw new Error('Price must be greater than 0')
      }
      const stockNum = Number(stock)
      if (!stock || isNaN(stockNum) || stockNum < 0) {
        throw new Error('Stock cannot be negative')
      }

      const productData = {
        name: name.trim(),
        description: description.trim(),
        includes: includesText
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter((item) => item && item.toLowerCase() !== 'includes:'),
        category,
        price: priceNum,
        stock: stockNum,
        sold: Number(sold) || 0,
        status,
        customizable,
        image: images[0] || '🧸', // Use first image or emoji as fallback
        images: images,
      }

      if (product) {
        await onSave({
          id: product.id,
          ...productData,
        } as Product)
      } else {
        await onSave(productData as Omit<Product, 'id'>)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-panel max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
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
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Product Name */}
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Product Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Cotton Onesie"
              className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add product details, materials, or care notes"
              rows={3}
              className="w-full resize-none rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
            />
          </div>

          {/* Includes */}
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Includes</label>
            <textarea
              value={includesText}
              onChange={(e) => setIncludesText(e.target.value)}
              placeholder={'Premium Half Romper\nMatching Cap\nHand Socks\nMatching Booties'}
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
            />
            <p className="mt-1 text-xs text-ink-muted">Add one item per line. These save as customer-side tags.</p>
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm text-ink-soft">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
              >
                {availableCategories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-soft">Price (₹) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Stock and Sold */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm text-ink-soft">Stock *</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
                required
              />
            </div>
            {/* <div>
              <label className="mb-1.5 block text-sm text-ink-soft">Sold</label>
              <input
                type="number"
                min="0"
                value={sold}
                onChange={(e) => setSold(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
              />
            </div> */}

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Active' | 'Draft' | 'Out of Stock')}
              className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
              >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
              </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm text-ink-soft">Product Images (Max 4)</label>
            <div className="grid grid-cols-1 gap-4">
              {[0, 1, 2, 3].map((index) => (
                (index === 0 || images[index - 1]) ? (
                  <ImageUpload
                    key={index}
                    currentImage={images[index] || ''}
                    onImageUpload={(url) => handleImageUpload(url, index)}
                    disabled={isLoading}
                  />
                ) : null
              ))}
            </div>
          </div>

          {/* Customizable (Ignored) */}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full bg-mauve-600 py-2.5 text-sm font-medium text-white hover:bg-mauve-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : product ? 'Update Product' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function formatDate(value: any) {
  if (!value) return "";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
