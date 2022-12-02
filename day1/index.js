const reader = require("line-reader");
function parseInput(path) {
    let input = [[]];
    let i = 0;
    reader.eachLine(path, function (line, last) {
        if (line == "") {
            i++;
            input[i] = [];
        } else {
            input[i].push(parseInt(line));
        }
        if (last) {
            const firstResult = firstPart(input);
            const secondResult = secondPart(input);

            console.table({
                'First result': firstResult,
                'Second result': secondResult
            })
        }
    });
}


const firstPart = (data) => {
    return Math.max(...data.map(d => {
        return d.reduce((prev,curr) => prev + curr,0)
    }))
}

const secondPart = (data) => {
    const addedValues = data.map(d => {
        return d.reduce((prev,curr) => prev + curr,0)
    })
    const sortedArr = addedValues.sort((a,b) => a-b)
    const maxedValues = sortedArr.slice(-3).reduce((prev,curr) => prev + curr,0)
    return maxedValues;
}

console.time('time')
parseInput('./data.txt')
console.timeEnd('time')