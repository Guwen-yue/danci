"use client"

import * as React from "react"
import { toast } from "sonner"
import type { WordBook, WordBookStatus } from "@/lib/books"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = ["四级", "六级", "考研", "雅思", "托福", "中考", "高中", "其他"]

export type BookFormData = {
  name: string
  category: string
  description: string
  wordCount: number
  status: WordBookStatus
}

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: WordBook | null
  onSubmit: (data: BookFormData) => void
}) {
  const [name, setName] = React.useState(book?.name ?? "")
  const [category, setCategory] = React.useState(book?.category ?? CATEGORIES[0])
  const [description, setDescription] = React.useState(book?.description ?? "")
  const [wordCount, setWordCount] = React.useState(book ? String(book.wordCount) : "")
  const [status, setStatus] = React.useState<WordBookStatus>(book?.status ?? "active")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("请输入单词书名")
      return
    }
    const count = Number(wordCount)
    if (!wordCount || Number.isNaN(count) || count < 0) {
      toast.error("请输入有效的单词数量")
      return
    }
    onSubmit({
      name: name.trim(),
      category,
      description: description.trim(),
      wordCount: count,
      status,
    })
    onOpenChange(false)
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
            <Label htmlFor="book-name">书名</Label>
            <Input
              id="book-name"
              placeholder="请输入书名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="book-category">分类</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? CATEGORIES[0])}>
                <SelectTrigger id="book-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-word-count">单词数量</Label>
              <Input
                id="book-word-count"
                type="number"
                min={0}
                placeholder="如 2800"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="book-description">简介</Label>
            <Textarea
              id="book-description"
              placeholder="请输入简介"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>状态</Label>
            <Select value={status} onValueChange={(v) => setStatus((v ?? "active") as WordBookStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue>{status === "active" ? "启用" : "停用"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{book ? "保存修改" : "创建"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
