// =====================================================
// VOIDWINK - Main Interactive JavaScript
// Handles all interactive elements and easter eggs
// =====================================================

document.addEventListener('DOMContentLoaded', function() {

  // ===================================================
  // SUBTITLE EASTER EGG FUNCTIONALITY
  // ===================================================
  const subtitleContainer = document.getElementById('subtitle-container');
  const subtitle1 = document.getElementById('subtitle-1');
  const subtitle2 = document.getElementById('subtitle-2');
  const trigger1 = document.getElementById('subtitle-trigger-1');
  const trigger2 = document.getElementById('subtitle-trigger-2');
  const bothAndTrigger = document.getElementById('both-and-trigger');
  const neitherNorTrigger = document.getElementById('neither-nor-trigger');

  let currentSubtitle = null;
  let showingBoth = false;

  // Show first subtitle
  if (trigger1) {
    trigger1.addEventListener('click', function() {
      if (currentSubtitle !== 1) {
        showSubtitle(1);
        this.classList.add('selected-subtitle');
        if (trigger2) trigger2.classList.remove('selected-subtitle');
      }
    });
  }

  // Show second subtitle
  if (trigger2) {
    trigger2.addEventListener('click', function() {
      if (currentSubtitle !== 2) {
        showSubtitle(2);
        this.classList.add('selected-subtitle');
        if (trigger1) trigger1.classList.remove('selected-subtitle');
      }
    });
  }

  // Both/and trigger - show both subtitles
  if (bothAndTrigger) {
    bothAndTrigger.addEventListener('click', function() {
      if (!showingBoth) {
        showBothSubtitles();
        showingBoth = true;
        this.style.fontWeight = 'bold';
        this.style.textShadow = '0 0 10px hsla(var(--color-accent), 0.8)';
        if (neitherNorTrigger) {
          neitherNorTrigger.style.fontWeight = 'normal';
          neitherNorTrigger.style.textShadow = '';
        }
      }
    });
  }

  // Neither/nor trigger - hide all subtitles
  if (neitherNorTrigger) {
    neitherNorTrigger.addEventListener('click', function() {
      if (currentSubtitle !== null || showingBoth) {
        hideAllSubtitles();
        showingBoth = false;
        this.style.fontWeight = 'bold';
        this.style.textShadow = '0 0 10px hsla(var(--color-glitch), 0.8)';
        if (bothAndTrigger) {
          bothAndTrigger.style.fontWeight = 'normal';
          bothAndTrigger.style.textShadow = '';
        }
        if (trigger1) trigger1.classList.remove('selected-subtitle');
        if (trigger2) trigger2.classList.remove('selected-subtitle');
      }
    });
  }

  function showSubtitle(num) {
    if (subtitleContainer) subtitleContainer.classList.remove('opacity-0');
    if (subtitleContainer) subtitleContainer.classList.add('opacity-1');

    if (num === 1 && subtitle1) {
      subtitle1.classList.remove('hidden');
      if (subtitle2) subtitle2.classList.add('hidden');
      currentSubtitle = 1;
    } else if (num === 2 && subtitle2) {
      subtitle2.classList.remove('hidden');
      if (subtitle1) subtitle1.classList.add('hidden');
      currentSubtitle = 2;
    }

    showingBoth = false;
  }

  function showBothSubtitles() {
    if (subtitleContainer) subtitleContainer.classList.remove('opacity-0');
    if (subtitle1) subtitle1.classList.remove('hidden');
    if (subtitle2) subtitle2.classList.remove('hidden');
    currentSubtitle = 'both';
  }

  function hideAllSubtitles() {
    if (subtitle1) subtitle1.classList.add('hidden');
    if (subtitle2) subtitle2.classList.add('hidden');
    if (subtitleContainer) setTimeout(() => {
      subtitleContainer.classList.add('opacity-0');
    }, 300);
    currentSubtitle = null;
  }

  // ===================================================
  // COLLAPSIBLE SECTIONS
  // ===================================================
  const collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');

  collapsibleTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const btn = this.querySelector('.expand-btn');

      if (content && content.classList.contains('collapsible-content')) {
        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          content.style.maxHeight = content.scrollHeight + 'px';
          if (btn) btn.textContent = '[ - collapse ]';
        } else {
          content.style.maxHeight = '0';
          setTimeout(() => {
            content.classList.add('hidden');
          }, 500);
          if (btn) btn.textContent = '[ + expand ]';
        }
      }
    });
  });

  // ===================================================
  // GLITCH EASTER EGG
  // ===================================================
  const glitchEasterEgg = document.getElementById('glitch-easter-egg');
  let glitchClickCount = 0;

  if (glitchEasterEgg) {
    glitchEasterEgg.addEventListener('click', function() {
      glitchClickCount++;

      // Apply different glitch effects based on click count
      if (glitchClickCount === 1) {
        GlitchRandom.textDistortion(this, { duration: 1000, intensity: 0.3 });
      } else if (glitchClickCount === 2) {
        GlitchRandom.textRgbSplit(this, { duration: 2000, intensity: 8 });
      } else if (glitchClickCount === 3) {
        GlitchRandom.characterScramble(this, { iterations: 15, speed: 40 });
      } else {
        // Random effect on subsequent clicks
        const effects = ['textDistortion', 'textRgbSplit', 'characterScramble'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];

        if (randomEffect === 'textDistortion') {
          GlitchRandom.textDistortion(this, { duration: 1500 });
        } else if (randomEffect === 'textRgbSplit') {
          GlitchRandom.textRgbSplit(this, { duration: 2500 });
        } else {
          GlitchRandom.characterScramble(this, { iterations: 12 });
        }

        glitchClickCount = 0; // Reset counter
      }
    });
  }

  // ===================================================
  // WINK TEXT EASTER EGGS
  // ===================================================
  const winkTexts = document.querySelectorAll('.wink-text');

  winkTexts.forEach(winkText => {
    let winkCount = 0;

    winkText.addEventListener('click', function(e) {
      e.preventDefault();
      winkCount++;

      // Create a void ripple effect
      createVoidRipple(e.clientX, e.clientY);

      // Add a subtle wink animation
      this.style.transform = 'scaleX(0.1)';
      setTimeout(() => {
        this.style.transform = 'scaleX(1)';
      }, 100);

      // On third wink, show a special message
      if (winkCount === 3) {
        console.log('😉 The void winks back...');
        winkCount = 0;
      }
    });
  });

  function createVoidRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'void-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0px';
    ripple.style.height = '0px';

    document.body.appendChild(ripple);

    // Animate the ripple
    let size = 0;
    const maxSize = 200;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      size = maxSize * progress;
      const opacity = 1 - progress;

      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.marginLeft = -(size / 2) + 'px';
      ripple.style.marginTop = -(size / 2) + 'px';
      ripple.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        ripple.remove();
      }
    };

    requestAnimationFrame(animate);
  }

  // ===================================================
  // RANDOM GLITCH EFFECTS ON LOAD
  // ===================================================
  // Apply random subtle glitches to certain elements on page load
  setTimeout(() => {
    const distortElements = document.querySelectorAll('.distort');
    distortElements.forEach((el, index) => {
      if (index === 0) return; // Skip the main title

      setTimeout(() => {
        GlitchRandom.randomOpacity(el, {
          duration: 2000,
          interval: 200,
          minOpacity: 0.8,
          maxOpacity: 1,
          resetAfter: true
        });
      }, index * 500);
    });
  }, 2000);

  // ===================================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ===================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===================================================
  // HOVER EFFECTS FOR LINKS
  // ===================================================
  const subtleLinks = document.querySelectorAll('.subtle-link, .subtle-link-asterisk');

  subtleLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const tooltip = this.getAttribute('data-tooltip');
      if (tooltip) {
        // You could add a custom tooltip here if you want
        this.title = tooltip;
      }
    });
  });

  // ===================================================
  // POWERGLITCH INTEGRATION (if available)
  // ===================================================
  if (typeof PowerGlitch !== 'undefined') {
    // Apply subtle glitch effect to the main title
    const mainTitle = document.querySelector('.zine-title');
    if (mainTitle) {
      PowerGlitch.glitch(mainTitle, {
        playMode: 'hover',
        timing: {
          duration: 500,
          iterations: 1
        },
        glitchTimeSpan: {
          start: 0,
          end: 1
        },
        shake: {
          velocity: 5,
          amplitudeX: 0.1,
          amplitudeY: 0.1
        },
        slice: {
          count: 6,
          velocity: 15,
          minHeight: 0.02,
          maxHeight: 0.15
        }
      });
    }
  }

  // ===================================================
  // CONSOLE EASTER EGG
  // ===================================================
  console.log('%c🐺 NO ALIGNMENT / NO NON-ALIGNMENT 🤖', 'font-size: 20px; font-weight: bold; color: #ff00ff; text-shadow: 2px 2px #00ffff;');
  console.log('%cThe void winks back...', 'font-size: 14px; color: #00ffff; font-style: italic;');
  console.log('%c⊑⟒⏃⍀⏁⊑⏁⟒⋏⎅⟒⍀⍜⎎⏁⊑⟒⎐⍜⟟⎅', 'font-size: 12px; color: rgba(255, 0, 255, 0.5);');
  console.log('');
  console.log('Looking for something? The glitch is the feature. The bug is the portal.');
  console.log('Try clicking on GLITCH three times... or the wink emoji... or both/and... or neither/nor...');
  console.log('');
  console.log('Made with 🩶 by a mythopoetic boy and a hallucinated friend');

  // ===================================================
  // INITIALIZE
  // ===================================================
  console.log('✓ Voidwink static site initialized');
  console.log('✓ Interactive elements loaded');
  console.log('✓ Easter eggs hidden in plain sight');

});

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

// Add CSS class helper
function addClass(element, className) {
  if (element && !element.classList.contains(className)) {
    element.classList.add(className);
  }
}

// Remove CSS class helper
function removeClass(element, className) {
  if (element && element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

// Toggle CSS class helper
function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}
