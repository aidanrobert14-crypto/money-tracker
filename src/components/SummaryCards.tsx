import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Transaction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const { t } = useLanguage();
  const { totalIncome, totalExpense, balance } = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
        acc.balance += transaction.amount;
      } else {
        acc.totalExpense += transaction.amount;
        acc.balance -= transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance Card */}
      <div className="bg-slate-800 border border-slate-700 p-4 shadow-lg rounded-xl flex flex-col relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t('totalBalance')}</p>
            <h3 className="text-2xl font-bold text-white">{formatCurrency(balance)}</h3>
          </div>
          <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg">
            <Wallet className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-slate-800 border border-slate-700 p-4 shadow-lg rounded-xl flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">{t('totalIncome')}</p>
            <h3 className="text-xl font-bold text-emerald-500">+{formatCurrency(totalIncome)}</h3>
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-slate-800 border border-slate-700 p-4 shadow-lg rounded-xl flex flex-col justify-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <ArrowDownRight className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">{t('totalExpense')}</p>
            <h3 className="text-xl font-bold text-rose-500">-{formatCurrency(totalExpense)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
