"use strict"

/**
 * class for the in-game "camera" following player
 * limits what is visible to the player during the game
 */
class Camera {
  /**
   * starting coordinates of camera (relative to canvas)
   * @property {number} x, y - position of camera
   */
  static x = 0;
  static y = 0;

  /**
   * updates coordinates + moves camera based on player's movement/position on canvas
   * stops moving when player reaches map edge
   */
  update() {
    Camera.x = this.#mapEdge(Player.x - (Canvas.width - Player.width) / 2, GameMap.rightBorder - Canvas.width, GameMap.leftBorder, Player.width);
    Camera.y = this.#mapEdge(Player.y - (Canvas.height - Player.height) / 2, GameMap.bottomBorder - Canvas.height, GameMap.topBorder, Player.height);
    Canvas.context.translate(-Camera.x, -Camera.y); // from w3schools
  }

  /**
   * determines camera coordinates based on where player is on the map
   * @param {number} coord - current camera coordinate based on player position
   * @param {number} max - max coordinate of camera before it stops following player (right and bottom border)
   * @param {number} min - min coordinate of camera before it stops following player (left and top border)
   * @return {number} what coordinate the camera should be at
   */
  #mapEdge(coord, max, min) {
    if (coord >= max) {
      return max;
    }
    else if (coord <= min) {
      return min;
    }
    else {
      return coord;
    }
  }

  /**
   * moves camera back to original position and updates coordinates
   */
  reset() {
    Canvas.context.translate(Camera.x, Camera.y);
    Camera.x = 0;
    Camera.y = 0;
  }
}