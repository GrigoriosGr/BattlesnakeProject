import { avoidItself,
  avoidSnakes,
  isSnakeHeadCollisionOK,
  getManhattanDistance,
  getFoodDistances,
  getOptimalMoveToEat,
  getSmallerSnakes,
  findClosestSmallerSnake,
  moveTowardsSnake,
  floodFillBoard } from "./index";

describe("avoidItself", () => {
  it("should return true if the move does not collide with itself", () => {

    // Test case 1
    // The snake's body is in a straight line and the move is "up"
    const snake1 = {
      body: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
    };
    let newHead = { x: 1, y: 0 };
    expect(avoidItself(newHead, snake1.body)).toBe(true);

    // Test case 2
    // The snake's body is in a straight line and the move is "left"
    newHead = { x: 0, y: 1 };
    expect(avoidItself(newHead, snake1.body)).toBe(true);

    // Test case 3
    // The snake's body wraps and the move is "up" which is OK
    //   <-
    //  ---
    const snake2 = {
      body: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }],
    };
    // The snake's body is in a U shape and the move is "up" which is OK
    newHead = { x: 1, y: 0 };
    expect(avoidItself(newHead, snake2.body)).toBe(true);

    // Test case 4
    // The snake's body wraps and the move is "down" which is NOT OK
    newHead = { x: 1, y: 2 };
    expect(avoidItself(newHead, snake2.body)).toBe(false);
  });
});

describe("avoidSnakes", () => {
  it("should return true if the move does not collide with other snakes", () => {
    const snakes = [
      {
        body: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
      },
      {
        body: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
      },
    ];
    const food = [{ x: 0, y: 0 }, { x: 2, y: 5 }];

    // Test case 1
    // New Head does not collide with any snake's body
    let newHead = { x: 1, y: 0 };
    expect(avoidSnakes(newHead, snakes, food, 5)).toBe(true);

    // Test case 2
    // New Head collides with the first snake's body
    newHead = { x: 1, y: 2 };
    expect(avoidSnakes(newHead, snakes, food, 5)).toBe(false);

    // Test case 3
    // New Head collides with the first snake's tail which is allowed
    newHead = { x: 1, y: 3 };
    expect(avoidSnakes(newHead, snakes, food, 5)).toBe(true);

    // Test case 4
    // New Head collides with the second snake's tail which is NOT allowed as there is food nearby
    newHead = { x: 2, y: 4 };
    expect(avoidSnakes(newHead, snakes, food, 5)).toBe(false);

    // Test case 5
    // New Head collides with the first snake's head which is allowed as it is smaller
    newHead = { x: 1, y: 1 };
    expect(avoidSnakes(newHead, snakes, food, 5)).toBe(true);

    // Test case 6
    // New Head collides with the first snake's head which is NOT allowed as it is larger
    newHead = { x: 1, y: 1 };
    expect(avoidSnakes(newHead, snakes, food, 2)).toBe(false);
  });
});

describe("testHeadCollision", () => {
  it("should return true if the move does not collide with other larger snakes heads", () => {
    const snakes = [
      {
        body: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }],
      },
      {
        body: [{ x: 2, y: 2 }, { x: 2, y: 3 }],
      },
    ];

    // Test case 1
    // New Head does not collide with any snake's head
    let newHead = { x: 1, y: 0 };
    let myLength = 3; // My snake's length is 3
    expect(testHeadCollision(newHead, snakes, myLength)).toBe(true);

    // Test case 2
    // New Head collides with the first snake's head which is larger than my snake's length
    newHead = { x: 1, y: 1 };
    expect(testHeadCollision(newHead, snakes, myLength)).toBe(false);

    // Test case 3
    // New Head collides with the second snake's tail which is allowed as it is smaller than my snake's length
    newHead = { x: 2, y: 2 };
    expect(testHeadCollision(newHead, snakes, myLength)).toBe(true);

  });
});

