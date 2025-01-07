import {ISolution} from './api.interface'

export interface ITelegraphService {
    baseUrl: string

    createPage(solution: ISolution): Promise<string>
}