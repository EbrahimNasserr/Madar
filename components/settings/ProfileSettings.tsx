"use client";

import { FormEvent, useEffect, useState } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useGetMeQuery, useUpdateMeMutation, useLogoutMutation } from "@/src/lib/api/authApi";
import { getApiErrorMessage } from "@/src/lib/api/error";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { logout } from "@/src/features/auth/authSlice";
import { tokenStorage } from "@/src/lib/auth/tokenStorage";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSettings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

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

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // proceed even if the server call fails
    } finally {
      tokenStorage.clear();
      dispatch(logout());
      router.push("/login");
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

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "جارٍ تسجيل الخروج…" : "تسجيل الخروج"}
          </Button>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </section>
  );
}
