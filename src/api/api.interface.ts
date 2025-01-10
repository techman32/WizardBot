export interface IUser {
    id: number,
    role?: string,
}

export interface IStatistic {
    perAllTime: number,
    perMonth: number,
    perWeek: number,
    perDay: number,
}

export interface IBookmark {
    bookmark: string,
    title?: string,
}

export interface IGrade {
    id: number,
    name: string,
}

export interface ISubject {
    id: number,
    name: string,
    symbol: string,
}

export interface IBook {
    id: number,
    type: string,
    year: string,
    image: string,
    author: string,
    isRetelling: boolean
}

export interface IBookPages {
    count: number,
    pages: string[]
}

export interface ITask {
    id: number,
    exercise: string,
}

export interface ISolution {
    id: number,
    path: string,
}

export default interface IApiService {
    baseUrl: string

    getGrades(): Promise<IGrade[]>

    getSubjects(gradeId: number): Promise<ISubject[]>

    getBooks(gradeId: number, subjectSymbol: string): Promise<IBook[]>

    getBookPages(bookId: number, limit: number, offset: number): Promise<IBookPages[]>

    setTelegraphPath(solutionId: number, path: string): Promise<boolean>

    getBookDetails(bookId: number): Promise<IBook[]>

    getTasks(bookId: number, pageNumber: number): Promise<ITask[]>

    getSolutions(taskId: number): Promise<ISolution[]>

    getSolutionPath(solutionId: number, limit: number, offset: number): Promise<ISolution[]>

    sendAlert(solutionId: number): Promise<boolean>

    setUser(user: IUser): Promise<boolean>

    getUserRole(user: IUser): Promise<string>

    setBookmark(user: IUser, bookmark: IBookmark): Promise<boolean>

    getBookmarks(user: IUser): Promise<IBookmark[]>

    deleteBookmark(user: IUser, path: string): Promise<boolean>

    getStatistic(): Promise<IStatistic | null>

    fetchData<T>(url: string): Promise<T[]>
}