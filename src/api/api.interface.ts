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

    fetchData<T>(url: string): Promise<T[]>
}