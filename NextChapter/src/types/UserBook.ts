export interface UserBook {
  _id: string
  bookId: string
  status: "want-to-read" | "reading" | "finished"
  pagesRead?: number
  title: string
  author: string
  cover?: string
}