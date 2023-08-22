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
let winner // null || 1 || -1
let shooting // true || false (will be used to help event listener either place ships or shoot where div is clicked)
let pBoard // array[0Array....9Array] nArray[0...9]
let p2Board// array[0Array....9Array] nArray[0...9]
let player
let player2
let shipSelect = {
    assignedShip: null,
    shipO: 1
}
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
            singleShot: Infinity,
            lineShot: 3,
            crossShot: 2,
            spreadShot: 1
        }

        this.ships = [generateShips()]

        this.shipsDestroyed = countShipDeath()
    }

    generateShips(affiliation) {
        for(let i = 1; i < 6; i++) {
            return new Ship(affiliation, i) 
        }
    }

    countShipDeath() {
        deadArray = this.ships.filter(filterShips(ship))
        return deadArray.length
    }

    filterShips(ship) {
        return !ship.destroyed
    }
}

// Cached Dom Elements
const opponentBoardEl = document.querySelector('#opponent-map')
const playerBoardEl = document.querySelector('#player-map')
const opponentSelectorEls = [...document.querySelectorAll('#opponent-map > div')]
const playerSelectorEls = [...document.querySelectorAll('#player-map > div')]
const messageEl =document.querySelector('h2')
const playerInfoEl = document.querySelector('#pl-info')
const player2InfoEl = document.querySelector('#comp-info')
const cannonshotEl = [...document.querySelectorAll('#cannon-type > div')]
const bodyEl = document.querySelector('body')
// affiliation els
const pirateButtonEl = document.querySelector('#pirate-button')
const navyButtonEl = document.querySelector('#navy-button')
// ship placement els
// const pirateShips = [...document.querySelector('#pship-select')]
// const navyShips = [...document.querySelector('#nship-select')]
const pshipEls = [...document.querySelectorAll('#pship-select>div')]
const nshipEls = [...document.querySelectorAll('#nship-select>div')]
const retryButtonEl = document.querySelector('#retry')


// Event Listeners

//               choose affiliation
if (pirateButtonEl){
    pirateButtonEl.addEventListener('click', initialize)
}

if (navyButtonEl) {
    navyButtonEl.addEventListener('click', initialize)
}

//             choose grid div for placing ships and shooting squares
if (opponentSelectorEls) {
    opponentSelectorEls.addEventListener('click', shoot)
}
if (playerSelectorEls) {
    playerSelectorEls.addEventListener('click', shoot)
}

pshipEls.addEventListener('click', selectShip)
nshipEls.addEventListener('click', selectShip)

function selectShip(e) {
    if (shooting === true) return
    else if(e.target.parentNode.id = turnAfil[turn.toString()]) {
        if (shipSelect.assignedShip === e.target.id) {    
            shipSelect.shipO *= -1
            }
        } else {shipSelect = {
            assignedShip: e.target.id,
            shipO: 1
            
        }
        }
}




// Functions
function initialize(e) {
    player = new Player(1, e.target.id)
    player2 = e.target.id = 'navy' ? new Player(-1, 'pirate') : new Player(-1, 'navy')
    console.log(player2)
    pBoard = []
    p2Board = []
    shooting = false
    turn = 1
    turnAfil = {
        '1': e.target.id, 
        '-1': p2Affil
    }
    createBoard(pBoard, e.target.id)
    createBoard(p2Board, p2Affil) 
    render()

}
// creates a 10/10 grid in a board array to map player choices
// also creates a div grid in html for 100 divs, each one with a unique ID (affiliation)(row)(column)
function createBoard(boardArray, affil) {  
    for(let i = 0; i < 10; i++) {
        let num1 = i
        for(let i = 0; i < 10; i++) {
            boardArray.push(0)
            let num2 = i
            el = document.createElement('div')
            let coordinate = el.setAtttribute('id', `${affil}-${num1}-${num2}`)
            if (turn === 1) {
                playerBoardEl.appendChild(coordinate)
                playerBoardEl.setAttribute('class', affil)
            } else if (turn === -1) {
                opponentBoardEl.appendChild(coordinate)
                opponentBoardEl.setAttribute('class', affil)
            }
        }
    }
}

function render() {
    renderBoard()
    renderMessage()
    renderShips()
    renderStats()
    renderShots()
}

function renderShips() {
    //makes sure it is needed (eval with shooting var)
    //makes player specific ships visible
    //renders ship visible on player's map after event listener
    if (shooting === false){
        let shipsPlaced = 0
        while(shipsPlaced < 6) {
            let shipSection = document.querySelector(`#${turnAfil[turn.toString]}`)
            shipSection.style.visibility = 'visible'
            renderShipLocation()
        }       
    } else if (shooting === true) {/*shoot div*/}
}

function renderShipLocation () {
    if (shipSelect.assignedShip === true) {

    }
}


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
function shoot(e) { //e = event
    if (shooting) {
        render()
    } else if (!shooting) {
        if (e.target.parentNode.id === turnAfil[turn.toString]) {//dont forget! board grid div ids will give coordinates for javascript board arrays
            if (shipSelect.assignedShip === true) {//ship-selector div ids will indicate the exact ship (in theory. at very least it has the length of the ship )
                let coordinateArray = e.target.id.split('-')
                let coordinate1 = Number(coordinateArray[1])
                let coordinate2 = Number(coordinateArray[2])
                let shipLength = Number(shipSelect.assignedShip.split('-')[1])
                let board = function() {turn = 1 ? pBoard : p2Board}
                if (board[coordinate1][coordinate2] === 0) {
                if (shipSelect.shipO === 1) {
                    if (shipLength + coordinate2 < 10 ) {
                        board[coordinate1].splice(coordinate2, shipLength, shipSelect.assignedShip)
                    }
                } else if(shipSelect.shipO === -1) {
                    if (shipLength + Number(corrdinateArray[1]) < 10 ) {
                        for (let i = 0; i = shipLength; i++) {
                            board[coordinate1 + i][coordinate2] = shipSelect.assignedShip
                        }
                    }
                    }
                }
            }
        }
    render()} 
}

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