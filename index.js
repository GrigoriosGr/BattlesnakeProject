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

/**
 * info is called when you create your Battlesnake on play.battlesnake.com
 * and controls your Battlesnake's appearance
 * TIP: If you open your Battlesnake URL in a browser you should see this data
 * @returns {Object} - Battlesnake configuration data
 */
function info() {
  console.log('INFO');

  return {
    apiversion: '1',
    author: 'GrigorisG', // Set a unique Battlesnake Username
    color: '#FE1212', // TODO: Choose color
    head: 'default', // TODO: Choose head
    tail: 'default', // TODO: Choose tail
  };
}

/**
 * start is called when your Battlesnake begins a game
 * @param {Object} gameState - The state of the game.
 */
function start(gameState) {
  console.log('GAME START');
}

/**
 * end is called when your Battlesnake finishes a game
 * @param {Object} gameState - The state of the game.
 */
function end(gameState) {
  console.log('GAME OVER\n');
}

/**
 * Does a flood fill on the board to mark all reachable spaces from a given starting point.
 * This can be used to determine if a move will trap the snake in a small area.
 * @author: Grigoris Grigoropoulos
 * @param {Array} board - The game board represented as a 2D array.
 * @param {number} row - The starting row for the flood fill.
 * @param {number} col - The starting column for the flood fill.
 * @param {string} newValue - The value to fill the reachable spaces with.
 * @returns {Array} - The modified board after flood fill.
 */
function floodFillBoard(board, row, col, newValue) {
  const numRows = board.length;
  const numCols = board[0].length;

  const originalValue = board[row][col];

  // Helper function to perform flood fill
  function fill(r, c) {
    if (
      r < 0 ||
      r >= numRows ||
      c < 0 ||
      c >= numCols ||
      board[r][c] !== originalValue
    ) {
      return;
    }

    board[r][c] = newValue;

    // Recursively fill neighboring cells
    fill(r - 1, c);
    fill(r + 1, c);
    fill(r, c - 1);
    fill(r, c + 1);
    fill(r - 1, c - 1);
    fill(r - 1, c + 1);
    fill(r + 1, c - 1);
    fill(r + 1, c + 1);
  }

  // Perform flood fill starting from the specified coordinates
  fill(row, col);

  return board;
}


/**
 * Chooses a random move from the list of safe moves
 * @author: Grigoris Grigoropoulos
 * @param {Array} safeMoves - The list of safe moves.
 * @returns {string} - The chosen move.
 */
function randomNextMove(safeMoves) {
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  return nextMove;
}


//
// Step 2 - Prevent your Battlesnake from colliding with itself
//
/**
 * Checks if the new head position is the same as any of the body coordinates
 * @author: Grigoris Grigoropoulos
 * @param {Object} newHeadPos - The future head position.
 * @param {Array} myBody - The list of the current snake's body coordinates.
 * @returns {boolean} - True if there is no collision, false otherwise.
 */
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
// Step 5 - Check head-on collisions with other snakes
//
/**
 *  Checks if there is a snake head collision and if yes if it is acceptable based on the size of the other snake
 * @author: Grigoris Grigoropoulos
 * @param {Object} futureHead - The future head position.
 * @param {Array} snakesBodies - The list of other snakes' bodies.
 * @param {number} myLength - The length of the current snake.
 * @returns {boolean} - True if the collision is acceptable, false otherwise.
 */
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

//
// Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
//
/**
 * Checks if the new head position overlaps with the tail coordinates of another snakes, and if so, to check if there is food in the next move
 * @author: Grigoris Grigoropoulos
 * @param {Object} futureHead - The future head position.
 * @param {Array} snake - The list of the current snake's body coordinates.
 * @param {Array} food - The list of food coordinates.
 * @returns {boolean} - True if there is no collision or the collision is acceptable, false otherwise.
 */
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


/**
 * Checks if the new head position is the same as any of the body coordinates of other snakes
 * @author: Grigoris Grigoropoulos
 * @param {Object} futureHead - The future head position.
 * @param {Array} snakesBodies - The list of all snakes' body coordinates.
 * @param {Array} food - The list of food coordinates.
 * @param {number} myLength - The length of the current snake.
 * @returns {boolean} - True if there is no collision or the collision is acceptable, false otherwise.
 */
