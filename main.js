// # Psuedocode
// ## constants

// ## variables
let turn // 1 || -1
let turnAfil //object holding affiliations 
let currentAfil
let winner = null // null || 1 || -1
let shooting // true || false (will be used to help event listener either place ships or shoot where div is clicked)
let pBoard // array[0Array....9Array] nArray[0...9]
let p2Board// array[0Array....9Array] nArray[0...9]
let pAffill
let p2Affil
let player
let player2
let shipSelect = {
    assignedShip: null, // format will be affiliation-length e.g. pirate-1, navy-4
    shipO: 1 // 1 is horizontal to the right, -1 is vertical down
}
let shipSelectShipArray
let shipSelectLength
let shipSelectAffil
let shipSelectId
let shipSelectType
let shipsPlaced = 0
let shotSelect = {
    shotType: null,
    shotsLeft: null
}
let currentBoard
let hiddenBoard
let currentDomBoard
let hiddenDomBoard
let selectorError = false
let turnSwitch = -1

// Cached Dom Elements
const opponentBoardEl = document.querySelector('#opponent-map')
const playerBoardEl = document.querySelector('#player-map')
const opponentSelectorEls = [...document.querySelectorAll('#opponent-map > div.ship')]
const playerSelectorEls = [...document.querySelectorAll('#player-map > div.ship')]
const topMessageEl = document.querySelector('h1')
const messageEl = document.querySelector('h2')
const playerInfoEl = document.querySelector('#pl-info')
const player2InfoEl = document.querySelector('#comp-info')
const cannonshotEl = document.querySelector('#cannon-type')
const bodyEl = document.querySelector('body')
// affiliation els
const pirateButtonEl = document.querySelector('#pirate-button')
const navyButtonEl = document.querySelector('#navy-button')
// ship placement els
// const pirateShips = [...document.querySelector('#pship-select')]
// const navyShips = [...document.querySelector('#nship-select')]
const pshipEls = document.querySelector('#pship-select')
const nshipEls = document.querySelector('#nship-select')
const retryButtonEl = document.querySelector('.retry>button')
const gameBoardEl = document.querySelector('.main-game')
const turnSignal = document.querySelector('.turnSignal')


// ## classes

class Ship {
    constructor(affil, length) {
        this.length = length

        this.id = `-${affil}-${length}`

        this.destroyed = false // true || false according to getShipStatus() paradigm

        this.orientation = 0 

        this.health = length // this will change, this.length will not

        this.affil = affil

        this.design = document.querySelector(`#${affil}-${this.length}`)

    }
    getShipStatus() {
        this.checkHealth(this.id, 'hit-ship')
        if (this.health > 0) {
           this.destroyed = false
        } else {
            this.destroyed =  true
            this.sinkShip()
        }
    }
    checkHealth(shipCheck, initShip) {
        let healthTally = 0
        for(let i = 0; i < 10; i++) {
            let num1 = i
            for(let i = 0; i < 10; i++) {
                let num2 = i
                    let checkNum1 = currentBoard[num1][num2].indexOf(shipCheck)
                    let checkNum2 = currentBoard[num1][num2].indexOf(initShip)
                    if(checkNum1 > -1 && checkNum2 > -1) {
                        healthTally ++
                    }  
                    let checkNum1b = hiddenBoard[num1][num2].indexOf(shipCheck)
                    let checkNum2b = hiddenBoard[num1][num2].indexOf(initShip)
                    if(checkNum1b > -1 && checkNum2b > -1) {
                        healthTally ++
                    } 
            }
        }
        if (this.health === healthTally) {
            this.health = 0
        }
    }
    sinkShip() {
        shipClassSwap('hit-ship', this.id, 'sunk-ship')
    }
}

class Player {
    constructor(playerID, affiliation) {
        this.playerID = playerID

        this.affiliation = affiliation
        
        this.cannonshotTypes = {
            'singleShot': 100,
            'lineShot': 3,
            'crossShot': 2,
            'spreadShot': 1
        }

        this.ships = []
        
        this.deadArray = []

        this.shipsDestroyed = false
    }

