//add fun tidbits of info etc "youve dived past mt everest"
//add searchlight. make it blink in and out of existence occasionally and only appear at divertickdepth >
//add images of reaper leviathan
//add parallax background
//light rays

//*deltaTime/17


let c;//canvas

//const divelement = document.getElementById("game");

let viewHeight = visualViewport.height;
let viewWidth = visualViewport.width;
const tick = 50;//every one hundred feet is a tick, which is 50 pixels
const maxDepthTick = tick*362.01;

let gameHeight = maxDepthTick+tick+viewHeight/2; 

let diver;
let diverSpeedY = 0;  
let diverSpeedX = 0;  
const maxSpeed = 3;

let diverDepthInTicks;  // Converts diver y position to ticks
let depth = 0;

let mx, my

let bubbles = [];

//sets up the titles for each zone
let sunlight;
let twilight;
let midnight;
let abyssal;
let trench;
let textSize = 50;

//disable scrolling for aesthetics
window.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

//setup
function setup() {
    c = createCanvas(viewWidth, viewHeight);
    c.parent('game');
    diver = new Diver(viewWidth / 2, viewHeight / 2);
    frameRate(60);//constant framerate to make things easier
    for (let i = 0; i < 500; i++) {
        bubbles.push(new Bubble(random(viewWidth), random(viewHeight/2, gameHeight), random(2, 9)));
    }
    sunlight = new Typewriter("SUNLIGHT ZONE(0-656ft)", 3, textSize);
    twilight = new Typewriter("TWILIGHT ZONE(656-3,281ft)", 3, textSize);
    midnight = new Typewriter("MIDNIGHT ZONE(3,281-13,123ft)", 3, textSize);
    abyssal = new Typewriter("ABYSSAL ZONE(13,123-19,685ft)", 3, textSize);
    trench = new Typewriter("THE TRENCH (19,685ft)", 3, textSize);
}

//draw
function draw() {
    //sets the variables again in case of a resize
    viewHeight = visualViewport.height;
    viewWidth = visualViewport.width;
    gameHeight = maxDepthTick+tick+viewHeight/2; 
    resizeCanvas(viewWidth, viewHeight)
    background(0);

    // Adjusting the view based on the diver's position
    translate(0, -diver.y + viewHeight / 2);

    // sets the tick depth
    diverDepthInTicks = (diver.y - viewHeight / 2) / tick;

    //draw skybox and ocean
    drawOcean();
    skyBox();

    //draw bubbles
    for (let bubble of bubbles) {
        if (bubble.y > diver.y - viewHeight/2 && bubble.y < diver.y + viewHeight/2) {
            bubble.update();
            bubble.display();
        }
    }

    //title
    push();
        translate(0, -0.2*diver.y);
        drawText(viewWidth/2, viewHeight/3, "HOW DEEP IS THE OCEAN?", textSize);
        drawText(viewWidth/2, 1.2*viewHeight/3, "controls: wasd, scroll wheel", textSize/2);
    pop();

    //write out fun info bits
    drawText(viewWidth/2, 27.165*tick+viewHeight/2, "This is the height of the Burj Khalifa", textSize/1.8);
    drawText(viewWidth/2, 73.92*tick+viewHeight/2, "Two Titans clash", textSize/1.8);//sperm whale vs giant squid
    drawText(viewWidth/2, 115*tick+viewHeight/2, "The OceanGate Incident", textSize/1.8);
    drawText(viewWidth/2, 125*tick+viewHeight/2, "Here's the Titanic", textSize/1.8);
    drawText(viewWidth/2, 290.31*tick+viewHeight/2, "You have dived past the height of Mt Everest", textSize/1.8);
    
    //write out the names of the zones. sunlight zone floats to the top cause its too close to the next zone
    push();
        translate(viewWidth/2, 3*viewHeight/4-0.2*diver.y);
        sunlight.display();
    pop();
    writeOutZones(6, 33-15, twilight);
    writeOutZones(33, 131-15, midnight);
    writeOutZones(131, 197-15, abyssal);
    writeOutZones(197, 327, trench);
    
    //display diver and move it
    diver.display();
    diver.move();

    // Draw the ruler
    drawRuler();

    //draw the depth meter
    depth = Math.max(0, (diver.y - viewHeight / 2) * (100 / tick)).toFixed();  // Calculates depth in terms of hundreds of ft
    push();
        resetMatrix();  // Reset the transformation matrix
        drawText(viewWidth/2, 10*viewHeight/11, "Depth: "+depth+"ft", textSize/2);
    pop();
    
    // rect(0, gameHeight-5, width, 10); draws a rect at game height to debug
    coolCursor();

}

