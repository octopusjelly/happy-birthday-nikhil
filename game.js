function isInButtonHitbox(left, right, top, bottom) {
  return mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
}

function rotateImage(img, x, y, w, h, theta) {
  applyMatrix();
  imageMode(CENTER);
  translate(x, y);
  rotate(theta);
  image(img, 0, 0, w, h);
  resetMatrix();
}

let introOpacity = 800;
let introFading;
let scissorsMouse = false;
let scissors;
let scissorsLeft;
let scissorsRight;
let nikhil;
let cutNikhil;
let pinkNikhil;
let hair;
let hairSpeed;
let playingIntro;
let playingTitleScreen;
let playingStartingScreen;
let playingGame;
let gameLost;
let gameWon;
let gameReset;

let timerMin, timerSec, timesSubtract, minuteUpdated, timerPaused;

let introMessages = [
  "HAPPY BELATED BIRTHDAY NIKHIL!!\nSo sorry this is a week late!\nThere will be a game for you to play!",
  "In this game, you, Nikhil,\nplay your MOM.\nAs your mom,\nyou lose when Nikhil's hair gets too long.",
  "The game ends when Nikhil's hair\ngrows out of control!",
  "Move the scissors (your mouse) to cut YOUR hair!\nBy the way,\nthis game is less annoying to play on a computer.",
  "To win, you must survive 3 minutes of hair.\nHair grows slowly at first,\nbut grows exponentially faster\nas the game progresses.",
  "The game will start soon...",
];

function timer() {
  let timerMillis = millis() - timesSubtract * 1000 + 1000;

  if (timerMillis > 1000) {
    if (!timerPaused) {
      timerSec--;
      if (timerSec % 5 == 0) hairSpeed *= 1.05;
    }
    timesSubtract++;
  }

  timerSec += 60;
  timerSec %= 60;

  if (timerSec == 59) {
    if (!minuteUpdated) {
      timerMin--;
    }
    minuteUpdated = true;
  } else {
    minuteUpdated = false;
  }

  let secondsDigit = timerSec < 10 ? "0" : "";

  return timerMin < 0 ? "0:00" : timerMin + ":" + secondsDigit + timerSec;
}

let messageIndex = 0;

function drawIntro() {
  textFont("Montserrat");
  textAlign(CENTER);
  textSize(20);

  background(0);
  noStroke();
  fill(255, introOpacity);
  text(introMessages[messageIndex], width * 0.5, height * 0.5 - 75);

  if (messageIndex > 2) scissorsMouse = true;

  if (introOpacity >= 200 && messageIndex > introMessages.length - 2) {
    playingIntro = false;
    playingStartingScreen = true;
  }

  if (introOpacity >= 400) {
    introFading = true;
  }
  if (introFading) {
    introOpacity -= 3.75;
  }
  if (introOpacity <= 0) {
    introOpacity = 0;
    if (messageIndex < introMessages.length - 1) {
      messageIndex++;
    }
    introFading = false;
  }
  if (!introFading) {
    introOpacity += 2.5;
  }

  rectMode(CENTER);
  noStroke();
  if (
    isInButtonHitbox(
      width * 0.5 - 75,
      width * 0.5 + 75,
      height * 0.5 + 25,
      height * 0.5 + 75
    )
  ) {
    cursor(ARROW);
    scissorsMouse = false;
    fill(100);
    rect(width * 0.5, height * 0.5 + 50, 150, 50);
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text("Skip Intro", width * 0.5, height * 0.5 + 55);
  } else {
    fill(50);
    rect(width * 0.5, height * 0.5 + 50, 150, 50);
    fill(150);
    textAlign(CENTER);
    textSize(20);
    text("Skip Intro", width * 0.5, height * 0.5 + 55);
  }
}

let startingScreenButtonHue = 0;

