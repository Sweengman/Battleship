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

// Cached Dom Elements
const opponentBoardEl = document.querySelector('#opponent-map')
const playerBoardEl = document.querySelector('#player-map')
const opponentSelectorEls = [...document.querySelectorAll('#opponent-map > div')]
const playerSelectorEls = [...document.querySelectorAll('#player-map > div')]
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

console.log(pirateButtonEl)
console.log(navyButtonEl)

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


console.log(opponentSelectorEls)
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
            shoot(e)
            turn *= -1
            render()
        } else if (!shooting) {
        
        if (e.target.parentNode.className === currentAfil) {//dont forget! board grid div ids will give coordinates for javascript board arrays
            if (shipSelect.assignedShip) {//ship-selector div ids will indicate the exact ship (in theory. at very least it has the length of the ship )
                let coordinateArray = e.target.id.split('-')
                let coordinate1 = Number(coordinateArray[1])
                let coordinate2 = Number(coordinateArray[2])
                let board = (turn === 1 ? pBoard : p2Board)
                if (!board[coordinate1][coordinate2].includes('ship')) {
                    if (shipSelect.shipO === 1) {
                        if (shipSelectLength + coordinate2 <= 10 ) {
                            let errorTest = false
                            for (let i = 0; i < shipSelectLength; i++) {
                                let currentEl = document.getElementById
                                (`${currentAfil}-${coordinate1}-${coordinate2 + i}`)
                                if (currentEl.classList.contains('ship')) {
                                    errorTest = true
                                }
                            }
                            if (!errorTest) {
                                for (let i = 0; i < shipSelectLength; i++) {
                                    let currentEl = document.getElementById
                                    (`${currentAfil}-${coordinate1}-${coordinate2 + i}`)
                                    currentEl.style.backgroundColor = 'yellow'
                                    board[coordinate1][coordinate2 + i] = shipSelect.assignedShip
                                    currentEl.classList.add('ship',`-${shipSelectShipArray[1]}-${shipSelectShipArray[2]}`)

                                }
                                if (currentAfil === 'pirate') { 
                                    delEl = document.querySelector(`section#pship-select>div${shipSelectId}`)
                                    delEl.remove()
                                } else if (currentAfil === 'navy') {
                                    delEl = document.querySelector(`section#nship-select>div${shipSelectId}`)
                                    delEl.remove()
                                }
                                shipsPlaced ++
                                shipSelect.assignedShip = null
                                turn *= -1
                                render()
                            }
                        }
                    } else if(shipSelect.shipO === -1) {
                        if (shipSelectLength + coordinate1 <= 10 ) {
                            let errorTest = false
                            for (let i = 0; i < shipSelectLength; i++) {
                                let currentEl = document.getElementById
                                (`${currentAfil}-${coordinate1 + i}-${coordinate2}`)
                                if (currentEl.classList.contains('ship')) {
                                    errorTest = true
                                }
                            }
                            if (!errorTest) {
                                for (let i = 0; i < shipSelectLength; i++) {
                                    let currentEl = document.getElementById
                                    (`${currentAfil}-${coordinate1 + i}-${coordinate2}`)
                                    currentEl.style.backgroundColor = 'yellow'
                                    board[coordinate1 + i][coordinate2] = shipSelect.assignedShip
                                    currentEl.classList.add('ship',`-${shipSelectShipArray[1]}-${shipSelectShipArray[2]}`)
                                }
                                if (currentAfil === 'pirate') { 
                                    delEl = document.querySelector(`section#pship-select>div${shipSelectId}`)
                                    delEl.remove()
                                } else if (currentAfil === 'navy') {
                                    delEl = document.querySelector(`section#nship-select>div${shipSelectId}`)
                                    delEl.remove()
                                }
                                shipsPlaced ++
                                shipSelect.assignedShip = null
                                turn *= -1
                                render()
                            }
                        }
                    }
                }
            }
        }
    }
    }
} 
//subfunctions to select 
function chooseShipPlace(e) {
    if (e.target.parentNode.className === currentAfil) {
        if (shipSelect.assignedShip) {
            let coordinateArray = e.target.id.split('-')
            let coordinate1 = Number(coordinateArray[1])
            let coordinate2 = Number(coordinateArray[2])
            let board = (turn === 1 ? pBoard : p2Board)
            if (shipSelect.shipO === 1) { 
                moveCoordinates(e.target.id, 'ship', 0, (shipSelectlength + 1), 0, 0, 0, 0, false)
                moveCoordinates(e.target.id, shipSelectType, (shipSelectlength + 1), 0, 0, 0, 0, false)
            } else if (shipSelect.ship0 === -1) {
                moveCoordinates(e.target.id, 'ship', 0, (shipSelectlength + 1), 0, 0, 0, 0, 0, false)
                moveCoordinates(e.target.id, shipSelectType, (shipSelectlength + 1), 0, 0, 0, 0, 0, false)
            }
        }
    }
}
function shoot(e) {
    if (shotSelect.shotType === 'singleShot') {
        moveCoordinates(e.target.id, 'shot', 0, 0, 0, 0, 0, false)

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
    makeMove(coordinate1, coordinate2, upNRights, overLength, boardParam, dynamic)
    makeMove(coordinate1, coordinate2, downNLefts, overLength, boardParam, dynamic)
    
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

function makeMove(coordinate1, coordinate2, doubleArray, overLength, methodFunc, methodParam, boardParam, dynamic) { //if dynamic = true then x = i creates a cross pattern
                             //first array
    for(let i = 0; i < doubleArray[0].length; i++) {
        let board
        if (turn === 1) {
            board = p2Board
        } else if (turn === 2) {
            board = pBoard
        }
        if (dynamic === true) {
            overLength = i
        }
        if (
            board.includes(board[doubleArray[0][i]]) && 
            board[doubleArray[0][i]].includes(board[doubleArray[0][i]][coordinate2]) &&
            board[doubleArray[0][i]].includes(board[doubleArray[0][i]][coordinate2 + overLength]) &&
            board[doubleArray[0][i]].includes(board[doubleArray[0][i]][coordinate2 - overLength])
            ) {
            if (boardParam) {
                board[doubleArray[0][i]][coordinate2].push(boardParam)
                if (!coordinate2 + overLength === 0) {
                board[doubleArray[0][i]][coordinate2 + overLength].push(boardParam)
                }
                if (!coordinate2 - overLength === 0) {
                board[doubleArray[0][i]][coordinate2 - overLength].push(boardParam)
                }
            }
        }
    }  
            //second Array
        for(let i = 0; i < doubleArray[1].length; i++) {
            let board
            if (turn === 1) {
                board = p2Board
            } else if (turn === 2) {
                board = pBoard
            }
            if (dynamic === true) {
                overLength = i
            }
            if (
                board.includes(board[i]) &&
                board[i].includes(board[i][coordinate2]) && 
                board[i].includes(board[i][coordinate2 + overLength]) &&
                board[i].includes(board[i][coordinate2 - overLength]) 
            ) {
                let currentEl = currentBoard.querySelector(`#${currentAfil}-${coordinate1}-${doubleArray[1][i]}`)
                let overElRight = currentBoard.querySelector(`#${currentAfil}-${coordinate1 + overLength}-${doubleArray[1][i]}`)
                let overElLeft = currentBoard.querySelector(`#${currentAfil}-${coordinate1 - overLength}-${doubleArray[1][i]}`)
                methodFunc(currentEl, methodParam)
                methodFunc(overElRight, methodParam)
                methodFunc(overElLeft, methodParam)
                if (boardParam) {
                    board[coordinate1][doubleArray[0][i]].push(boardParam)
                    if (!coordinate2 + overLength === 0) {
                    board[coordinate1 + overLength][doubleArray[0][i]].push(boardParam)
                    }
                    if (!coordinate2 - overLength === 0) {
                    board[coordinate1 - overLength][doubleArray[0][i]].push(boardParam)
                    }
                }
               
                
                
            }
            }
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
    if (e.target.matches('div')) {
        if (shooting) {
            if (shotSelect.shotType) {
                if (shotSelect.shotType === 'singleShot') {
                    moveCoordinates(e.target.id, classAddEval, 'highlighted', 'highlighted', 0, 0, 0, 0, 0, false)
                } else if (shotSelect.shotType === 'lineShot') {
                    moveCoordinates(e.target.id, classAddEval, 'highlighted', 'highlighted', 2, 0, 2, 0, 0, false)
                } else if (shotSelect.shotType === 'crossShot') {
                    moveCoordinates(e.target.id, classAddEval, 'highlighted', 'highlighted', 2, 2, 2, 2, 0, false)
                } else if (shotSelect.shotType === 'spreadShot') {
                    moveCoordinates(e.target.id, classAddEval, 'highlighted', 'highlighted', 3, 3, 3, 3, 0, true)
                }
            }
        } else if ((!shooting) && shipSelect.assignedShip) {
            let coordinates = (e.target.id).split('-')
            let coordinate1 = Number(coordinates[1])
            let coordinate2 = Number(coordinates[2])
            let errorTest = false      
            if (shipSelect.shipO === 1) {
                if (shipSelectLength + coordinate2 <= 10) {
                    for (let i = 0; i < shipSelectLength; i++) {
                        let el = document.querySelector(`#${coordinates[0]}-${coordinate1}-${coordinate2 + i}`)
                        if (el.classList.contains('ship')) {
                            errorTest = true
                        }
                    }   
                }
                    for (let i = 0; i < shipSelectLength; i++) {
                        let el = document.querySelector(`#${coordinates[0]}-${coordinate1}-${coordinate2 + i}`)
                        if (el) {
                            if (((coordinate2 + shipSelectLength) <= 10) && (!errorTest)) {el.classList.add('highlighted')}
                            else {el.classList.add('er-highlighted')}
                        }
                    } 
                } else if (shipSelect.shipO === -1) {
                if (shipSelectLength + coordinate1 <= 10) {
                    for (let i = 0; i < shipSelectLength; i++) {
                        let el = document.querySelector(`#${coordinates[0]}-${coordinate1 + i}-${coordinate2}`)
                        if (el.classList.contains('ship')) {
                            errorTest = true
                        }
                    }
                }
                for (let i = 0; i < shipSelectLength; i++) {
                    let el = document.querySelector
                    (`#${coordinates[0]}-${coordinate1 + i}-${coordinate2}`)
                    if (el) {
                    if ((coordinate1 + shipSelectLength <= 10) && (!errorTest)) { el.classList.add('highlighted')}
                    else {el.classList.add('er-highlighted')}
                    }
                }
            }
            }
        }
    }
    

function wipeHighlight(e) {
    if (e.target.matches('div')) {
        let wipeArray1 = [...document.querySelectorAll('#player-map>div')]
        let wipeArray2 = [...document.querySelectorAll('#opponent-map>div')]

        for(let div of wipeArray1) {
        div.classList.remove('highlighted')
        div.classList.remove('er-highlighted')
        }
        for(let div of wipeArray2) {
        div.classList.remove('highlighted')
        div.classList.remove('er-highlighted')
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
    console.log('initialize!')
    console.log(e.target.class)
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
    console.log(currentAfil)
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
            boardArray[num1].push([0]) 
            let num2 = i
            el = document.createElement('div')
            let boundEl = whosBoard.appendChild(el)
            boundEl.setAttribute('id', `${affil}-${num1}-${num2}`)
            boundEl.setAttribute('class', 'null')
            
            whosBoard.classList.add(affil)

        }
    }
}

function render() {
    currentAfil = turnAfil[turn.toString()]
    let currentBoardObj = {
        '1': playerBoardEl,
        '-1': opponentBoardEl
    }
    currentBoard = currentBoardObj[turn.toString()]


    if (shipsPlaced > 9) {
        shooting = true
    }
    renderTurn()
    //renderMessage()
    renderShips()
    //renderStats()
    //renderShots()
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
    for (let i = 0; i < 10; i++) {
        let coordinate1 = i
        for(let i = 0; i < 10; i++) {
            let coordinate2 = i
            let boardEl = domBoard.querySelector(`#${affil}-${coordinate1}-${coordinate2}`)

            for(let singleClass of board[coordinate1][coordinate2]) {
                boardEl.classList.add(`${singleClass}`)
            }
            
        }
    }
}
    //     colArr.forEach(function()) {
    //     const divId = `c${colIdx}r${board[2]}`;
    //         // const cellEl = document.getElementById(divId);
    //         // cellEl.style.backgroundColor = COLOR_LOOKUP[board[1]];
    //     $(`#${divId}`).css('backgroundColor', COLOR_LOOKUP[board[1]])
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


// my helper function arguments for my moveCoordinates function :D
function classAddEval(el, classArg) {
    if (el) {
        el.classList.add(classArg)
    }
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