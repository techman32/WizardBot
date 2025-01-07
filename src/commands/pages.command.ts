import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getBookPageButtons, getBookPageNavigationButtons, showErrorMessage} from '../utils/bot.utils'

export class PagesCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^pages\/(\d+)\/page\/(\d+)\/(\d+)\/([\w-]+)(\/nodelete)?$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const bookId = parseInt(match[1])
            const currentPage = parseInt(match[3])
            const gradeId = parseInt(match[4])
            const subjectSymbol = match[5]
            const isNoDelete = !!match[6]
            const itemsPerPage = 40

            try {
                const bookPages = await this.apiService.getBookPages(bookId, itemsPerPage, (currentPage - 1) * itemsPerPage)
                const totalPages = Math.ceil(bookPages[0].count / itemsPerPage)
                const caption = `Выберите страницу (стр. ${currentPage}/${totalPages})`
                const buttons = getBookPageButtons(bookPages, bookId, currentPage, gradeId, subjectSymbol)
                const navigationButtons = getBookPageNavigationButtons(bookId, currentPage, totalPages, gradeId, subjectSymbol)
                const keyboard = Markup.inlineKeyboard([
                    ...buttons,
                    navigationButtons,
                    [Markup.button.callback('🔙 Назад', `book\/${bookId}\/${gradeId}\/${subjectSymbol}`)],
                    [Markup.button.callback('❌ Закрыть', 'close')]
                ])

                if (!isNoDelete) {
                    await ctx.deleteMessage()
                    const loadingMessage = await ctx.reply('Загрузка...')
                    await ctx.telegram.editMessageText(
                        loadingMessage.chat.id,
                        loadingMessage.message_id,
                        undefined,
                        caption,
                        keyboard
                    )
                } else {
                    await ctx.editMessageText(caption, keyboard)
                }
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}