function drawStartingScreen() {
  background(255);
  noStroke();
  for (let i = round(max(width, height) / 50); i > 0; i--) {
    fill(255 * ((i + 1) % 2));
    ellipse(width * 0.5, height * 0.5, i * 50, i * 50);
  }
  imageMode(CENTER);
  image(nikhil, width * 0.5, height - nikhil.height * 0.5);

  let buttonWidth = width / 6 < 150 ? 250 : width / 6;

  if (
    isInButtonHitbox(
      width * 0.5 - buttonWidth * 0.5,
      width * 0.5 + buttonWidth * 0.5,
      height * 0.4 - 25,
      height * 0.4 + 25
    )
  ) {
    cursor(ARROW);
    scissorsMouse = false;
    colorMode(HSB, 360, 100, 100);
    fill(startingScreenButtonHue, 100, 100);
    rect(width * 0.5, height * 0.4, buttonWidth, 50);
    colorMode(RGB, 255);
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text("PLAY GAME!", width * 0.5, height * 0.4 + 5);
  } else {
    scissorsMouse = true;
    colorMode(HSB, 360, 100, 100);
    fill(startingScreenButtonHue, 100, 50);
    rect(width * 0.5, height * 0.4, buttonWidth, 50);
    colorMode(RGB, 255);
    fill(150);
    textAlign(CENTER);
    textSize(20);
    text("PLAY GAME!", width * 0.5, height * 0.4 + 5);
  }

  startingScreenButtonHue += 5;
  startingScreenButtonHue %= 360;
}

function drawGame() {
  timerPaused = false;
  scissorsMouse = true;
  background(255);

  stroke(38, 24, 13, gameWon ? 0 : 255);
  strokeWeight(2);

  for (let i = 0; i < hairs.length; i++) {
    line(hairs[i][0], hairs[i][1], hairs[i][0], hairs[i][2]);
    if (
      (mouseX >= hairs[i][0] && pmouseX < hairs[i][0]) ||
      (mouseX <= hairs[i][0] && pmouseX > hairs[i][0])
    ) {
      let newHairLength =
        ((mouseY - pmouseY) * (hairs[i][0] - pmouseX)) / (mouseX - pmouseX) +
        pmouseY;
      if (!gameLost)
        hairs[i][2] =
          newHairLength > hairs[i][2] && newHairLength < hairsY
            ? newHairLength
            : hairs[i][2];
    }
    imageMode(CENTER);
    if (!gameWon)
      image(cutNikhil, width * 0.5 + 4, height * 0.75, 309, height * 0.5);

    if (hairs[i][2] < height * 0.2 && !gameWon) gameLost = true;

    if (!gameLost && !gameWon) hairs[i][2] -= hairSpeed;
  }

  strokeWeight(2);
  for (let i = 0; i < width; i += 20) {
    stroke(255, 0, 0);
    line(i, height * 0.2, i + 10, height * 0.2);
    stroke(255, 200, 0);
    line(i, height * 0.5, i + 10, height * 0.5);
  }
  noStroke();
  textAlign(LEFT);
  textSize(20);
  fill(255, 0, 0);
  text("hair cannot exceed this line", 5, height * 0.2 - 5);
  fill(255, 200, 0);
  text("cut above this line", 5, height * 0.5);

  // timer

  if (timerMin == 0 && timerSec == 0) gameWon = true;

  if (gameLost) {
    scissorsMouse = false;
    cursor(ARROW);
    background(255, 0, 0, 150);
    timerPaused = true;
    textAlign(CENTER);
    textSize(50);
    fill(255, 0, 0);
    stroke(0);
    text("GAME OVER!!\nWHAT AN L\nSO UNLUCKY!!", width * 0.5, height * 0.25);
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(20);
    if (
      isInButtonHitbox(
        width * 0.5 - 100,
        width * 0.5 + 100,
        height * 0.75 - 50,
        height * 0.75 + 50
      )
    ) {
      fill(255);
    } else {
      fill(200);
    }

    rect(width * 0.5, height * 0.75, 200, 100);
    fill(0);
    text("Play Again", width * 0.5, height * 0.75 + 5);
  }

  if (gameWon && !gameReset) {
    background(255, 255, 0, 100);

    image(nikhilPink, width * 0.5, height * 0.75);

    fill(0, 50);
    rectMode(CENTER);
    rect(width * 0.5, height * 0.75 - 35, width, 100);
    fill(255);
    textAlign(CENTER);
    textSize(100);
    text("YOU WIN!!", width * 0.5, height * 0.75);

    if (
      isInButtonHitbox(
        width * 0.5 - 100,
        width * 0.5 + 100,
        height * 0.9 - 50,
        height * 0.9 + 50
      )
    ) {
      scissorsMouse = false;
      cursor(ARROW);
      colorMode(HSB, 360, 100, 100);
      fill((millis() * 5) % 360, 100, 100);
      rect(width * 0.5, height * 0.9, 200, 50);
      fill(255);
      textAlign(CENTER);
      textSize(25);
      text("PLAY AGAIN!", width * 0.5, height * 0.9 + 5);
      colorMode(RGB, 255);
    } else {
      scissorsMouse = true;
      colorMode(HSB, 360, 100, 100);
      fill((millis() * 5) % 360, 100, 50);
      rect(width * 0.5, height * 0.9, 200, 50);
      fill(((millis() * 5) % 360) + 180, 100, 50);
      textAlign(CENTER);
      textSize(25);
      text("PLAY AGAIN!", width * 0.5, height * 0.9 + 5);
      colorMode(RGB, 255);
    }
  }

  if (gameReset) {
    for (let i = 0; i < hairs.length; i++) {
      hairs[i][2] = hairsY;
    }
    hairSpeed = 1;
    timerMin = 3;
    timerSec = 0;
    timerPaused = false;
    gameLost = false;
    gameWon = false;
    gameReset = false;
  }
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);

  hairsWidth = 215;
  hairsY = height * 0.5;
  hairSpeed = 1;

  hairs = [];
  for (
    let i = 0.5 * (width - hairsWidth);
    i < 0.5 * (width + hairsWidth);
    i++
  ) {
    hairs.push([i, hairsY, hairsY]);
  }
  playingIntro = true;
  playingStartingScreen = false;
  playingGame = false;
  gameLost = false;
  gameWon = false;
  gameReset = false;

  scissors = loadImage("scissors.png");
  scissorsLeft = loadImage("scissorsLeft.png");
  scissorsRight = loadImage("scissorsRight.png");
  nikhil = loadImage("nikhil.png");
  cutNikhil = loadImage("cutNikhil.png");
  nikhilPink = loadImage("nikhilPink.png");

  timerMin = 3;
  timerSec = 0;
  timesSubtract = 1;
  timerPaused = false;
  minuteUpdated = false;
}

