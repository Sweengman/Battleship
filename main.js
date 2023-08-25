// # Psuedocode
// ## constants
const COLOR_LOOKUP = {
    '1': 'red',
    '-1': 'white',
    '0': 'gray',
}



// ## variables
let turn // 1 || -1
let turnAfil //object holding affiliations 
let currentAfil //currentAfil
let winner // null || 1 || -1
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
const messageEl =document.querySelector('h2')
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
const retryButtonEl = document.querySelector('#retry')

// console.log(pirateButtonEl)
// console.log(navyButtonEl)

// ## classes

class Ship {
    constructor(affil, length) {
        this.length = length

        this.id = `${affil}-${length}`

        this.destroyed = getShipStatus() // true || false

        this.orientation = 0 

        this.health = length // this will change, this.length will not

        this.affil = affil

        this.design = document.querySelector(`#${affil}-${this.length}`)
    }
    getShipStatus() {
        if (this.health) {
            return false
        } else return true
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
        

        this.shipsDestroyed = false
    }

    generateShips(affiliation) {
        for(let i = 1; i < 5; i++) {
            this.ships[i-1] = new Ship(affiliation, i) 
        }
    }

    countShipDeath() {
        deadArray = this.ships.filter(filterShips(ship))
        this.shipsDestroyed = deadArray.length = 4 ? true : false
    }

