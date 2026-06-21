import { Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Transaction, ACCOUNTS } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AccountCardsProps {
  transactions: Transaction[];
}

export function AccountCards({ transactions }: AccountCardsProps) {
  const { t } = useLanguage();

  const accountStats = ACCOUNTS.map(account => {
    const accTxs = transactions.filter(tx => tx.accountId === account.id);
    const stats = accTxs.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.income += tx.amount;
          acc.balance += tx.amount;
        } else {
          acc.expense += tx.amount;
          acc.balance -= tx.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
    return { ...account, ...stats };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {accountStats.map(stat => (
        <div key={stat.id} className="bg-slate-800 border border-slate-700 p-3 shadow-lg rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase truncate pr-2">
              {t(stat.nameKey as any)}
            </span>
            <Wallet className="w-3 h-3 text-slate-500 shrink-0" />
          </div>
          
          <div className="mb-3">
            <p className="text-[10px] text-slate-500 uppercase mb-0.5 tracking-wider">{t('totalBalance')}</p>
            <p className="text-sm font-bold text-slate-200">{formatCurrency(stat.balance)}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="bg-emerald-500/5 rounded p-1.5 border border-emerald-500/10">
              <div className="flex items-center text-emerald-500 mb-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-[8px] uppercase font-bold ml-0.5">{t('income')}</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-400">{formatCurrency(stat.income).replace('Rp', '').trim()}</p>
            </div>
            <div className="bg-rose-500/5 rounded p-1.5 border border-rose-500/10">
              <div className="flex items-center text-rose-500 mb-0.5">
                <ArrowDownRight className="w-3 h-3" />
                <span className="text-[8px] uppercase font-bold ml-0.5">{t('expense')}</span>
              </div>
              <p className="text-[10px] font-mono text-rose-400">{formatCurrency(stat.expense).replace('Rp', '').trim()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
