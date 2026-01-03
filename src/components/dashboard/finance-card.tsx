import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  amount: number;
  type: string;
}

interface DashboardFinanceCardProps {
  transactions: Transaction[] | null;
}

export function DashboardFinanceCard({
  transactions,
}: DashboardFinanceCardProps) {
  const totalIncome =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const totalExpense =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const currentBalance = totalIncome - totalExpense;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Card className='bg-white border-stone-200 border-t-4 border-emerald-500 shadow-lg relative overflow-hidden flex flex-col justify-between h-full'>
      <div className='absolute top-0 right-0 p-4 opacity-5 pointer-events-none'>
        <Wallet size={120} className='text-stone-900' />
      </div>

      <CardHeader className='pb-2 relative z-10'>
        <CardTitle className='text-stone-700 font-medium text-lg flex items-center gap-2'>
          <Wallet size={20} className='text-emerald-600' /> Keuangan
        </CardTitle>
      </CardHeader>

      <CardContent className='relative z-10'>
        <div className='space-y-4'>
          <div>
            <p className='text-xs text-stone-500 font-medium uppercase tracking-wider'>
              Saldo Saat Ini
            </p>
            <div className='text-2xl font-bold text-stone-800 mt-1 truncate'>
              {formatRupiah(currentBalance)}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 pt-2 border-t border-stone-100'>
            <div className='flex flex-col'>
              <span className='text-[10px] text-stone-400 flex items-center gap-1'>
                <TrendingUp size={12} className='text-emerald-500' /> Masuk
              </span>
              <span className='font-semibold text-emerald-600 text-sm truncate'>
                {formatRupiah(totalIncome)}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-[10px] text-stone-400 flex items-center gap-1'>
                <TrendingDown size={12} className='text-rose-500' /> Keluar
              </span>
              <span className='font-semibold text-rose-600 text-sm truncate'>
                {formatRupiah(totalExpense)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
