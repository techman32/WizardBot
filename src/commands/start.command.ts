import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'

export class StartCommand extends Command {
    partnerChannelId: string

    constructor(bot: Telegraf<Context>) {
        super(bot)
        this.partnerChannelId = '@tshfjamm'
    }

    handle(): void {
        this.bot.start(async (ctx) => {
            ctx.reply('Для использования бота необходимо подписаться на канал наших партнеров', Markup.inlineKeyboard([
                [Markup.button.url('Подписаться', `https://t.me/${this.partnerChannelId.slice(1)}`)],
                [Markup.button.callback('Проверить подписку', `check_subscription`)]
            ]))
        })

        this.bot.action('check_subscription', async (ctx) => {
            try {
                const chatMember = await ctx.telegram.getChatMember(this.partnerChannelId, ctx.from.id)

                if (['left', 'kicked'].includes(chatMember.status)) {
                    ctx.reply('Вы не подписаны на канал!')
                } else {
                    ctx.deleteMessage()
                    ctx.reply('Добро пожаловать в ГДЗ бота!', Markup.keyboard([
                        ['🔍 Найти ответ'], ['🔺 Для правообладателей']
                    ]).resize())
                }
            } catch (error) {
                console.error(error)
                ctx.reply('Что-то пошло не так! Попробуйте еще раз написать команду \/start')
            }
        })
    }
}