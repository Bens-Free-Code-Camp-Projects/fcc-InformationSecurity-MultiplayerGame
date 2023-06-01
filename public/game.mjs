import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();

const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let thisPlayer
let players = {}
let directions = {}
let collectible;

const movement = () => {
    let input = ''
    if(directions['ArrowUp']){
        input += 'up'
    }
    if(directions['ArrowDown']){
        input += 'down'
    }
    if(directions['ArrowLeft']){
        input += 'left'
    }
    if(directions['ArrowRight']){
        input += 'right'
    }
    if(input){
        thisPlayer.movePlayer(input, 5)
        if(thisPlayer.collision(collectible)){
            collectible = new Collectible({})
            thisPlayer.score += 1
        }
        players[thisPlayer.id] = new Player(thisPlayer)
        socket.emit('update', {players: players, collectible: collectible})
    }
}

socket.on('new_player', (data) => {
    thisPlayer = new Player(data.player)
    players = data.players
    if(Object.keys(players).length === 1){
        collectible = new Collectible({})
        socket.emit('update', {players: players, collectible: collectible})
    } else {
        socket.emit('addPlayer', {players: players})
    }
    onkeydown = onkeyup = function(e){
        directions[e.key] = e.type == 'keydown';
    }
})

socket.on('addPlayer', (data) => {
    players = data.players
    if(collectible){
        socket.emit('update', {players: players, collectible: collectible})
    }
})

socket.on('update', (data) => {
    players = data.players
    collectible = data.collectible
})

const drawGame = () => {
    movement()
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, canvas.height/6, canvas.width, 1)
    
    let p
    for(const _id in players){
        if(_id === thisPlayer.id){
            context.fillStyle = 'white'
        } else {
            context.fillStyle = 'red'
        }

        p = new Player(players[_id])
        context.fillRect(p.x-(p.size/2), p.y-(p.size/2), p.size, p.size)
    }

    if(collectible){
        context.fillStyle = 'yellow'
        context.fillRect(collectible.x - (collectible.size/2), collectible.y - (collectible.size/2), collectible.size, collectible.size)
    }

    if(thisPlayer){
        context.fillStyle = 'white'
        context.font = '20px'
        context.fillText(thisPlayer.calculateRank(Object.values(players)), canvas.width*(9/10), canvas.height/8)
    }

    window.requestAnimationFrame(drawGame)
}


window.requestAnimationFrame(drawGame)
