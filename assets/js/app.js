const num1to26 = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25
];
const num26to50 = [
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50
];
let cloneNum26to50 = [...num26to50];
let current_num = 1;
let best_score = Number.MAX_SAFE_INTEGER;
let is_playing = false;

// Game Start Menu
const gameMenu = {
  start: function() {
    // var button =
    //   '<button class="start" onclick="startGame()">' +
    //   "Click to Start" +
    //   "</button>";
    // $(".app-container").html(button);
    createNewBoard();
  }
};
const gameMen3dsdu = {
  start: function() {
    // var button =
    //   '<button class="start" onclick="startGame()">' +
    //   "Click to Start" +
    //   "</button>";
    // $(".app-container").html(button);
    createNewBoard();
  }
};

// Game Over Menu
const showResult = {
  start: function() {
    var output =
      '<div class="final-result">Your Time is<br />' +
      "<strong>" +
      $(".current-score").text() +
      "</strong><br /></div>" +
      '<button id="restart-button" onclick="restartGame()">' +
      "Restart" +
      "</button>";
    $(".app-container").html(output);
  }
};

// Function for shuffling number tiles.
const shuffleNumbers = a => {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
};
// show new Game button
const showNewGameButton = () => {
  $(".restart-button").fadeIn();
};
// hide new Game button
const hideNewGameButton = () => {
  $(".restart-button").fadeOut();
};
// Function for creating game borad.
const createNewBoard = () => {
  shuffleNumbers(num1to26);
  var output = "";
  // var score = setInterval(10);
  for (var i = 0; i < 25; i++) {
    output +=
      '<div class="single-tile" onclick="clickTile(this)">' +
      num1to26[i] +
      "</div>";
  }
  $(".app-container").addClass("game-started");
  $(".app-container").html(output);
};

// Function that handles tile clicking events.
const clickTile = tile => {
  if (tile.innerHTML == current_num) {
    scoreStart();
    if (current_num <= 25) {
      const item =
        cloneNum26to50[Math.floor(Math.random() * cloneNum26to50.length)];
      const index = cloneNum26to50.indexOf(item);
      if (index > -1) {
        cloneNum26to50.splice(index, 1);
      }
      $(tile).fadeOut(5, function() {
        $(tile)
          .text(item)
          .fadeIn(5)
          .addClass("darker");
        current_num++;
      });
    } else {
      $(tile).fadeOut(5, function() {
        $(tile)
          .text("00")
          .fadeIn(5)
          .addClass("invisible");
        current_num++;
      });
      if (current_num == 50) {
        // load game over screen and reset all variables.
        endGame();
        $(".app-container").removeClass("game-started");
      }
    }
  } else {
    // add a possible penalty for clicking a wrong tile.
  }
};

// Reseting game.
const gameReset = () => {
  cloneNum26to50 = [...num26to50];
  current_num = 1;
  is_playing = false;
  // $(".app-container").removeClass("game-started");
};

// // starting game.
// const startGame = () => {
//   scoreReset();
//   is_playing = true;
//   var counter = 3;
//   var output = '<div id="timer">' + counter + "</div>";
//   $(".app-container").html(output);
//   var timer = setInterval(function() {
//     if (is_playing) {
//       counter--;
//       if (counter <= 0) {
//         createNewBoard();

//         // showNewGameButton();
//         clearInterval(timer);
//       } else {
//         $("#timer").html(counter);
//       }
//     } else {
//       // if a player clicks new game button during countdown,
//       // countdown timer has to be reset.
//       clearInterval(timer);
//       counter = 3;
//       // hideNewGameButton();
//       return;
//     }
//   }, 1000);
// };

// new game, goes back to game menu screen.
const newGame = () => {
  is_playing = false;
  scoreStop();
  scoreReset();
  gameReset();
  gameMenu.start();
  // hideNewGameButton();
};

// re-starting game.
const restartGame = () => {
  scoreStop();
  scoreReset();
  gameReset();
  createNewBoard();
};

// end game.
const endGame = () => {
  scoreStop();
  showResult.start();
  updateBestScroe();
  gameReset();
};

// function for updating best time.
const updateBestScroe = () => {
  if (parseFloat($(".current-score").text()) < best_score) {
    best_score = parseFloat($(".current-score").text());
    $(".best-score").html($(".current-score").text());
  }
};

gameMenu.start();
