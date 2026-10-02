"use client";

import { FormEvent, useEffect, useState } from "react";

import { toast } from "sonner";

import { useGetMeQuery, useUpdateMeMutation } from "@/src/lib/api/authApi";
import { getApiErrorMessage } from "@/src/lib/api/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSettings() {
  const { data, isLoading } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const user = data?.data.user;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
    });
  }, [user]);

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateMe({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      }).unwrap();
      toast.success("تم تحديث بياناتك");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-950">الملف الشخصي</h2>
        <p className="mt-1 text-sm text-slate-500">
          عدّل البيانات التي تظهر في حسابك.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="الاسم الأول"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            required
          />
          <Input
            label="الاسم الأخير"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            required
          />
        </div>

        <Input
          label="رقم الهاتف"
          type="tel"
          dir="ltr"
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
        />

        <Input
          label="البريد الإلكتروني"
          type="email"
          dir="ltr"
          value={user?.email ?? ""}
          disabled
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </section>
  );
}
