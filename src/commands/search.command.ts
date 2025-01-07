import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getGradeButtons, showErrorMessage} from '../utils/bot.utils'

export class SearchCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.hears('🔍 Найти ответ', async (ctx) => {
            try {
                const grades = await this.apiService.getGrades()
                const buttons = getGradeButtons(grades)

                await ctx.deleteMessage()
                await ctx.reply('Выберите класс', Markup.inlineKeyboard([
                    ...buttons,
                    [Markup.button.callback('❌ Закрыть', 'close')]
                ]))
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}