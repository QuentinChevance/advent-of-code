const fs = require('fs')
const es = require('event-stream')

function parseInput(path) {
    let input: number[][] = [[]]
    let i = 0
    const stream = fs
        .createReadStream(path, { flags: 'r' })
        .pipe(es.split())
        .pipe(
            es.map(function (line: string, cb) {
                input[i++] = [...line].map((treeHeight) => Number(treeHeight))
                cb(null, line)
            })
        )

    stream.on('end', () => {
        const firstResult = firstPart(input)
        const secondResult = secondPart(input)

        console.timeEnd('time')
        console.table({
            'First result': firstResult,
            'Second result': secondResult,
        })
    })
}

const isVisible = (
    heights: number[][],
    i: number,
    j: number,
    direction: 'top' | 'bottom' | 'left' | 'right'
) => {
    let set = new Set<number>()
    switch (direction) {
        case 'right':
            set = new Set(
                [...Array(heights[j].length - i - 1).keys()].map(
                    (y) => heights[j][i + y + 1]
                )
            )
            break
        case 'left':
            set = new Set(
                [...Array(i).keys()].map((y) => heights[j][i - y - 1])
            )
            break
        case 'top':
            set = new Set(
                [...Array(j).keys()].map((y) => heights[j - y - 1][i])
            )
            break
        case 'bottom':
            set = new Set(
                [...Array(heights.length - j - 1).keys()].map(
                    (y) => heights[j + y + 1][i]
                )
            )
            break
        default:
            break
    }
    return [...set].every((height) => height < heights[j][i])
}

const getScenicScore = (
    heights: number[][],
    i: number,
    j: number,
    direction: 'top' | 'bottom' | 'left' | 'right'
) => {
    let list: number[] = []
    let res = 0
    switch (direction) {
        case 'right':
            list = [...Array(heights[j].length - i - 1).keys()].map(
                (y) => heights[j][i + y + 1]
            )
            break
        case 'left':
            list = [...Array(i).keys()].map((y) => heights[j][i - y - 1])
            break
        case 'top':
            list = [...Array(j).keys()].map((y) => heights[j - y - 1][i])

            break
        case 'bottom':
            list = [...Array(heights.length - j - 1).keys()].map(
                (y) => heights[j + y + 1][i]
            )
            break
        default:
            break
    }
    for (let u = 0; u < list.length; u++) {
        res++
        if (list[u] >= heights[j][i]) {
            break
        }
    }
    return res
}

const firstPart = (input: number[][]) => {
    let visibleTrees = 0
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (
                isVisible(input, i, j, 'top') ||
                isVisible(input, i, j, 'bottom') ||
                isVisible(input, i, j, 'left') ||
                isVisible(input, i, j, 'right')
            ) {
                visibleTrees++
            }
        }
    }
    return visibleTrees
}

const secondPart = (input: number[][]) => {
    let highestScenicScore = 0
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            const score =
                getScenicScore(input, i, j, 'top') *
                getScenicScore(input, i, j, 'bottom') *
                getScenicScore(input, i, j, 'left') *
                getScenicScore(input, i, j, 'right')
            if (score >= highestScenicScore) {
                highestScenicScore = score
            }
        }
    }
    return highestScenicScore
}

console.time('time')
parseInput('./data.txt')

export {}
