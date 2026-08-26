"use client";

import * as React from "react";
import { toast } from "sonner";
import type { AdminRole, PublicUser } from "@/lib/types";
import type { SimpleResult } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AdminFormData = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  isSelf,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PublicUser | null;
  isSelf: boolean;
  onSubmit: (data: AdminFormData) => Promise<SimpleResult>;
}) {
  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<AdminRole>(user?.role ?? "admin");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("请输入姓名");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("请输入正确的邮箱格式");
      return;
    }
    if (!user && password.length < 6) {
      toast.error("密码长度至少为 6 位");
      return;
    }
    if (user && password && password.length < 6) {
      toast.error("密码长度至少为 6 位");
      return;
    }

    setSubmitting(true);
    const result = await onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(user ? "管理员已更新" : "管理员已创建");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "编辑管理员" : "新建管理员"}</DialogTitle>
          <DialogDescription>
            {user
              ? "修改管理员信息，密码留空表示不修改"
              : "创建管理员账号，可设置为系统管理员或普通管理员"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="user-name">姓名</Label>
            <Input
              id="user-name"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-email">邮箱</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-password">
              密码{user ? "（留空则不修改）" : ""}
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder={user ? "请输入新密码（至少 6 位）" : "请输入密码（至少 6 位）"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label>角色</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole((v ?? "admin") as AdminRole)}
              disabled={isSelf}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{role === "super" ? "系统管理员" : "普通管理员"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super">系统管理员</SelectItem>
                <SelectItem value="admin">普通管理员</SelectItem>
              </SelectContent>
            </Select>
            {isSelf && (
              <p className="text-xs text-muted-foreground">不能修改当前登录账号的角色</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "保存中..." : user ? "保存修改" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
