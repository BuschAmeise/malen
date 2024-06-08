  let season = 0; // 0: Sommer, 1: Herbst, 2: Winter, 3: Frühling
        let particles = [];
        let personX, personY;
        let snowParticles = [];
        let snowThrowing = false;
        let jumpScareTriggered = false;
        let jumpScareSize = 0;
        let audioContext, oscillator, gainNode, noiseBuffer, noiseSource;

        function setup() {
            createCanvas(windowWidth, windowHeight);
            background(135, 206, 235); // Himmelblau
            personX = width / 2;
            personY = height - 100;

            // Audio Setup
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'square'; // Schrillerer Ton
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // Frequenz für schrillen Ton

            // Noise Setup
            noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
            let output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseBuffer.length; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        }

        function draw() {
            if (!jumpScareTriggered) {
                background(135, 206, 235);
                drawWeather();
                drawPerson();
                updateWeather();
                drawSnow();
            } else {
                background(0);
                drawScaryFace();
                jumpScareSize += 20; // Vergrößern Sie das Bild mit jeder Frame

                if (audioContext.currentTime > jumpScareEndTime) {
                    stopJumpScareSound();
                    noLoop();
                }
            }
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
                    snowParticles.push(snow);
                }
                for (let i = snowParticles.length - 1; i >= 0; i--) {
                    ellipse(snowParticles[i].x, snowParticles[i].y, 5, 5);
                    snowParticles[i].y += 2;
                    if (snowParticles[i].y > height - 5 || isSnowOnSnow(snowParticles[i])) {
                        snowParticles[i].y -= 2;
                    }
                }
                if (snowParticles.length > 50 && !snowThrowing) {
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
                personX -= 1;
                if (personX < -40) {
                    triggerJumpScare();
                }
            } else {
                // Sommer - klares Wetter
                particles = [];
            }
        }

        function isSnowOnSnow(snow) {
            for (let i = 0; i < snowParticles.length; i++) {
                if (snowParticles[i] !== snow && dist(snow.x, snow.y, snowParticles[i].x, snowParticles[i].y) < 5) {
                    return true;
                }
            }
            return false;
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

        function drawSnow() {
            fill(255);
            for (let i = 0; i < snowParticles.length; i++) {
                ellipse(snowParticles[i].x, snowParticles[i].y, 5, 5);
            }
        }

        function triggerJumpScare() {
            jumpScareTriggered = true;
            startJumpScareSound();
            jumpScareEndTime = audioContext.currentTime + 2; // Ton für 2 Sekunden
            audioContext.resume();
        }

        function startJumpScareSound() {
            // Start oscillator
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);

            // Start noise
            noiseSource = audioContext.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            let noiseGain = audioContext.createGain();
            noiseSource.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            noiseGain.gain.setValueAtTime(0.5, audioContext.currentTime);
            noiseSource.start();
        }

        function stopJumpScareSound() {
            oscillator.stop();
            noiseSource.stop();
        }

        function drawScaryFace() {
            let x = width / 2;
            let y = height / 2;

            // Kopf
            fill(0, 0, 0);
            ellipse(x, y, jumpScareSize, jumpScareSize);

            // Augen (doof gucken)
            fill(255);
            ellipse(x - jumpScareSize * 0.1, y - jumpScareSize * 0.1, jumpScareSize * 0.1, jumpScareSize * 0.1);
            ellipse(x + jumpScareSize * 0.1, y - jumpScareSize * 0.1, jumpScareSize * 0.1, jumpScareSize * 0.1);

            // Mund (doof gucken)
            stroke(255);
            strokeWeight(4);
            line(x - jumpScareSize * 0.1, y + jumpScareSize * 0.1, x + jumpScareSize * 0.1, y + jumpScareSize * 0.1);
        }

        function mousePressed() {
            season = (season + 1) % 4;
            if (season != 2) {
                snowParticles = [];
                snowThrowing = false;
            }
        }