    generateShips(affiliation) {
        for(let i = 1; i < 6; i++) {
            this.ships[i-1] = new Ship(affiliation, i) 
        }
    }

    countShipDeath() {
        for(let ship of this.ships) {
            ship.getShipStatus()
        }
        this.deadArray = this.ships.filter((ship) => ship.destroyed) // my normal function format wasn't reading so I used arrow function
        this.shipsDestroyed = (this.deadArray.length === 5 ? true : false)
    }
}


// Event Listeners

//               choose affiliation
pirateButtonEl.addEventListener('click', initialize)
navyButtonEl.addEventListener('click', initialize)

//             choose grid div for placing ships and shooting squares
opponentBoardEl.addEventListener('click', select)
playerBoardEl.addEventListener('click', select)
pshipEls.addEventListener('click', selectShip)
nshipEls.addEventListener('click', selectShip)
opponentBoardEl.addEventListener('mouseover', highlightAffectedArea)
playerBoardEl.addEventListener('mouseover', highlightAffectedArea)
opponentBoardEl.addEventListener('mouseout', wipeHighlight)
playerBoardEl.addEventListener('mouseout', wipeHighlight)
cannonshotEl.addEventListener('click', selectShot)

//event listener functions
function select(e) { //e = event
        if (e.target.matches('div')){
            if (shooting) {
                if (e.target.parentNode.className === currentDomBoard.className) {
                shoot(e)
                if(!selectorError) {
                    wipeHighlight()
                    signalTurn()
                } else {selectorError = false}
                }
            } else if (!shooting && shipSelect.assignedShip) {
                if (e.target.parentNode.className === currentAfil) {
                    chooseShipPlace(e)
                    if (!selectorError) {
                        document.querySelector(`.${currentAfil}.selector>${shipSelectId}`).remove()
                        shipsPlaced ++
                        shipSelect.assignedShip = null
                        shipSelect.shipO = 1
                        wipeHighlight()
                        signalTurn()
                     } else {selectorError = false}
                }
            }
        }
    }
//subfunctions to select 
async function signalTurn() {
    setTimeout(() => {turn *= -1}, '1000')
    render()
    
}

function chooseShipPlace(e) {
    if (e.target.parentNode.className === currentDomBoard.className) {
        if (shipSelect.assignedShip) {
            if (shipSelect.shipO === 1) { 
                moveCoordinates(e, e.target.id, 'ship', 1, (shipSelectLength), 0, 0, 0, 0, false)
                moveCoordinates(e, e.target.id, shipSelectType, 1, (shipSelectLength), 0, 0, 0, 0,- false)
            } else if (shipSelect.shipO === -1) {
                moveCoordinates(e, e.target.id, 'ship', (shipSelectLength), 1, 0, 0, 0, 0, false)
                moveCoordinates(e, e.target.id, shipSelectType, (shipSelectLength), 1, 0, 0, 0, 0, false)
            }
        }   
    }
}
function shoot(e) {
    if (shotSelect.shotType === 'singleShot') {
        moveCoordinates(e, e.target.id, 'shot', 1, 1, 0, 0, 0, false)

    } else if (shotSelect.shotType === 'lineShot') {
        moveCoordinates(e, e.target.id, 'shot', 2, 1, 2, 0, 0, false)

    } else if (shotSelect.shotType === 'crossShot') {
        moveCoordinates(e, e.target.id, 'shot', 2, 2, 2, 2, 0, false)

    } else if (shotSelect.shotType === 'spreadShot') {
        moveCoordinates(e, e.target.id, 'shot', 3, 3, 3, 3, 0, true)
    }
    shotSelect.shotType = null
    shotSelect.shotsLeft = null
}




//dynamic is true or false statement that makes overrides overLength and creates an X pattern


