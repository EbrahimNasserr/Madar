import { Receipt } from 'lucide-react'
import { formatMoney } from '@/src/lib/formatters/money'
import { formatDate }  from '@/src/lib/formatters/date'
import { getExpenseCategoryLabel } from '@/src/constants/expenses'
import type { Expense } from '@/src/lib/api/expensesApi'
import { PAYMENT_METHOD_LABELS } from './constants'

type Props = {
  expenses: Expense[]
  onAdd:    () => void
}

// ── Guided empty state ─────────────────────────────────────────────────────────

function EmptyExpenses({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Receipt className="h-7 w-7 text-slate-400" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-slate-900">لا توجد مصروفات خلال هذا الشهر</p>
        <p className="text-sm text-slate-400">سجّل أول مصروف لمتابعة تكاليف التشغيل.</p>
      </div>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
      >
        + مصروف جديد
      </button>
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────

export function ExpensesTable({ expenses, onAdd }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-950">قائمة المصروفات</h2>
          {expenses.length > 0 && (
            <p className="mt-0.5 text-xs text-slate-400">{expenses.length} عملية</p>
          )}
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyExpenses onAdd={onAdd} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">المصروف</th>
                <th className="px-5 py-3 font-medium">التصنيف</th>
                <th className="px-5 py-3 font-medium">التاريخ</th>
                <th className="px-5 py-3 font-medium">طريقة الدفع</th>
                <th className="px-5 py-3 font-medium text-start">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense._id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{expense.title}</p>
                    {expense.notes && (
                      <p className="mt-0.5 text-xs text-slate-400">{expense.notes}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {getExpenseCategoryLabel(expense.category)}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {PAYMENT_METHOD_LABELS[expense.paymentMethod] ?? expense.paymentMethod}
                  </td>
                  <td className="px-5 py-4 text-start font-semibold tabular-nums text-slate-950">
                    {formatMoney(expense.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
