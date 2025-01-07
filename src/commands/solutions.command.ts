import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {TelegraphService} from '../api/telegraph.service'
import {showErrorMessage} from '../utils/bot.utils'

export class SolutionsCommand extends Command {
    private readonly apiService: ApiService
    private readonly telegraphService: TelegraphService

    constructor(bot: Telegraf<Context>, apiService: ApiService, telegraphService: TelegraphService) {
        super(bot)
        this.apiService = apiService
        this.telegraphService = telegraphService
    }

    handle(): void {
        this.bot.action(/^solutions\/(\d+)\/(\d+)\/(\d+)\/(\d+)\/(\d+)\/([\w-]+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const taskId = parseInt(match[1])
            const bookId = parseInt(match[2])
            const pageNumber = parseInt(match[3])
            const currentPage = parseInt(match[4])
            const gradeId = parseInt(match[5])
            const subjectSymbol = match[6]

            try {
                const solutions = await this.apiService.getSolutions(taskId)
                let telegraphUrl

                if (solutions[0].path === null) {
                    const url = await this.telegraphService.createPage(solutions[0])
                    await this.apiService.setTelegraphPath(solutions[0].id, url)
                    telegraphUrl = url
                } else {
                    telegraphUrl = solutions[0].path
                }

                await ctx.editMessageText('Решение доступно по кнопке ниже', Markup.inlineKeyboard([
                        [Markup.button.url('Открыть решение', `${telegraphUrl}`)],
                        [Markup.button.callback('🔙 Назад', `tasks\/${bookId}\/${pageNumber}\/${currentPage}\/${gradeId}\/${subjectSymbol}`)],
                        [Markup.button.callback('‼️ Пожаловаться', `alert\/${solutions[0].id}`)],
                        [Markup.button.callback('❌ Закрыть', 'close')]
                    ])
                )
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}