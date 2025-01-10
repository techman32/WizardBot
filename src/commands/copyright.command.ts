import {Command} from './command.class'
import {Context, Telegraf} from 'telegraf'

export class CopyrightCommand extends Command {
    constructor(bot: Telegraf<Context>) {
        super(bot)
    }

    handle(): void {
        this.bot.hears('🔺 Для правообладателей', async (ctx) => {
            try {
                ctx.reply('Все будет защищено')
            } catch (error) {
                console.error(error)
            }
        })
    }
}