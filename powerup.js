"use strict"

/**
 * abstract class for all power ups in game
 */
class PowerUp {
  /**
   * @property {array} powerups - stores all power ups in the game
   * @property {number} width, height - default size of all power ups (based on image)
   */
  static powerups = [];
  #width = document.getElementById("preloaded-powerup").width;
  #height = document.getElementById("preloaded-powerup").height;

  /**
   * create power up
   * @param {number} x, y - coordinates of power up
   * @property {string} - image file of power up
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.image;

    if (new.target === PowerUp) {
      throw new Error("abstract class");
    }
  }

  /**
   * gets size of power up
   * @return {number} size of power up
   */
  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }

  /**
   * creates power up image and draws on canvas
   */
  draw() {
    this.img = new Image();
    this.img.src = this.image;
    Canvas.context.drawImage(this.img, this.x, this.y)
  }

  /**
   * abstract method to use power up
   */
  use() {
    throw new Error("abstract method");
  }

  /**
   * checks if player collides with any power ups
   * removes power up and uses it if collided
   */
  static checkActivated() {
    for (let i = 0; i < PowerUp.powerups.length; i++) {
      if (Physics.hasCollided(PowerUp.powerups[i], Game.player)) {
        PowerUp.powerups[i].use();
        PowerUp.powerups.splice(i, 1);
      }
    }
  }

  /**
   * generates 9-12 power ups in random positions on map
   * 1 QuickShoot power up, around 40% ANRMIncrease power up, 60% HealthIncrease power up
   */
  static generate() {
    const numPowerUps = Game.randomNum(9, 12);

    for (let i = 0; i < numPowerUps; i++) {
      if (i === 0) {
        PowerUp.powerups.push(new QuickShoot(0, 0));
      }
      else if (i < numPowerUps * 0.4) {
        PowerUp.powerups.push(new ANRMIncrease(0, 0));
      }
      else {
        PowerUp.powerups.push(new HealthIncrease(0, 0));
      }

      Game.randomCoord(PowerUp.powerups[i]);
    }
  }

  /**
   * resets any adjustments made by power ups
   */
  static reset() {
    Game.player.atkDamage = 10;
    QuickShoot.triggered = false;
  }
}

/**
 * class for increasing player HP
 * @extends PowerUp
 */
class HealthIncrease extends PowerUp {
  /**
   * @property {number} HPIncrease - amount to increase HP by
   */
  #HPIncrease = 20;

  constructor(x, y) {
    super(x, y);
    this.image = './/images//powerup1.png';
  }

  /**
   * overwrites use() function to increase player's current HP by HPIncrease, or to maxHP
   */
  use() {
    if (Game.player.HP + this.#HPIncrease > Game.player.maxHP) {
      Game.player.HP = Game.player.maxHP;
    }
    else {
      Game.player.HP += this.#HPIncrease;
    }
  }
}

/**
 * class for increasing player attack damage
 * @extends PowerUp
 */
class ANRMIncrease extends PowerUp {
  /**
   * @property {number} atkIncrease - amount to increase attack damage by
   */
  #atkIncrease = 10;

  constructor(x, y) {
    super(x, y);
    this.image = './/images//powerup2.png';
  }

  /**
   * overwrites use() function to increase player's attack damage by atkIncrease
   */
  use() {
    Game.player.atkDamage += this.#atkIncrease;
  }
}

/**
 * class for allowing player to shoot ANRM faster
 * @extends PowerUp
 */
class QuickShoot extends PowerUp {
  /**
   * @property {boolean} triggered - if quick shoot is activated
   */
  static triggered = false;

  constructor(x, y) {
    super(x, y);
    this.image = './/images//powerup3.png';
  }

  /**
   * overwrites use() function to set activate quick shoot (used in ANRM class)
   */
  use() {
    QuickShoot.triggered = true;
  }
}