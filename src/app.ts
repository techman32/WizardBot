import {Context, Telegraf} from 'telegraf'
import {ConfigService} from './config/config.service'
import {ApiService} from './api/api.service'
import {Command} from './commands/command.class'
import {StartCommand} from './commands/start.command'
import {SearchCommand} from './commands/search.command'
import {GradeCommand} from './commands/grade.command'
import {SubjectCommand} from './commands/subject.command'
import {BookCommand} from './commands/book.command'
import {PagesCommand} from './commands/pages.command'
import {TasksCommand} from './commands/tasks.command'
import {SolutionsCommand} from './commands/solutions.command'
import {CloseCommand} from './commands/close.command'
import {AlertCommand} from './commands/alert.command'
import {CopyrightCommand} from './commands/copyright.command'
import {SubSolutionCommand} from './commands/subsolution.command'
import {BookmarksCommand} from './commands/bookmarks.command'
import {StatisticCommand} from './commands/statistic.command'

class Bot {
    bot: Telegraf<Context>
    commands: Command[] = []

    constructor(
        private readonly configService: ConfigService,
        private readonly apiService: ApiService
    ) {
        this.bot = new Telegraf<Context>(this.configService.get('TELEGRAM_TOKEN'))
    }

    init() {
        this.commands = [
            new StartCommand(this.bot, this.apiService),
            new SearchCommand(this.bot, this.apiService),
            new CopyrightCommand(this.bot),
            new GradeCommand(this.bot, this.apiService),
            new SubjectCommand(this.bot, this.apiService),
            new BookCommand(this.bot, this.apiService),
            new PagesCommand(this.bot, this.apiService),
            new TasksCommand(this.bot, this.apiService),
            new SolutionsCommand(this.bot, this.apiService),
            new SubSolutionCommand(this.bot, this.apiService),
            new AlertCommand(this.bot, this.apiService),
            new BookmarksCommand(this.bot, this.apiService),
            new BookCommand(this.bot, this.apiService),
            new StatisticCommand(this.bot, this.apiService),
            new CloseCommand(this.bot)
        ]
        for (const command of this.commands) {
            command.handle()
        }
        this.bot.launch()
    }
}

const configService = new ConfigService()
const bot = new Bot(configService, new ApiService())
bot.init()