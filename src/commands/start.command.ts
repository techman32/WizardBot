import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {IUser} from '../api/api.interface'

export class StartCommand extends Command {
    private readonly apiService: ApiService
    partnerChannelId: string
    withSubscribe: boolean = false
    keyboard: string[][]

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.partnerChannelId = '@tshfjamm'
        this.apiService = apiService
        this.keyboard = []
    }

    handle(): void {
        this.bot.start(async (ctx) => {
            if (this.withSubscribe) {
                ctx.reply('Для использования бота необходимо подписаться на канал наших партнеров', Markup.inlineKeyboard([
                    [Markup.button.url('Подписаться', `https://t.me/${this.partnerChannelId.slice(1)}`)],
                    [Markup.button.callback('Проверить подписку', `check_subscription`)]
                ]))
            } else {
                try {
                    const user: IUser = {
                        id: ctx.from.id
                    }

                    await this.apiService.setUser(user)

                    const userRole = await this.apiService.getUserRole(user)
                    if (userRole === 'admin') {
                        this.keyboard = [
                            ['🔍 Найти ответ'], ['📔 Закладки'], ['🔺 Для правообладателей'], ['📊 Статистика']
                        ]
                    } else {
                        this.keyboard = [
                            ['🔍 Найти ответ'], ['📔 Закладки'], ['🔺 Для правообладателей']
                        ]
                    }

                    ctx.reply('Добро пожаловать в ГДЗ бота!', Markup.keyboard(this.keyboard).resize())
                } catch (error) {
                    console.error(error)
                }
            }
        })

        this.bot.action('check_subscription', async (ctx) => {
            try {
                const chatMember = await ctx.telegram.getChatMember(this.partnerChannelId, ctx.from.id)

                if (['left', 'kicked'].includes(chatMember.status)) {
                    ctx.reply('Вы не подписаны на канал!')
                } else {
                    try {
                        const user: IUser = {
                            id: ctx.from.id
                        }
                        await this.apiService.setUser(user)

                        ctx.deleteMessage()
                        ctx.reply('Добро пожаловать в ГДЗ бота!', Markup.keyboard(this.keyboard).resize())
                    } catch (error) {
                        console.error(error)
                    }
                }
            } catch (error) {
                console.error(error)
                ctx.reply('Что-то пошло не так! Попробуйте еще раз написать команду \/start')
            }
        })
    }
}