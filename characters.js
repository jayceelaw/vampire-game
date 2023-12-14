"use strict"

/**
 * abstract class for all the characters in the game (anything that moves)
 */
class Character {
  /**
   * @property {number} invincibleTime - time in milliseconds when player is invincible (cannot be attacked by same enemy during that time)
   * @property {number} invincible - timer for when player is invincible
   * @property {array} enemyObjCollide - will contain [object collided, direction] when enemy collides with object to determine how to move around the collided object (only used for enemy)
   */
  #invincibleTime = 3000 / Game.fps;
  #invincible = this.#invincibleTime;
  #enemyObjCollide;

  /**
   * creates the character 
   * @param {number} x, y - coordinates of character
   * @param {number} width, height - size of character (based on image used)
   * @property {number} velocity - distance in pixels the character will move every frame
   * @property {number} HP - current amount of "health" the character has
   * @property {number} maxHP - max amount of "health" character can have (starting amount of HP)
   * @property {number} atkDamage - amount of damage character will do (amount of HP subtracted)
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = document.getElementById(this.constructor.name).width; // from stack overflow
    this.height = document.getElementById(this.constructor.name).height;
    this.image;
    this.velocity;
    this.HP;
    this.maxHP;
    this.atkDamage;

    if (new.target === Character) {
      throw new Error("abstract class");
    }
  }

  /**
   * gets the array value of enemyObjCollide
   * return {array} value of enemyObjCollide
   */
  get enemyObjCollide() {
    return this.#enemyObjCollide;
  }
  /**
   * sets new array value for enemyObjCollide if valid (empty array or second value must be a valid direction)
   */
  set enemyObjCollide(value) {
    const directions = ["up", "down", "left", "right"];
    if (value.length === 0 || directions.includes(value[1])) {
      this.#enemyObjCollide = value;
    }
    else {
      throw new Error("invalid direction");
    }
  }

  /**
  * gets the invincibleTime/current invincible timer
  * return {number} invincibleTime/invincible value
  */
  get invincibleTime() {
    return this.#invincibleTime;
  }
  get invincible() {
    return this.#invincible;
  }
  /**
   * sets new time for current invincible time
   */
  set invincible(time) {
    this.#invincible = time;
  }

  /**
   * creates new image element in HTML based on character
   */
  createImage() {
    this.img = new Image();
    this.img.src = this.image;
  }

  /**
   * draws character at current coordinates/angle on canvas
   * @param {number} angle - angle in radians to rotate character by
   */
  drawChar(angle) {
    Canvas.context.save();
    Canvas.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    Canvas.context.rotate(angle);
    Canvas.context.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    Canvas.context.drawImage(this.img, this.x, this.y);
    Canvas.context.restore();
  }

  /**
   * updates character coordinates based on which direction they're moving in
   * if collided with border or object, coordinates are moved back to before collided
   * + sets enemyObjCollide array to object collided with and direction character was moving (only used for enemies)
   * @param {boolean} up, left, down, right - direction to move character
   */
  move(up, left, down, right) {
    this.enemyObjCollide = [];

    if (up === true) {
      this.y -= this.velocity;
      for (let obj of GameMap.objects) {
        if (Physics.hasCollided(this, obj)) {
          this.y += this.velocity;
          this.enemyObjCollide = [obj, "up"];
        }
      }
    }

    if (down === true) {
      this.y += this.velocity;
      for (let obj of GameMap.objects) {
        if (Physics.hasCollided(this, obj)) {
          this.y -= this.velocity;
          this.enemyObjCollide = [obj, "down"];
        }
      }
    }

    if (left === true) {
      this.x -= this.velocity;
      for (let obj of GameMap.objects) {
        if (Physics.hasCollided(this, obj)) {
          this.x += this.velocity;
          this.enemyObjCollide = [obj, "left"];
        }
      }
    }

    if (right === true) {
      this.x += this.velocity;
      for (let obj of GameMap.objects) {
        if (Physics.hasCollided(this, obj)) {
          this.x -= this.velocity;
          this.enemyObjCollide = [obj, "right"];
        }
      }
    }

    Physics.hasHitBorder(this);
  }

  /**
   * determines if character is still alive
   * @return {boolean} character is not alive when their HP is <= 0
   */
  isDead() {
    return this.HP <= 0;
  }

  /**
   * updates HP of character attacked based on attacker's attack damage
   */
  takeDamage(attack, character) {
    character.HP -= attack.atkDamage;
  }

  /**
   * draws health bar of character based on their current HP (in green)
   * @param {number} x, y - coordinates of HP bar
   * @param {number} width, height - size of HP bar
   */
  drawHP(x, y, width, height) {
    Canvas.context.fillStyle = "rgb(0, 255, 0)";
    Canvas.context.fillRect(x, y, width * (this.HP / this.maxHP), height);
    Canvas.context.lineWidth = 2; // from w3schools
    Canvas.context.strokeRect(x, y, width, height); // from w3schools
    Canvas.context.font = `${height * 0.75}px arial black, sans-serif`;
    Canvas.context.textAlign = "center"; // from w3schools
    Canvas.context.fillStyle = "rgb(0,0,0)";
    Canvas.context.fillText(this.HP, x + width / 2, y + height * 0.75);
  }
}

/**
 * class for the player (character controlled by player)
 * @extends Character
 */
class Player extends Character {
  /**
   * static properties of player to be accessed in other classes
   * @property {number} x, y - player's coordinates
   * @property {number} width, height - player's size (based on image)
   * @property {number} vampiresSaved - number of vampires saved using ANRM
   */
  static x = 0;
  static y = 0;
  static width;
  static height;
  static vampiresSaved = 0;

