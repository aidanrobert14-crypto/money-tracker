import { useEffect, useState } from 'react';
import { SummaryCards } from './components/SummaryCards';
import { AccountCards } from './components/AccountCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Transaction, TransactionType, Category } from './types';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { subscribeToTransactions, subscribeToCategories, initializeCategories, addTransaction, deleteTransaction as dbDeleteTransaction } from './lib/db';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    initializeCategories(user.uid);

    const unsubTxs = subscribeToTransactions(user.uid, (data) => {
      setTransactions(data);
      setIsLoading(false);
    });

    const unsubCats = subscribeToCategories(user.uid, (data) => {
      setCategories(data);
    });

    return () => {
      unsubTxs();
      unsubCats();
    };
  }, [user]);

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addTransaction(user.uid, newTx);
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await dbDeleteTransaction(id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-slate-500 font-mono text-sm animate-pulse uppercase tracking-wider">{t('verifyingSecurity')}</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">M</span>
              {t('appTitle')} <span className="text-emerald-500 ml-1 text-sm">v2.0</span>
            </h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="hidden sm:block text-[10px] text-slate-500 font-mono uppercase truncate max-w-[150px]">
                {user.email}
              </div>
              <button 
                onClick={signOut}
                className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 rounded text-[10px] font-mono uppercase transition-colors"
              >
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 font-mono text-sm animate-pulse uppercase tracking-wider">{t('loading')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <SummaryCards transactions={transactions} />
            <AccountCards transactions={transactions} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1 sticky top-24">
                <TransactionForm onAddTransaction={handleAddTransaction} categories={categories} user={user} />
              </div>
              <div className="lg:col-span-2 shadow-2xl">
                <TransactionList 
                  transactions={transactions} 
                  categories={categories}
                  onDeleteTransaction={handleDeleteTransaction} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