function mouseClicked() {
  if (
    playingIntro &&
    isInButtonHitbox(
      width * 0.5 - 75,
      width * 0.5 + 75,
      height * 0.5 + 25,
      height * 0.5 + 75
    )
  ) {
    playingIntro = false;
    playingStartingScreen = true;
  }

  let buttonWidth = width / 6 < 150 ? 250 : width / 6;
  if (
    playingStartingScreen &&
    isInButtonHitbox(
      width * 0.5 - buttonWidth * 0.5,
      width * 0.5 + buttonWidth * 0.5,
      height * 0.4 - 25,
      height * 0.4 + 25
    )
  ) {
    playingStartingScreen = false;
    playingGame = true;
  }

  if (
    gameLost &&
    isInButtonHitbox(
      width * 0.5 - 100,
      width * 0.5 + 100,
      height * 0.75 - 50,
      height * 0.75 + 50
    )
  ) {
    gameReset = true;
  }

  if (
    gameWon &&
    isInButtonHitbox(
      width * 0.5 - 100,
      width * 0.5 + 100,
      height * 0.9 - 50,
      height * 0.9 + 50
    )
  ) {
    gameReset = true;
  }
}

function draw() {
  if (playingGame) {
    drawGame();
  } else {
    timerPaused = true;
  }

  if (playingStartingScreen) {
    drawStartingScreen();
  }

  if (playingIntro) {
    drawIntro();
  }

  if (scissorsMouse) {
    noCursor();
    if (pmouseX < mouseX) {
      scissors = scissorsRight;
    }
    if (pmouseX > mouseX) {
      scissors = scissorsLeft;
    }
    imageMode(CENTER);
    image(scissors, mouseX, mouseY, 25, 25);
  }

  fill(0, playingGame ? 255 : 0);
  textAlign(CENTER);
  textSize(30);
  text(timer(), width * 0.5, height * 0.1);

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
}
