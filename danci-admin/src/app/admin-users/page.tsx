"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AdminShell } from "@/components/admin/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteUser, getPublicUsers, type PublicUser } from "@/lib/auth"
import { formatDateTime } from "@/lib/format"
import { useAuth } from "@/hooks/use-auth"

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = React.useState<PublicUser[]>(() => getPublicUsers())
  const [deleting, setDeleting] = React.useState<PublicUser | null>(null)

  function refresh() {
    setUsers(getPublicUsers())
  }

  function handleDelete() {
    if (!deleting) return
    const result = deleteUser(deleting.id)
    if (!result.ok) {
      toast.error(result.message)
      setDeleting(null)
      return
    }
    toast.success("管理员已删除")
    setDeleting(null)
    refresh()
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">管理员管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            管理系统管理员账号，首个注册的账号为超级管理员
          </p>
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
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "super" ? "default" : "secondary"}>
                          {user.role === "super" ? "超级管理员" : "管理员"}
                        </Badge>
                        {isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">（当前账号）</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDateTime(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
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
                      </TableCell>
                    </TableRow>
                  )
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      暂无管理员
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

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
            <Button type="button" variant="destructive" onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