describe("getManhattanDistance", () => {
  it("should return the correct Manhattan distance between two points", () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 3, y: 4 };
    expect(getManhattanDistance(point1, point2)).toBe(7);
  });
});

describe("getFoodDistances", () => {
  it("should return the correct distances to all food items", () => {
    const myHead = { x: 0, y: 0 };
    const food = [{ x: 3, y: 4 }, { x: 1, y: 1 }];
    expect(getFoodDistances(myHead, food)).toEqual([7, 2]);
  });
});

describe("getOptimalMoveToEat", () => {
  it("should return the correct optimal move to eat food", () => {
    const myHead = { x: 0, y: 0 };
    const food = [{ x: 3, y: 4 }, { x: 1, y: 0 }];
    const isMoveSafe = {
      up: true,
      down: true,
      left: true,
      right: true
    };
    // Test case 1: The closest food is to the right
    expect(getOptimalMoveToEat(myHead, food, isMoveSafe)).toBe("right");

    // Test case 2: The closest food is above
    const myHead1 = { x: 3, y: 6 };
    expect(getOptimalMoveToEat(myHead1, food, isMoveSafe)).toBe("up");

  });
});


describe("getSmallerSnakes", () => {
  it("should return the smaller snakes than our snake", () => {
    const snakes = [
      {
        body: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }],
      },
      {
        body: [{ x: 2, y: 2 }, { x: 2, y: 3 }],
      },
      {
        body: [{ x: 4, y: 2 }, { x: 4, y: 3 }, { x: 3, y: 3 }],
      },
    ];
    // Test case 1: There is only one smaller snake than our snake with length 3
    let smallerSnakesNum = getSmallerSnakes(snakes, 4).length;
    expect(smallerSnakesNum).toBe(1);

    // Test case 2: There are two smaller snakes than our snake with length 5
    smallerSnakesNum = getSmallerSnakes(snakes, 5).length;
    expect(smallerSnakesNum).toBe(2);

    // Test case 3: There are no smaller snakes than our snake with length 2
    smallerSnakesNum = getSmallerSnakes(snakes, 2).length;
    expect(smallerSnakesNum).toBe(0);

    // Test case 4: There are 3 smaller snakes than our snake with length 5
    smallerSnakesNum = getSmallerSnakes(snakes, 5).length;
    expect(smallerSnakesNum).toBe(3);

  });
});


describe("findClosestSmallerSnake", () => {
  it("should return the closest smaller snake than our snake", () => {
    const snakes = [
      {
        body: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }],
      },
      {
        body: [{ x: 2, y: 2 }, { x: 2, y: 3 }],
      },
      {
        body: [{ x: 4, y: 2 }, { x: 4, y: 3 }, { x: 3, y: 3 }],
      },
    ];
    // Test case 1: The closest smaller snake is the first
    let myHead = { x: 0, y: 0 };
    let smallerSnakes = findClosestSmallerSnake(myHead, snakes);
    expect(smallerSnakes).toBe(snakes[0]);

    // Test case 2: The closest smaller snake is the last
    myHead = { x: 4, y: 3 };
    smallerSnakes = findClosestSmallerSnake(myHead, snakes);
    expect(smallerSnakes).toBe(snakes[2]);

    // Test case 3: Our snake has the same distance with both the second and the third
    // so choose the one with the larger length which is the third
    myHead = { x: 3, y: 2 };
    smallerSnakes = findClosestSmallerSnake(myHead, snakes);
    expect(smallerSnakes).toBe(snakes[2]);
  });
});

describe("moveTowardsSnake", () => {
  it("should return the correct move towards a specific snake", () => {
    const myHead = { x: 0, y: 0 };
    const snakeHead = { x: 3, y: 4 };
    const isMoveSafe = {
      up: true,
      down: true,
      left: true,
      right: false
    };
    expect(moveTowardsSnake(myHead, snakeHead, isMoveSafe)).toBe("down");
  });
});
