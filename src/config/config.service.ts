import {IConfigService} from './config.interface'
import {config, DotenvParseOutput} from 'dotenv'

export class ConfigService implements IConfigService {
    private readonly config: DotenvParseOutput

    constructor() {
        const {error, parsed} = config()
        if (error) {
            throw new Error('Файл ".env" не найден')
        }

        if (!parsed) {
            throw new Error('Файл ".env" пустой')
        }

        this.config = parsed
    }

    get(key: string): string {
        const res = this.config[key]
        if (!res) {
            throw new Error(`Нет ключа ${key}`)
        }

        return res
    }
}