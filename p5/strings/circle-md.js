/**
 * # Circle Class
 * 
 * A physics-enabled circle that falls and bounces using Matter.js physics engine.
 * Each circle has a random color from a palette and can be removed when it falls off screen.
 */

class Circle {
    /**
     * ## Constructor
     * 
     * Creates a new Circle instance and adds it to the physics world.
     * 
     * **Initial Position:**
     * - `x = width/2` - Starts at the horizontal center of the canvas
     * - `y = 40` - Starts 40 pixels from the top of the canvas
     * 
     * **Properties:**
     * - `this.r = 10` - Circle radius in pixels (diameter will be 20px)
     * - `this.c = random(colorPalette)` - Randomly selects a color from the colorPalette array
     * - `this.done = false` - Flag to track if circle has fallen off screen
     */
    constructor() {
      // Horizontal center of canvas
      let x = width/2;
      
      // 40 pixels from top of canvas
      let y = 40;
      
      // Circle radius (10 pixels = 20px diameter)
      this.r = 10;
      
      // Random color from colorPalette array
      this.c = random(colorPalette);
      
      // Flag: false = circle is active, true = circle should be removed
      this.done = false;
      
      /**
       * Creates a circular Matter.js physics body
       * - `Bodies.circle(x, y, radius, options)` - Creates circle at position (x, y)
       * - `restitution: 0.6` - Bounciness (0 = no bounce, 1 = perfect bounce)
       *   - 0.6 means the circle will bounce back with 60% of its impact velocity
       */
      this.body = Bodies.circle(x, y, this.r, {restitution: 0.6});
      
      /**
       * Sets initial velocity for the circle
       * - `Vector.create(random(-1, 1), random(-1, 1))` - Random velocity vector
       *   - X component: random between -1 and 1 (left/right movement)
       *   - Y component: random between -1 and 1 (up/down movement)
       * - `Body.setVelocity(body, velocity)` - Applies velocity to the physics body
       *   This makes the circle start moving in a random direction
       */
      let velocity = Vector.create(random(-1, 1), random(-1, 1));
      Body.setVelocity(this.body, velocity);
      
      /**
       * Adds the circle's physics body to the Matter.js world
       * - `Composite.add(engine.world, this.body)` - Registers body with physics engine
       *   Now the engine will simulate gravity, collisions, and movement for this circle
       */
      Composite.add(engine.world, this.body);
    }
    
    /**
     * ## display()
     * 
     * Draws the circle on the canvas using p5.js
     * 
     * **Process:**
     * 1. Sets fill color to the circle's assigned color (`this.c`)
     * 2. Draws an ellipse at the circle's current physics position
     *    - Position comes from `this.body.position` (updated by Matter.js physics)
     *    - Size is `this.r * 2` (diameter = radius × 2)
     */
    display() {
      // Set fill color to the circle's color
      fill(this.c);
      
      /**
       * Draw ellipse at physics body position
       * - `this.body.position.x` - Current X position from physics engine
       * - `this.body.position.y` - Current Y position from physics engine
       * - `this.r * 2` - Diameter (radius × 2 = 20 pixels)
       * - `this.r * 2` - Same for height (makes it a perfect circle)
       */
      ellipse(this.body.position.x, this.body.position.y, this.r * 2, this.r * 2);
    }
    
    /**
     * ## checkDone()
     * 
     * Checks if the circle has fallen off the bottom of the screen.
     * 
     * **Logic:**
     * - If circle's Y position is greater than canvas height + circle diameter
     *   → Circle is completely below the visible area
     *   → Set `this.done = true` to mark for removal
     * - Otherwise, keep `this.done = false` (circle is still visible)
     * 
     * **Why `height + this.r * 2`?**
     * - `height` = bottom edge of canvas
     * - `+ this.r * 2` = add circle diameter to account for circle's bottom edge
     * - This ensures circle is fully off-screen before marking as done
     */
    checkDone() {
      // Check if circle has fallen below the bottom of the canvas
      if (this.body.position.y > height + this.r * 2) {
        // Circle is completely off-screen, mark for removal
        this.done = true;
      } else {
        // Circle is still visible, keep it active
        this.done = false;
      }
    }
    
    /**
     * ## removeCircle()
     * 
     * Removes the circle from the physics world.
     * 
     * **Process:**
     * - `Composite.remove(engine.world, this.body)` - Removes the physics body
     *   This stops physics simulation for this circle and frees up resources
     * 
     * **When to call:**
     * - Call this when `this.done === true` (circle has fallen off screen)
     * - Prevents memory leaks from accumulating physics bodies
     */
    removeCircle() {
      // Remove circle's physics body from the Matter.js world
      Composite.remove(engine.world, this.body);
    }
  }