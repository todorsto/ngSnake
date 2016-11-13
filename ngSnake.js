angular.module("snakeApp", [])

    .constant("board", {
        "size": 20
    })

    .constant("colors", {
        game_over: '#820303',
        fruit: '#f4511e',
        snake_head: '#0DFF00',
        snake_body: '#0DFF00',
        board: '#696969'
    })

    .constant("directions", {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    })

    .controller("snakeController", [
        "$scope",
        "$timeout",
        "$window",
        "board",
        "colors",
        "directions",
        function snakeController($scope, $timeout, $window, board, colors, directions) {

            var snake = {
                direction: directions.left,
                parts: [{
                    x: -1,
                    y: -1
                }]
            };

            var fruit = {
                x: -1,
                y: -1
            };

            var interval, tempDirection, isGameOver;
            $scope.board = [];
            $scope.score = 0;

            function setupBoard() {
                for (var i = 0; i < board.size; i++) {
                    $scope.board[i] = [];
                    for (var j = 0; j < board.size; j++) {
                        $scope.board[i][j] = false;
                    }
                }
            }

            setupBoard();

            $scope.setStyling = function (col, row) {
                if (isGameOver) {
                    return colors.game_over;
                } else if (fruit.x == row && fruit.y == col) {
                    return colors.fruit;
                } else if (snake.parts[0].x == row && snake.parts[0].y == col) {
                    return colors.snake_head;
                } else if ($scope.board[col][row] === true) {
                    return colors.snake_body;
                }
                return colors.board;
            };

            function update() {
                var newHead = getNewHead();

                if (boardCollision(newHead) || selfCollision(newHead)) {
                    return gameOver();
                } else if (fruitCollision(newHead)) {
                    eatFruit();
                }

                // Remove tail
                var oldTail = snake.parts.pop();
                $scope.board[oldTail.y][oldTail.x] = false;

                // Pop tail to head
                snake.parts.unshift(newHead);
                $scope.board[newHead.y][newHead.x] = true;

                // Do it again
                snake.direction = tempDirection;
                $timeout(update, interval);
            }

            function getNewHead() {
                var newHead = angular.copy(snake.parts[0]);

                // Update Location
                if (tempDirection === directions.left) {
                    newHead.x -= 1;
                } else if (tempDirection === directions.right) {
                    newHead.x += 1;
                } else if (tempDirection === directions.up) {
                    newHead.y -= 1;
                } else if (tempDirection === directions.down) {
                    newHead.y += 1;
                }
                return newHead;
            }

            function boardCollision(part) {
                return part.x === board.size || part.x === -1 || part.y === board.size || part.y === -1;
            }

            function selfCollision(part) {
                return $scope.board[part.y][part.x] === true;
            }

            function fruitCollision(part) {
                return part.x === fruit.x && part.y === fruit.y;
            }

            function resetFruit() {
                var x = Math.floor(Math.random() * board.size);
                var y = Math.floor(Math.random() * board.size);

                if ($scope.board[y][x] === true) {
                    return resetFruit();
                }
                fruit = {x: x, y: y};
            }

            function eatFruit() {
                $scope.score++;

                // Grow by 1
                var tail = angular.copy(snake.parts[snake.parts.length - 1]);
                snake.parts.push(tail);
                resetFruit();

                if ($scope.score % 5 === 0) {
                    interval -= 15;
                }
            }

            function gameOver() {
                isGameOver = true;

                $timeout(function () {
                    isGameOver = false;
                }, 500);

                setupBoard();
            }

            $window.addEventListener("keyup", function (e) {
                if (e.keyCode == directions.left && snake.direction !== directions.right) {
                    tempDirection = directions.left;
                } else if (e.keyCode == directions.up && snake.direction !== directions.down) {
                    tempDirection = directions.up;
                } else if (e.keyCode == directions.right && snake.direction !== directions.left) {
                    tempDirection = directions.right;
                } else if (e.keyCode == directions.down && snake.direction !== directions.up) {
                    tempDirection = directions.down;
                }
            });

            $scope.startGame = function () {
                $scope.score = 0;
                snake = {direction: directions.left, parts: []};
                tempDirection = directions.left;
                isGameOver = false;
                interval = 150;

                // Set up initial snake
                for (var i = 0; i < 5; i++) {
                    snake.parts.push({x: 10 + i, y: 10});
                }
                resetFruit();
                update();
            };

        }
    ]) 