    filterShips(ship) {
        return !ship.destroyed
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
    if (e.target.parentNode.className === currentAfil) {
        if (e.target.matches('div')){
            if (shooting) {
                shoot(e)

            } else if (!shooting && shipSelect.assignedShip) {
                chooseShipPlace(e)
                if (!selectorError) {
                    document.querySelector(`.${currentAfil}.selector>${shipSelectId}`).remove()
                    shipsPlaced ++
                    shipSelect.assignedShip = null
                    shipSelect.shipO = 1
                }
            }
            if(!selectorError) {
                wipeHighlight()
                turn *= -1
                render()
            } else {selectorError = false}
            
        }
    }
}
//subfunctions to select 
function chooseShipPlace(e) {
    if (e.target.parentNode.className === currentAfil) {
        if (shipSelect.assignedShip) {
            if (shipSelect.shipO === 1) { 
                moveCoordinates(e.target.id, 'ship', 0, (shipSelectLength), 0, 0, 0, 0, false)
                moveCoordinates(e.target.id, shipSelectType,(shipSelectLength), 0, 0, 0, 0, 0,- false)
            } else if (shipSelect.shipO === -1) {
                moveCoordinates(e.target.id, 'ship', (shipSelectLength), 0,  0, 0, 0, 0, 0, false)
                moveCoordinates(e.target.id, shipSelectType, (shipSelectLength), 0, 0, 0, 0, 0, false)
            }
        }   
    }
}
function shoot(e) {
    if (shotSelect.shotType === 'singleShot') {
        moveCoordinates(e.target.id, 'shot', 1, 1, 0, 0, 0, false)

    } else if (shotSelect.shotType === 'lineShot') {
        moveCoordinates(e.target.id, 'shot', 2, 0, 2, 0, 0, false)

    } else if (shotSelect.shotType === 'crossShot') {
        moveCoordinates(e.target.id, 'shot', 2, 2, 2, 2, 0, false)

    } else if (shotSelect.shotType === 'spreadShot') {
        moveCoordinates(e.target.id, 'shot', 3, 3, 3, 3, 0, true)
    }
}


//dynamic is true or false statement that makes overrides overLength and creates an X pattern
function moveCoordinates(elId, boardParam, upLengthNum, rightLengthNum, downLengthNum, leftLengthNum, overLength, dynamic) {
    downLengthNum *= -1
    leftLengthNum *= -1
    let splitId = elId.split('-')
    let coordinate1 = Number(splitId[1]) //y direction coordinate
    let coordinate2 = Number(splitId[2]) //x direction coordinate
    let upNRights = getCoordinates(coordinate1, coordinate2, rightLengthNum, upLengthNum)
    let downNLefts = getCoordinates(coordinate1, coordinate2, leftLengthNum, downLengthNum)
    if (coordinate1 + upLengthNum > 10 || coordinate2 + rightLengthNum > 10 || coordinate1 + downLengthNum < 0  || coordinate2 + leftLengthNum < 0) {
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
    for(let i = 0; i < doubleArray[0].length; i++) {
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
                if (!currentBoard[doubleArray[0][i]][coordinate2].includes(boardParam)) {
                (currentBoard[doubleArray[0][i]][coordinate2]).push(boardParam)
                } else {moveError(coordinate1, coordinate2)}

                if (!(overLength === 0)) {
                    if (!coordinate2 + overLength >= 0 && coordinate2 + overLength <=9 && !(currentBoard[doubleArray[0][i]][coordinate2]).includes(boardParam)) {
                    (currentBoard[doubleArray[0][i]][coordinate2 + overLength]).push(boardParam)
                    } else {moveError(coordinate1, coordinate2)} 
                    if ((coordinate2 - overLength) >= 0 && coordinate2 - overLength <=9 && !(currentBoard[doubleArray[0][i]][coordinate2]).includes(boardParam)) {
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
                if (!currentBoard[coordinate1][doubleArray[1][i]].includes(boardParam)) {
                currentBoard[coordinate1][doubleArray[1][i]].push(boardParam)
                } else {moveError(coordinate1, coordinate2)}
                if (!(overLength ===0)) {
                    if ((coordinate2 + overLength) <= 9 && !(currentBoard[coordinate1 + overLength][doubleArray[1][i]].includes(boardParam))) {
                    currentBoard[coordinate1 + overLength][doubleArray[1][i]].push(boardParam)
                    } else {moveError(coordinate1, coordinate2)}
                    if ((coordinate2 - overLength) >= 0 && (coordinate2 - overLength) <= 9 && !currentBoard[coordinate1 - overLength][doubleArray[1][i]].includes(boardParam)) {
                    currentBoard[coordinate1 - overLength][doubleArray[1][i]].push(boardParam)
                    } else {moveError(coordinate1, coordinate2)}
                }
            }  
        }
    }
}

function moveError(coordinate1, coordinate2) {
        currentDomBoard.querySelector(`#${currentAfil}-${coordinate1}-${coordinate2}`).classList.add('er-highlighted')
        currentBoard[coordinate1][coordinate2].push('er-highlighted')
        selectorError = true
         console.log('error')
}

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
    if (e.target.parentNode.className === currentAfil) {
        if (e.target.matches('div')) {
            if (shooting) {
                if (shotSelect.shotType) {
                    if (shotSelect.shotType = 'singleShot') { 
                        moveCoordinates(e.target.id, 'highlighted', 1, 0, 0, 0, 0, 0, false)
                    }
                }
            } else if (!shooting) {
                if (shipSelect.assignedShip) {
                    if (shipSelect.shipO === 1) { 
                        moveCoordinates(e.target.id, 'highlighted', 0, shipSelectLength, 0, 0, 0, 0, false)
                    } else if (shipSelect.shipO === -1) {
                        moveCoordinates(e.target.id, 'highlighted', shipSelectLength, 0, 0, 0, 0, 0, false)
                        
                    }
                }
            }
            selectorError = false
            render()
        }
    }
    window.addEventListener('mouseout', wipeHighlight)
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
}
  

function selectShot(e) {
    if (shooting) {
        let shotType = e.target.id
        if (player.cannonshotTypes[shotType] > 0) {
            shotSelect.shotType = shotType
            shotSelect.shotsLeft = player.cannonshotTypes[shotType]
        } 
        e.target.innerHTML = `${shotType}: ${player.cannonshotTypes[shotType]} Left...`
        setTimeout(function() {e.target.innerHTML = shotType}, 1000);
    }
}




// Functions
function initialize(e) {
    // console.log('initialize!')
    // console.log(e.target.class)
    pAffill = e.target.className
    if (pAffill === 'pirate') {
        p2Affil = 'navy'
    } else if (pAffill === 'navy') {
        p2Affil = 'pirate'
    }
    player = new Player(1, pAffill)
    player2 = new Player(-1, p2Affil)
    player.generateShips
    player2.generateShips
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
    // console.log(currentAfil)
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
        // console.log('lap')
        for(let i = 0; i < 10; i++) {
            boardArray[num1].push(['-']) 
            let num2 = i
            el = document.createElement('div')
            let boundEl = whosBoard.appendChild(el)
            boundEl.setAttribute('id', `${affil}-${num1}-${num2}`)  
            whosBoard.classList.add(affil)
            whosBoard.id
            // console.log(boardArray[num1][num2])
        }
    }
}

function render() {
    currentAfil = turnAfil[turn.toString()]
    if (!shooting) {
        let currentBoardObj = {
            '1': pBoard,
            '-1': p2Board
        }

        currentBoard = currentBoardObj[turn.toString()]
        currentBoard = currentBoardObj[(-turn).toString()]
    let currentDomBoardObj = {
        '1': playerBoardEl,
        '-1': opponentBoardEl
    }

    currentDomBoard = currentDomBoardObj[turn.toString()]
    hiddenDomBoard = currentDomBoardObj[(-turn).toString()]

    } else if (shooting) {
        let currentDomBoardObj = {
            '1': opponentBoardEl,
            '-1': playerBoardEl
        }

        currentDomBoard = currentDomBoardObj[turn.toString()]
        let currentBoardObj = {
            '1': p2Board,
            '-1': pBoard
        }
        currentBoard = currentBoardObj[turn.toString()]
    }

    if (shipsPlaced > 9) {
        shooting = true
    }
    renderTurn()
    //renderMessage()
    renderShips()
    //renderStats()
    renderBoard(pBoard, pAffill, playerBoardEl)
    renderBoard(p2Board, p2Affil, opponentBoardEl)
}

