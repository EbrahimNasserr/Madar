"use client";

import { FormEvent, useState } from "react";

import { toast } from "sonner";

import { useChangePasswordMutation } from "@/src/lib/api/authApi";
import { getApiErrorMessage } from "@/src/lib/api/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("كلمتا المرور الجديدتان غير متطابقتين");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success("تم تغيير كلمة المرور");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-950">أمان الحساب</h2>
      <p className="mt-1 text-sm text-slate-500">
        حدّث كلمة المرور الخاصة بحسابك.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
        <Input
          label="كلمة المرور الحالية"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          label="كلمة المرور الجديدة"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="تأكيد كلمة المرور الجديدة"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "جارٍ التغيير…" : "تغيير كلمة المرور"}
        </Button>
      </form>
    </section>
  );
}