function selectShip(e) {
    if (shooting === true) return
    else if(e.target.parentNode.className === `${currentAfil} selector`) {
        if (shipSelect.assignedShip === e.target.className) {    
            shipSelect.shipO *= -1
            // e.target.style.transform.rotate('90deg');
        } else {shipSelect = {
            assignedShip: e.target.className,
            shipO: 1
            }
        }
        if (shipSelect.assignedShip) {
            shipSelectShipArray = shipSelect.assignedShip.split('-')
            shipSelectLength = Number(shipSelectShipArray[2])
            shipSelectAffil = shipSelectShipArray[1]
            shipSelectId = `.ship.-${shipSelectAffil}-${shipSelectLength}`
            shipSelectType = `-${shipSelectAffil}-${shipSelectLength}`
        }
        render()
    }

}

function highlightAffectedArea(e) {
    wipeHighlight()
    if (e.target.parentNode.className === currentDomBoard.className) {
        if (e.target.matches('div')) {
            if (shooting) {
                if (shotSelect.shotType) {
                    if (shotSelect.shotType === 'singleShot') { 
                        moveCoordinates(e, e.target.id, 'highlighted', 1, 1, 0, 0, 0, 0, false)

                    } else if (shotSelect.shotType === 'lineShot') {
                        moveCoordinates(e, e.target.id, 'highlighted', 2, 1, 2, 0, 0, false)
                
                    } else if (shotSelect.shotType === 'crossShot') {
                        moveCoordinates(e, e.target.id, 'highlighted', 2, 2, 2, 2, 0, false)
                
                    } else if (shotSelect.shotType === 'spreadShot') {
                        moveCoordinates(e, e.target.id, 'highlighted', 3, 3, 3, 3, 0, true)

                    }
                }
            } else if (!shooting) {
                if (shipSelect.assignedShip) {
                    if (shipSelect.shipO === 1) { 
                        moveCoordinates(e, e.target.id, 'highlighted', 1, shipSelectLength, 0, 0, 0, 0, false)
                    } else if (shipSelect.shipO === -1) {
                        moveCoordinates(e, e.target.id, 'highlighted', shipSelectLength, 1, 0, 0, 0, 0, false)
                        
                    }
                }
            }
            selectorError = false
            render()
        }
    }
}

function wipeHighlight() {
    for (let i = 0; i < 10; i++) {
        let coordinate1 = i
        for(let i = 0; i < 10; i++) {
            let coordinate2 = i
            let boardClasses = currentBoard[coordinate1][coordinate2]
            currentDomBoard.querySelector('div').classList.remove('highlighted')
            currentDomBoard.querySelector('div').classList.remove('er-highlighted')
            for(let cl of boardClasses) {
                let deathNum = boardClasses.indexOf('highlighted')
                let deathNum2 = boardClasses.indexOf('er-highlighted')
                if (deathNum > -1) {
                    boardClasses.splice(deathNum, 1)
                }
                if (deathNum2 > -1) {
                    boardClasses.splice(deathNum2, 1)
                }
            }
        }
    }
    render()
}
  

function selectShot(e) {
    if (shooting) {
        let pl = (currentAfil = pAffill ? player : player2)
        let shotType = e.target.id
        if (pl.cannonshotTypes[shotType] > 0) {
            shotSelect.shotType = shotType
            shotSelect.shotsLeft = pl.cannonshotTypes[shotType]
        } 
        e.target.innerHTML = `${shotType}: ${pl.cannonshotTypes[shotType]} Left...`
        setTimeout(function() {e.target.innerHTML = shotType}, 1000);
    }
}




