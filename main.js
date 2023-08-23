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
    assignedShip: null,
    shipO: 1
}
let shipsPlaced = 0

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
            singleShot: Infinity,
            lineShot: 3,
            crossShot: 2,
            spreadShot: 1
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
opponentBoardEl.addEventListener('click', shoot)
playerBoardEl.addEventListener('click', shoot)
pshipEls.addEventListener('click', selectShip)
nshipEls.addEventListener('click', selectShip)

function selectShip(e) {
    if (shooting === true) return
    else if(e.target.parentNode.id = currentAfil) {
        if (shipSelect.assignedShip === e.target.id) {    
            shipSelect.shipO *= -1
            e.target.style.transform.rotate('90deg');
        } else {shipSelect = {
            assignedShip: e.target.id,
            shipO: 1
        }}
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
    currentAfil = turnAfil[turn.toString()]
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
            boardArray[num1].push(0) 
            let num2 = i
            el = document.createElement('div')
            whosBoard.appendChild(el).setAttribute('id', `${affil}-${num1}-${num2}`)
            //whosBoard.classList.add(affil)

        }
    }
}

function render() {
    if (shipsPlaced >= 10) {
        shooting = true
    }
    //renderMessage()
    renderShips()
    //renderStats()
    //renderShots()
    renderBoard(pBoard, pAffill)
    renderBoard(p2Board, p2Affil)
}

function renderShips() {
    //makes sure it is needed (eval with shooting var)
    //makes player specific ships visible
    //renders ship visible on player's map after event listener
    if(!shooting){
        let shipSection = document.querySelector(`section.${currentAfil}`)
        console.log(shipSection)
        shipSection.style.visibility = 'visible'
    } else if (shooting) {/*ships are invisible, check for shot divs*/}
}
function renderBoard (board, affil) {
    for (let i = 0; i > 10; i++) {
        for (let innerArr of board[i]){
            if (innerArr !== 0) {
            let idx2 = array.findIndex(innerArr)
            let element = document.getElementById(`${affil}-${idx1}-${idx2}`)
            element.setAttribute('id', `${board[idx1][idx2]}`)
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
function shoot(e) { //e = event
    if (shooting) {
        render()
    } else if (!shooting) {
        if (e.target.parentNode.id === currentAfil) {//dont forget! board grid div ids will give coordinates for javascript board arrays
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
                        for(let i = 0; i< shipLength; i++) {
                           let currentEl = document.getElementById
                           (`${turnAfil[true.toString()]}-${coordinate1}-${coordinate2 + i}`)
                           currentEl.style.backgroundColor = 'yellow'
                        }

                    }
                } else if(shipSelect.shipO === -1) {
                    if (shipLength + Number(coordinateArray[1]) < 10 ) {
                        for (let i = 0; i = shipLength; i++) {
                            board[coordinate1 + i][coordinate2] = shipSelect.assignedShip
                        }
                    }
                    }
                    shipsPlaced ++
                }
            }
        }
    render()
    turn *= -1
    } 
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