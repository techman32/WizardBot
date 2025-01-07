import {Command} from './command.class'
import {Context, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'

export class AlertCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^alert\/(\d+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const solutionId = parseInt(match[1])

            try {
                const alertStatus = await this.apiService.sendAlert(solutionId)

                if (alertStatus) {
                    ctx.reply(`Жалоба на задание с ID: ${solutionId} отправлена. Спасибо!`)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
}