"use strict"

/**
 * class to handle player controls
 */
class Controller {
  /**
   * controls used in the game
   * @property {boolean} w, a, s, d - if any WASD keys are pressed (for movement)
   * @property {number} mouseX, mouseY - current coordinates of cursor relative to camera
   * @property {boolean} click - if mouse is pressed down
   * @property {boolean} unclicked - if mouse is unpressed
   */
  static w = false;
  static a = false;
  static s = false;
  static d = false;

  static mouseX = 0;
  static mouseY = 0;
  static click = false;
  static unclicked = true;

  /**
   * calls method to update class properties when event occurs
   */
  constructor() {
    document.addEventListener("keydown", (e) => {
      this.#keyDownHandler(e);
    })
    document.addEventListener("keyup", (e) => {
      this.#keyUpHandler(e);
    })

    document.addEventListener("mousemove", (e) => { // from mdn web docs
      this.#mousemoveHandler(e);
    })
    document.addEventListener("mousedown", () => { // from mdn web docs
      this.#clickHandler();
    })
    document.addEventListener("mouseup", () => { // from mdn web docs
      this.#unclickHandler();
    })
  }

  /**
   * updates w, a, s, d properties if WASD keys are pressed
   */
  #keyDownHandler(e) {
    if (e.key === "w") {
      Controller.w = true;
    }
    if (e.key === "a") {
      Controller.a = true;
    }
    if (e.key === "s") {
      Controller.s = true;
    }
    if (e.key === "d") {
      Controller.d = true;
    }
  }

  /**
   * updates w, a, s, d properties if WASD keys are unpressed
   */
  #keyUpHandler(e) {
    if (e.key === "w") {
      Controller.w = false;
    }
    if (e.key === "a") {
      Controller.a = false;
    }
    if (e.key === "s") {
      Controller.s = false;
    }
    if (e.key === "d") {
      Controller.d = false;
    }
  }

  /**
   * updates mouse coordinates when cursor is moved
   */
  #mousemoveHandler(e) {
    Controller.mouseX = e.clientX; // from w3schools
    Controller.mouseY = e.clientY;
  }

  /**
   * updates click property if mouse is pressed and has already been been unpressed
   * checks if mouse is unpressed for shooting ANRM (regular and with powerup)
   */
  #clickHandler() {
    if (Controller.unclicked === true) {
      Controller.click = true;
    }
  }

  /**
   * updates click and unclicked property if mouse is unpressed
   */
  #unclickHandler() {
    Controller.click = false;
    Controller.unclicked = true;
  }
}