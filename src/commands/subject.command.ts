import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getAuthorButtons, showErrorMessage} from '../utils/bot.utils'

export class SubjectCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^subject\/(\d+)\/([\w-]+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const gradeId = parseInt(match[1])
            const subjectSymbol = match[2]

            try {
                const books = await this.apiService.getBooks(gradeId, subjectSymbol)
                const buttons = getAuthorButtons(books, gradeId, subjectSymbol)

                await ctx.editMessageText('Выберите автора', Markup.inlineKeyboard([
                    ...buttons,
                    [Markup.button.callback('🔙 Назад', `grade\/${gradeId}`)],
                    [Markup.button.callback('❌ Закрыть', 'close')]
                ]))
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}