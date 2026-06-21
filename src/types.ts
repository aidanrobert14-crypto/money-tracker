export type TransactionType = 'income' | 'expense';
export type AccountId = 'cash' | 'bri' | 'mandiri' | 'bpd_jateng' | 'dana';

export const ACCOUNTS: { id: AccountId; nameKey: string }[] = [
  { id: 'cash', nameKey: 'acc_cash' },
  { id: 'bri', nameKey: 'acc_bri' },
  { id: 'mandiri', nameKey: 'acc_mandiri' },
  { id: 'bpd_jateng', nameKey: 'acc_bpd_jateng' },
  { id: 'dana', nameKey: 'acc_dana' }
];

export interface Category {
  id?: string; // id from firestore
  name: string;
  type: TransactionType;
  userId: string;
  isCustom: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string; // id from firestore
  amount: number;
  type: TransactionType;
  categoryId: string; // reference to category
  accountId: AccountId;
  description: string;
  date: string;
  createdAt: string;
  userId: string;
}

// Default categories to initialize for a new user
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'userId' | 'createdAt'>[] = [
  ...['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'].map(name => ({ name, type: 'income' as TransactionType, isCustom: false })),
  ...['Housing', 'Food', 'Groceries', 'Transportation', 'Utilities', 'Insurance', 'Medical', 'Saving & Debt', 'Personal', 'Entertainment', 'Other Expense'].map(name => ({ name, type: 'expense' as TransactionType, isCustom: false }))
];
