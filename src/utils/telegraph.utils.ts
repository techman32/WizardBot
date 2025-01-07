import {ISolution} from '../api/api.interface'

export const getPageContent = (solution: ISolution) => {
    const texts = solution.text.split(/(\d+\sшаг\n|Ответ\n)/)
    const body = texts.map(text => {
        if (text.match(/(\d+\sшаг\n)/) || text.match(/Ответ\n/)) {
            return {tag: 'h3', children: [text.trim()]}
        } else {
            return {tag: 'p', children: [text.trim()]}
        }
    })

    const images = solution.images.map(image => {
        return {
            tag: 'img',
            attrs: {
                src: image
            }
        }
    })

    return [...body, ...images]
}