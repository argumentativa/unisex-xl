/*
==========================================
COLLISION BALLS - Without Physics Engine
==========================================
Tutorial by Patt Vira
Video: https://youtu.be/EFDesKpLCG0
Website: https://www.pattvira.com/
==========================================
*/

// --- GLOBAL VARIABLES ---

// `gravity` - Gravity force applied to balls (0.3)
// How fast balls fall downward each frame
let gravity = 0.3;

// `restitution` - Bounce coefficient (0.5)
// How much energy is retained after collision (0 = no bounce, 1 = perfect bounce)
let restitution = 0.5;

// `balls` - Array storing all ball objects
// Empty array that will be populated with Ball instances
let balls = [];

// `num` - Initial number of balls (1)
// Number of balls created at startup
let num = 1;

// `colorPalette` - Array of color hex codes
// Color options for randomly assigning to balls
let colorPalette = ["#f38eb0", "#2EAA50", "#F9A825", "#5C6BC0"];

// `lines` - Array of text lines to display
// Text that appears at the bottom of the canvas
let lines = ["LET'S", "MAKE", "TECH", "ARTSY", "TOGETHER."];

// `font` - p5.js font object
// Will store the loaded font for text rendering
let font;

// `fontSize` - Base font size in pixels (50)
// Size of text characters
let fontSize = 50;

// `margin` - Margin from edges in pixels (20)
// Spacing from canvas edges for text positioning
let margin = 20;

// `t` - Time variable for animation
// Used for sine wave animation of text weight
let t = 0;

// --- SETUP FUNCTION ---
// Runs once when the sketch starts

function setup() {
  // `createCanvas(400, 400)` - Creates the drawing canvas
  // Canvas size = 400x400 pixels
  createCanvas(400, 400);
  
  // Load Google Fonts - Fixed approach
  // Using textFont() with font name string instead of loadFont()
  // Google Sans Code font will be loaded via CSS in HTML
  textFont("monospace"); // Fallback font
  
  // Create initial balls
  // Loop creates `num` balls with random properties
  for (let i = 0; i < num; i++) {
    // `x` - Random X position (0 to width/2)
    // Spawns balls in left half of canvas
    let x = random(0, width / 2);
    
    // `y` - Random Y position (-300 to -100)
    // Spawns balls above canvas (negative Y) so they fall in
    let y = random(-300, -100);
    
    // `r` - Random radius (30 to 70 pixels)
    // Size of each ball
    let r = random(30, 70);
    
    // `c` - Random color from palette
    // Picks a random color from colorPalette array
    let c = random(colorPalette);
    
    // Create new Ball object and add to array
    // `new Ball(x, y, r, c)` - Creates ball with position, size, and color
    balls.push(new Ball(x, y, r, c));
  }
}

// `mousePressed()` - Called when mouse button is clicked
// Creates a new ball at mouse position

function mousePressed() {
  // `mouseX, mouseY` - Current mouse position
  // Gets X and Y coordinates of mouse click
  let x = mouseX;
  let y = mouseY;
  
  // Create ball with random size and color
  let r = random(30, 70);
  let c = random(colorPalette);
  
  // Add new ball to array
  balls.push(new Ball(x, y, r, c));
}

// --- DRAW FUNCTION ---
// Runs continuously (typically 60 times per second)

