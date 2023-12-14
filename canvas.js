"use strict"

/**
 * class for the canvas the game is displayed with
 */
class Canvas {
  /**
   * @property {element} canvas - canvas element from HTML
   * @property {context} context - 2d context of canvas element
   * @property {number} width, height - size of canvas based on size of window
   */
  static canvas = document.getElementById('gameScreen');
  static context = Canvas.canvas.getContext('2d');
  static width = window.innerWidth; // from w3schools
  static height = window.innerHeight;

  /**
   * create the canvas + update size
   * @property {object} game - initiates Game class
   */
  constructor() {
    Canvas.canvas.width = Canvas.width;
    Canvas.canvas.height = Canvas.height;
    this.game = new Game();
  }
}

new Canvas();