"use client";

import * as React from "react";
import Image from "next/image";
import { BookOpen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  BookFormDialog,
  type BookFormData,
} from "@/components/books/book-form-dialog";
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
import {
  createBookRequest,
  listBooks,
  removeBookRequest,
  updateBookRequest,
  type WordBook,
} from "@/lib/books";
import type { SimpleResult } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export default function BooksPage() {
  const [books, setBooks] = React.useState<WordBook[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<WordBook | null>(null);
  const [formKey, setFormKey] = React.useState(0);
  const [deleting, setDeleting] = React.useState<WordBook | null>(null);
  const [deletingState, setDeletingState] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    listBooks().then((list) => {
      if (cancelled) return;
      setBooks(list);
      setFetching(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function refresh() {
    listBooks().then(setBooks);
  }

  function handleCreate() {
    setEditing(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleEdit(book: WordBook) {
    setEditing(book);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  async function handleSave(data: BookFormData): Promise<SimpleResult> {
    const result = editing
      ? await updateBookRequest(editing.id, data)
      : await createBookRequest(data);
    if (result.ok) refresh();
    return result;
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingState(true);
    const result = await removeBookRequest(deleting.id);
    setDeletingState(false);
    if (!result.ok) {
      toast.error(result.message);
      setDeleting(null);
      return;
    }
    toast.success(
      result.deletedWords > 0
        ? `单词书已删除，同时删除 ${result.deletedWords} 个关联单词`
        : "单词书已删除"
    );
    setDeleting(null);
    refresh();
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
                  <TableHead>封面</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>单词数量</TableHead>
                  <TableHead>bookId</TableHead>
                  <TableHead>标签</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => {
                  const tags = (book.tags ?? "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  return (
                    <TableRow key={book.id}>
                      <TableCell>
                        {book.coverUrl ? (
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            width={48}
                            height={64}
                            unoptimized
                            className="h-16 w-12 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <BookOpen className="size-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.wordCount.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {book.bookId}
                      </TableCell>
                      <TableCell>
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
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
                  );
                })}
                {fetching && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        加载中...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!fetching && books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
              确定要删除「{deleting?.title}」吗？该单词书在 words 表中关联的全部单词（bookId 相同）也会一并删除，删除后不可恢复。
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
