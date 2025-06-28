(function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleNum = Math.floor((canvas.width * canvas.height) / 30000);
    const lineDistance = 150;
    const particles = [];
    let interactionParticle = null;

    // 吸引模式：true=吸引，false=排斥
    let attractMode = true;

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
            if (this.x <= 0 || this.x >= canvas.width) this.velocityX *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.velocityY *= -1;

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
            const size = getRandomArbitrary(2, 4);
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const velocityX = getRandomArbitrary(-0.5, 0.5);
            const velocityY = getRandomArbitrary(-0.5, 0.5);
            const color = 'rgba(0,125,125,0.667)';
            particles.push(new Particle(x, y, velocityX, velocityY, size, color));
        }
    }

    function calculateDistance(p1, p2) {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const distance = calculateDistance(p1, p2);
                if (distance < lineDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,125,125,${1 - distance / lineDistance})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function applyInteraction() {
        if (!interactionParticle) return;

        particles.forEach(p => {
            if (p !== interactionParticle) {
                const dx = interactionParticle.x - p.x;
                const dy = interactionParticle.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < lineDistance) {
                    const force = (lineDistance - distance) / lineDistance * 0.5;
                    const fx = dx / distance * force;
                    const fy = dy / distance * force;

                    // 根据吸引模式调整
                    if (attractMode) {
                        p.velocityX += fx;
                        p.velocityY += fy;
                    } else {
                        p.velocityX -= fx;
                        p.velocityY -= fy;
                    }

                    // 速度限制
                    const maxSpeed = 2;
                    p.velocityX = Math.max(Math.min(p.velocityX, maxSpeed), -maxSpeed);
                    p.velocityY = Math.max(Math.min(p.velocityY, maxSpeed), -maxSpeed);

                    // 添加摩擦
                    p.velocityX *= 0.95;
                    p.velocityY *= 0.95;
                }
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        connectParticles();
        applyInteraction();
        requestAnimationFrame(animate);
    }

    function bindEvents() {
        canvas.addEventListener('mousemove', e => {
            if (!interactionParticle) {
                interactionParticle = new Particle(e.clientX, e.clientY, 0, 0, 4, 'rgba(255,0,0,1)');
                particles.push(interactionParticle);
            } else {
                interactionParticle.x = e.clientX;
                interactionParticle.y = e.clientY;
            }
        });

        canvas.addEventListener('mouseout', () => {
            if (interactionParticle) {
                particles.pop();
                interactionParticle = null;
            }
        });

        // 切换吸引 / 排斥模式（按空格键切换）
        window.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                attractMode = !attractMode;
                console.log(`Interaction mode: ${attractMode ? "Attract" : "Repel"}`);
            }
        });
    }

    // 初始化
    createParticles();
    bindEvents();
    animate();

    let items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let intervalId = setInterval(next, 3000);

    // const fileInput = document.getElementById('file-input');
    // const addBtn = document.getElementById('add-image-btn');

    // addBtn.addEventListener('click', () => {
    //     fileInput.click(); // 点击按钮时，触发文件选择
    // });

    function updateCarousel() {
        const total = items.length;

        items.forEach((item, index) => {
            const relativeIndex = (index - currentIndex + total) % total;

            // 初始化
            item.style.transition = 'all 0.8s ease';
            item.style.opacity = '0';
            item.style.transform = 'translate(-50%, -50%) scale(0.7)';
            item.style.zIndex = '0';

            if (relativeIndex === 0) {
                // 左侧
                item.style.opacity = '0.5';
                item.style.transform = 'translate(-150%, -50%) scale(0.85)';
                item.style.zIndex = '1';
            } else if (relativeIndex === 1) {
                // 中间
                item.style.opacity = '1';
                item.style.transform = 'translate(-50%, -50%) scale(1)';
                item.style.zIndex = '2';
            } else if (relativeIndex === 2) {
                // 右侧
                item.style.opacity = '0.5';
                item.style.transform = 'translate(50%, -50%) scale(0.85)';
                item.style.zIndex = '1';
            }
            // 其他保持隐藏
        });
    }

    // items.forEach(item => {
    //     item.addEventListener('mouseenter', () => {
    //         clearInterval(intervalId); // ✅ 停止轮播
    //     });

    //     item.addEventListener('mouseleave', () => {
    //         resetInterval(); // ✅ 恢复轮播
    //     });
    // });

    function next() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    // 左右按钮点击事件
    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(next, 3000);
    }

    document.querySelector('.carousel-button.left').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
        resetInterval();
    });

    document.querySelector('.carousel-button.right').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
        resetInterval();
    });

    // fileInput.addEventListener('change', (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = function (e) {
    //             const imageUrl = e.target.result;

    //             const newItem = document.createElement('div');
    //             newItem.classList.add('carousel-item');
    //             newItem.innerHTML = `<img src="${imageUrl}" alt="New Pic">`;

    //             document.querySelector('.carousel').appendChild(newItem);

    //             // 更新 items
    //             items = document.querySelectorAll('.carousel-item');

    //             // 添加 hover 事件
    //             newItem.addEventListener('mouseenter', () => {
    //                 clearInterval(intervalId);
    //             });
    //             newItem.addEventListener('mouseleave', () => {
    //                 resetInterval();
    //             });

    //             updateCarousel(); // 更新轮播显示
    //         };
    //         reader.readAsDataURL(file); // 读取本地文件为DataURL
    //     }

    //     // 清空 input，否则选择同一个文件后不会触发 change
    //     fileInput.value = '';
    // });


    updateCarousel();
    window.addEventListener('resize', updateCarousel);

})();


