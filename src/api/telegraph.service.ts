import {ITelegraphService} from './telegraph.interface'
import {ISolution} from './api.interface'
import {getPageContent} from '../utils/telegraph.utils'
import axios from 'axios'
import {ConfigService} from '../config/config.service'

export class TelegraphService implements ITelegraphService {
    baseUrl: string = 'https://api.telegra.ph'
    token: string

    constructor(private readonly configService: ConfigService) {
        this.token = this.configService.get('TELEGRAPH_TOKEN')
    }

    async createPage(solution: ISolution): Promise<string> {
        const url = this.baseUrl + '/createPage'

        const content = getPageContent(solution)

        const data = {
            access_token: this.token,
            title: `Решение-${solution.id}`,
            content: JSON.stringify(content),
            return_content: true
        }

        try {
            const response = await axios.post(url, data)
            if (response.data.ok) {
                return response.data.result.url
            }
        } catch (error) {
            console.error('Ошибка при создании страницы: ', error)
        }

        return ''
    }
}