import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from '@/config/firebase'
import { db } from '@/config/firebase'
import type { Category } from '@/types'

interface CategoriesContextValue {
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (currentName: string, nextCategory: Category) => void
  removeCategory: (name: string) => void
}

const DEFAULT_CATEGORIES: Category[] = []

function normalizeCategoryName(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function getCategoryDocId(name: string) {
  return normalizeCategoryName(name).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category'
}

function normalizeCategory(category: Category): Category {
  return {
    name: normalizeCategoryName(category.name),
    image: category.image?.trim() || '',
    description: category.description?.trim() || '',
  }
}

export const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    const categoriesRef = collection(db, 'categories')
    const q = query(categoriesRef, orderBy('name', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot: { docs: Array<{ id: string; data: () => Partial<Category> }> }) => {
        const items = snapshot.docs.map((item) => {
          const data = item.data() as Partial<Category>
          return normalizeCategory({
            name: data.name || item.id,
            image: data.image || '',
            description: data.description || '',
          })
        })

        setCategories(items)
      },
      (error: unknown) => {
        console.error('Failed to load categories:', error)
      },
    )

    return unsubscribe
  }, [])

  const addCategory = useCallback(async (category: Category) => {
    const nextCategory = normalizeCategory(category)
    if (!nextCategory.name) {
      return
    }

    const docId = getCategoryDocId(nextCategory.name)
    await setDoc(doc(db, 'categories', docId), {
      ...nextCategory,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true })
  }, [])

  const updateCategory = useCallback(async (currentName: string, nextCategory: Category) => {
    const previousName = normalizeCategoryName(currentName)
    const updatedCategory = normalizeCategory(nextCategory)

    if (!previousName || !updatedCategory.name) {
      return
    }

    const previousDocId = getCategoryDocId(previousName)
    const nextDocId = getCategoryDocId(updatedCategory.name)

    if (previousDocId !== nextDocId) {
      await deleteDoc(doc(db, 'categories', previousDocId))
    }

    await setDoc(doc(db, 'categories', nextDocId), {
      ...updatedCategory,
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }, [])

  const removeCategory = useCallback(async (name: string) => {
    const target = normalizeCategoryName(name)
    if (!target) {
      return
    }

    await deleteDoc(doc(db, 'categories', getCategoryDocId(target)))
  }, [])

  const value = useMemo<CategoriesContextValue>(
    () => ({ categories, addCategory, updateCategory, removeCategory }),
    [categories, addCategory, updateCategory, removeCategory],
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}
