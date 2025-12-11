"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  History,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "@/app/actions/finance";
import { toast } from "sonner";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTransactions();
        setTransactions(data as any[]);
      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.error("Gagal memuat data transaksi.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.warning("Mohon isi semua kolom.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("amount", amount);
    formData.append("type", type);

    const res = await addTransaction(formData);

    if (res?.success) {
      const newData = await getTransactions();
      setTransactions(newData as any[]);
      setDescription("");
      setAmount("");
      toast.success("Transaksi berhasil disimpan!");
    } else {
      toast.error("Gagal menyimpan transaksi. Coba lagi.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const promise = new Promise(async (resolve, reject) => {
      const prevData = [...transactions];
      setTransactions(transactions.filter((t) => t.id !== id));

      const res = await deleteTransaction(id);
      if (res?.success) {
        resolve("Data dihapus");
      } else {
        setTransactions(prevData); 
        reject("Gagal menghapus");
      }
    });

    toast.promise(promise, {
      loading: "Menghapus data...",
      success: "Transaksi berhasil dihapus",
      error: "Gagal menghapus transaksi",
    });
  };

  return (
    <div className='flex flex-col space-y-6 pb-20 w-full max-w-full overflow-hidden'>
      <div className='px-1'>
        <h1 className='text-2xl md:text-3xl font-bold text-stone-800'>
          Manajemen Keuangan
        </h1>
        <p className='text-sm md:text-base text-stone-500'>
          Pantau arus kas pertanian Anda.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-white border-stone-200 shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4'>
            <CardTitle className='text-sm font-medium text-stone-500'>
              Total Saldo
            </CardTitle>
            <Wallet className='h-4 w-4 text-emerald-600' />
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            {loading ? (
              <Loader2 className='animate-spin h-6 w-6 text-stone-300' />
            ) : (
              <>
                <div className='text-2xl font-bold text-stone-800 truncate'>
                  {formatRupiah(balance)}
                </div>
                <p className='text-xs text-stone-500 mt-1'>Bersih saat ini</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='bg-white border-stone-200 shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4'>
            <CardTitle className='text-sm font-medium text-stone-500'>
              Pemasukan
            </CardTitle>
            <div className='bg-emerald-100 p-1 rounded-full'>
              <TrendingUp className='h-4 w-4 text-emerald-600' />
            </div>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            {loading ? (
              <Loader2 className='animate-spin h-6 w-6 text-stone-300' />
            ) : (
              <>
                <div className='text-2xl font-bold text-emerald-600 truncate'>
                  + {formatRupiah(totalIncome)}
                </div>
                <p className='text-xs text-stone-500 mt-1'>Total penjualan</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='bg-white border-stone-200 shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4'>
            <CardTitle className='text-sm font-medium text-stone-500'>
              Pengeluaran
            </CardTitle>
            <div className='bg-rose-100 p-1 rounded-full'>
              <TrendingDown className='h-4 w-4 text-rose-600' />
            </div>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            {loading ? (
              <Loader2 className='animate-spin h-6 w-6 text-stone-300' />
            ) : (
              <>
                <div className='text-2xl font-bold text-rose-600 truncate'>
                  - {formatRupiah(totalExpense)}
                </div>
                <p className='text-xs text-stone-500 mt-1'>Biaya operasional</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
        {/* FORM INPUT */}
        <div className='lg:col-span-1 order-2 lg:order-1'>
          <Card className='border-stone-200 shadow-md'>
            <CardHeader className='px-4 py-4 md:px-6 md:py-6'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <PlusCircle className='h-5 w-5 text-emerald-600' /> Tambah Data
              </CardTitle>
            </CardHeader>
            <CardContent className='px-4 pb-4 md:px-6 md:pb-6'>
              <form onSubmit={handleAdd} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='desc' className='text-sm'>
                    Keterangan
                  </Label>
                  <Input
                    id='desc'
                    placeholder='Contoh: Jual Bibit'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className='text-base'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='amount' className='text-sm'>
                    Nominal (Rp)
                  </Label>
                  <Input
                    id='amount'
                    type='number'
                    placeholder='0'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className='text-base'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-sm'>Jenis Transaksi</Label>
                  <div className='grid grid-cols-2 gap-3'>
                    <button
                      type='button'
                      onClick={() => setType("income")}
                      disabled={isSubmitting}
                      className={`
                        flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
                        ${
                          type === "income"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500 font-semibold"
                            : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:border-stone-300"
                        }
                      `}
                    >
                      <ArrowUpCircle
                        size={18}
                        className={
                          type === "income"
                            ? "text-emerald-600"
                            : "text-stone-400"
                        }
                      />
                      <span>Pemasukan</span>
                    </button>

                    <button
                      type='button'
                      onClick={() => setType("expense")}
                      disabled={isSubmitting}
                      className={`
                        flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
                        ${
                          type === "expense"
                            ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm ring-1 ring-rose-500 font-semibold"
                            : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50 hover:border-stone-300"
                        }
                      `}
                    >
                      <ArrowDownCircle
                        size={18}
                        className={
                          type === "expense"
                            ? "text-rose-600"
                            : "text-stone-400"
                        }
                      />
                      <span>Pengeluaran</span>
                    </button>
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-stone-800 hover:bg-stone-900 mt-2 h-10 md:h-11 text-base'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className='animate-spin mr-2' />
                  ) : (
                    "Simpan Transaksi"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* LIST RIWAYAT */}
        <div className='lg:col-span-2 order-1 lg:order-2'>
          <Card className='border-stone-200 shadow-sm h-full max-h-[600px] flex flex-col'>
            <CardHeader className='px-4 py-4 md:px-6 md:py-6 border-b border-stone-100'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <History className='h-5 w-5 text-stone-500' /> Riwayat Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0 overflow-y-auto flex-1'>
              <div className='p-4 space-y-3'>
                {loading ? (
                  <div className='flex justify-center py-8'>
                    <Loader2 className='animate-spin text-emerald-600' />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-12 text-stone-400 gap-2'>
                    <AlertCircle size={40} className='opacity-50' />
                    <p>Belum ada data transaksi.</p>
                  </div>
                ) : (
                  transactions.map((t) => (
                    <div
                      key={t.id}
                      className='flex items-center justify-between p-3 md:p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all gap-3'
                    >
                      <div className='flex items-center gap-3 min-w-0 flex-1'>
                        <div
                          className={`p-2 rounded-full shrink-0 ${
                            t.type === "income"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {t.type === "income" ? (
                            <TrendingUp size={18} />
                          ) : (
                            <TrendingDown size={18} />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='font-semibold text-stone-800 text-sm md:text-base truncate'>
                            {t.description}
                          </p>
                          <p className='text-[10px] md:text-xs text-stone-500 truncate'>
                            {new Date(t.date).toLocaleDateString("id-ID", {
                              dateStyle: "medium",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className='text-right flex items-center gap-2 md:gap-4 shrink-0'>
                        <span
                          className={`font-bold text-sm md:text-base whitespace-nowrap ${
                            t.type === "income"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {t.type === "income" ? "+ " : "- "}
                          {formatRupiah(t.amount)}
                        </span>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className='p-2 rounded-full text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-colors'
                          aria-label='Hapus'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