function renderTurn() {
    let turn1Els = [...document.querySelectorAll(`.${pAffill}`)]
    let turn2Els = [...document.querySelectorAll(`.${p2Affil}`)]
    length1 = turn1Els.length
    length2 = turn2Els.length
    
    if (shooting) {
        pshipEls.remove()
        nshipEls.remove()
        turn *= turnSwitch
        turnSwitch = 1
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
    } else if (shooting) {
        /*ships are invisible, check for shot divs*/
    }
}
function renderBoard (board, affil, domBoard) {
    if (shooting) {
        for(let ship of [...currentDomBoard.querySelectorAll('div.ship')]) {
            ship.classList.remove('ship')
            ship.classList.add('shoot-ship')
        }
        for(let ship of [...hiddenDomBoard.querySelectorAll('div.ship')]) {
            ship.classList.remove('ship')
            ship.classList.add('shoot-ship')
        }
        for(let i = 0; 1 < 10; i++) {
            let num1 = i
            for(let i = 0; 1 < 10; i++) {
                let num2 = i
                for(let soloClass of currentBoard[num1][num2]) {
                    let deathNum = currentBoard[num1][num2].indexOf('ship')
                    if(deathNum > -1) {
                        currentBoard[num1][num2].indexOf('ship').splice(deathNum, 1)
                    }
                }
                for(let soloClass of hiddenBoard[num1][num2]) {
                    let deathNum = currentBoard[num1][num2].indexOf('ship')
                    if(deathNum > -1) {
                        currentBoard[num1][num2].indexOf('ship').splice(deathNum, 1)
                    }
                }
            }
        }
    }
    for (let i = 0; i < 10; i++) {
        let coordinate1 = i
        for(let i = 0; i < 10; i++) {
            let coordinate2 = i
            let boardEl = domBoard.querySelector(`#${affil}-${coordinate1}-${coordinate2}`)
            let boardClasses = board[coordinate1][coordinate2]
            boardClasses.join(' ')
            boardEl.setAttribute('class',`${boardClasses.join(' ')}`)
        }
    }
}
    //     colArr.forEach(function()) {
    //     const divId = `c${colIdx}r${currentBoard[2]}`;
    //         // const cellEl = document.getElementById(divId);
    //         // cellEl.style.backgroundColor = COLOR_LOOKUP[currentBoard[1]];
    //     $(`#${divId}`).css('backgroundColor', COLOR_LOOKUP[currentBoard[1]])
    //     }})
    // }

        /*function grabShip(e) {
    player.ships[e.target.id]           #0-4
    document.addEventListener('mousemove', function(e) {
    let ship = document.getElementById(`#ship${e.target.id}`);
    let left = e.offsetX;
    let top = e.offsetY;
    circle.style.left = left + 'px';
    circle.style.top = top + 'px';
    
});
} */





// if shooting phase has begun, shoots div. 
//if not, gets shipSelect assignedShip (affil and length) and adds it to board array based on shipSelect.shipO (orientation)


function checkForShip(el) {

}



// ## objects
// - player (object from class)
// - player2 (object from class) {
//     AI functionality
// }
// ## cached DOM
// - message
// - select faction buttons
// - player and comp stat sections
// - grid divs
// - cannonshot divs
// - images/gifs (for hit vs miss and possibly boat sink)
// - play again
// - 10 ship els, each with own ID
// - section id #ship-select (for selecting ships and where to put them)

// ## on load

// on load
// - init
//     - render
//         - choose faction
//         - sound of waves?
//     - variables



// ## eventlisteners
// - all are on 'click'
//     - choose faction (changes) 
//         - ship style 
//         - music, 
//         - starts rest (allows render of) player2 grid 
//         - info sections 
//         - side sections
//         - bind's ship faction divs to player and player2 ship object vars. 
//     - place ships
//         - click ship from 'ship-select'
//     - grid divs
//         - selects target tile
//         - blasts (image or animation if this is my wildest dream)
//         - reveals if hit or miss with image
//         - reveals boat if destroyed
//     - choose cannontype
//         - changes which function is used during the grid divs   listener (in my dreams again, changes how the hover CSS works)

//     - play again
    
// ## functions
// ### div e.targeters
// - shootSpot
// - shootCross
// - shootLine
// - shootSpread

// ### theme changers
// - decoratePirate
// - decorateNavy

// ### game evals
// - checkWin
// - boatHit
// - checkSink

// ### AI functionality
// - ifTurn (check turn var, check winner var)
//     - check viable options (choose from unhit divs)
//     - check smart options (don't shoot own ships && if enemy objectShip hit last turn, choose from adjacent divs)
//     - pickSpot (math.random)
//     - endTurn