function draw() {
  // `background("#f1e1e6")` - Sets canvas background color
  // Light pink background
  background("#f1e1e6");
  
  // Update time variable for animation
  // `millis()` - Milliseconds since sketch started
  // Multiplied by 0.002 for slower animation
  t = millis() * 0.002;
  
  // Randomly spawn new balls (1% chance per frame)
  // `random() < 0.01` - 1% probability each frame
  if (random() < 0.01) {
    let x = random(0, width / 2);
    let y = random(-300, -100);
    let r = random(30, 70);
    let c = random(colorPalette);
    balls.push(new Ball(x, y, r, c));
  }
  
  // Check collisions between all ball pairs
  // Outer loop: iterate through each ball
  for (let i = 0; i < balls.length; i++) {
    // Inner loop: check against all other balls (avoid duplicate checks)
    // `j = i + 1` - Only check pairs once (ballA vs ballB, not ballB vs ballA)
    for (let j = i + 1; j < balls.length; j++) {
      let ballA = balls[i];
      let ballB = balls[j];
      // `collide()` - Check and resolve collision between two balls
      ballA.collide(ballB);
    }
  }
  
  // Update and display all balls (reverse loop for safe deletion)
  // Loop backwards so we can safely remove balls while iterating
  for (let i = balls.length - 1; i >= 0; i--) {
    // `update()` - Apply physics (gravity, velocity, position)
    balls[i].update();
    
    // `display()` - Draw the ball on canvas
    balls[i].display();
    
    // Remove balls that have fallen off screen
    // `offScreen()` - Returns true if ball is below canvas
    if (balls[i].offScreen()) {
      // `splice(i, 1)` - Remove ball at index i from array
      balls.splice(i, 1);
    }
  }
  
  // Display animated text
  displayText();
}

// `displayText()` - Renders animated text at bottom of canvas
// Text weight animates using sine wave

function displayText() {
  // Loop through each line of text
  for (let i = 0; i < lines.length; i++) {
    // `phase` - Offset for sine wave animation
    // Maps line index to phase angle (0 to TWO_PI)
    // Each line animates at slightly different phase
    let phase = map(i, 0, lines.length - 1, 0, TWO_PI);
    
    // `w` - Animated text weight (stroke width)
    // Uses sine wave to animate between 300 and 800
    // `sin(t + phase)` - Sine wave with time and phase offset
    // `map()` - Maps sine output (-1 to 1) to weight range (300 to 800)
    let w = map(sin(t + phase), -1, 1, 300, 800);
    
    // Set text properties
    // `textSize(fontSize)` - Set font size
    textSize(fontSize);
    
    // `strokeWeight()` - Set stroke width (simulates text weight)
    // Note: p5.js doesn't have textWeight(), so we use strokeWeight() for effect
    strokeWeight(w / 100); // Scale down for reasonable stroke width
    stroke(0); // Black stroke
    fill(0); // Black fill
    
    // Calculate text position
    // `x` - X position (left margin)
    let x = margin;
    
    // `y` - Y position (bottom-up, accounting for line index)
    // Positions text from bottom of canvas upward
    let y = height - margin - (lines.length - i) * fontSize;
    
    // `text(lines[i], x, y)` - Draw text
    // Renders the line of text at calculated position
    text(lines[i], x, y);
  }
}

// ============================================
// BALL CLASS
// ============================================
// Represents a single ball with physics properties

class Ball {
  // `constructor(x, y, r, c)` - Creates a new ball
  // Parameters:
  //   - `x` - Initial X position
  //   - `y` - Initial Y position
  //   - `r` - Radius (size)
  //   - `c` - Color (hex string)
  
  constructor(x, y, r, c) {
    // Position
    // `this.x` - Current X position
    this.x = x;
    // `this.y` - Current Y position
    this.y = y;
    
    // Velocity
    // `this.vx` - Velocity in X direction (horizontal speed)
    this.vx = 0;
    // `this.vy` - Velocity in Y direction (vertical speed)
    this.vy = 0;
    
    // Properties
    // `this.r` - Radius (size) of ball
    this.r = r;
    // `this.c` - Color of ball
    this.c = c;
  }
  
  // `update()` - Updates ball position based on physics
  // Applies gravity and updates position each frame
  
  update() {
    // Apply gravity to vertical velocity
    // `gravity` - Constant downward acceleration
    // Increases `vy` each frame, making ball fall faster
    this.vy += gravity;
    
    // Update position based on velocity
    // `this.x += this.vx` - Move horizontally by velocity
    this.x += this.vx;
    // `this.y += this.vy` - Move vertically by velocity
    this.y += this.vy;
    
    // Bounce off walls (horizontal boundaries)
    // `this.x - this.r < 0` - Ball hit left wall
    if (this.x - this.r < 0) {
      // `this.x = this.r` - Move ball back inside canvas
      this.x = this.r;
      // `this.vx *= -restitution` - Reverse and dampen horizontal velocity
      // Negative reverses direction, restitution reduces energy
      this.vx *= -restitution;
    }
    // `this.x + this.r > width` - Ball hit right wall
    else if (this.x + this.r > width) {
      // `this.x = width - this.r` - Move ball back inside canvas
      this.x = width - this.r;
      // Reverse and dampen horizontal velocity
      this.vx *= -restitution;
    }
    
    // Bounce off floor
    // `this.y + this.r > height` - Ball hit bottom of canvas
    if (this.y + this.r > height) {
      // `this.y = height - this.r` - Move ball back above floor
      this.y = height - this.r;
      // Reverse and dampen vertical velocity
      this.vy *= -restitution;
    }
  }
  
