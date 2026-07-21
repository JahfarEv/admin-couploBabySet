import { useCallback, useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Product } from '@/types'

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      console.log("Documents:", snapshot.size);

      const items = snapshot.docs.map((doc) => {
        console.log(doc.id, doc.data());

        return {
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">),
        };
      });

      console.log(items);

      setProducts(items as Product[]);
      setLoading(false);
    },
    (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    }
  );

  return unsubscribe;
}, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
  try {
    console.log("Step 1: addProduct called");
    console.log(product);

    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Step 2: Saved", docRef.id);

    return docRef.id;
  } catch (err) {
    console.error("Firebase Error:", err);
    throw err;
  }
}, []);

  const updateProduct = useCallback(async (product: Product) => {
    try {
      const { id, ...productData } = product
      const productRef = doc(db, 'products', id)

      await updateDoc(productRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product.'
      setError(message)
      throw err
    }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product.'
      setError(message)
      throw err
    }
  }, [])

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
