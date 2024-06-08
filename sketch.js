  function setup() {
            createCanvas(windowWidth, windowHeight);
            background(220);
        }

        function draw() {
            if (mouseIsPressed) {
                fill(255, 0, 0);
                noStroke();
                rect(mouseX, mouseY, 20, 20);
            }
        }