// Functions
function initialize(e) {
    pAffill = e.target.className
    if (pAffill === 'pirate') {
        p2Affil = 'navy'
    } else if (pAffill === 'navy') {
        p2Affil = 'pirate'
    }
    player = new Player(1, pAffill)
    player2 = new Player(-1, p2Affil)
    player.generateShips(pAffill)
    player2.generateShips(p2Affil)
    pBoard = []
    p2Board = []
    shooting = false
    turn = 1
    turnAfil = {
        '1': pAffill, 
        '-1': p2Affil
    }
    playerBoardEl.classList.add(pAffill)
    opponentBoardEl.classList.add(p2Affil)
    createBoard(pBoard, playerBoardEl, pAffill)
    createBoard(p2Board, opponentBoardEl, p2Affil) 
    render()

}
// creates a 10/10 grid in a board array to map player choices
// also creates a div grid in html for 100 divs, each one with a unique ID (affiliation)(row)(column)
function createBoard(boardArray, whosBoard, affil) {  
    for(let i = 0; i < 10; i++) {
        let num1 = i
        boardArray.push([])
        for(let i = 0; i < 10; i++) {
            boardArray[num1].push(['-']) 
            let num2 = i
            el = document.createElement('div')
            let boundEl = whosBoard.appendChild(el)
            boundEl.setAttribute('id', `${affil}-${num1}-${num2}`)  
            whosBoard.classList.add(affil)
            whosBoard.id
        }
    }
}

function render() {
    pirateButtonEl.remove()
    navyButtonEl.remove()
    if (shooting){
        currentAfil = turnAfil[(-turn).toString()]
    } else {
        currentAfil = turnAfil[turn.toString()]
    }
    let currentBoardObj = {
        '1': pBoard,
        '-1': p2Board
    }

    currentBoard = currentBoardObj[turn.toString()]
    hiddenBoard = currentBoardObj[(-turn).toString()]
    let currentDomBoardObj = {
        '1': playerBoardEl,
        '-1': opponentBoardEl
    }

    currentDomBoard = currentDomBoardObj[turn.toString()]
    hiddenDomBoard = currentDomBoardObj[(-turn).toString()]

    if (shipsPlaced > 9) {
        shooting = true
    }
    renderTurn()
    
    renderShips()
    checkWinner()
    //renderStats()
    renderBoard(pBoard, pAffill, playerBoardEl)
    renderBoard(p2Board, p2Affil, opponentBoardEl)
    renderMessage()
}

function renderTurn() {
    let turn1Els = [...document.querySelectorAll(`.${pAffill}`)]
    let turn2Els = [...document.querySelectorAll(`.${p2Affil}`)]
    length1 = turn1Els.length
    length2 = turn2Els.length
    
    if (shooting) {
        pshipEls.remove()
        nshipEls.remove()
    }
 if (turn === 1) {
        for (let i = 0; i < length1; i++) {
            turn1Els[i].style.visibility = 'visible'
        }
        for (let i = 0; i < length2; i++) {
            turn2Els[i].style.visibility = 'hidden'
        }
    } else if (turn === -1) {
        for (let i = 0; i < length2; i++) {
            turn2Els[i].style.visibility = 'visible'
        }
        for (let i = 0; i < length1; i++) {
            turn1Els[i].style.visibility = 'hidden'
        }
    }
}
function renderShips() {
    //makes sure it is needed (eval with shooting var)
    //makes player specific ships visible
    //renders ship visible on player's map after event listener
    if(!shooting){
        if (shipSelect.assignedShip) {
            pshipEls.querySelector(shipSelectId) ? 
                pshipEls.querySelector(shipSelectId).style.borderColor = 'yellow'
                : nshipEls.querySelector(shipSelectId).style.borderColor = 'yellow'
        
        } else {
            let els = document.querySelectorAll(`section.selector>div`)
            for (let el of els) {
                el.style.borderColor = 'black'
            }
        }
    }
}
function renderBoard(board, affil, domBoard) {
    if (shooting) {
        shipClassSwap('ship', 'ship', 'shoot-ship')
        shipClassSwap('shot', 'shoot-ship', 'hit-ship', 'miss')
    }
    for (let i = 0; i < 10; i++) {
        let coordinate1 = i
        for(let i = 0; i < 10; i++) {
            let coordinate2 = i
            let boardEl = domBoard.querySelector(`#${affil}-${coordinate1}-${coordinate2}`)
            let boardClasses = board[coordinate1][coordinate2]
            boardEl.setAttribute('class',`${boardClasses.join(' ')}`)
        }
    }
}
function checkWinner() {
    player.countShipDeath()
    player2.countShipDeath()
    if (player.shipsDestroyed) {
        winner = player2
    } else if (player2.shipsDestroyed) {
        winner = player
    }

    if (winner) {
        opponentBoardEl.parentNode.removeChild(opponentBoardEl)
        playerBoardEl.parentNode.removeChild(playerBoardEl)
        renderMessage()
    }

}

