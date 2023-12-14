"use strict"

/**
 * class to draw everything in game other than player
 */
class GameMap {
  /**
   * @property {array} objects - stores all objects in game
   * @property {array} enemies - stores all enemies in game
   * @property {object} background - image for the game's background
   */
  static objects = [];
  static enemies = [];
  static background = new Image();

  /**
   * @property {number} leftBorder, rightBorder, topBorder, bottomBorder - borders that game takes place within (not size of background)
   */
  static #leftBorder = -2430;
  static #rightBorder = 1850;
  static #topBorder = -1210;
  static #bottomBorder = 1000;

  /**
   * @property {object} pauseButton - button to pause game during game
   */
  constructor() {
    GameMap.background.src = './/images//background.png';
    GameMap.pauseButton = new Button(Camera.x + Canvas.width - Canvas.width * 0.04 - 10, Camera.y + 10, Canvas.width * 0.04, Canvas.width * 0.04, "𓊕");
  }

  /**
   * gets coordinates of borders around game
   * @return {number} coordinate of border
   */
  static get leftBorder() {
    return GameMap.#leftBorder;
  }
  static get rightBorder() {
    return GameMap.#rightBorder;
  }
  static get topBorder() {
    return GameMap.#topBorder;
  }
  static get bottomBorder() {
    return GameMap.#bottomBorder;
  }

  /**
   * updates position of enemies and ANRM shots (removes any shots that hit border or an object)
   * draws background with all objects, enemies, power ups, and ANRM shots in game (if in camera)
   */
  static draw() {
    Canvas.context.drawImage(GameMap.background, -(Canvas.width + GameMap.background.width) / 2, -(Canvas.height + GameMap.background.height) / 2);

    for (let object of GameMap.objects) {
      if (GameMap.withinCamera(object)) {
        object.draw();
      }
    }

    for (let enemy of GameMap.enemies) {
      enemy.update();
      if (GameMap.withinCamera(enemy)) {
        enemy.draw();
      }
    }

    for (let powerup of PowerUp.powerups) {
      if (GameMap.withinCamera(powerup)) {
        powerup.draw();
      }
    }

    for (let i = 0; i < ANRM.shots.length; i++) {
      if (GameMap.withinCamera(ANRM.shots[i])) {
        ANRM.shots[i].draw();
      }
      ANRM.shots[i].update();
      if (Physics.hasHitBorder(ANRM.shots[i]) ||
        GameMap.objects.some(obj => Physics.hasCollided(ANRM.shots[i], obj))) { // from stack overflow
        ANRM.shots.splice(i, 1);
      }
    }
  }

  /**
   * determines if object given is within 20 pixels of camera
   * @param {object} obj - object to check if within camera
   * @return {boolean} if object is within 20 pizels of camera
   */
  static withinCamera(obj) {
    const border = 20;
    if (obj.x + obj.width + border >= Camera.x &&
      obj.x - border <= Camera.x + Canvas.width &&
      obj.y + obj.height + border >= Camera.y &&
      obj.y - border <= Camera.y + Canvas.height) {
      return true;
    }
    return false;
  }

  /**
   * draws in-game HUD (pause button + vampires saved/remaining)
   */
  static drawHUD() {
    const fontSize = Canvas.height * 0.03;
    Menu.createText(`VAMPIRES SAVED: ${Player.vampiresSaved}`, Camera.x + Canvas.width - 20 - this.pauseButton.width, Camera.y + 10 + fontSize, fontSize, "right");
    Menu.createText(`VAMPIRES REMAINING: ${GameMap.enemies.length}`, Camera.x + Canvas.width - 20 - this.pauseButton.width, Camera.y + 10 + fontSize * 2, fontSize, "right");

    this.pauseButton.x = Camera.x + Canvas.width - this.pauseButton.width - 10;
    this.pauseButton.y = Camera.y + 10;
    this.pauseButton.draw();
  }
}
