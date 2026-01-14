// =====================================================
// VOIDWINK - Main Interactive JavaScript
// Handles all interactive elements and easter eggs
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
  // Store interval/timeout IDs for cleanup
  const timerIds = [];

  // Helper to create cleanable timeouts
  const createTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timerIds.push(id);
    return id;
  };

  // Clean up function to handle page unload
  const cleanupTimers = () => {
    timerIds.forEach(id => clearTimeout(id));
  };

  // Add cleanup event
  window.addEventListener('unload', cleanupTimers);

  // ===================================================
  // WINK TEXT EASTER EGG - Replace all "wink" text
  // ===================================================
  function setupWinkEasterEgg() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const winkNodes = [];
    let node;

    while (node = walker.nextNode()) {
      const text = node.nodeValue.toLowerCase();
      if (text.includes('wink')) {
        winkNodes.push(node);
      }
    }

    winkNodes.forEach(node => {
      const parent = node.parentNode;

      // Skip if parent is already an anchor or has special attributes
      if (parent.tagName === 'A' || parent.hasAttribute('data-no-wink') ||
          parent.classList.contains('subtle-link') ||
          parent.classList.contains('subtle-link-asterisk')) {
        return;
      }

      const text = node.nodeValue;
      const regex = /\b(wink\w*)\b/gi;
      const matches = [...text.matchAll(regex)];

      if (matches.length === 0) return;

      let lastIndex = 0;
      const fragments = [];

      for (const match of matches) {
        if (match.index > lastIndex) {
          fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        const span = document.createElement('span');
        span.classList.add('wink-easter-egg');
        span.textContent = match[0];
        span.setAttribute('data-original', match[0]);
        span.setAttribute('data-toggle', 'Void Winks Back');

        // Click handler to toggle text
        span.addEventListener('click', function(e) {
          e.stopPropagation();
          const isToggled = this.getAttribute('data-toggled') === 'true';

          if (!isToggled) {
            this.textContent = this.getAttribute('data-toggle');
            this.setAttribute('data-toggled', 'true');
            this.classList.add('toggled');

            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'void-ripple';
            document.body.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            ripple.style.position = 'fixed';
            ripple.style.left = centerX + 'px';
            ripple.style.top = centerY + 'px';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.width = '2px';
            ripple.style.height = '2px';

            createTimeout(() => {
              ripple.style.width = '200px';
              ripple.style.height = '200px';
              ripple.style.opacity = '0';
            }, 10);

            createTimeout(() => {
              document.body.removeChild(ripple);
            }, 1000);
          } else {
            this.textContent = this.getAttribute('data-original');
            this.setAttribute('data-toggled', 'false');
            this.classList.remove('toggled');
          }
        });

        fragments.push(span);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        fragments.push(document.createTextNode(text.substring(lastIndex)));
      }

      const docFrag = document.createDocumentFragment();
      fragments.forEach(frag => docFrag.appendChild(frag));

      parent.replaceChild(docFrag, node);
    });
  }

  // Set up the wink easter egg
  setupWinkEasterEgg();

  // ===================================================
  // SIDEBAR NAVIGATION
  // ===================================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sections = document.querySelectorAll('.zine-section');
  const navLinks = document.querySelectorAll('.zine-nav-link');

  // Mobile menu toggle
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      this.innerHTML = sidebar.classList.contains('open') ? '<span class="blink">></span> CLOSE' : '<span class="blink">></span> MENU';
    });
  }

  // Close menu when clicking a link on mobile
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth < 768 && sidebar && mobileMenuToggle) {
        sidebar.classList.remove('open');
        mobileMenuToggle.innerHTML = '<span class="blink">></span> MENU';
      }

      // Smooth scroll to section
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 30,
          behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
      }
    });
  });

  // Throttle helper
  function throttle(callback, delay) {
    let isThrottled = false;
    let savedArgs = null;
    let savedThis = null;

    function wrapper() {
      if (isThrottled) {
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      callback.apply(this, arguments);
      isThrottled = true;

      setTimeout(function() {
        isThrottled = false;
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, delay);
    }

    return wrapper;
  }

  // Update active nav link based on scroll
  function setActiveNavLink() {
    let current = '';
    let scrollY = window.pageYOffset || document.documentElement.scrollTop;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;

      if (scrollY >= sectionTop - 100) {
        current = '#' + section.getAttribute('id');
      }
    }

    if (current) {
      for (let i = 0; i < navLinks.length; i++) {
        const link = navLinks[i];
        const isActive = link.getAttribute('href') === current;

        if (isActive && !link.classList.contains('active')) {
          link.classList.add('active');
        } else if (!isActive && link.classList.contains('active')) {
          link.classList.remove('active');
        }
      }
    }
  }

  const throttledSetActiveNavLink = throttle(setActiveNavLink, 100);
  setActiveNavLink();
  window.addEventListener('scroll', throttledSetActiveNavLink);

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
  // RANDOM GLITCH EFFECTS ON LOAD
  // ===================================================
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
    // Tooltips are handled by data-tooltip attribute in CSS
    // No need to add title attribute which creates the ? cursor
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
