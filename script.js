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

    function animate() {
        ctx.clearRect(0, 0, width, height);

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
