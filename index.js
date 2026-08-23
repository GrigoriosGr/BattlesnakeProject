// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "GregG",       // TODO: Your Battlesnake Username
    color: "#FE1212", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// TODO: Step 2 - Prevent your Battlesnake from colliding with itself
// This function will check if the new head position is the same as any of the body coordinates
function avoidItself(newHeadPos, myBody){

	myBody.forEach((coord)=>{

		if(newHeadPos.x== coord.x && newHeadPos.y== coord.y){
			console.log("Hits self");
			return false;
		}
	})
	return true;
}

// TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
// This function will check if the new head position is the same as any of the body coordinates of other snakes
function avoidSnakes(futureHead, snakesBodies){

  	snakesBodies.forEach((snake)=>{
			snake.body.forEach((coord) =>{

				if(futureHead.x===coord.x && futureHead.y===coord.y){
					console.log("Hits Other snakes");
					return false;
				}
			})
		})
	return true;
}

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer

// Calculate the manhattan distance between the head and the food, and return the distance
function getManhattanDistance(head, food) {
  return Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
}



// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // Step 1 - Prevent your Battlesnake from moving out of bounds
  boardWidth = gameState.board.width;
  boardHeight = gameState.board.height;

  // Check horizontal bounds between 0 and width-1
  if (myHead.x === 0) {
    isMoveSafe.left = false;
  } else if (myHead.x === boardWidth - 1) {
    isMoveSafe.right = false;
  }

  // Check vertical bounds between 0 and width-1
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  } else if (myHead.y === boardHeight - 1) {
    isMoveSafe.up = false;
  }


  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // Check if after the move the new head position would be in the same position as any of the body coordinates
  newHead = myHead;
  if(isMoveSafe.up) {
    isMoveSafe.up = avoidItself({x: newHead.x, y: newHead.y - 1}, gameState.you.body);
  }
  if(isMoveSafe.down) {
    isMoveSafe.down = avoidItself({x: newHead.x, y: newHead.y + 1}, gameState.you.body);
  }
  if(isMoveSafe.left) {
    isMoveSafe.left = avoidItself({x: newHead.x - 1, y: newHead.y}, gameState.you.body);
  }
  if(isMoveSafe.right) {
    isMoveSafe.right = avoidItself({x: newHead.x + 1, y: newHead.y}, gameState.you.body);
  }

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // Check if after the move the new head position would be in the same position as any of the body coordinates of other snakes
  opponents = gameState.board.snakes;
  if(isMoveSafe.up) {
    isMoveSafe.up = avoidSnakes({x: newHead.x, y: newHead.y - 1}, opponents);
  }
  if(isMoveSafe.down) {
    isMoveSafe.down = avoidSnakes({x: newHead.x, y: newHead.y + 1}, opponents);
  }
  if(isMoveSafe.left) {
    isMoveSafe.left = avoidSnakes({x: newHead.x - 1, y: newHead.y}, opponents);
  }
  if(isMoveSafe.right) {
    isMoveSafe.right = avoidSnakes({x: newHead.x + 1, y: newHead.y}, opponents);
  }


  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
