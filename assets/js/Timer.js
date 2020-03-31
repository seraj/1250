var clsStopwatch = function() {
  var startAt = 0; // Time of last start / resume. (0 if not running)
  var lapTime = 0; // Time on the clock when last stopped in milliseconds

  var now = function() {
    return new Date().getTime();
  };

  // Public methods
  // Start or resume
  this.start = function() {
    startAt = startAt ? startAt : now();
  };

  // Stop or pause
  this.stop = function() {
    // If running, update elapsed time otherwise keep it
    lapTime = startAt ? lapTime + now() - startAt : lapTime;
    startAt = 0; // Paused
  };

  // Reset
  this.reset = function() {
    lapTime = startAt = 0;
  };

  // Duration
  this.time = function() {
    return lapTime + (startAt ? now() - startAt : 0);
  };
};

var x = new clsStopwatch();
var clocktimer;

function pad(num, size) {
  var s = "0000" + num;
  return s.substr(s.length - size);
}

function formatTime(time) {
  var s = (ms = 0);
  var newTime = "";

  s = Math.floor(time / 1000);
  ms = time % 1000;

  newTime = s + "." + pad(ms, 3);
  return newTime;
}

function show() {
  update();
}

function update() {
  $(".current-score").html(formatTime(x.time()));
}

function scoreStart() {
  clocktimer = setInterval("update()", 1);
  x.start();
}

function scoreStop() {
  x.stop();
  clearInterval(clocktimer);
}

function scoreReset() {
  scoreStop();
  x.reset();
  update();
}
