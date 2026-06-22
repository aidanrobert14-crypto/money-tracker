import { collection, doc, query, where, onSnapshot, addDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, Category, DEFAULT_CATEGORIES } from '../types';

export const subscribeToTransactions = (userId: string, callback: (data: Transaction[]) => void) => {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(txs);
  });
};

export const subscribeToCategories = (userId: string, callback: (data: Category[]) => void) => {
  const q = query(
    collection(db, 'categories'),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    cats.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    callback(cats);
  });
};

export const initializeCategories = async (userId: string) => {
  const q = query(collection(db, 'categories'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    const batch = writeBatch(db);
    DEFAULT_CATEGORIES.forEach(cat => {
      const newRef = doc(collection(db, 'categories'));
      batch.set(newRef, {
        ...cat,
        userId,
        createdAt: new Date().toISOString()
      });
    });
    await batch.commit();
  }
};

export const addCategory = async (userId: string, category: Omit<Category, 'id' | 'userId' | 'createdAt'>) => {
  return addDoc(collection(db, 'categories'), {
    ...category,
    userId,
    createdAt: new Date().toISOString()
  });
};

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
  return addDoc(collection(db, 'transactions'), {
    ...transaction,
    userId,
    createdAt: new Date().toISOString()
  });
};

export const deleteTransaction = async (id: string) => {
  return deleteDoc(doc(db, 'transactions', id));
};
