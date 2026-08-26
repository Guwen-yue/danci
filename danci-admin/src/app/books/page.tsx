"use client"

import * as React from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AdminShell } from "@/components/admin/admin-shell"
import { BookFormDialog, type BookFormData } from "@/components/books/book-form-dialog"
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
import { getBooks, saveBooks, type WordBook } from "@/lib/books"
import { formatDateTime } from "@/lib/format"

export default function BooksPage() {
  const [books, setBooks] = React.useState<WordBook[]>(() => getBooks())
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<WordBook | null>(null)
  const [deleting, setDeleting] = React.useState<WordBook | null>(null)
  const [formKey, setFormKey] = React.useState(0)

  function handleCreate() {
    setEditing(null)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  function handleEdit(book: WordBook) {
    setEditing(book)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  function handleSave(data: BookFormData) {
    if (editing) {
      const next = books.map((b) =>
        b.id === editing.id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
      )
      saveBooks(next)
      setBooks(next)
      toast.success("单词书已更新")
    } else {
      const now = new Date().toISOString()
      const book: WordBook = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now }
      const next = [book, ...books]
      saveBooks(next)
      setBooks(next)
      toast.success("单词书已创建")
    }
  }

  function handleDelete() {
    if (!deleting) return
    const next = books.filter((b) => b.id !== deleting.id)
    saveBooks(next)
    setBooks(next)
    toast.success("单词书已删除")
    setDeleting(null)
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">单词书管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              维护单词书，支持创建、编辑、删除与查询
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            新增单词书
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>单词书列表</CardTitle>
            <CardDescription>共 {books.length} 本单词书</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>书名</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>单词数量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div className="font-medium">{book.name}</div>
                      <div className="mt-0.5 line-clamp-1 max-w-xs text-xs text-muted-foreground">
                        {book.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{book.category}</Badge>
                    </TableCell>
                    <TableCell>{book.wordCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={book.status === "active" ? "default" : "outline"}>
                        {book.status === "active" ? "启用" : "停用"}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(book.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(book)}
                          aria-label="编辑"
                          title="编辑"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleting(book)}
                          aria-label="删除"
                          title="删除"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      暂无单词书，点击右上角「新增单词书」创建
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <BookFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        book={editing}
        onSubmit={handleSave}
      />

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除单词书</DialogTitle>
            <DialogDescription>
              确定要删除「{deleting?.name}」吗？删除后不可恢复。
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
