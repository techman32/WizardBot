import {Context, Markup} from 'telegraf'
import {IBook, IBookPages, IGrade, ISubject, ITask} from '../api/api.interface'

export const showErrorMessage = async (ctx: Context, error: unknown) => {
    console.error(error)
    await ctx.reply('Произошла ошибка! Попробуйте еще раз выбрать пункт "Найти ответ"')
}

export const getGradeButtons = (grades: IGrade[]) => {
    return grades.reduce((acc, grade, index) => {
        if (index % 2 === 0) {
            const nextGrade = grades[index + 1]
            const row = [
                Markup.button.callback(`${grade.name} класс`, `grade\/${grade.id}`),
                nextGrade?.name !== '11' && nextGrade
                    ? Markup.button.callback(`${nextGrade.name} класс`, `grade\/${nextGrade.id}`)
                    : null
            ].filter(Boolean)
            acc.push(row)
        }
        return acc
    }, [] as any[])
}

export const getSubjectButtons = (subjects: ISubject[], gradeId: number) => {
    return subjects.map(subject => [
        Markup.button.callback(`${subject.name}`, `subject\/${gradeId}\/${subject.symbol}`)
    ])
}

export const getAuthorButtons = (books: IBook[], gradeId: number, subjectSymbol: string) => {
    return books.map(book => [
        Markup.button.callback(`${book.author} – ${book.type}`, `book\/${book.id}\/${gradeId}\/${subjectSymbol}`)
    ])
}

export const getBookButtons = (details: IBook[], gradeId: number, subjectSymbol: string) => {
    const buttons = [
        [Markup.button.callback('🔙 Назад', `back_to_authors\/${gradeId}\/${subjectSymbol}`)],
        [Markup.button.callback('❌ Закрыть', 'close')]
    ]
    if (details[0].image === null && details[0].isRetelling) {
        buttons.unshift([Markup.button.callback('Перейти к заданиям', `tasks\/${details[0].id}\/0\/1\/${gradeId}\/${subjectSymbol}`)])
    } else {
        buttons.unshift([Markup.button.callback('Перейти к учебнику', `pages\/${details[0].id}\/page\/1\/${gradeId}\/${subjectSymbol}`)])
    }
    return buttons
}

export const getBookPageButtons = (
    book: IBookPages[],
    bookId: number,
    currentPage: number,
    gradeId: number,
    subjectSymbol: string
) => {
    return book[0].pages.reduce((rows: any, page, index) => {
        if (index % 4 === 0) rows.push([])
        rows[rows.length - 1].push(Markup.button.callback(`${page}`, `tasks\/${bookId}\/${page === '0' ? page : page.split('.')[1]}\/${currentPage}\/${gradeId}\/${subjectSymbol}`))
        return rows
    }, [])
}

export const getBookPageNavigationButtons = (
    bookId: number,
    currentPage: number,
    totalPages: number,
    gradeId: number,
    subjectSymbol: string
) => {
    const navigationButtons = []
    if (currentPage > 1) {
        navigationButtons.push(Markup.button.callback('<<', `pages\/${bookId}\/page\/${currentPage - 1}\/${gradeId}\/${subjectSymbol}\/nodelete`))
    }
    if (currentPage < totalPages) {
        navigationButtons.push(Markup.button.callback('>>', `pages\/${bookId}\/page\/${currentPage + 1}\/${gradeId}\/${subjectSymbol}\/nodelete`))
    }
    return navigationButtons
}

export const getTaskButtons = (
    tasks: ITask[],
    bookId: number,
    pageNumber: number,
    currentPage: number,
    gradeId: number,
    subjectSymbol: string
) => {
    return tasks.map(task => [
        Markup.button.callback(`${task.exercise}`, `solutions\/${task.id}\/${bookId}\/${pageNumber}\/${currentPage}\/${gradeId}\/${subjectSymbol}`)
    ])
}