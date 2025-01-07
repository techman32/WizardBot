import {Context, Telegraf} from 'telegraf'

export abstract class Command {
    protected constructor(public bot: Telegraf<Context>) {}

    abstract handle(): void
}