  // `display()` - Draws the ball on canvas
  // Renders ball as colored circle
  
  display() {
    // `push()` - Save current drawing state
    push();
    
    // `fill(this.c)` - Set fill color to ball's color
    fill(this.c);
    // `noStroke()` - Remove outline
    noStroke();
    
    // `ellipse(this.x, this.y, this.r * 2, this.r * 2)` - Draw circle
    // `this.x, this.y` - Center position
    // `this.r * 2` - Diameter (radius * 2)
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
    
    // `pop()` - Restore previous drawing state
    pop();
  }
  
  // `collide(other)` - Handles collision with another ball
  // Parameters:
  //   - `other` - Other Ball object to check collision with
  
  collide(other) {
    // Calculate distance between ball centers
    // `dx` - Horizontal distance between centers
    let dx = other.x - this.x;
    // `dy` - Vertical distance between centers
    let dy = other.y - this.y;
    // `distance` - Total distance between centers
    // `dist()` - p5.js function calculates distance between two points
    let distance = dist(this.x, this.y, other.x, other.y);
    
    // `minDist` - Minimum distance for collision
    // Sum of both radii (balls touching)
    let minDist = this.r + other.r;
    
    // Check if balls are colliding
    // `distance < minDist` - Balls are overlapping
    if (distance < minDist) {
      // Calculate collision angle
      // `angle` - Angle of collision line
      // `atan2(dy, dx)` - Calculates angle from horizontal
      let angle = atan2(dy, dx);
      
      // Calculate overlap amount
      // `overlap` - How much balls are overlapping
      let overlap = minDist - distance;
      
      // Separate balls to prevent overlap
      // Move balls apart along collision line
      // `this.x` - Move this ball backward
      this.x -= cos(angle) * overlap * 0.5;
      this.y -= sin(angle) * overlap * 0.5;
      // `other.x` - Move other ball forward
      other.x += cos(angle) * overlap * 0.5;
      other.y += sin(angle) * overlap * 0.5;
      
      // Calculate relative velocity
      // `relVelX` - Relative horizontal velocity
      let relVelX = other.vx - this.vx;
      // `relVelY` - Relative vertical velocity
      let relVelY = other.vy - this.vy;
      
      // Project relative velocity onto collision line
      // `velAlongNormal` - Velocity component along collision line
      let velAlongNormal = relVelX * cos(angle) + relVelY * sin(angle);
      
      // Don't resolve if velocities are separating
      // `velAlongNormal > 0` - Balls moving apart, no collision
      if (velAlongNormal > 0) return;
      
      // Calculate impulse (collision response)
      // `impulse` - Force applied to separate balls
      // Uses restitution to simulate energy loss
      let impulse = -(1 + restitution) * velAlongNormal;
      
      // Apply impulse to velocities
      // Update velocities based on collision
      // `this.vx` - Update this ball's horizontal velocity
      this.vx -= impulse * cos(angle);
      // `this.vy` - Update this ball's vertical velocity
      this.vy -= impulse * sin(angle);
      // `other.vx` - Update other ball's horizontal velocity
      other.vx += impulse * cos(angle);
      // `other.vy` - Update other ball's vertical velocity
      other.vy += impulse * sin(angle);
    }
  }
  
  // `offScreen()` - Checks if ball has fallen off bottom of canvas
  // Returns: `true` if ball is completely below canvas
  
  offScreen() {
    // `this.y - this.r > height` - Ball's top edge is below canvas bottom
    // Returns true if ball has completely fallen off screen
    return this.y - this.r > height;
  }
}


