import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getTaskButtons} from '../utils/bot.utils'

export class TasksCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^tasks\/(\d+)\/(\d+)\/(\d+)\/(\d+)\/([\w-]+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const bookId = parseInt(match[1])
            const pageNumber = parseInt(match[2])
            const currentPage = parseInt(match[3])
            const gradeId = parseInt(match[4])
            const subjectSymbol = match[5]

            try {
                const tasks = await this.apiService.getTasks(bookId, pageNumber)
                const buttons = getTaskButtons(tasks, bookId, pageNumber, currentPage, gradeId, subjectSymbol)

                await ctx.editMessageText('Выберите задание', Markup.inlineKeyboard([
                    ...buttons,
                    (subjectSymbol === 'pereskazy'
                        ? [Markup.button.callback('🔙 Назад', `book\/${bookId}\/${gradeId}\/${subjectSymbol}`)]
                        : [Markup.button.callback('🔙 Назад', `pages\/${bookId}\/page\/${currentPage}\/${gradeId}\/${subjectSymbol}\/nodelete`)]),
                    [Markup.button.callback('❌ Закрыть', 'close')]
                ]))
            } catch (error) {
                console.error(error)
                await ctx.reply('Произошла ошибка! Попробуйте еще раз выбрать пункт "Найти ответ"')
            }
        })
    }
}