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
