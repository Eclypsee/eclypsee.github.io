//class file
//multiply speed*deltaTime/17
class Diver {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bubbles = [];
        this.unit = viewHeight/18;
    }

    display() {
        fill(0, 0, 255);
        this.drawBubbles();
        strokeWeight(0);

        //searchlight
        fill(255, 255, 0, 90);
        if (diverDepthInTicks > 170) {
            push();
                let correctedMouseY = mouseY + this.y - viewHeight / 2; // Correct the mouseY coordinate
                let ang = Math.atan2((correctedMouseY - this.y), (mouseX - this.x)); // Calculate the angle with the corrected coordinate
                
                translate(this.x, this.y);
                rotate(ang);
                triangle(0, 0, viewWidth, viewHeight/3, viewWidth, -viewHeight/3);
            pop();
        }

        //draws the diver's submarine
        drawSub(this.x, this.y, this.unit);
    }

    move() {
        
        if (this.y>10+viewHeight/2) {
            this.addBubble();
        }
        // Vertical movement with acceleration
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            diverSpeedY -= 0.1;
        } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
            diverSpeedY += 0.1;
        } else {
            diverSpeedY *= 0.95; // Deceleration
        }
        diverSpeedY = constrain(diverSpeedY, -maxSpeed, maxSpeed);
        this.y += diverSpeedY;

        //constrainst the diver y to below sea level
        this.y = constrain(this.y, viewHeight/2, gameHeight-viewHeight/2); 
        

        // Horizontal movement with acceleration
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            diverSpeedX -= 0.1;
        } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            diverSpeedX += 0.1;
        } else {
            diverSpeedX *= 0.95; // Deceleration
        }
        
        diverSpeedX = constrain(diverSpeedX, -maxSpeed, maxSpeed);
        this.x += diverSpeedX;
        this.x = constrain(this.x, viewWidth/6, 5*viewWidth/6);

        //fixes acceleration on edge collision
        if (this.x <= viewWidth/6 || this.x >= 5*viewWidth/6) {
            diverSpeedX = 0;  // Reset speed when hitting the edges
        }
        if (this.y <= viewHeight/2|| this.y >= gameHeight-viewHeight/2) {
            diverSpeedY = 0;  // Reset speed when hitting the edges
        }
       
    }

    addBubble() {
        let bubble = {
            x: random(this.x, this.x-this.unit),
            y: random(this.y+.3*this.unit, this.y-.5*this.unit),
            radius: random(5, 20), // You can adjust the range of the bubble sizes here
            opacity: 150 // Initial opacity
        };
        this.bubbles.push(bubble);

        // Optional: limit the number of bubbles to keep in the array to save memory
        if (this.bubbles.length > 30) { // You can adjust the max number of bubbles
            this.bubbles.shift();
        }
    }

    drawBubbles() {
        for (let i = 0; i < this.bubbles.length; i++) {
            let bubble = this.bubbles[i];
            fill(255, 255, 255, bubble.opacity);
            noStroke();
            ellipse(bubble.x, bubble.y, bubble.radius);

            // Update bubble position and opacity
            bubble.y -= 2*deltaTime/17; // Adjust the speed of the bubbles rising
            bubble.opacity -= 2*deltaTime/17; // Adjust how quickly the bubbles fade

            // Remove the bubble from the array if it is fully transparent
            if (bubble.opacity <= 0 || bubble.y<viewHeight/2) {
                this.bubbles.splice(i, 1);
                i--; // Adjust the index since we removed an element from the array
            }
        }
    }

}

class Bubble {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = random(50, 255);
        this.opacityChange = random(1, 3); // How fast the opacity changes
        this.speedx = random(-.1, .1);
        this.speedy = random(-.3, .3);
    }

    update() {
        this.opacity += this.opacityChange*deltaTime/17;
        if (this.opacity > 255 || this.opacity < 50) {
            this.opacityChange *= -1;
        }
        this.opacity = constrain(this.opacity, 50, 255);
        this.x+=this.speedx*deltaTime/17;
        this.y+=this.speedy*deltaTime/17;
    }

    display() {
        noStroke();
        fill(255, this.opacity);
        ellipse(this.x, this.y, this.size);
        if(this.y<viewHeight/2+this.size/2 || this.y>gameHeight){
            this.y = random(viewHeight/2+this.size/2, gameHeight);
        }
        if(this.x<0 || this.x>viewWidth){
            this.x = random(viewWidth);
        }
        
    }
}

class Typewriter {
    constructor(txt, typeSpeed, size) {
        this.txt = txt;
        this.x = 0;
        this.y = 0;
        this.typeSpeed = typeSpeed; // The number of frames per character when typing
        this.deleteSpeed = typeSpeed; // The number of frames per character when deleting
        this.cursorBlinkSpeed = 20; // The speed of the cursor blinking
        this.currentLength = 0; // The current length of the displayed text
        this.cursorVisible = true;
        this.frameCount = 0; // A frame counter to handle text and cursor animation speed
        this.del = false;
        this.size = size;
    }

    display() {
        textAlign(CENTER, CENTER);
        textFont('Exo', this.size);
        fill(255);
        stroke(255);
        this.frameCount++;
        
        if (!this.del) {
            if (this.frameCount % this.typeSpeed === 0 && this.currentLength < this.txt.length) {
                this.currentLength++;
            }
            if(this.del){
                this.frameCount = 0; // Reset frame count when starting to delete
            }
        } else if (this.frameCount % this.deleteSpeed === 0 && this.currentLength > 0) {
        this.currentLength--;
        }

        let displayedText = this.txt.substring(0, this.currentLength);

        let startX = this.x - textWidth(displayedText) / 2;

        text(displayedText, this.x, this.y);
        
        //cursor
        if (this.frameCount % this.cursorBlinkSpeed === 0) {
        this.cursorVisible = !this.cursorVisible;
        }
        if (this.cursorVisible && this.currentLength!=0 && this.currentLength!=this.txt.length) {
            strokeWeight(this.size/10);
            let cursorX = startX + textWidth(displayedText);
            line(cursorX, this.y - this.size/2, cursorX, this.y + this.size/2);
            strokeWeight(1);
        }
    }
}