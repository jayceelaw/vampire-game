"use strict"

/**
 * class for Vampire1 type enemy
 * @extends Enemy
 */
class Vampire1 extends Enemy {
  /**
   * default properties of Vampire1
   */
  maxHP = 50;
  velocity = 210 / Game.fps;
  atkDamage = 10;

  /**
   * create the vampire + image used for vampire
   */
  constructor(x, y, width, height, image, velocity, HP, atkDamage) {
    super(x, y, width, height, image);
    this.x = x;
    this.y = y;
    this.HP = this.maxHP;
    this.image = './/images//vampire1.png';
    this.createImage();
  }
}

/**
 * class for Vampire2 type enemy
 * @extends Enemy
 */
class Vampire2 extends Enemy {
  /**
   * default properties of Vampire2
   */
  maxHP = 75;
  velocity = 150 / Game.fps;
  atkDamage = 15;

  /**
   * create the vampire + image used for vampire
   */
  constructor(x, y, width, height, image, velocity, HP, atkDamage) {
    super(x, y, width, height, image);
    this.x = x;
    this.y = y;
    this.HP = this.maxHP;
    this.image = './/images//vampire2.png';
    this.createImage();
  }
}

/**
 * class for Vampire3 type enemy
 * @extends Enemy
 */
class Vampire3 extends Enemy {
  /**
   * default properties of Vampire3
   */
  maxHP = 100;
  velocity = 100 / Game.fps;
  atkDamage = 30;

  /**
   * create the vampire + image used for vampire
   */
  constructor(x, y, width, height, image, velocity, HP, atkDamage) {
    super(x, y, width, height, image);
    this.x = x;
    this.y = y;
    this.HP = this.maxHP;
    this.image = './/images//vampire3.png';
    this.createImage();
  }
}

/**
 * class for Vampire4 type enemy
 * @extends Enemy
 */
class Vampire4 extends Enemy {
  /**
   * default properties of Vampire4
   */
  maxHP = 250;
  velocity = 80 / Game.fps;
  atkDamage = 50;

  /**
   * create the vampire + image used for vampire
   */
  constructor(x, y, width, height, image, velocity, HP, atkDamage) {
    super(x, y, width, height, image);
    this.x = x;
    this.y = y;
    this.HP = this.maxHP;
    this.image = './/images//vampire4.png';
    this.createImage();
  }
}