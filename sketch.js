let season = 0; // 0: Sommer, 1: Herbst, 2: Winter, 3: Frühling
        let particles = [];
        let personX, personY;
        let snowLevel = 0;
        let snowThrowing = false;

        function setup() {
            createCanvas(windowWidth, windowHeight);
            background(135, 206, 235); // Himmelblau
            personX = width / 2;
            personY = height - 100;
        }

        function draw() {
            background(135, 206, 235);
            drawWeather();
            drawPerson();
            updateWeather();
            drawSnowLevel();
        }

        function drawPerson() {
            let x = personX;
            let y = personY;

            // Körper
            fill(255, 204, 0);
            rect(x - 20, y - 60, 40, 60);

            // Kopf
            fill(255, 220, 177);
            ellipse(x, y - 90, 40, 40);

            // Augen (normal)
            fill(0);
            ellipse(x - 10, y - 94, 6, 6);
            ellipse(x + 10, y - 94, 6, 6);

            // Mund (normal)
            noFill();
            stroke(0);
            arc(x, y - 84, 20, 10, 0, PI);

            if (season == 1 || season == 2 || season == 3) {
                // Augen (doof gucken)
                ellipse(x - 10, y - 94, 10, 10);
                ellipse(x + 10, y - 94, 10, 10);

                // Mund (doof gucken)
                line(x - 10, y - 80, x + 10, y - 80);
            }

            if (season == 1) {
                // Herbst - Regenschirm
                fill(0);
                rect(x - 5, y - 100, 10, 50); // Griff
                fill(0, 0, 0);
                arc(x, y - 100, 60, 60, PI, 0); // Schirm
            }
        }

        function drawWeather() {
            if (season == 0) {
                // Sommer - Sonne
                fill(255, 204, 0);
                ellipse(width - 100, 100, 80, 80); // Sonne

                for (let i = 0; i < 8; i++) {
                    let angle = PI / 4 * i;
                    let x = (width - 100) + cos(angle) * 60;
                    let y = 100 + sin(angle) * 60;
                    line(width - 100, 100, x, y);
                }
            }
        }

        function updateWeather() {
            if (season == 1) {
                // Herbst - Regen
                fill(0, 0, 255);
                if (frameCount % 2 == 0) {
                    let rain = { x: random(width), y: 0 };
                    particles.push(rain);
                }
                for (let i = particles.length - 1; i >= 0; i--) {
                    ellipse(particles[i].x, particles[i].y, 5, 10);
                    particles[i].y += 5;
                    if (particles[i].y > height) {
                        particles.splice(i, 1);
                    }
                }
            } else if (season == 2) {
                // Winter - Schnee
                fill(255);
                if (frameCount % 5 == 0) {
                    let snow = { x: random(width), y: 0 };
                    particles.push(snow);
                }
                for (let i = particles.length - 1; i >= 0; i--) {
                    ellipse(particles[i].x, particles[i].y, 5, 5);
                    particles[i].y += 2;
                    if (particles[i].y > height - snowLevel) {
                        snowLevel += 2;
                        particles.splice(i, 1);
                    }
                }
                if (snowLevel > 50 && !snowThrowing) {
                    snowThrowing = true;
                    throwSnow();
                }
            } else if (season == 3) {
                // Frühling - Wind
                fill(255);
                if (frameCount % 10 == 0) {
                    let leaf = { x: 0, y: random(height - 50) };
                    particles.push(leaf);
                }
                for (let i = particles.length - 1; i >= 0; i--) {
                    ellipse(particles[i].x, particles[i].y, 10, 5);
                    particles[i].x += 3;
                    if (particles[i].x > width) {
                        particles.splice(i, 1);
                    }
                }
                // Bewege das Männchen nach links
                personX += 1;
            } else {
                // Sommer - klares Wetter
                particles = [];
            }
        }

        function throwSnow() {
            for (let i = 0; i < 100; i++) {
                let snow = {
                    x: personX,
                    y: personY - 90,
                    vx: random(-5, 5),
                    vy: random(-5, 5)
                };
                particles.push(snow);
            }
        }

        function drawSnowLevel() {
            fill(255);
            rect(0, height - snowLevel, width, snowLevel);
        }

        function mousePressed() {
            season = (season + 1) % 4;
            if (season != 2) {
                snowLevel = 0;
                snowThrowing = false;
            }
        }
