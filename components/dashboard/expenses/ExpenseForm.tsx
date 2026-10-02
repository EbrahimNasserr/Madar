"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { EXPENSE_CATEGORIES } from "@/src/constants/expenses";
import { useCreateExpenseMutation, type ExpenseCategory } from "@/src/lib/api/expensesApi";
import { getApiErrorMessage } from "@/src/lib/api/error";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ModalBody, ModalFooter } from "@/components/ui/Modal";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

type PaymentMethod = "cash" | "bank_transfer" | "instapay" | "other";

export default function ExpenseForm({ onSuccess, onCancel }: Props) {
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "other" as ExpenseCategory,
    expenseDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "cash" as PaymentMethod,
    notes: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createExpense({
        title:         form.title.trim(),
        amount:        Number(form.amount),
        category:      form.category,
        expenseDate:   form.expenseDate,
        paymentMethod: form.paymentMethod,
        notes:         form.notes.trim() || undefined,
      }).unwrap();

      toast.success("تم تسجيل المصروف");
      onSuccess?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ModalBody>
        <Input
          label="اسم المصروف"
          placeholder="مثال: طباعة ملازم"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="المبلغ (جنيه)"
            type="number"
            min={1}
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            required
          />
          <Input
            label="التاريخ"
            type="date"
            value={form.expenseDate}
            onChange={(e) => set("expenseDate", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="التصنيف"
            value={form.category}
            onChange={(e) => set("category", e.target.value as ExpenseCategory)}
          >
            {EXPENSE_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>

          <Select
            label="طريقة الدفع"
            value={form.paymentMethod}
            onChange={(e) => set("paymentMethod", e.target.value as PaymentMethod)}
          >
            <option value="cash">نقدي</option>
            <option value="instapay">InstaPay</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="other">أخرى</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 select-none">
            ملاحظات
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-[border-color,box-shadow] focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10"
            placeholder="أي تفاصيل إضافية..."
          />
        </div>
      </ModalBody>

      <ModalFooter>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "جارٍ الحفظ..." : "تسجيل المصروف"}
        </Button>
      </ModalFooter>
    </form>
  );
}
