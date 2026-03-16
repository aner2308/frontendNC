//Typning av bokstatus
export type BookStatusType = "want-to-read" | "reading" | "finished";


//Typning av användarens sparade böcker
export interface UserBook {
  _id: string
  bookId: string
  status: BookStatusType
  pagesRead?: number
  title: string
  author: string
  cover?: string
}