import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getAuthorButtons, getBookButtons, showErrorMessage} from '../utils/bot.utils'

export class BookCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^book\/(\d+)\/(\d+)\/([\w-]+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const bookId = parseInt(match[1])
            const gradeId = parseInt(match[2])
            const subjectSymbol = match[3]
            const bookmarkPath = ctx.match[0]

            try {
                const details = await this.apiService.getBookDetails(ctx.from.id, bookId)
                const caption = `Автор: ${details[0].author}\nГод издания: ${details[0].year}`
                const buttons = getBookButtons(details, gradeId, subjectSymbol, bookmarkPath)

                if (details[0].image === null) {
                    await ctx.editMessageText(caption, Markup.inlineKeyboard([...buttons]))
                } else {
                    await ctx.deleteMessage()
                    await ctx.replyWithPhoto(
                        {url: details[0].image},
                        {caption: caption, reply_markup: {inline_keyboard: [...buttons]}}
                    )
                }
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })

        this.bot.action(/^back_to_authors\/(\d+)\/([\w-]+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const gradeId = parseInt(match[1])
            const subjectSymbol = match[2]

            try {
                const books = await this.apiService.getBooks(gradeId, subjectSymbol)
                const buttons = getAuthorButtons(books, gradeId, subjectSymbol)

                await ctx.deleteMessage()
                await ctx.reply('Выберите автора', Markup.inlineKeyboard([
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