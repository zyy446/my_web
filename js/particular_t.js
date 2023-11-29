(function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, 100, 100);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleNum = (window.outerHeight * window.outerWidth) / 20000;
    const lineDistance = (window.outerHeight * window.outerWidth) / 5500;
    // const colorRGB = '125, 125, 125';
    let particles = [];
    let interactionParticle = null;

    class Particle {
        constructor(x, y, velocityX, velocityY, size, color) {
            this.x = x;
            this.y = y;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

        }
        update() {
            if (this.x < 0 || this.x > canvas.width) {
                this.velocityX *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.velocityY *= -1;
            }
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.draw();
        }
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createParticles() {
        for (let i = 0; i < particleNum; i++) {
            let size = getRandomArbitrary(3, 3);
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let velocityX = getRandomArbitrary(-1, 1);
            let velocityY = getRandomArbitrary(-1, 1);
            let color = 'rgba(0,125,125,0.667)';
            particles.push(new Particle(x, y, velocityX, velocityY, size, color));
        }
    }

    function calculate(x1, x2, y1, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                let distance = calculate(p1.x, p2.x, p1.y, p2.y);
                if (distance < lineDistance) {
                    ctx.beginPath();
                    var opacity = 1 - distance / lineDistance;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = .8;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
        });
        connect();
    }

    function bindEvents() {
        canvas.addEventListener('mouseover', e => {
            if (!interactionParticle) {
                interactionParticle = new Particle(e.x, e.y, 0, 0, 2, 'rgba(${colorRGB}, 1)');
                particles.push(interactionParticle);
            }
        });
        canvas.addEventListener('onmouseover', e => {
            interactionParticle.x = e.x;
            interactionParticle.y = e.y;
            for (let i = 0; i < particles.length - 1; i++) {
                p1_x = particles[i].x;
                p1_y = particles[i].y;
                p2_x = interactionParticle.x;
                p2_y = interactionParticle.y;
                let distance = calculate(p1_x, p2_x, p1_y, p2_y);
                if (distance < lineDistance && distance > lineDistance - 10) {
                    particles[i].velocityX = (p2_x - p1_x) / (lineDistance - 20);
                    particles[i].velocityY = (p2_y - p1_y) / (lineDistance - 20);
                    if (distance < lineDistance - 10) {
                        particles[i].velocityX *= -1;
                        particles[i].velocityY *= -1;
                    }
                }
            }
        });
        canvas.addEventListener('mousemove', e => {
            interactionParticle.x = e.x;
            interactionParticle.y = e.y;
            for (let i = 0; i < particles.length - 1; i++) {
                p1_x = particles[i].x;
                p1_y = particles[i].y;
                p2_x = interactionParticle.x;
                p2_y = interactionParticle.y;
                let distance = calculate(p1_x, p2_x, p1_y, p2_y);
                if (distance < lineDistance - 20) {
                    particles[i].velocityX = ((p2_x - p1_x) / (lineDistance - 20)) * getRandomArbitrary(0, 1);
                    particles[i].velocityY = ((p2_y - p1_y) / (lineDistance - 20)) * getRandomArbitrary(0, 1);
                }
                if (distance > lineDistance - 20 && distance < lineDistance) {
                    particles[i].velocityX = getRandomArbitrary(-1, 1);
                    particles[i].velocityY = getRandomArbitrary(-1, 1);
                }
            }
        });

        canvas.addEventListener('mouseout', e => {
            interactionParticle.x = null;
            interactionParticle.y = null;
        });
    }

    function cir() {

    }

    cir();
    bindEvents();
    createParticles();
    animate();
}());