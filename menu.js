"use strict"

/**
 * abstract class for menu screens in the game
 */
class Menu {
  /**
   * default sizes of text/buttons
   * @property {number} titleFontSize - font size of menu screen's title
   * @property {number} textFontSize - font size of menu screen's text
   * @property {number} buttonWidth, buttonHeight - size of buttons on menu screen
   */
  #titleFontSize = Canvas.height * 0.1;
  #textFontSize = Canvas.height * 0.05;
  #buttonWidth = Canvas.width * 0.3;
  #buttonHeight = Canvas.height * 0.2;

  /**
   * create a menu screen
   * @property {number} width, height - size of menu screen
   * @property {number} x, y - coordinate of menu screen relative to canvas
   * @property {string} title - title of menu screen
   * @property {object} restartButton - default button on menu screen
   */
  constructor() {
    this.width = Canvas.width * 0.6;
    this.height = Canvas.height * 0.75;
    this.x = (Canvas.width - this.width) / 2;
    this.y = (Canvas.height - this.height) / 2;
    this.title = "";

    this.restartButton = new Button((Canvas.width - this.buttonWidth) / 2, Canvas.height * 0.55, this.buttonWidth, this.buttonHeight, "RESTART");

    if (new.target === Menu) {
      throw new Error("abstract class");
    }
  }

  /**
   * get default font/button sizes
   * @return {number} font/button size
   */
  get titleFontSize() {
    return this.#titleFontSize;
  }
  get textFontSize() {
    return this.#textFontSize;
  }
  get buttonWidth() {
    return this.#buttonWidth;
  }
  get buttonHeight() {
    return this.#buttonHeight;
  }

  /**
   * creates text to display on menu screen (default center aligned, black, arial font)
   * @param {string} text - text to display
   * @param {number} x, y - coordinates of text
   * @param {number} fontSize - size of text font
   * @param {string} align - text alignment (default center)
   */
  static createText(text, x, y, fontSize, align = "center") { // from w3schools
    Canvas.context.font = `${fontSize}px arial black, sans-serif`;
    Canvas.context.textAlign = align;
    Canvas.context.fillStyle = "rgb(0,0,0)";
    Canvas.context.fillText(text, x, y);
  }

  /**
   * draws menu screen with text and buttons
   */
  draw() {
    Canvas.context.fillStyle = "rgba(0, 0, 0, 0.5)";
    Canvas.context.fillRect(this.x, this.y, this.width, this.height);
    Menu.createText(this.title, Canvas.width / 2, Canvas.height * 0.3, this.titleFontSize);
    this.drawText();
    this.drawButtons();
  }

  /**
   * draws buttons needed for screen (default only restart button)
   */
  drawButtons() {
    this.restartButton.draw();
  }

  /**
   * draws text shown on screen (default current vampires saved/remaining)
   */
  drawText() {
    Menu.createText(`VAMPIRES SAVED: ${Player.vampiresSaved}`, Canvas.width / 2, Canvas.height * 0.4, this.textFontSize);
    Menu.createText(`VAMPIRES REMAINING: ${GameMap.enemies.length}`, Canvas.width / 2, Canvas.height * 0.5, this.textFontSize);
  }
}

/**
 * class for start screen (screen shown before game starts)
 * @extends Menu
 */
class Start extends Menu {
  /**
   * creates start screen
   * @property {object} startButton - button to start running the game
   */
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.title = "VAMPIRE GAME";

    this.startButton = new Button((Canvas.width - this.buttonWidth) / 2, Canvas.height * 0.55, this.buttonWidth, this.buttonHeight, "START");
  }

  /**
   * overwrites drawButtons() function to draw startButton (no restart button)
   */
  drawButtons() {
    this.startButton.draw();
  }

  /**
   * overwrites drawText() function to display controls for game 
   */
  drawText() {
    Menu.createText("CONTROLS", Canvas.width / 2, Canvas.height * 0.38, this.textFontSize);
    Menu.createText("W = UP", Canvas.width / 2 - Canvas.width * 0.1, Canvas.height * 0.45, this.textFontSize);
    Menu.createText("A = LEFT", Canvas.width / 2 + Canvas.width * 0.1, Canvas.height * 0.45, this.textFontSize);
    Menu.createText("S = DOWN", Canvas.width / 2 - Canvas.width * 0.1, Canvas.height * 0.5, this.textFontSize);
    Menu.createText("D = RIGHT", Canvas.width / 2 + Canvas.width * 0.1, Canvas.height * 0.5, this.textFontSize);
  }
}

/**
 * class for pause screen (screen shown when game is paused)
 * @extends Menu
 */
class Pause extends Menu {
  /**
   * creates pause screen
   * @property {object} continueButton - button to continue running the game
   * @property {object} restartButton - button to restart game (modified button width to fit 2 buttons)
   */
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.title = "PAUSED";

    this.continueButton = new Button(this.x + this.width * 0.05, Canvas.height * 0.55, this.buttonWidth * 0.8, this.buttonHeight, "CONTINUE");
    this.restartButton = new Button(this.x + this.width * 0.55, Canvas.height * 0.55, this.buttonWidth * 0.8, this.buttonHeight, "RESTART");
  }

  /**
   * overwrites drawButtons() function to draw both continue and restart buttons
   */
  drawButtons() {
    this.continueButton.draw();
    this.restartButton.draw();
  }
}

/**
 * class for end screen (screen shown when player loses/gameover)
 * @extends Menu
 */
class End extends Menu {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.title = "GAME OVER";
  }
}

/**
 * class for win screen (screen shown when player wins the game)
 * @extends Menu
 */
class Win extends Menu {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.title = "YOU WON";
  }
}

