"use strict"

/**
 * class to handle physics in the game
 */
class Physics {
  /**
   * determines if object given hit the game's borders + updates coordinates to before collision
   * @param {object} obj - object to check if it hit borders
   * @return {boolean} if object had hit the border (any)
   */
  static hasHitBorder(obj) {
    let hitBorder = false;

    if (obj.x <= GameMap.leftBorder) {
      obj.x = GameMap.leftBorder;
      hitBorder = true;
    }

    if (obj.x + obj.width >= GameMap.rightBorder) {
      obj.x = GameMap.rightBorder - obj.width;
      hitBorder = true;
    }

    if (obj.y <= GameMap.topBorder) {
      obj.y = GameMap.topBorder;
      hitBorder = true;
    }

    if (obj.y + obj.height >= GameMap.bottomBorder) {
      obj.y = GameMap.bottomBorder - obj.height;
      hitBorder = true;
    }
    return hitBorder;
  }

  /**
   * determines if 2 objects had collided 
   * @param {object} obj1, obj2 - the 2 objects to check for collision
   * @return {boolean} if the 2 objects had collided
   */
  static hasCollided(obj1, obj2) {
    if (obj1.x + obj1.width > obj2.x &&
      obj1.x < obj2.x + obj2.width &&
      obj1.y + obj1.height > obj2.y &&
      obj1.y < obj2.y + obj2.height) {
      return true;
    }
    return false;
  }

  /**
   * adds friction/inertia to character when moving (only works with player)
   * adds acceleration to character's velocity each time until max speed
   * decreases velocity by acceleration * 2 when stopping
   * updates player movement/direction 
   * @param {object} character - character to apply friction/inertia to
   */
  static friction(character) {
    const acceleration = character.maxVelocity / Game.fps;

    if (!Controller.w && !Controller.a && !Controller.s && !Controller.d) {
      if (character.velocity - (acceleration * 2) > 0) {
        character.velocity -= acceleration * 2;
      }
      else {
        character.velocity = 0;
        Game.player.up = false;
        Game.player.left = false;
        Game.player.down = false;
        Game.player.right = false;
      }
    }

    else {
      if (character.velocity < character.maxVelocity) {
        character.velocity += acceleration;
      }
      Game.player.up = Controller.w;
      Game.player.left = Controller.a;
      Game.player.down = Controller.s;
      Game.player.right = Controller.d;
    }
  }
}