function renderMessage() {
    renderTop()
    renderBottom()
}

function renderTop() {
    if (shooting) {
        topMessageEl.innerHTML = `${currentAfil} turn!`
    } else if (!shooting) {
        topMessageEl.innerHTML = `${currentAfil} turn!`
    }

    if (winner) {
        topMessageEl.innerHTML = `${winner.affiliation} wins!!!`
    }
}

function renderBottom() {
    if (shooting) {
        if (shotSelect.shotType) {
            messageEl.innerHTML = `grabbed ${shotSelect.shotType}`
        } else {messageEl.innerHTML = 'click shot-type to select, then click grid to fire!'}
    } else if (!shooting) {
        if (shipSelect.assignedShip) {
            messageEl.innerHTML = `grabbed ${shipSelect.assignedShip}`
        } else {messageEl.innerHTML = 'click side ship to select-click again to flip rotation-click grid to set!'}
    }

    if (winner) {
        messageEl.innerHTML = 'Play Again?'
        exit()
    }
}



function shipClassSwap(shipCheck, initShip, newShip, newShipElse) {
    for(let i = 0; i < 10; i++) {
        let num1 = i
        for(let i = 0; i < 10; i++) {
            let num2 = i
                let checkNum1 = currentBoard[num1][num2].indexOf(shipCheck)
                let checkNum2 = currentBoard[num1][num2].indexOf(initShip)
                let checkNum3 = currentBoard[num1][num2].indexOf(newShip)
                if(checkNum1 > -1 && checkNum2 > -1 && checkNum3 === -1) {
                    let deathNum = checkNum2
                    currentBoard[num1][num2].splice(deathNum, 1,newShip)

                } else if (checkNum1 > -1 && checkNum3 === -1) {
                    if (newShipElse) {
                    currentBoard[num1][num2].push(newShipElse)
                    }
                }
                let checkNum1b = hiddenBoard[num1][num2].indexOf(shipCheck)
                let checkNum2b = hiddenBoard[num1][num2].indexOf(initShip)
                if(checkNum1b > -1 && checkNum2b > -1 && checkNum3 === -1) {
                    let deathNum = checkNum2b
                    hiddenBoard[num1][num2].splice(deathNum, 1,newShip)
                } else if (checkNum1b > -1 && checkNum3 === -1 && newShipElse === -1) {
                    if (newShipElse) {
                        currentBoard[num1][num2].push(newShipElse)
                        }
                }

            }
        }
    }


//my beautiful superfunction chain to work smarter not harder <3
function moveCoordinates(e, elId, boardParam, upLengthNum, rightLengthNum, downLengthNum, leftLengthNum, overLength, dynamic) {
    downLengthNum *= -1
    leftLengthNum *= -1
    let splitId = elId.split('-')
    let coordinate1 = Number(splitId[1]) //y direction coordinate
    let coordinate2 = Number(splitId[2]) //x direction coordinate
    let upNRights = getCoordinates(coordinate1, coordinate2, rightLengthNum, upLengthNum)
    let downNLefts = getCoordinates(coordinate1, coordinate2, leftLengthNum, downLengthNum)

    // lengthNums affect coordinates one less than their number, thus the value they must be lessthan/greaterthan must be lesser or greater by 1 to account for the 'redundancy'
    if (coordinate1 + upLengthNum > 10 || 
        coordinate2 + rightLengthNum > 10 || 
        coordinate1 + downLengthNum < -1  || 
        coordinate2 + leftLengthNum < -1 ||
        e.target.classList.contains(boardParam)) {
        moveError(coordinate1, coordinate2)
    } else {
    makeMove(coordinate1, coordinate2, upNRights, overLength, boardParam, dynamic)
    makeMove(coordinate1, coordinate2, downNLefts, overLength, boardParam, dynamic)
    }
}