  /**
   * @property {boolean} up, left, down, right - direction player is moving in (based on key pressed)
   */
  up = Controller.w;
  left = Controller.a;
  down = Controller.s;
  right = Controller.d;

  /**
   * default properties of every player
   * @property {number} maxVelocity - max speed player can travel at (after friction/acceleration)
   */
  maxHP = 200
  maxVelocity = 200 / Game.fps;
  atkDamage = 10;

  /**
   * create the player + image used for player
   * @property {number} velocity - current velocity starts at 0 since player is not moving
   */
  constructor(x, y) {
    super(x, y);
    Player.width = this.width;
    Player.height = this.height;
    this.HP = this.maxHP;
    this.image = './/images//player.png';
    this.createImage();
    this.velocity = 0;
  }

  /**
   * updates coordinates of player based on WASD keys + inertia when moving from rest/coming to rest
   * updates static coordinates of player
   */
  update() {
    Physics.friction(this);
    this.move(this.up, this.left, this.down, this.right);
    Player.x = this.x;
    Player.y = this.y;
  }

  /**
   * calculates angle for player to face the direction of the cursor
   * draws player with HP bar on top left corner of screen
   */
  draw() {
    const angle = Math.atan((Controller.mouseY - (Player.y - Camera.y + Player.height / 2)) / (Controller.mouseX - (Player.x - Camera.x + Player.width / 2))); // Math.atan from stack overflow
    this.drawChar(angle);
    this.drawHP(Camera.x + 10, Camera.y + 10, Canvas.width * 0.3, Canvas.height * 0.05);
  }
}

/**
 * abstract class for all enemies (vampires)
 * @extends Character
 */
class Enemy extends Character {
  /**
   * create the enemy
   * @property {array} enemyObjCollide - starts with empty array before colliding
   */
  constructor(x, y) {
    super(x, y);
    this.enemyObjCollide = [];

    if (new.target === Enemy) {
      throw new Error("abstract class");
    }
  }

  /**
   * updates coordinates of enemy to move around collided object in shortest path to player
   * determines which direction to move based on distance to player on either sides (midpoint of both characters)
   * keeps moving in this direction until not colliding with object or shortest path to player changes (player moves)
   */
  handleCollision() {
    const obj = this.enemyObjCollide[0];

    if (this.enemyObjCollide[1] === "up" || this.enemyObjCollide[1] === "down") {
      const enemyMid = this.x + this.width / 2;
      const playerMid = Player.x + Player.width / 2;

      let left = (enemyMid - obj.x) + (playerMid - obj.x) <
        (obj.x + obj.width - enemyMid) + (obj.x + obj.width - playerMid)
        && (playerMid < obj.x + obj.width);

      this.move(Player.y < this.y, left, Player.y > this.y, !left);
    }
    else {
      const enemyMid = this.y + this.height / 2;
      const playerMid = Player.y + Player.height / 2;

      let up = (enemyMid - obj.y) + (playerMid - obj.y) <
        (obj.y + obj.height - enemyMid) + (obj.y + obj.height - playerMid)
        && playerMid < obj.y + obj.height;

      this.move(up, Player.x < this.x, !up, Player.x > this.x);
    }
  }

  /**
   * updates coordinates of enemy to move towards player 
   * stops moving for invincibleTime if collided with player + resets invincible timer + subtracts player HP, updates invincible timer every time
   * runs handleCollision() function if collided with object
   * checks for collisions between any ANRM bullets and enemy - deletes ANRM bullet if collided and subtracts enemy HP
   * deletes enemy if saved by player and updates vampiresSaved accordingly
   */
  update() {
    if (this.enemyObjCollide.length > 0) {
      this.handleCollision();
    }
    else if (this.invincible >= this.invincibleTime) {
      this.move(Player.y < this.y - this.velocity, Player.x < this.x - this.velocity, Player.y > this.y + this.velocity, Player.x > this.x + this.velocity);
      if (Physics.hasCollided(this, Game.player)) {
        this.takeDamage(this, Game.player);
        this.invincible = 0;
      }
    }
    this.invincible++;

    for (let i = 0; i < ANRM.shots.length; i++) {
      if (Physics.hasCollided(ANRM.shots[i], this)) {
        this.takeDamage(ANRM.shots[i], this);
        ANRM.shots.splice(i, 1);

        if (this.isDead()) {
          GameMap.enemies.splice(GameMap.enemies.indexOf(this), 1); // indexOf() from stack overflow
          Player.vampiresSaved++;
        }
        break;
      }
    }
  }

  /**
   * calculates angle for enemy to face direction of player
   * draws enemy with HP bar on top
   */
  draw() {
    const angle = Math.atan((Player.y - (this.y + this.height / 2)) / (Player.x - (this.x + this.width / 2)));
    this.drawChar(angle);
    this.drawHP(this.x + (this.width - 120) / 2, this.y - 30, 120, 20);
  }

  /**
   * generates 10-15 enemies in random positions on map
   * around 10% Vampire4 type (strongest), 20% Vampire3 type, 30% Vampire2 type, %40 Vampire1 type (weakest)
   */
  static generate() {
    const numVampires = Game.randomNum(10, 15);

    for (let i = 0; i < numVampires; i++) {
      if (i < numVampires * (1 / 10)) {
        GameMap.enemies.push(new Vampire4(0, 0));
      }
      else if (i < numVampires * (3 / 10)) {
        GameMap.enemies.push(new Vampire3(0, 0));
      }
      else if (i < numVampires * (6 / 10)) {
        GameMap.enemies.push(new Vampire2(0, 0));
      }
      else {
        GameMap.enemies.push(new Vampire1(0, 0));
      }

      Game.randomCoord(GameMap.enemies[i]);
    }
  }
}


