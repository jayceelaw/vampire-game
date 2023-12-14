"use strict"

/**
 * class to run the game
 * handles everything during the game + draws every frame
 */
class Game {
  /**
   * @property {number} fps - frames per second
   * @property {number} timeInterval - time in milliseconds between every frame
   * @property {object} player - character controlled by user (starting at 0,0)
   */
  static fps = 30;
  static timeInterval = 1000 / Game.fps;
  static player;

  /**
   * creates/initiates classes/generates enemies, objects, powerups + starts the game with starting screen
   * @property {object} controller - handles controls during game
   * @property {object} camera - handles camera movement based on player
   * @property {object} anrm - handles anrm bullets/shots
   * @property {object} gamemap - handles everything other than player in game
   * @property {object} start, pause, gameover, win - menu screens
   */
  constructor() {
    Game.player = new Player(0, 0);
    this.controller = new Controller();
    this.camera = new Camera();
    this.anrm = new ANRM();
    this.gamemap = new GameMap();
    this.start = new Start();
    this.pause = new Pause();
    this.gameover = new End();
    this.win = new Win();

    /**
     * displays start screen until start button is clicked
     * sets Controller.click to false after button is clicked to prevent shooting when game first starts
     * stops running start screen and starts running game when button is pressed
     */
    this.startInterval = setInterval(() => {
      this.drawMenuScreen(this.start);

      if (this.start.startButton.clicked()) {
        Controller.click = false;
        clearInterval(this.startInterval); // from stack overflow
        this.runGame();
      }
    }, Game.timeInterval);

    Rock.generate();
    Enemy.generate();
    PowerUp.generate();
  }

  /**
   * draws everything in game on every frame
   * displays pause screen if pause button is pressed
   * displays win/gameover screen based on player HP and remaining enemies
   * checks if ANRM is shot + player collides with any power ups
   */
  runGame() {
    this.gameInterval = setInterval(() => {
      this.draw();

      if (GameMap.pauseButton.clicked()) {
        this.displayScreen(this.pause, true);
      }

      this.anrm.shoot();
      PowerUp.checkActivated();

      if (Game.player.isDead()) {
        this.displayScreen(this.gameover);
      }
      if (GameMap.enemies.length === 0) {
        this.displayScreen(this.win);
      }
    }, Game.timeInterval);
  }

  /**
   * stops running game to display menu screen with their buttons
   * resets game and runs again if restart button is pressed 
   * runs game without resetting anything if continue button is pressed
   * @param {object} screen - the menu screen to display
   * @param {boolean} checkContinue (default false) - check if continue button is pressed (only for pause screen)
   */
  displayScreen(screen, checkContinue = false) {
    Controller.click = false;
    clearInterval(this.gameInterval);
    this.camera.reset();

    this.screenInterval = setInterval(() => {
      this.drawMenuScreen(screen);
      if (screen.restartButton.clicked()) {
        clearInterval(this.screenInterval);
        this.restart();
        this.runGame();
      }
      if (checkContinue === true && screen.continueButton.clicked()) {
        clearInterval(this.screenInterval);
        this.runGame();
      }
    }, Game.timeInterval);
  }


  /**
   * draws game background in the center and draws menu screen (makes sure camera is centered on menu screen)
   * @param {object} screen - the menu screen to display
   */
  drawMenuScreen(screen) {
    Canvas.context.drawImage(GameMap.background, (Canvas.width - GameMap.background.width) / 2, (Canvas.height - GameMap.background.height) / 2);
    screen.draw();
  }

  /**
   * clears previous frame and redraws everything in the game 
   * updates player and camera position
   */
  draw() {
    Canvas.context.setTransform(1, 0, 0, 1, 0, 0); // from stack overflow
    this.clear();
    Game.player.update();
    this.camera.update();
    GameMap.draw();
    Game.player.draw();
    GameMap.drawHUD();
  }

  /**
   * clears canvas
   */
  clear() {
    Canvas.context.clearRect(0, 0, Canvas.width, Canvas.height);
  }

  /**
   * generates a random number between min and max (inclusive)
   * @param {number} min - minimum number
   * @param {number} max - maximum number
   * @return {number} random number generated
   */
  static randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // from stack overflow
  }

  /**
   * generates random coordinates for object given + updates object's coordinates
   * keeps generating random coordinates until it doesn't collide with any existing objects (only objects) to prevent collisions 
   * @param {object} obj - object to generate coordinates for
   */
  static randomCoord(obj) {
    obj.x = Math.floor(Math.random() * (GameMap.rightBorder - obj.width - GameMap.leftBorder)) + GameMap.leftBorder;
    obj.y = Math.floor(Math.random() * (GameMap.bottomBorder - obj.height - GameMap.topBorder)) + GameMap.topBorder;

    if (Physics.hasCollided(obj, Game.player)) {
      this.randomCoord(obj);
    }
    for (let rock of GameMap.objects) {
      if (Physics.hasCollided(rock, obj) && rock !== obj) {
        this.randomCoord(obj);
        return;
      }
    }
  }

  /**
   * resets everything in game to play again/restart
   * resets any statistics and regenerates enemies/objects/power ups
   */
  restart() {
    this.camera.reset();
    GameMap.enemies = [];
    GameMap.objects = [];
    PowerUp.powerups = [];
    PowerUp.reset();
    ANRM.shots = [];
    Enemy.generate();
    PowerUp.generate();
    Rock.generate();
    Game.player.x = 0;
    Game.player.y = 0;
    Player.vampiresSaved = 0;
    Game.player.HP = Game.player.maxHP;
  }
}