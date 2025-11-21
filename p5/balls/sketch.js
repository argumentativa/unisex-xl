/*
----- Coding Tutorial by Patt Vira ----- 
Name: Collision without Physics Engine
Video Tutorial: https://youtu.be/EFDesKpLCG0

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

let gravity = 0.3;
let restitution = 0.5;
let balls = []; let num = 1;
let colorPalette = ["#f38eb0","#2EAA50", "#F9A825", "#5C6BC0"];


let lines = ["LET'S", "MAKE", "TECH", "ARTSY", "TOGETHER."];
let font; let fontSize = 50;
let margin = 20; let t = 0;

async function setup() {
  createCanvas(400, 400);
  
  font = await loadFont("https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&display=swap");
  textFont(font);
  
  for (let i=0; i<num; i++) {
    let x = random(0, width/2);
    let y = random(-300, -100); 
    let r = random(30, 70);
    let c = random(colorPalette);
    balls.push(new Ball(x, y, r, c));
  }
  
}

function mousePressed() {
  let x = mouseX;
  let y = mouseY; 
  let r = random(30, 70);
  let c = random(colorPalette);
  balls.push(new Ball(x, y, r, c));
}

function draw() {
  background("#f1e1e6");
  t = millis() * 0.002;
  
  if (random() < 0.01) {
    let x = random(0, width/2);
    let y = random(-300, -100); 
    let r = random(30, 70);
    let c = random(colorPalette);
    balls.push(new Ball(x, y, r, c));
  }
  
  
  for (let i=0; i<balls.length; i++) {
    for (let j=i+1; j<balls.length; j++) {
      let ballA = balls[i];
      let ballB = balls[j];
      ballA.collide(ballB);
    }
  }
  
  for (let i=balls.length-1; i>= 0; i--) {
    balls[i].update();
    balls[i].display();
    
    if (balls[i].offScreen()) {
      balls.splice(i, 1);
    }
  }
  
  displayText();
}

function displayText() {
  for (let i=0; i<lines.length; i++) {
    let phase = map(i, 0, lines.length-1, 0, TWO_PI);
    let w = map(sin(t + phase), -1, 1, 300, 800);
    textWeight(w);
    textSize(fontSize);
    let x = margin; 
    let y = height - margin - (lines.length - i) * fontSize;
    text(lines[i], x, y);
  }
}




