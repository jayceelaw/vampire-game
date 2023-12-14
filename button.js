"use strict"

/**
 * class to create buttons (used for Menu and pause button during game)
 */
class Button {
  /**
   * predefined fields of every button
   * @property {string} buttonColour - default colour of button (gray)
   * @property {string} buttonHoverColour - default colour of button when mouse is hovering over (dark gray)
   * @property {string} colour - current colour of button based on mouse position
   */
  #buttonColour = "rgb(150, 150, 150)";
  #buttonHoverColour = "rgb(100, 100, 100)";
  #colour = this.#buttonColour;

  /**
   * create a button
   * @param {number} x, y - coordinates of button relative to canvas
   * @param {number} width, height - size of button
   * @param {string} text - text to be displayed on button
   */
  constructor(x, y, width, height, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
  }

  /**
   * draws the button on the canvas with given coordinates, size, text, and colour based on mouse
   */
  draw() {
    this.#hover();
    Canvas.context.fillStyle = this.#colour;
    Canvas.context.fillRect(this.x, this.y, this.width, this.height);
    Menu.createText(this.text, this.x + this.width / 2, this.y + this.height * 0.6, Canvas.height * 0.07);
  }

  /**
   * checks if mouse is clicked when on top of button (coordinates relative to camera)
   * @return {boolean} if button was clicked
   */
  clicked() {
    if (Controller.click === true &&
      Controller.mouseX > this.x - Camera.x &&
      Controller.mouseX < this.x + this.width - Camera.x &&
      Controller.mouseY > this.y - Camera.y &&
      Controller.mouseY < this.y + this.height - Camera.y) {
      return true;
    }
    return false;
  }

  /**
   * checks if mouse is hovering over button (coordinates relative to camera)
   * changes colour of button to indicate it's hovering over
   * @return {boolean} if mouse hovering on button
   */
  #hover() {
    if (Controller.mouseX > this.x - Camera.x &&
      Controller.mouseX < this.x + this.width - Camera.x &&
      Controller.mouseY > this.y - Camera.y &&
      Controller.mouseY < this.y + this.height - Camera.y) {
      this.#colour = this.#buttonHoverColour;
      return true;
    }
    this.#colour = this.#buttonColour;
    return false;
  }
}