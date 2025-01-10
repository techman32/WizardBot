import {Command} from './command.class'
import {Context, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {showErrorMessage} from '../utils/bot.utils'

export class StatisticCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.hears('📊 Статистика', async (ctx) => {
            try {
                const statistic = await this.apiService.getStatistic()

                if (statistic) {
                    await ctx.reply(`📊 Статистика\n\nЗа все время: ${statistic.perAllTime}\nЗа неделю: +${statistic.perWeek}\nЗа месяц: +${statistic.perMonth}\nЗа день: +${statistic.perDay}`)
                } else {
                    await ctx.reply('Статистика временно недоступна')
                }
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}