function avoidSnakes(futureHead, snakesBodies, food, myLength) {
  snakesBodies.forEach((snake) => {
    snake.body.forEach((coord) => {
      if (futureHead.x === coord.x && futureHead.y === coord.y) {
        console.log('Hits Other snakes');
        // Check if the future head position is the same as the tail of the other snake, and if so, check if there is food in the next move
        if (coord === snake.body[snake.body.length - 1]) {
          return isMoveToAnotherSnakeTailOK(futureHead, snake, food);
        }
        // Check if the future head position is the same as the head of the other snake, and if so, check if it is smaller than our snake
        if (coord === snake.body[0]) {
          return isSnakeHeadCollisionOK(futureHead, snakesBodies, myLength);
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

/**
 * Calculate the manhattan distance between two points on the grid, and return the distance
 * @author: Grigoris Grigoropoulos
 * @param {Object} point1 - Point 1 on the grid.
 * @param {Object} point2 - Point 2 on the grid.
 * @returns {number} - The manhattan distance.
 */
function getManhattanDistance(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

/**
 * Calculate the distances from the head to each food item and return an array of distances
 * @author: Grigoris Grigoropoulos
 * @param {Object} myHead - The current head position.
 * @param {Array} food - The list of food coordinates.
 * @returns {Array} - An array of manhattan distances.
 */
function getFoodDistances(myHead, food) {
  return food.map((foodItem) => {
    return getManhattanDistance(myHead, foodItem);
  });
}

/**
 * Finds the optimal move for eating food by moving towards the closest food item
 * @author: Grigoris Grigoropoulos
 * @param {Object} myHead - The current head position.
 * @param {Array} food - The list of food coordinates.
 * @param {Object} isMoveSafe - The current safe moves for the snake.
 * @returns {Array} - A filtered array of safe moves that lead towards the closest food item.
 */
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

/**
 * Gets an array of smaller snakes based on the provided criteria.
 * @author: Grigoris Grigoropoulos
 * @param {Array<object>} allSnakes - Array of all snakes on the board.
 * @param {number} myLength - Length of the snake being controlled.
 * @returns {Array<object>} - Array of smaller snakes.
 */
function getSmallerSnakes(allSnakes, myLength) {
  return allSnakes.filter(
    (snake) => snake.length < myLength && snake.body.length > 0,
  );
}

/**
 * Finds the closest smaller snake to the provided snake's head.
 * @author: Grigoris Grigoropoulos
 * @param {object} myHead - The current position of the snake's head.
 * @param {Array<object>} smallerSnakes - Array of smaller snakes.
 * @returns {object|null} - The closest smaller snake or null if none found.
 */
function findClosestSmallerSnake(myHead, smallerSnakes) {
  let closestSmallerSnake;
  let closestDistance = 1000000; // Initialize with a large number

  for (const snake of smallerSnakes) {
    const distance = getManhattanDistance( myHead, snake.body[0]);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestSmallerSnake = snake;
    }
    else if (distance === closestDistance) {
      // If the distance is the same, choose the snake with the larger length to remove the stronger opponent from the board
      if (snake.length > closestSmallerSnake.length) {
        closestSmallerSnake = snake;
      }
    }
  }
  return closestSmallerSnake;
}

/**
 * Gets the next move towards a specific snake's head while considering safety.
 * @param {object} myHead - The current position of the snake's head.
 * @param {object} snakeHead - The position of the target snake's head.
 * @param {object} isMoveSafe - An object representing the safety of each move.
 * @returns {string} - The next move ("up", "down", "left", or "right") towards the target snake.
 */
function moveTowardsSnake(myHead, snakeHead, isMoveSafe) {
  const dx = snakeHead.x - myHead.x;
  const dy = snakeHead.y - myHead.y;

  if (dx !== 0 && isMoveSafe[dx > 0 ? "right" : "left"]) {
    return dx > 0 ? "right" : "left";
  } else if (dy !== 0 && isMoveSafe[dy > 0 ? "up" : "down"]) {
    return dy > 0 ? "up" : "down";
  }
  return randomNextMove(isMoveSafe);
}

/**
 * Hunts smaller snakes by determining the next move based on the game state and safety of moves.
 * @author: Grigoris Grigoropoulos
 * @param {object} gameState - The current state of the game.
 * @param {object} myHead - The current position of the snake's head.
 * @param {object} isMoveSafe - An object representing the safety of each move.
 * @returns {string} - The next move ("up", "down", "left", or "right").
 */
function huntSmallerSnakes(gameState, myHead, isMoveSafe) {
  const myLength = gameState.you.length;
  const smallerSnakes = getSmallerSnakes(gameState.board.snakes, myLength);

  let closestSmallerSnake = findClosestSmallerSnake(myHead, smallerSnakes);

  if (closestSmallerSnake) {
    return moveTowardsSnake(myHead, closestSmallerSnake.body[0], isMoveSafe);
  }
  return randomNextMove(isMoveSafe);
}

/**
 * Tries to find the most optimal move. The most optimal move is:
 * 1. Hunt smaller snakes if they are present on the board.
 * 2. Move towards food if there are no smaller snakes.
 * 3. If there are no smaller snakes and no food, move randomly to a safe position.
 * @author: Grigoris Grigoropoulos
 * @param {object} gameState - The current state of the game.
 * @param {object} isMoveSafe - An object representing the safety of each move.
 * @returns {string} - The next move ("up", "down", "left", or "right").
 */
function determineOptimalNextMove(gameState, isMoveSafe) {
  const food = gameState.board.food;
  const myHead = gameState.you.body[0];
  const myLength = gameState.you.length;

  // Check if there is a smaller snake on the board
  const hasSmallerSnake = gameState.board.snakes.some(
    (snake) => snake.id !== gameState.you.id && snake.length < myLength
  );

  if (hasSmallerSnake) {
    // If there is a smaller snake, prioritize hunting it
    const huntMove = huntSmallerSnakes(gameState, myHead, isMoveSafe);
    if (huntMove !== null) {
      return huntMove;
    }
  } else {
    return getOptimalMoveToEat(myHead, food, isMoveSafe);
  }
  return randomNextMove(isMoveSafe);
}



/**
 * move is called on every turn and returns your next move
 * Valid moves are "up", "down", "left", or "right"
 * See https://docs.battlesnake.com/api/example-move for available data
 * @author: Grigoris Grigoropoulos
 * @param {Object} gameState - The current game state as returned from teh remote server.
 * @returns {string} - The recommended move for the snake.
 */
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
  const myLength = gameState.you.length;
  if (isMoveSafe.up) {
    isMoveSafe.up = avoidSnakes({ x: newHead.x, y: newHead.y - 1 }, opponents, food, myLength);
  }
  if (isMoveSafe.down) {
    isMoveSafe.down = avoidSnakes({ x: newHead.x, y: newHead.y + 1 }, opponents, food, myLength);
  }
  if (isMoveSafe.left) {
    isMoveSafe.left = avoidSnakes({ x: newHead.x - 1, y: newHead.y }, opponents, food, myLength);
  }
  if (isMoveSafe.right) {
    isMoveSafe.right = avoidSnakes({ x: newHead.x + 1, y: newHead.y }, opponents, food, myLength);
  }

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    // No safe moves left, so choose a random move (this will likely lead to death)
    return { move: 'down' };
  }

  // Step 4 - Move towards food instead of random, to regain health and survive longer
  // let nextMove = getOptimalMoveToEat(myHead, food, isMoveSafe);

  // Choose a random move from the safe moves
  //---  Removed as the optimal move to eat food is now being used ---
  // const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // Try to find the best possible move based on the current game state and the safety of each move
  let nextMove = determineOptimalNextMove(gameState, isMoveSafe);

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});

export { avoidItself,
  avoidSnakes,
  isSnakeHeadCollisionOK,
  getManhattanDistance,
  getFoodDistances,
  getOptimalMoveToEat,
  getSmallerSnakes,
  findClosestSmallerSnake,
  moveTowardsSnake,
  floodFillBoard };
