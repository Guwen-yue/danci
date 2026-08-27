"use client";

import * as React from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  UserFormDialog,
  type AdminFormData,
} from "@/components/admin-users/user-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import {
  createAdminRequest,
  listAdmins,
  removeAdminRequest,
  updateAdminRequest,
  type SimpleResult,
} from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import type { PublicUser } from "@/lib/types";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = React.useState<PublicUser[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PublicUser | null>(null);
  const [formKey, setFormKey] = React.useState(0);
  const [deleting, setDeleting] = React.useState<PublicUser | null>(null);
  const [deletingState, setDeletingState] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    listAdmins().then((list) => {
      if (cancelled) return;
      setUsers(list);
      setFetching(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function refresh() {
    listAdmins().then(setUsers);
  }

  function handleCreate() {
    setEditing(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleEdit(user: PublicUser) {
    setEditing(user);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  async function handleSave(data: AdminFormData): Promise<SimpleResult> {
    const isSelf = editing?.id === currentUser?.id;
    const result = editing
      ? await updateAdminRequest(editing.id, {
          name: data.name,
          email: data.email,
          // 当前登录账号的状态和角色不可修改，不向后端提交
          ...(isSelf ? {} : { role: data.role, status: data.status }),
          ...(data.password ? { password: data.password } : {}),
        })
      : await createAdminRequest(data);
    if (result.ok) refresh();
    return result;
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingState(true);
    const result = await removeAdminRequest(deleting.id);
    setDeletingState(false);
    if (!result.ok) {
      toast.error(result.message);
      setDeleting(null);
      return;
    }
    toast.success("管理员已删除");
    setDeleting(null);
    refresh();
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">管理员管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              系统管理员可新增管理员，并设置其为系统管理员或普通管理员
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            新建管理员
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>管理员列表</CardTitle>
            <CardDescription>共 {users.length} 位管理员</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "super" ? "default" : "secondary"}>
                          {user.role === "super" ? "系统管理员" : "普通管理员"}
                        </Badge>
                        {isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">（当前账号）</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : "destructive"}
                        >
                          {user.status === "active" ? "启用" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDateTime(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEdit(user)}
                            aria-label="编辑"
                            title="编辑"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={isSelf}
                            onClick={() => setDeleting(user)}
                            aria-label="删除"
                            title={isSelf ? "不能删除当前登录账号" : "删除"}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {fetching && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        加载中...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!fetching && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      暂无管理员，点击右上角「新建管理员」创建
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <UserFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editing}
        isSelf={editing?.id === currentUser?.id}
        onSubmit={handleSave}
      />

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除管理员</DialogTitle>
            <DialogDescription>
              确定要删除管理员「{deleting?.name}」吗？删除后该账号将无法登录。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleting(null)}>
              取消
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deletingState}>
              {deletingState ? "删除中..." : "删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
