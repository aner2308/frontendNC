export type BookStatusType = "want-to-read" | "reading" | "finished";

export interface UserBook {
  _id: string
  bookId: string
  status: BookStatusType
  pagesRead?: number
  title: string
  author: string
  cover?: string
}