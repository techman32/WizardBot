import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {showErrorMessage} from '../utils/bot.utils'

export class SubSolutionCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^subsolution\/(\d+)\/(\d+)\/(\d+)\/(\d+)\/(\d+)\/([\w-]+)\/(\d+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const taskId = parseInt(match[1])
            const bookId = parseInt(match[2])
            const pageNumber = parseInt(match[3])
            const currentPage = parseInt(match[4])
            const gradeId = parseInt(match[5])
            const subjectSymbol = match[6]
            const solutionId = parseInt(match[7])

            try {
                const solution = await this.apiService.getSolutionPath(solutionId)
                if (solution[0].path !== null) {
                    await ctx.editMessageText('Решение доступно по кнопке ниже', Markup.inlineKeyboard([
                            [Markup.button.url('Открыть решение', `${solution[0].path}`)],
                            [Markup.button.callback('🔙 Назад', `solutions\/${taskId}\/${bookId}\/${pageNumber}\/${currentPage}\/${gradeId}\/${subjectSymbol}`)],
                            [Markup.button.callback('‼️ Пожаловаться', `alert\/${solution[0].id}`)],
                            [Markup.button.callback('❌ Закрыть', 'close')]
                        ])
                    )
                }

            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}