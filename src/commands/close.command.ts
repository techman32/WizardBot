import {Command} from './command.class'
import {Context, Telegraf} from 'telegraf'

export class CloseCommand extends Command {
    constructor(bot: Telegraf<Context>) {
        super(bot)
    }

    handle(): void {
        this.bot.action('close', ctx => {
            ctx.deleteMessage()
        })
    }
}