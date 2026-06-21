import React, { useState, useEffect } from 'react';
import { PlusCircle, Settings2 } from 'lucide-react';
import { TransactionType, Category, AccountId, ACCOUNTS } from '../types';
import { cn } from '../lib/utils';
import { addCategory } from '../lib/db';
import { User } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    amount: number;
    type: TransactionType;
    categoryId: string;
    accountId: AccountId;
    description: string;
    date: string;
  }) => void;
  categories: Category[];
  user: User;
}

export function TransactionForm({ onAddTransaction, categories, user }: TransactionFormProps) {
  const { t } = useLanguage();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState<AccountId>('cash');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const typeCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (typeCategories.length > 0 && !typeCategories.find(c => c.id === categoryId)) {
      setCategoryId(typeCategories[0].id || '');
    }
  }, [type, typeCategories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !categoryId || !accountId || !date) return;
    
    onAddTransaction({
      amount: Number(amount),
      type,
      categoryId,
      accountId,
      description,
      date,
    });
    
    // Reset basic fields
    setAmount('');
    setDescription('');
  };

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await addCategory(user.uid, {
        name: newCategoryName.trim(),
        type,
        isCustom: true
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900 p-5 rounded-xl shadow-2xl border border-slate-700">
      <h2 className="text-sm font-bold text-white mb-5 uppercase tracking-wide">{t('addTransaction')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={cn(
              "flex-1 py-1.5 text-[11px] font-bold uppercase rounded-md transition-colors border",
              type === 'expense' ? "bg-slate-700 text-rose-400 border-slate-600 shadow" : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            {t('expense')}
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={cn(
              "flex-1 py-1.5 text-[11px] font-bold uppercase rounded-md transition-colors ml-1 border",
              type === 'income' ? "bg-slate-700 text-emerald-400 border-slate-600 shadow" : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            {t('income')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('amount')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">Rp</span>
              <input
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none text-sm placeholder:text-slate-600"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">{t('category')}</label>
                <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Settings2 className="w-3 h-3" />
                </button>
              </div>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none placeholder:text-slate-600"
                    placeholder="New category..."
                  />
                  <button type="button" onClick={handleAddCustomCategory} className="px-3 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold hover:bg-emerald-500/20">+</button>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none"
                  required
                >
                  {typeCategories.length === 0 ? <option value="">Loading...</option> : typeCategories.map((cat) => {
                    const translationKey = ('cat_' + cat.name.replace(/ /g, '_').replace(/&/g, '').replace(/__/g, '_')) as any;
                    const translatedName = cat.isCustom ? cat.name : (t(translationKey) !== translationKey ? t(translationKey) : cat.name);
                    return (
                      <option key={cat.id} value={cat.id}>{translatedName}</option>
                    );
                  })}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('account')}</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value as AccountId)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none"
                required
              >
                {ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>{t(acc.nameKey as any)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('date')}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('description')}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none placeholder:text-slate-600"
              placeholder="What was this for?"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors focus:ring-2 focus:ring-emerald-500/50 mt-4"
        >
          <PlusCircle className="w-4 h-4" />
          {t('addTransaction')}
        </button>
      </form>
    </div>
  );
}
