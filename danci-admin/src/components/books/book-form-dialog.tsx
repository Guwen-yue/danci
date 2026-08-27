"use client";

import * as React from "react";
import { toast } from "sonner";
import type { WordBook } from "@/lib/books";
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

export type BookFormData = {
  title: string;
  wordCount: number;
  coverUrl: string;
  bookId: string;
  tags: string;
};

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: WordBook | null;
  onSubmit: (data: BookFormData) => Promise<SimpleResult>;
}) {
  const [title, setTitle] = React.useState(book?.title ?? "");
  const [wordCount, setWordCount] = React.useState(book ? String(book.wordCount) : "");
  const [coverUrl, setCoverUrl] = React.useState(book?.coverUrl ?? "");
  const [bookId, setBookId] = React.useState(book?.bookId ?? "");
  const [tags, setTags] = React.useState(book?.tags ?? "");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("请输入标题");
      return;
    }
    if (!bookId.trim()) {
      toast.error("请输入 bookId");
      return;
    }
    const count = Number(wordCount);
    if (!wordCount || Number.isNaN(count) || count < 0) {
      toast.error("请输入有效的单词数量");
      return;
    }
    setSubmitting(true);
    const result = await onSubmit({
      title: title.trim(),
      wordCount: Math.floor(count),
      coverUrl: coverUrl.trim(),
      bookId: bookId.trim(),
      tags: tags.trim(),
    });
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(book ? "单词书已更新" : "单词书已创建");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? "编辑单词书" : "新增单词书"}</DialogTitle>
          <DialogDescription>
            {book ? "修改单词书信息后保存" : "填写信息创建一本新的单词书"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="book-title">标题</Label>
            <Input
              id="book-title"
              placeholder="请输入标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="book-word-count">单词数量</Label>
              <Input
                id="book-word-count"
                type="number"
                min={0}
                placeholder="如 64"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-id">bookId</Label>
              <Input
                id="book-id"
                placeholder="如 PEPXiaoXue3_1"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="book-cover">封面 URL</Label>
            <Input
              id="book-cover"
              placeholder="https://example.com/cover.jpg"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="book-tags">标签</Label>
            <Input
              id="book-tags"
              placeholder="多个标签用逗号分隔，如：小学,人教版,三年级"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "保存中..." : book ? "保存修改" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
