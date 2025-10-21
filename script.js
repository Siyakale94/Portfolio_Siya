/* cursor light */
const cursorLight = document.querySelector('.cursor-light');
document.addEventListener('mousemove', (e) => {
  cursorLight.style.left = `${e.clientX}px`;
  cursorLight.style.top  = `${e.clientY}px`;
});

/* simple intersection reveal for .slide-up elements (already animates via CSS) */
const slides = document.querySelectorAll('.slide-up');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
slides.forEach(s => obs.observe(s));

/* FORM HANDLING */
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const toast = document.getElementById('formToast');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  // basic client-side validation
  if (!payload.name || !payload.email || !payload.message) {
    showToast('Please fill all fields.');
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Message';
    return;
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send message');
    }

    // success
    form.reset();
    showToast('Thank you — your message was sent.');
  } catch (err) {
    console.error('Contact error:', err);
    showToast('Could not send message. Try again later.');
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Message';
  }
});

function showToast(text){
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 3500);
}
/* ===============================
   Subtle Tech Particle Background
   =============================== */
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('particle-background').appendChild(canvas);

let particles = [];
const particleCount = 60;
const maxDistance = 120;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Generate particles
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3, // slow, subtle movement
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.5 + 0.5,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw particles
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.8)'; // soft cyan-blue glow
    ctx.fill();
  }

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = 1 - distance / maxDistance;
        ctx.strokeStyle = `rgba(0, 150, 255, ${opacity * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Move particles slowly
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  }

  requestAnimationFrame(drawParticles);
}

drawParticles();

