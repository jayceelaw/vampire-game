"use strict"

/**
 * class for anrm/"weapon" used by player to save vampires
 * instance created every time mouse is clicked
 */
class ANRM {
  /**
   * predefined fields of every "bullet"/shot
   * @property {array} shots - stores every shot to be drawn in game
   * @property {number} width, height - constant/default size of every shot
   * @property {string} colour - default/constant colour of shot (light blue)
   */
  static shots = [];
  #mouseX;
  #mouseY;
  #width = 20;
  #height = 10;
  #colour = "rgb(173, 216, 230)";
  #angle;
  #velocityX;
  #velocityY;

  /**
   * create a bullet/shot
   * @param {number} x, y - starting coordinates from where bullet is shot from (player center)
   * @param {number} mouseX, mouseY - coordinates of cursor when mouse is clicked (to create instance of this class)
   * @property {number} atkDamage - amount of HP to subtract from enemies hit 
   * @property {number} angle - angle in radians between player center and clicked mouse coordinates (to rotate the shot by)
   * @property {number} velocityX, velocityY - distance to move shot by every frame
   */
  constructor(x, y, mouseX, mouseY) {
    this.x = x;
    this.y = y;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.atkDamage = Game.player.atkDamage;

    this.#angle = Math.atan2((this.#mouseY - (Player.y - Camera.y + Player.height / 2)), (this.#mouseX - (Player.x - Camera.x + Player.width / 2)));
    this.#velocityX = 400 * Math.cos(this.#angle) / Game.fps;
    this.#velocityY = 400 * Math.sin(this.#angle) / Game.fps;
  }

  /**
   * set mouse coordinates when instance is created
   */
  set mouseX(mouseX) {
    this.#mouseX = mouseX;
  }
  set mouseY(mouseY) {
    this.#mouseY = mouseY;
  }

  /**
   * get size of bullet
   * @return {number} the bullet's width/height in pixels
   */
  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }

  /**
   * draws the bullet on the canvas
   * draws at correct angle and current x,y coordinates on every frame
   */
  draw() {
    Canvas.context.save();
    Canvas.context.translate(this.x + this.#width / 2, this.y + this.#height / 2);
    Canvas.context.rotate(this.#angle);
    Canvas.context.translate(-this.x - this.#width / 2, -this.y - this.#height / 2);
    Canvas.context.fillStyle = this.#colour;
    Canvas.context.fillRect(this.x, this.y, this.#width, this.#height);
    Canvas.context.restore();
  }

  /**
   * updates x and y positions of bullet on every frame
   * moves bullet in direction where mouse was clicked
   */
  update() {
    this.y += this.#velocityY;
    this.x += this.#velocityX;
  }

  /**
   * creates new instance of class every time mouse is clicked + adds to array of shots
   * sets Controller.click to false after 1 bullet is shot to prevent more from shooting
   * allows Controller.click to stay true as long as mouse is held down when QuickShoot is true, so player can continuously shoot bullets
   */
  shoot() {
    if (Controller.click === true) {
      ANRM.shots.push(new ANRM(Player.x + (Player.width / 2), Player.y + (Player.height / 2), Controller.mouseX, Controller.mouseY));
      if (QuickShoot.triggered === false) {
        Controller.click = false;
      }
      Controller.unclicked = false;
    }
  }
}