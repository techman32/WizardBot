import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {showErrorMessage} from '../utils/bot.utils'

export class BookmarksCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.hears('📔 Закладки', async (ctx) => {
            try {
                const user = {
                    id: ctx.from.id
                }

                const bookmarks = await this.apiService.getBookmarks(user)
                if (bookmarks.length === 0) {
                    await ctx.reply('Тут пока пусто')
                } else {
                    bookmarks.map(async (bookmark) => {
                        await ctx.reply(`${bookmark.title}`, Markup.inlineKeyboard([
                            [
                                Markup.button.callback('Открыть', `${bookmark.bookmark}`),
                                Markup.button.callback('Удалить', `deletebookmark/${bookmark.bookmark}`)
                            ]
                        ]))
                    })
                }
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })

        this.bot.action(/^addbookmark\/(.*)$/, async (ctx) => {
            const path = ctx.match[0].replace('addbookmark/', '')

            try {
                const bookmark = {
                    bookmark: path
                }
                const user = {
                    id: ctx.from.id
                }

                await this.apiService.setBookmark(user, bookmark)
                await ctx.reply('Закладка успешно создана!')
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })

        this.bot.action(/^deletebookmark\/(.*)$/, async (ctx) => {
            const path = ctx.match[0].replace('deletebookmark/', '')

            try {
                const user = {
                    id: ctx.from.id
                }
                await this.apiService.deleteBookmark(user, path)
                await ctx.editMessageText('Закладка успешно удалена!')
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}