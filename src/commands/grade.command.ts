import {Command} from './command.class'
import {Context, Markup, Telegraf} from 'telegraf'
import {ApiService} from '../api/api.service'
import {getGradeButtons, getSubjectButtons, showErrorMessage} from '../utils/bot.utils'

export class GradeCommand extends Command {
    private readonly apiService: ApiService

    constructor(bot: Telegraf<Context>, apiService: ApiService) {
        super(bot)
        this.apiService = apiService
    }

    handle(): void {
        this.bot.action(/^grade\/(\d+)$/, async (ctx) => {
            const match = ctx.match[0].split('\/')
            const gradeId = parseInt(match[1])

            try {
                const subjects = await this.apiService.getSubjects(gradeId)
                const buttons = getSubjectButtons(subjects, gradeId)

                await ctx.editMessageText('Выберите предмет', Markup.inlineKeyboard([
                    ...buttons,
                    [Markup.button.callback('🔙 Назад', 'back_to_grades')],
                    [Markup.button.callback('❌ Закрыть', 'close')]
                ]))
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })

        this.bot.action('back_to_grades', async (ctx) => {
            try {
                const grades = await this.apiService.getGrades()
                const buttons = getGradeButtons(grades)

                await ctx.editMessageText('Выберите класс', Markup.inlineKeyboard([
                    ...buttons,
                    [Markup.button.callback('❌ Закрыть', 'close')]
                ]))
            } catch (error) {
                await showErrorMessage(ctx, error)
            }
        })
    }
}