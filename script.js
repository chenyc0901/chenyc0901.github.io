const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            if (nav.classList.contains('nav-active')) {
                document.querySelector('.burger').click();
            }

            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Biotech & Bioinformatics Background Animation
const canvas = document.getElementById('bioCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // DNA Helix Properties
    const helixConfig = {
        strandColor: 'rgba(0, 95, 115, 0.4)',
        basePairColor: 'rgba(10, 147, 150, 0.3)',
        particleCount: 80,
        radius: 0, // dynamic
        speed: 0.02
    };

    class Particle {
        constructor(x, y, layer) {
            this.x = x;
            this.y = y;
            this.layer = layer; // 0 or 1 for two strands
            this.angle = (y / height) * Math.PI * 4; // Initial angle based on y position (2 turns)
            this.baseX = x;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            // Move in a sine wave pattern to simulate helix rotation
            this.angle += helixConfig.speed;

            // Calculate X based on sine wave
            const offset = Math.sin(this.angle + (this.layer * Math.PI)) * helixConfig.radius;
            this.x = this.baseX + offset;

            // Scale size for 3D effect
            const scale = (Math.cos(this.angle + (this.layer * Math.PI)) + 2) / 3;
            this.currentSize = this.size * scale;
            this.opacity = scale * 0.8;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
            ctx.fillStyle = helixConfig.strandColor;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Network Nodes (Bioinformatics/Data)
    let nodes = [];
    const nodeConfig = {
        count: 40,
        connectionDistance: 100
    };

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(238, 155, 0, 0.6)'; // Accent color
            ctx.fill();
        }
    }

    // Binary Streams (Bioinformatics)
    let binaryStreams = [];
    class BinaryStream {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.speed = Math.random() * 1 + 0.5;
            this.value = Math.random() > 0.5 ? '1' : '0';
            this.fontSize = Math.random() * 10 + 10;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.y += this.speed;
            if (this.y > height) {
                this.y = 0;
                this.x = Math.random() * width;
                this.value = Math.random() > 0.5 ? '1' : '0';
            }
        }

        draw() {
            ctx.font = `${this.fontSize}px monospace`;
            ctx.fillStyle = `rgba(10, 147, 150, ${this.opacity})`;
            ctx.fillText(this.value, this.x, this.y);
        }
    }

    // Molecules (Molecular Biology)
    let molecules = [];
    class Molecule {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 15 + 5;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.spin;

            if (this.x < -50 || this.x > width + 50) this.vx *= -1;
            if (this.y < -50 || this.y > height + 50) this.vy *= -1;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.strokeStyle = 'rgba(238, 155, 0, 0.15)'; // Faint accent
            ctx.lineWidth = 2;
            ctx.beginPath();
            // Draw hexagon
            for (let i = 0; i < 6; i++) {
                const angle = i * Math.PI / 3;
                const hx = Math.cos(angle) * this.size;
                const hy = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();
            // Center atom
            ctx.fillStyle = 'rgba(238, 155, 0, 0.1)';
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);

        // precise init of particles for DNA
        particles = [];
        const step = height / helixConfig.particleCount;
        for (let i = 0; i < helixConfig.particleCount; i++) {
            const y = i * step;
            // Strand 1
            particles.push(new Particle(width * 0.2, y, 0)); // Left helix
            particles.push(new Particle(width * 0.2, y, 1));

            // Strand 2 (mirror or separate) - Let's do one big one in the back
            // Or maybe floating nodes everywhere else
        }

        // Init floating nodes
        nodes = [];
        for (let i = 0; i < nodeConfig.count; i++) {
            nodes.push(new Node());
        }

        // Init Binary Streams
        binaryStreams = [];
        for (let i = 0; i < 20; i++) {
            binaryStreams.push(new BinaryStream());
        }

        // Init Molecules
        molecules = [];
        for (let i = 0; i < 10; i++) {
            molecules.push(new Molecule());
        }

        animate();
    }

    function resize() {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        helixConfig.radius = width * 0.1;
        if (helixConfig.radius > 100) helixConfig.radius = 100;

        // Re-center DNA particles if needed
        particles.forEach(p => {
            p.baseX = width * 0.15; // Keep it to the left side mostly
        });
    }

    function connectNodes() {
        for (let a = 0; a < nodes.length; a++) {
            for (let b = a + 1; b < nodes.length; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < nodeConfig.connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(10, 147, 150, ${0.15 - dist / nodeConfig.connectionDistance * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(nodes[a].x, nodes[a].y);
                    ctx.lineTo(nodes[b].x, nodes[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawDNAConnections() {
        // Connect paired particles occasionally to simulate base pairs
        for (let i = 0; i < particles.length; i += 2) {
            const p1 = particles[i];
            const p2 = particles[i + 1];

            // Simple interaction: connect if they are close enough horizontally? 
            // Actually they are pairs by index.

            ctx.beginPath();
            ctx.strokeStyle = helixConfig.basePairColor;
            // Calculate opacity based on their average scale (depth)
            const avgScale = (p1.opacity + p2.opacity) / 2;
            ctx.globalAlpha = avgScale * 0.3;
            ctx.lineWidth = 2 * avgScale;

            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    function drawComputer() {
        const x = width * 0.8;
        const y = height * 0.5;
        const size = Math.min(width, height) * 0.15; // Responsive size

        ctx.strokeStyle = 'rgba(0, 95, 115, 0.6)'; // Primary color
        ctx.lineWidth = 2;

        // Monitor
        ctx.beginPath();
        const screenWidth = size * 1.6;
        const screenHeight = size;
        ctx.rect(x - screenWidth / 2, y - screenHeight / 2, screenWidth, screenHeight);
        ctx.stroke();

        // Screen Content (Code lines)
        ctx.fillStyle = 'rgba(10, 147, 150, 0.2)'; // Secondary color
        ctx.fillRect(x - screenWidth / 2 + 5, y - screenHeight / 2 + 5, screenWidth - 10, screenHeight - 10);

        ctx.fillStyle = 'rgba(0, 95, 115, 0.4)';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(x - screenWidth / 2 + 15, y - screenHeight / 2 + 20 + i * 15, screenWidth * 0.6, 4);
            ctx.fillRect(x - screenWidth / 2 + 15, y - screenHeight / 2 + 28 + i * 15, screenWidth * 0.4, 4);
        }

        // Stand
        ctx.beginPath();
        ctx.moveTo(x, y + screenHeight / 2);
        ctx.lineTo(x, y + screenHeight / 2 + size * 0.3);
        ctx.moveTo(x - size * 0.4, y + screenHeight / 2 + size * 0.3);
        ctx.lineTo(x + size * 0.4, y + screenHeight / 2 + size * 0.3);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Computer
        drawComputer();

        // Draw Binary Streams
        binaryStreams.forEach(b => {
            b.update();
            b.draw();
        });

        // Draw Molecules
        molecules.forEach(m => {
            m.update();
            m.draw();
        });

        // Draw DNA
        drawDNAConnections();
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw Network Nodes
        connectNodes();
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        requestAnimationFrame(animate);
    }

    init();
}
