const sudoku = document.querySelector('.sudoku')
const inputElems = sudoku.querySelectorAll('.input')
const solveBTN = document.getElementById('solve_btn')

solveBTN.addEventListener('click' , solveSudoku)
let solveCounter = 0

let possibleNumbersInSudoku = {}
let inputElemsIDs = ['up_left_' , 'up_' , 'up_right_' , 'left_' , 'middle_' , 'right_' , 'bottom_left_' , 'bottom_' , 'bottom_right_']

function solveSudoku() {
    solveCounter++
    Array.from(inputElems).forEach((input , index) => {
        const value = input.value
        if(!value) {
            input.style.color = 'blue'
            solve(input , index)
        }
    })

    let isSolved = isSudokuSoleved()
    
    if (isSolved) return

    reverseCheck()

    if (solveCounter < 2) solveSudoku()
        
}


function solve (input, index) {
    const id = input.id
    
    
    let rowNumbers = rowPossibleNumbers(index)
    if (rowNumbers.length === 1) {
        input.value = rowNumbers[0]
        return
    }

    let columnNumbers = columnPossibleNumbers(index)
    if (columnNumbers.length === 1) {
        input.value = columnNumbers[0]
        return
    }

    
    let squareNumbers = squarePossibleNumberS(id)
    
    if (squareNumbers.length === 1) {
        input.value = squareNumbers[0]
        return
    }
    possibleNumbersInSudoku[id] = [rowNumbers , columnNumbers, squareNumbers]
    
    let commonNumbers = findCommonNumbers(squareNumbers , rowNumbers , columnNumbers)
    
    if (commonNumbers.length === 1) {
        input.value = commonNumbers[0]
        return
    }
}

function rowPossibleNumbers (index) {

    let rowIndex
    let existNumbers = []

    for (let i = 0 ; i <= index ; i++) {
        if (i % 9 === 0) rowIndex = i
    }
    for (let i = rowIndex ; i < rowIndex + 9 ; i++ ) {
        let inputElem = inputElems[i]
        if (inputElem.value) {        
            let value = parseInt(inputElem.value)
            existNumbers.push(value);
        }
    }
    let possibleNumbers = findMissingNumbersNaive(existNumbers)
    return possibleNumbers
}

function columnPossibleNumbers(index) {
    let columnIndex = index
    let existNumbers = []
    
    while (columnIndex > 9) {
        columnIndex -= 9
    }

    for (let i = columnIndex ; i < inputElems.length ; i+=9) {
        let inputElem = inputElems[i]
        if (inputElem.value) {        
            let value = parseInt(inputElem.value)
            existNumbers.push(value);
        }
    }
    let possibleNumbers = findMissingNumbersNaive(existNumbers)
    return possibleNumbers
    
}

function squarePossibleNumberS (id) {
    const splitedId = id.split('_')
    splitedId.pop()
    const joinId = splitedId.join('_')
    let existNumbers = []

    for (let i = 1 ; i < 10 ; i++) {
        let inputElemId = joinId + '_' + i
        let inputElem = document.getElementById(inputElemId)
        if (inputElem.value) {        
            let value = parseInt(inputElem.value)
            existNumbers.push(value);
        }
    }
    let possibleNumbers = findMissingNumbersNaive(existNumbers)
    return possibleNumbers
}

function findCommonNumbers (sq , row , col) {
    let commonNumbersBetweenSQandROW = []
    let commonNumbersBetweenAll = []
    for (let i = 0 ; i < sq.length ; i++) {
        if (row.includes(sq[i])) {
            commonNumbersBetweenSQandROW.push(sq[i])
        }
    }
    for (let i = 0 ; i < col.length ; i++) {
        if (commonNumbersBetweenSQandROW.includes(col[i])) {
            commonNumbersBetweenAll.push(col[i])
        }
    }
    return commonNumbersBetweenAll
}

function reverseCheck () {
    for (let i = 0 ; i < inputElemsIDs.length ; i++) {
        reverseSolve(inputElemsIDs[i])
    }
}

function reverseSolve (id) {
    let inSquarePosibilities = {}
    inSquarePosibilities[id] = {}

    for (let i = 1 ; i <= 9 ; i++) {
        inSquarePosibilities[id][i] = []

        for (let j = 1 ; j <=9 ; j++) {
            
            let inputId = id + j
            let inputElem = document.getElementById(inputId)
            if (!inputElem.value) {
                if (!possibleNumbersInSudoku[inputId][2].includes(i)) continue
                if (!possibleNumbersInSudoku[inputId][0].includes(i) ||
                !possibleNumbersInSudoku[inputId][1].includes(i))
                {
                    inSquarePosibilities[id][i].push([i, inputId , false])
                }
                else inSquarePosibilities[id][i].push([i, inputId , true])
            }
        }

        let counter = 0
        let countedId
        let countedValue
        for (let k = 0 ; k < inSquarePosibilities[id][i].length ; k++) {
            if (inSquarePosibilities[id][i][k][2]) {
                countedId = inSquarePosibilities[id][i][k][1]
                countedValue = inSquarePosibilities[id][i][k][0]
                counter++
            }
        }
        if (counter === 1) {
            let input = document.getElementById(countedId)
            input.value = countedValue
        }
        

    }

    
}



function findMissingNumbersNaive(arr) {
    const missingNumbers = [];

    for (let i = 1; i < 10; i++) {
        if (!arr.includes(i)) {
            missingNumbers.push(i);
        }
    }

    return missingNumbers;
}

function isSudokuSoleved () {
    let bool = true
    Array.from(inputElems).forEach((input) => {
        const value = input.value
        if(!value) {
            bool = false
        }
    })
    if (!bool) return false
    return true
}