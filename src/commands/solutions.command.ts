import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getSubSolutionButtons, showErrorMessage} from '../utils/bot.utils'

export class SolutionsCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
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
                if (solutions.length > 1) {
                    const solutionButtons = getSubSolutionButtons(solutions, taskId, bookId, pageNumber, currentPage, gradeId, subjectSymbol)

                    await ctx.editMessageText('Выберите решение: ', Markup.inlineKeyboard([
                        ...solutionButtons,
                        [Markup.button.callback('🔙 Назад', `tasks\/${bookId}\/${pageNumber}\/${currentPage}\/${gradeId}\/${subjectSymbol}`)],
                        [Markup.button.callback('❌ Закрыть', 'close')]
                    ]))
                } else {
                    await ctx.editMessageText('Решение доступно по кнопке ниже', Markup.inlineKeyboard([
                            [Markup.button.url('Открыть решение', `${solutions[0].path}`)],
                            [Markup.button.callback('🔙 Назад', `tasks\/${bookId}\/${pageNumber}\/${currentPage}\/${gradeId}\/${subjectSymbol}`)],
                            [Markup.button.callback('‼️ Пожаловаться', `alert\/${solutions[0].id}`)],
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