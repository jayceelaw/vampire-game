"use strict"

/**
 * class for objects in game
 */
class Rock {
  /**
   * default size of every rock
   * @property {number} width, height - size of rock (based on image)
   */
  #width = document.getElementById("preloaded-rock").width;
  #height = document.getElementById("preloaded-rock").height;

  /**
   * create a rock
   * @param {number} x, y - coordinates of rock
   * @property {object} img - image of rock
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = ".//images//rock.png";
  }

  /**
   * get size of rock
   * @return {number} size of rock
   */
  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }

  /**
   * draws rock on canvas
   */
  draw() {
    Canvas.context.drawImage(this.img, this.x, this.y);
  }

  /**
   * generates 12-16 rocks in random positions on map
   */
  static generate() {
    const numObjects = Game.randomNum(12, 16);

    for (let i = 0; i < numObjects; i++) {
      GameMap.objects.push(new Rock(0, 0));
      Game.randomCoord(GameMap.objects[i]);
    }
  }
}