function getCoordinates(coordinate1, coordinate2, xLength, yLength) {
    let coordinates = []
    let yCoordinates = []
    let xCoordinates = []
    if (xLength < 0 || yLength < 0) {
        for(let i = 0; i > yLength; i--) {
            let yCoordinate = coordinate1 + i
            yCoordinates.push(yCoordinate)
        }
        for(let i = 0; i > xLength; i--) {
            let xCoordinate = coordinate2 + i
            xCoordinates.push(xCoordinate)
        }
    } else {
        for(let i = 0; i < yLength; i++) {
            let yCoordinate = coordinate1 + i
            yCoordinates.push(yCoordinate)
        }
        for(let i = 0; i < xLength; i++) {
            let xCoordinate = coordinate2 + i
            xCoordinates.push(xCoordinate)
        }
    }
    coordinates.push(yCoordinates)
    coordinates.push(xCoordinates)
    return coordinates
}

function makeMove(coordinate1, coordinate2, doubleArray, overLength, boardParam, dynamic) { //if dynamic = true then x = i creates a cross pattern
                             //first array
    for(let i = 1; i < doubleArray[0].length; i++) {
        if (dynamic) {
            overLength = 0
            overLength += i
        }
        if (
            currentBoard.includes(currentBoard[doubleArray[0][i]]) && 
            currentBoard[doubleArray[0][i]].includes(currentBoard[doubleArray[0][i]][coordinate2]) &&
            currentBoard[doubleArray[0][i]].includes(currentBoard[doubleArray[0][i]][coordinate2 + overLength]) &&
            currentBoard[doubleArray[0][i]].includes(currentBoard[doubleArray[0][i]][coordinate2 - overLength])
            ) {
            if (boardParam) {
                (currentBoard[doubleArray[0][i]][coordinate2]).push(boardParam)
                if (overLength !== 0) {
                    if (coordinate2 + overLength >= 0 && coordinate2 + overLength <=9 && !(currentBoard[doubleArray[0][i]][coordinate2 + overLength]).includes(boardParam) && !(currentBoard[doubleArray[0][i]][coordinate2 + overLength]).includes('shot')) {
                    (currentBoard[doubleArray[0][i]][coordinate2 + overLength]).push(boardParam)
                    } else {moveError(coordinate1, coordinate2)} 
                    if ((coordinate2 - overLength) >= 0 && coordinate2 - overLength <=9 && !(currentBoard[doubleArray[0][i]][coordinate2 - overLength]).includes(boardParam)) {
                    (currentBoard[doubleArray[0][i]][coordinate2 - overLength]).push(boardParam)
                    } else {moveError(coordinate1, coordinate2)}
                }
            }
        }
    }
            //second Array
    for(let i = 0; i < doubleArray[1].length; i++) {
        if (dynamic === true) {
            overLength = i
        }
        if (
            currentBoard.includes(currentBoard[i]) &&
            currentBoard[i].includes(currentBoard[i][coordinate2]) && 
            currentBoard[i].includes(currentBoard[i][coordinate2 + overLength]) &&
            currentBoard[i].includes(currentBoard[i][coordinate2 - overLength]) &&
            doubleArray[1][i] <= 9
        ) {
            if (boardParam) { 
                    currentBoard[coordinate1][doubleArray[1][i]].push(boardParam)   
            }  
        }
    }
}
function moveError(coordinate1, coordinate2) {
        currentDomBoard.querySelector(`#${currentAfil}-${coordinate1}-${coordinate2}`).classList.add('er-highlighted')
        currentBoard[coordinate1][coordinate2].push('er-highlighted')
        selectorError = true
}
   

