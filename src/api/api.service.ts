import axios, {AxiosResponse} from 'axios'
import IApiService, {IBook, IBookPages, IGrade, ISolution, ISubject, ITask} from './api.interface'

export class ApiService implements IApiService {
    baseUrl: string = 'http://89.223.127.62:5000/api'

    async getGrades(): Promise<IGrade[]> {
        const url = this.baseUrl + '/grades'
        return await this.fetchData<IGrade>(url)
    }

    async getSubjects(gradeId: number): Promise<ISubject[]> {
        const url = this.baseUrl + `/grades/${gradeId}/subjects`
        return await this.fetchData<ISubject>(url)
    }

    async getBooks(gradeId: number, subjectSymbol: string): Promise<IBook[]> {
        const url = this.baseUrl + `/grades/${gradeId}/${subjectSymbol}/books`
        return await this.fetchData<IBook>(url)
    }

    async getBookPages(bookId: number, limit: number = 40, offset: number = 0): Promise<IBookPages[]> {
        const url = this.baseUrl + `/books/${bookId}/pages?limit=${limit}&offset=${offset}`
        return await this.fetchData<IBookPages>(url)
    }

    async sendAlert(solutionId: number): Promise<boolean> {
        const url = this.baseUrl + '/save-trouble'

        try {
            const response = await axios.post(url, {
                solutionId: solutionId
            })

            if (response.status === 200) {
                return response.data.success
            }
        } catch (error) {
            console.error(`Ошибка при запросе к URL: ${url}`, error)
        }
        return false
    }

    async setTelegraphPath(solutionId: number, path: string): Promise<boolean> {
        const url = this.baseUrl + `/save-path`

        try {
            const response: AxiosResponse<{ success: boolean, message: string }> = await axios.post(url, {
                id: solutionId,
                path: path
            })

            if (response.status === 200) {
                return response.data.success
            }
        } catch (error) {
            console.error(`Ошибка при запросе к URL: ${url}`, error)
        }
        return false
    }

    async getBookDetails(bookId: number): Promise<IBook[]> {
        const url = this.baseUrl + `/books/${bookId}/details`
        return await this.fetchData<IBook>(url)
    }

    async getTasks(bookId: number, pageNumber: number): Promise<ITask[]> {
        const url = this.baseUrl + `/books/${bookId}/${pageNumber}/tasks`
        return await this.fetchData<ITask>(url)
    }

    async getSolutions(taskId: number): Promise<ISolution[]> {
        const url = this.baseUrl + `/tasks/${taskId}/solutions`
        return await this.fetchData<ISolution>(url)
    }

    async fetchData<T>(url: string): Promise<T[]> {
        try {
            const response: AxiosResponse<T[]> = await axios.get(url)
            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            console.error(`Ошибка при запросе к URL: ${url}`, error)
        }
        return []
    }
}