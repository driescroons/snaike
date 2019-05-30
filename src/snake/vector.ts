export interface iVector {
  x: number;
  y: number;
}

class Vector implements iVector {
  public x: number;
  public y: number;

  constructor(vector) {
    this.x = vector.x;
    this.y = vector.y;
  }

  /**
   * Add another vector to this vector.
   * @param	{Vector}	v	The vector to add.
   * @return	{Vector}	The current vector. useful for daisy-chaining calls.
   */
  public add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  /**
   * Take another vector from this vector.
   * @param  {Vector} v The vector to subtrace from this one.
   * @return {Vector}   The current vector. useful for daisy-chaining calls.
   */
  public subtract(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  /**
   * Divide the current vector by a given value.
   * @param  {Number|Vector} value The number (or Vector) to divide by.
   * @return {Vector}	   The current vector. Useful for daisy-chaining calls.
   */
  public divide(value) {
    if (value instanceof Vector) {
      this.x /= value.x;
      this.y /= value.y;
    } else if (typeof value == "number") {
      this.x /= value;
      this.y /= value;
    } else throw new Error("Can't divide by non-number value.");

    return this;
  }

  /**
   * Multiply the current vector by a given value.
   * @param  {Number|Vector} value The number (or Vector) to multiply the current vector by.
   * @return {Vector}	   The current vector. useful for daisy-chaining calls.
   */
  public multiply(value) {
    if (value instanceof Vector) {
      this.x *= value.x;
      this.y *= value.y;
    } else if (typeof value == "number") {
      this.x *= value;
      this.y *= value;
    } else throw new Error("Can't multiply by non-number value.");

    return this;
  }

  /**
   * Move the vector towards the given vector by the given amount.
   * @param  {Vector} v      The vector to move towards.
   * @param  {Number} amount The distance to move towards the given vector.
   */
  public moveTowards(v, amount) {
    // From http://stackoverflow.com/a/2625107/1460422
    var dir = new Vector({ x: v.x - this.x, y: v.y - this.y }).limitTo(amount);
    this.x += dir.x;
    this.y += dir.y;

    return this;
  }

  /**
   * Rounds the x and y components of this vector down to the next integer.
   * @return	{Vector}	This vector - useful for diasy-chaining.
   */
  public floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }
  /**
   * Rounds the x and y components of this vector up to the next integer.
   * @return	{Vector}	This vector - useful for diasy-chaining.
   */
  public ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }
  /**
   * Rounds the x and y components of this vector to the nearest integer.
   * @return	{Vector}	This vector - useful for diasy-chaining.
   */
  public round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  /**
   * Calculates the 'area' of this vector and returns the result.
   * In other words, returns x * y. Useful if you're using a Vector to store
   * a size.
   * @return {Number} The 'area' of this vector.
   */
  public area() {
    return this.x * this.y;
  }

  /**
   * Snaps this vector to an imaginary square grid with the specified sized
   * squares.
   * @param	{Number}	grid_size	The size of the squares on the imaginary  grid to which to snap.
   * @return	{Vector}	The current vector - useful for daisy-chaining.
   */
  public snapTo(grid_size) {
    this.x = Math.floor(this.x / grid_size) * grid_size;
    this.y = Math.floor(this.y / grid_size) * grid_size;

    return this;
  }

  /**
   * Limit the length of the current vector to value without changing the
   * direction in which the vector is pointing.
   * @param  {Number} value The number to limit the current vector's length to.
   * @return {Vector}	   The current vector. useful for daisy-chaining calls.
   */
  public limitTo(value) {
    if (typeof value != "number") throw new Error("Can't limit to non-number value.");

    this.divide(this.length);
    this.multiply(value);

    return this;
  }

  /**
   * Return the dot product of the current vector and another vector.
   * @param  {Vector} v   The other vector we should calculate the dot product with.
   * @return {Vector}	 The current vector. Useful for daisy-chaining calls.
   */
  public dotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculate the angle, in radians, from north to another vector.
   * @param  {Vector} v The other vector to which to calculate the angle.
   * @return {Vector}	 The current vector. useful for daisy-chaining calls.
   */
  public angleFrom(v) {
    // From http://stackoverflow.com/a/16340752/1460422
    var angle = Math.atan2(v.y - this.y, v.x - this.x) - Math.PI / 2;
    angle += Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    return angle;
  }

  /**
   * Clones the current vector.
   * @return {Vector} A clone of the current vector. Very useful for passing around copies of a vector if you don't want the original to be altered.
   */
  public clone() {
    return new Vector({ x: this.x, y: this.y });
  }

  /*
   * Returns a representation of the current vector as a string.
   * @returns {string} A representation of the current vector as a string.
   */
  public toString() {
    return `(${this.x}, ${this.y})`;
  }

  /**
   * Whether the vector is equal to another vector.
   * @param  {Vector} v The vector to compare to.
   * @return {boolean}  Whether the current vector is equal to the given vector.
   */
  public equals(v) {
    return this.x == v.x && this.y == v.y;
  }

  /**
   * Get the unit vector of the current vector - that is a vector poiting in the same direction with a length of 1. Note that this does *not* alter the original vector.
   * @return {Vector} The current vector's unit form.
   */
  public get unitVector() {
    var length = this.length;
    return new Vector({ x: this.x / length, y: this.y / length });
  }

  /**
   * Get the length of the current vector.
   * @return {Number} The length of the current vector.
   */
  public get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get the value of the minimum component of the vector.
   * @return {Number} The minimum component of the vector.
   */
  public get minComponent() {
    return Math.min(this.x, this.y);
  }

  /**
   * Get the value of the maximum component of the vector.
   * @return {Number} The maximum component of the vector.
   */
  public get maxComponent() {
    return Math.min(this.x, this.y);
  }

  /**
   * Returns a new vector based on an angle and a length.
   * @param	{Number}	angle	The angle, in radians.
   * @param	{Number}	length	The length.
   * @return	{Vector}	A new vector that represents the (x, y) of the specified angle and length.
   */
  public static fromBearing(angle, length) {
    return new Vector({ x: length * Math.cos(angle), y: length * Math.sin(angle) });
  }

  static zero = new Vector({ x: 0, y: 0 });
  static one = new Vector({ x: 1, y: 1 });
}

export default Vector;
