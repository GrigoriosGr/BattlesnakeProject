Changelog

All notable changes to this project will be documented in this file.
The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

[1.0.1] - 2026-08-20
Added

    The function that checks for collisions with other snakes has been updated to check
     for collisions with the tail and if there is no food next to the snake's head
     it will not block the move.
    Run the codebase through prettier and eslint to fix formatting and linting issues.
    Added jest VS Code plugin
    Added a function to flood fill the board
    Added Jest test cases for the collision detection functions, the food distance function,
     the Manhattan distance function and the optimal move function.

Changed

    Selected a unique battlesnake username and commited it as a hotfix with tag 'R1.0.1' to the main branch.

Removed

    Nothing.

Fixed

    Nothing.

[1.0.0] - 2026-08-19
Added

    Feature to avoid collison with walls.
    Feature to avoid collison with itself.
    Feature to avoid collison with other snakes.
    Feature to move towards food instead of random, to regain health and survive longer.
    Added a function to check for head-on collisions with other snakes.
    Added the VSCode workspace file to the project.
    Added prettier VSCode extension to format code and configures default javascript formatting.
    Added eslint via VSCode extension to check for code quality and configures default javascript linting.
    Run the codebase through prettier and eslint to fix formatting and linting issues.

Changed

    Nothing.

Removed

    Nothing.

Fixed

    Nothing.
