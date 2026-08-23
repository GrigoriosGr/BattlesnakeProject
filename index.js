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
  console.log('INFO');

  return {
    apiversion: '1',
    author: 'GregG', // TODO: Your Battlesnake Username
    color: '#FE1212', // TODO: Choose color
    head: 'default', // TODO: Choose head
    tail: 'default', // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log('GAME START');
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log('GAME OVER\n');
}

//
// Function to choose a random move from the list of safe moves (moved to a separate function for better readability)
//
function randomNextMove(safeMoves) {
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  return nextMove;
}

//
// Step 2 - Prevent your Battlesnake from colliding with itself
//
// This function will check if the new head position is the same as any of the body coordinates
function avoidItself(newHeadPos, myBody) {
  myBody.forEach((coord) => {
    if (newHeadPos.x == coord.x && newHeadPos.y == coord.y) {
      console.log('Hits self');
      return false;
    }
  });
  return true;
}

//
// Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
//
// This function will check if the new head position overlaps with the tail coordinates of another snakes, and if so, to check if there is food in the next move
function isMoveToAnotherSnakeTailOK(futureHead, snake, food) {
  const tail = snake.body[snake.body.length - 1];
  if (futureHead.x === tail.x && futureHead.y === tail.y) {
    console.log('Hits Other snakes tail');
    // If there is food in the next move, we want to avoid the tail collision, otherwise we can engage with the tail
    const isFoodInNextMove = food.some((foodItem) => {
      return (
        (foodItem.x === futureHead.x && foodItem.y === futureHead.y + 1) ||
        (foodItem.x === futureHead.x && foodItem.y === futureHead.y - 1) ||
        (foodItem.x === futureHead.x + 1 && foodItem.y === futureHead.y) ||
        (foodItem.x === futureHead.x - 1 && foodItem.y === futureHead.y)
      );
    });
    return !isFoodInNextMove;
  }
  return true;
}

// This function will check if the new head position is the same as any of the body coordinates of other snakes
function avoidSnakes(futureHead, snakesBodies, food) {
  snakesBodies.forEach((snake) => {
    snake.body.forEach((coord) => {
      if (futureHead.x === coord.x && futureHead.y === coord.y) {
        console.log('Hits Other snakes');
        // Check if the future head position is the same as the tail of the other snake, and if so, check if there is food in the next move
        if (coord === snake.body[snake.body.length - 1]) {
          return isMoveToAnotherSnakeTailOK(futureHead, snakesBodies, food);
        }
        return false;
      }
    });
  });
  return true;
}

//
// Step 4 - Move towards food instead of random, to regain health and survive longer
//

// Calculate the manhattan distance between the head and the food, and return the distance
function getManhattanDistance(head, food) {
  return Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
}

// Calculate the distances from the head to each food item and return an array of distances
function getFoodDistances(myHead, food) {
  return food.map((foodItem) => {
    return getManhattanDistance(myHead, foodItem);
  });
}

// Try to find the optimal move for eating food by moving towards the closest food item
function getOptimalMoveToEat(myHead, food, isMoveSafe) {
  const foodDistances = getFoodDistances(myHead, food);
  const closestFood = food[foodDistances.indexOf(Math.min(...foodDistances))];

  const dx = closestFood.x - myHead.x;
  const dy = closestFood.y - myHead.y;

  if (dx !== 0 && isMoveSafe[dx > 0 ? 'right' : 'left']) {
    return dx > 0 ? 'right' : 'left';
  } else if (dy !== 0 && isMoveSafe[dy > 0 ? 'up' : 'down']) {
    return dy > 0 ? 'up' : 'down';
  }
  return randomNextMove(Object.keys(isMoveSafe).filter((move) => isMoveSafe[move]));
}

//
// Step 5 - Check head-on collisions with other snakes
//
// This function will check if the new head position is the same as any of the body coordinates of other snakes
function isSnakeHeadCollisionOK(futureHead, snakesBodies, myLength) {
  snakesBodies.forEach((snake) => {
    if (futureHead.x === snake.head.x && futureHead.y === snake.head.y) {
      console.log('Hits Other snakes head');
      // We want to avoid head-on collisions with snakes that are bigger than us, but we want to engage with smaller snakes
      const isBiggerThanMe = snake.length > myLength; // gameState.you.length;
      return !isBiggerThanMe;
    }
  });
  return true;
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

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
  const newHead = myHead;
  if (isMoveSafe.up) {
    isMoveSafe.up = avoidItself({ x: newHead.x, y: newHead.y - 1 }, gameState.you.body);
  }
  if (isMoveSafe.down) {
    isMoveSafe.down = avoidItself({ x: newHead.x, y: newHead.y + 1 }, gameState.you.body);
  }
  if (isMoveSafe.left) {
    isMoveSafe.left = avoidItself({ x: newHead.x - 1, y: newHead.y }, gameState.you.body);
  }
  if (isMoveSafe.right) {
    isMoveSafe.right = avoidItself({ x: newHead.x + 1, y: newHead.y }, gameState.you.body);
  }

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // Check if after the move the new head position would be in the same position as any of the body coordinates of other snakes
  const opponents = gameState.board.snakes;
  const food = gameState.board.food;
  if (isMoveSafe.up) {
    isMoveSafe.up = avoidSnakes({ x: newHead.x, y: newHead.y - 1 }, opponents, food);
  }
  if (isMoveSafe.down) {
    isMoveSafe.down = avoidSnakes({ x: newHead.x, y: newHead.y + 1 }, opponents, food);
  }
  if (isMoveSafe.left) {
    isMoveSafe.left = avoidSnakes({ x: newHead.x - 1, y: newHead.y }, opponents, food);
  }
  if (isMoveSafe.right) {
    isMoveSafe.right = avoidSnakes({ x: newHead.x + 1, y: newHead.y }, opponents, food);
  }

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    // No safe moves left, so choose a random move (this will likely lead to death)
    return { move: 'down' };
  }

  // Step 4 - Move towards food instead of random, to regain health and survive longer
  let nextMove = getOptimalMoveToEat(myHead, food, isMoveSafe);

  // Choose a random move from the safe moves
  //---  Removed as the optimal move to eat food is now being used ---
  // const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
