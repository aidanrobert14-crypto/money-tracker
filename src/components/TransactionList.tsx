import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, Category, ACCOUNTS } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, categories, onDeleteTransaction }: TransactionListProps) {
  const { t } = useLanguage();
  if (transactions.length === 0) {
    return (
      <div className="bg-slate-900 p-8 rounded-xl shadow-2xl border border-slate-700 text-center h-[300px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-5 h-5 text-slate-500" />
        </div>
        <h3 className="text-slate-300 font-bold mb-1 uppercase tracking-wider text-xs">{t('noTransactionsYet')}</h3>
        <p className="text-slate-500 text-xs">{t('waitingForState')}</p>
      </div>
    );
  }

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return t('unknown');
    const translationKey = ('cat_' + cat.name.replace(/ /g, '_').replace(/&/g, '').replace(/__/g, '_')) as any;
    return cat.isCustom ? cat.name : (t(translationKey) !== translationKey ? t(translationKey) : cat.name);
  };

  const getAccountName = (accountId: string) => {
    const acc = ACCOUNTS.find(a => a.id === accountId);
    if (!acc) return t('unknown');
    return t(acc.nameKey as any);
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-full lg:h-[600px]">
      <div className="p-3 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('recentTransactions')}</h2>
        <div className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{t('count')}: {transactions.length}</div>
      </div>
      
      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3 truncate mr-4">
                <div className={cn(
                  "w-8 h-8 rounded flex items-center justify-center shrink-0 font-bold text-[10px] border",
                  tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                )}>
                  {tx.type === 'income' ? 'IN' : 'OUT'}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-xs text-slate-200 truncate">
                    {tx.description || getCategoryName(tx.categoryId)}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-2 uppercase tracking-wider mt-0.5">
                    <span>{getCategoryName(tx.categoryId)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span>{getAccountName(tx.accountId)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span>{format(parseISO(tx.date), 'MMM d, yyyy')}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={cn(
                  "font-mono text-xs font-semibold whitespace-nowrap",
                  tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                )}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                
                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  className="p-1.5 text-slate-500 border border-slate-700 bg-slate-900 hover:text-rose-400 hover:border-rose-500/50 rounded transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete transaction"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
