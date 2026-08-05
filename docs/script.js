/* ==========================================================================
   BraveType — Official Website Interactive JavaScript
   Author: Brave Studios
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Font Specimen Demo Widget Functionality
  const demoInput = document.getElementById('demo-text-input');
  const demoSlider = document.getElementById('demo-size-slider');
  const demoSizeValue = document.getElementById('demo-size-value');
  const specimenElements = document.querySelectorAll('.card-font-specimen');
  const pillButtons = document.querySelectorAll('.pill-btn');

  const PRESET_TEXTS = {
    Sentence: 'The quick brown fox jumps over the lazy dog',
    Heading: 'Create Stunning Digital Experiences',
    Alphabet: 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz',
    Numbers: '0 1 2 3 4 5 6 7 8 9   ! @ # $ % ^ & * ( )',
    Logo: 'ANTIGRAVITY DESIGN STUDIO',
    Button: 'Get Started Now',
    'Business Card': 'CREATIVE DIRECTOR — BRAVE STUDIOS'
  };

  // Update Font Size
  if (demoSlider && demoSizeValue) {
    demoSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      demoSizeValue.textContent = `${size}px`;
      specimenElements.forEach(el => {
        el.style.fontSize = `${size}px`;
      });
    });
  }

  // Update Custom Text Live
  if (demoInput) {
    demoInput.addEventListener('input', (e) => {
      const val = e.target.value;
      specimenElements.forEach(el => {
        el.textContent = val || 'The quick brown fox jumps over the lazy dog';
      });
    });
  }

  // Handle Preset Pills
  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      const text = PRESET_TEXTS[mode] || PRESET_TEXTS.Sentence;
      
      if (demoInput) {
        demoInput.value = text;
      }
      specimenElements.forEach(el => {
        el.textContent = text;
      });
    });
  });

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. Copy SHA256 Checksum Button
  const copyBtn = document.getElementById('copy-checksum-btn');
  const checksumText = document.getElementById('checksum-code');

  if (copyBtn && checksumText) {
    copyBtn.addEventListener('click', () => {
      const code = checksumText.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Copied!';
        copyBtn.style.backgroundColor = '#10B981';
        copyBtn.style.color = '#FFFFFF';
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }
});
