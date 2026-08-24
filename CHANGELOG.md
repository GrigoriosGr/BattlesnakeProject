Changelog

All notable changes to this project will be documented in this file.
The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

[1.X.X] - 2026-08-22
Added

    Added jsdoc comments to all functions in index.js file.
    Generated the jsdoc documentation for the index.js file and saved it in the docs folder.
    Added support to hunt smaller snakes
    Modifed the determineOptimalNextMove function to prioritize hunting smaller snakes over food when they are nearby and safe to attack.
    Updated test cases to include scenarios for hunting smaller snakes and verifying the new behavior of the determineOptimalNextMove function.
    Updated the JSdoc comments to reflect the new behavior of the determineOptimalNextMove function and the added functions for hunting smaller snakes.
    Added Github Actions for a node.js workflow to run tests on push and pull requests.
    Added Github Actions for linting and formatting checks on push and pull requests.
    Added Github Actions for checking code coverage on push and pull requests.
    Enabled dependabot to automatically check for dependency updates and create pull requests for them.
    Updated JSDOC documentation

Changed

    Nothing.

Removed

    Nothing.

Fixed

    Nothing.


[1.1.0] - 2026-08-21
Added

    Nothing.

Changed

    Made the hotfix release and all new features an official minor release, tagged '1.1.0' on the main branch.

Removed

    Nothing.

Fixed

    Nothing.

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

    Selected a unique battlesnake username and committed it as a hotfix with tag 'R1.0.1' to the main branch.

Removed

    Nothing.

Fixed

    Nothing.

[1.0.0] - 2026-08-19
Added

    Feature to avoid collision with walls.
    Feature to avoid collision with itself.
    Feature to avoid collision with other snakes.
    Feature to move towards food instead of randomly, to regain health and survive longer.
    Added a function to check for head-on collisions with other snakes.
    Added the VSCode workspace file to the project.
    Added prettier VSCode extension to format code and configure default javascript formatting.
    Added eslint via VSCode extension to check for code quality and configures default javascript linting.
    Run the codebase through prettier and eslint to fix formatting and linting issues.

Changed

    Nothing.

Removed

    Nothing.

Fixed

    Nothing.
