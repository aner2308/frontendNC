//Typning av bokstatus
export interface BookStatus {
    _id: string;
    bookId: string;
    status: "want-to-read" | "reading" | "finished";
    pagesRead?: number;
}

//Typning av recensioner
export interface Review {
    _id: string;
    bookId: string;
    rating: number;
    comment: string;
    user: {
        username: string;
    };
}