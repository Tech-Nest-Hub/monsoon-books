"use client"

import { useEffect, useState, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import { Bold, Italic, Star, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "../login/LoginDialogForm"

const MAX_CHARS = 2000

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewLike = {
  isLike: boolean
  userId: number
}

type ReviewUser = {
  id: number
  firstName: string
  lastName: string
}

type Review = {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  user: ReviewUser
  likes: ReviewLike[]
}

type BookReviewsProps = {
  bookId: number
  user?: { id: number; firstName: string; lastName: string } | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-neutral-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"
          }`}
        />
      ))}
    </div>
  )
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return <>{children}</>
}

// ─── Like/Dislike button ──────────────────────────────────────────────────────

function LikeButton({
  reviewId,
  bookId,
  likes,
  userId,
  onUpdate,
}: {
  reviewId: number
  bookId: number
  likes: ReviewLike[]
  userId?: number
  onUpdate: () => void
}) {
  const [pending, setPending] = useState(false)

  const likeCount = likes.filter((l) => l.isLike).length
  const dislikeCount = likes.filter((l) => !l.isLike).length
  const myVote = userId ? likes.find((l) => l.userId === userId) : null

  const vote = async (isLike: boolean) => {
    if (!userId || pending) return
    setPending(true)
    try {
      await fetch(`/api/reviews/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isLike }),
      })
      onUpdate()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-3 pt-1">
      <button
        onClick={() => vote(true)}
        disabled={pending || !userId}
        title={!userId ? "Log in to vote" : undefined}
        className={`flex items-center gap-1.5 text-xs transition-colors disabled:cursor-not-allowed ${
          myVote?.isLike === true
            ? "text-green-600 font-semibold"
            : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <span>{likeCount}</span>
      </button>

      <button
        onClick={() => vote(false)}
        disabled={pending || !userId}
        title={!userId ? "Log in to vote" : undefined}
        className={`flex items-center gap-1.5 text-xs transition-colors disabled:cursor-not-allowed ${
          myVote?.isLike === false
            ? "text-red-500 font-semibold"
            : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <span>{dislikeCount}</span>
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookReviews({ bookId, user }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [ratingError, setRatingError] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "best">("newest")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write a review..." }),
      CharacterCount.configure({ limit: MAX_CHARS }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-[100px] px-4 pt-4 pb-2 text-sm text-neutral-800 focus:outline-none",
      },
    },
  })

  const charCount = editor?.storage.characterCount.characters() ?? 0

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews/${bookId}`)
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data)) setReviews(data)
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const handleSubmit = async () => {
    if (!rating) { setRatingError("Please select a star rating"); return }
    setRatingError("")
    setSubmitting(true)
    try {
      const res = await fetch(`/api/reviews/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: editor?.getHTML() ?? "" }),
      })
      if (res.ok) {
        editor?.commands.clearContent()
        setRating(0)
        await fetchReviews()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete your review?")) return
    setDeletingId(reviewId)
    try {
      await fetch(`/api/reviews/${bookId}`, { method: "DELETE" })
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } finally {
      setDeletingId(null)
    }
  }

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === "best") {
      // Sort by net likes (likes - dislikes)
      const netA = a.likes.filter(l => l.isLike).length - a.likes.filter(l => !l.isLike).length
      const netB = b.likes.filter(l => l.isLike).length - b.likes.filter(l => !l.isLike).length
      return netB - netA
    }
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const userHasReviewed = user ? reviews.some((r) => r.user.id === user.id) : false

  return (
    <section className="space-y-6 py-10 border-t border-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-bold text-neutral-900">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </h2>
          {avgRating && (
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-neutral-700">{avgRating}</span>
            </div>
          )}
        </div>
        {reviews.length > 1 && (
          <div className="flex gap-2">
            {(["best", "newest", "oldest"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all capitalize ${
                  sortBy === opt
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor — logged in, hasn't reviewed */}
      {user && !userHasReviewed && (
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <StarInput value={rating} onChange={setRating} />
            {ratingError && <span className="text-xs text-red-500">{ratingError}</span>}
          </div>
          <EditorContent editor={editor} />
          <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-100 bg-neutral-50">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  editor?.isActive("bold")
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  editor?.isActive("italic")
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs tabular-nums ${charCount >= MAX_CHARS ? "text-red-500" : "text-neutral-400"}`}>
                {charCount}/{MAX_CHARS}
              </span>
              <button
                onClick={handleSubmit}
                disabled={submitting || charCount > MAX_CHARS}
                className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not logged in — show disabled editor + login dialog trigger */}
      {!user && (
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-5 text-sm text-neutral-400">
            Log in to write a review...
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-100 bg-neutral-50">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded flex items-center justify-center text-neutral-300">
                <Bold className="w-3.5 h-3.5" />
              </div>
              <div className="w-7 h-7 rounded flex items-center justify-center text-neutral-300">
                <Italic className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Login dialog */}
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger>
                <div className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-700 transition-all">
                  Log in to comment
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-2xl p-0 ring-0 border-0 shadow-2xl">
                <LoginForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Already reviewed */}
      {user && userHasReviewed && (
        <p className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-lg">
          You've already reviewed this book. Delete your review below to write a new one.
        </p>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-neutral-200 rounded" />
                <div className="h-3 w-full bg-neutral-100 rounded" />
                <div className="h-3 w-3/4 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-neutral-400 py-4">
          No reviews yet. Be the first to review this book.
        </p>
      ) : (
        <div className="space-y-6">
          {sorted.map((review) => {
            const isOwn = user?.id === review.user.id
            const initials = `${review.user.firstName[0]}${review.user.lastName[0]}`.toUpperCase()

            return (
              <div key={review.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600 shrink-0">
                  {initials}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-neutral-800">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    <ClientOnly>
                      <span suppressHydrationWarning className="text-xs text-neutral-400">
                        {timeAgo(review.createdAt)}
                      </span>
                    </ClientOnly>
                    <StarDisplay rating={review.rating} />
                    {isOwn && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="ml-auto text-neutral-300 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <div
                      className="text-sm text-neutral-600 leading-relaxed prose prose-sm max-w-none prose-p:my-0"
                      dangerouslySetInnerHTML={{ __html: review.comment }}
                    />
                  )}

                  {/* Like / Dislike */}
                  <LikeButton
                    reviewId={review.id}
                    bookId={bookId}
                    likes={review.likes}
                    userId={user?.id}
                    onUpdate={fetchReviews}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

    </section>
  )
}