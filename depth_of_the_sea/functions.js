// functions file
//write out the names of the zones and deletes them if the threshold is passed
function writeOutZones(startTick, endTick, writer){
    push();
        resetMatrix();
        translate(viewWidth/2, 5*viewHeight/6);
        writer.display();
        if(!(diverDepthInTicks >=startTick && diverDepthInTicks<=endTick)){
            delType(writer);
        }else{
            writer.del = false;
        }
    pop();
}

function coolCursor(){
    correctedMouseY = mouseY + diver.y - viewHeight / 2
    strokeWeight(5)
    stroke(255, 255, 255)
    if(!mouseIsPressed){
        noFill();
    }else{
        fill(255, 255, 255);
    }
    circle(mouseX, correctedMouseY, tick/2);
    strokeWeight(1)
    noStroke();
}
//deletes the typewriter instance
function delType(writer){
    writer.del = true;
}

//scrolling for depth movement
function mouseWheel(event) {
    diver.y += 0.9 * event.delta;
    diver.y = constrain(diver.y, viewHeight / 2, gameHeight - viewHeight / 2);
    
}

//creates a gradient with (startcolor, endcolor, starty, endy)
function gradient(c1, c2, s, e){ //gradient
    for (let i = s; i <= e; i++) {
       let inter = map(i, s, e, 0, 1);
       let c = lerpColor(c1, c2, inter);
       stroke(c);
       line(0, i, viewWidth, i);
   }
}

//draws the ocean
function drawOcean(){
    push();
        translate(0, viewHeight/2);
        if(diverDepthInTicks>=0 &&diverDepthInTicks-viewHeight/2<=6){
            // Sunlight zone (0 to 6 ticks)
            let sunlightTop = color(0, 191, 255); // Sky blue
            let sunlightBottom = color(70, 130, 180); // Steel blue
            gradient(sunlightTop, sunlightBottom, 0, 6 * tick);
        }

        if(diverDepthInTicks+viewHeight/2>=6 &&diverDepthInTicks-viewHeight/2<=33){
            // Twilight zone (6 to 33 ticks)
            let twilightTop = color(70, 130, 180); // Steel blue
            let twilightBottom = color(25, 25, 112); // Midnight blue
            gradient(twilightTop, twilightBottom, 6 * tick, 33 * tick);
        }

        if(diverDepthInTicks+viewHeight/2>=33 &&diverDepthInTicks-viewHeight/2<=131){
            // Midnight zone (33 to 131 ticks)
            let midnightTop = color(25, 25, 112); // Midnight blue
            let midnightBottom = color(0, 0, 139); // Dark blue
            gradient(midnightTop, midnightBottom, 33 * tick, 131 * tick);
        }

        if(diverDepthInTicks+viewHeight/2>=131 &&diverDepthInTicks-viewHeight/2<=197){
            // Abyssal zone (131 to 197 ticks)
            let abyssalTop = color(0, 0, 139); // Dark blue
            let abyssalBottom = color(0, 0, 0); // Black
            gradient(abyssalTop, abyssalBottom, 131 * tick, 197 * tick);
        }

        if(diverDepthInTicks+viewHeight/2>=197 &&diverDepthInTicks-viewHeight/2<=230){
            // Trenches (197 ticks and below)
            gradient(color(0, 0, 0), color(0, 0, 0), 197 * tick, 230*tick); // Black
        }
    pop();
}

//draws the skybox(i need to add clouds and a sun)
function skyBox(){
    push();
        translate(0, 0); 
        gradient(color(143, 242, 241), color(230, 176, 96), 0, viewHeight/2);
    pop();
}

function drawText(x, y, t, s){
    push();
        textAlign(CENTER, CENTER);
        textFont('Exo', s); // Set the font to Exo and size to 48
        fill(255); // Set fill color to white
        text(t, x, y);
    pop();
    
}

function drawSub(x, y, rad){
    noStroke();
    fill(204, 83, 67);
    rect(x-.9*rad, y-.8*rad, 0.7*rad, rad, 0.1*rad);
    fill(0, 255, 255);
    circle(x, y, rad);
    fill(255, 255, 255);
    circle(x, y, .5*rad);
    fill(224, 151, 49);
    rect(x-rad, y-rad*.5, rad, rad, 0.1*rad);
    fill(219, 87, 31);
    rect(x-1.2*rad, y+.35*rad, rad*1.8, 0.2*rad, 0.1*rad);
    rect(x-1.2*rad, y, rad*1, 0.3*rad, 0.1*rad);
    rect(x-1.2*rad, y-0.35*rad, rad*1, 0.3*rad, 0.1*rad);
    fill(176, 159, 151);
    rect(x-1.2*rad, y-.5*rad, rad*1.8, 0.3*rad, 0.1*rad);
}

function drawRuler() {
    textAlign(LEFT, CENTER);
    strokeWeight(1);
    textFont('Exo', 20); 
    push();
        translate(0, viewHeight/2);
        stroke(255);
        fill(255);
        let inc = tick;
        let currentInc = 0;
        for (let i = 0; i < maxDepthTick; i += inc) {
            if (currentInc % 10 === 0) {
                line(10, i, 40, i); 
                text(currentInc*100 + ' ft', 50, i + 5);
            } else {
                line(10, i, 25, i); 
            }
            currentInc++;
            
        }
        //draws the last depth
        line(10, maxDepthTick, 40, maxDepthTick); 
        textFont('Exo');
        text(36201 + ' ft', 50, maxDepthTick + 5);
    pop();
}
