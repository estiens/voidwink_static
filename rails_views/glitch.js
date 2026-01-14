// Utility functions
const utils = {
    // Get element(s) by selector (class or ID)
    getElements: function(selector) {
        if (typeof selector === 'string') {
            const elements = document.querySelectorAll(selector);
            return elements.length > 0 ? elements : null;
        }
        return null;
    },
    
    // Generate random integer between min and max (inclusive)
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Shuffle array using Fisher-Yates algorithm
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Create a debounce function to limit execution frequency
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Text Glitch Effects
const textGlitch = {
    // Character scramble effect
    characterScramble: function(selector, options = {}) {
        const defaults = {
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=',
            speed: 50,
            iterations: 10,
            finalText: null, // If null, will revert to original text
            onComplete: null
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            const originalText = element.textContent;
            const finalText = settings.finalText || originalText;
            const textLength = finalText.length;
            let iterationCount = 0;
            
            const scramble = () => {
                if (iterationCount >= settings.iterations) {
                    element.textContent = finalText;
                    if (typeof settings.onComplete === 'function') {
                        settings.onComplete(element);
                    }
                    return;
                }
                
                let scrambledText = '';
                for (let i = 0; i < textLength; i++) {
                    // Gradually reveal the final text
                    if (i < (textLength * (iterationCount / settings.iterations))) {
                        scrambledText += finalText[i];
                    } else {
                        scrambledText += settings.characters.charAt(
                            Math.floor(Math.random() * settings.characters.length)
                        );
                    }
                }
                
                element.textContent = scrambledText;
                iterationCount++;
                setTimeout(scramble, settings.speed);
            };
            
            scramble();
        });
    },
    
    // Glitch slice effect - creates a "sliced" text appearance
    glitchSlice: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            slices: 3,
            interval: 100,
            glitchChance: 0.3
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            // Store original text and styling
            const originalText = element.textContent;
            const originalHtml = element.innerHTML;
            const originalPosition = window.getComputedStyle(element).position;
            
            // Set position to relative if it's static
            if (originalPosition === 'static') {
                element.style.position = 'relative';
            }
            
            // Clear the element
            element.innerHTML = '';
            
            // Create slices
            for (let i = 0; i < settings.slices; i++) {
                const slice = document.createElement('div');
                slice.textContent = originalText;
                slice.style.position = 'absolute';
                slice.style.top = '0';
                slice.style.left = '0';
                slice.style.right = '0';
                slice.style.bottom = '0';
                slice.style.clip = `rect(${i * (100 / settings.slices)}% ${100}%, ${(i + 1) * (100 / settings.slices)}% ${100}%)`;
                slice.style.willChange = 'transform, opacity, filter';
                element.appendChild(slice);
            }
            
            const slices = element.children;
            let glitchInterval;
            let endTimeout;
            
            // Start glitching
            const startGlitch = () => {
                glitchInterval = setInterval(() => {
                    for (let i = 0; i < slices.length; i++) {
                        if (Math.random() < settings.glitchChance) {
                            const slice = slices[i];
                            const xShift = utils.randomInt(-10, 10);
                            const yShift = utils.randomInt(-2, 2);
                            const colorShift = utils.randomInt(0, 10);
                            
                            slice.style.transform = `translate(${xShift}px, ${yShift}px)`;
                            slice.style.filter = `hue-rotate(${colorShift}deg) saturate(${utils.randomInt(80, 150)}%)`;
                            slice.style.opacity = utils.randomInt(80, 100) / 100;
                        }
                    }
                }, settings.interval);
                
                // End glitching after duration
                endTimeout = setTimeout(() => {
                    clearInterval(glitchInterval);
                    element.innerHTML = originalHtml;
                    if (originalPosition === 'static') {
                        element.style.position = originalPosition;
                    }
                }, settings.duration);
            };
            
            startGlitch();
            
            // Return a function to stop the effect early if needed
            return function stopGlitch() {
                clearInterval(glitchInterval);
                clearTimeout(endTimeout);
                element.innerHTML = originalHtml;
                if (originalPosition === 'static') {
                    element.style.position = originalPosition;
                }
            };
        });
    },
    
    // Text distortion effect
    distortion: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            intensity: 0.5,
            speed: 50,
            chars: '!<>-_\\/[]{}—=+*^?#________'
        };
        
        const settings = {...defaults, ...options};
        let elements;
        
        // Handle both selector strings and DOM elements
        if (typeof selector === 'string') {
            elements = utils.getElements(selector);
        } else if (selector instanceof Element) {
            elements = [selector];
        } else {
            return;
        }
        
        if (!elements) return;
        
        elements.forEach(element => {
            const originalText = element.textContent;
            const textLength = originalText.length;
            let interval;
            let endTimeout;
            
            // Create spans for each character
            element.innerHTML = originalText.split('').map(char => {
                return `<span data-char="${char}">${char}</span>`;
            }).join('');
            
            const spans = element.querySelectorAll('span');
            
            // Start distortion
            const startDistortion = () => {
                interval = setInterval(() => {
                    spans.forEach((span, index) => {
                        if (Math.random() < settings.intensity) {
                            span.textContent = settings.chars.charAt(
                                Math.floor(Math.random() * settings.chars.length)
                            );
                        } else {
                            span.textContent = span.dataset.char;
                        }
                    });
                }, settings.speed);
                
                // End distortion after duration
                endTimeout = setTimeout(() => {
                    clearInterval(interval);
                    spans.forEach(span => {
                        span.textContent = span.dataset.char;
                    });
                }, settings.duration);
            };
            
            startDistortion();
            
            // Return a function to stop the effect early if needed
            return function stopDistortion() {
                clearInterval(interval);
                clearTimeout(endTimeout);
                spans.forEach(span => {
                    span.textContent = span.dataset.char;
                });
            };
        });
    },
    
    // RGB split effect
    rgbSplit: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            intensity: 5,
            interval: 50
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            const originalHtml = element.innerHTML;
            const originalPosition = window.getComputedStyle(element).position;
            
            // Set position to relative if it's static
            if (originalPosition === 'static') {
                element.style.position = 'relative';
            }
            
            // Create RGB layers
            const text = element.textContent;
            element.innerHTML = '';
            
            const redLayer = document.createElement('div');
            redLayer.textContent = text;
            redLayer.style.position = 'absolute';
            redLayer.style.top = '0';
            redLayer.style.left = '0';
            redLayer.style.color = 'red';
            redLayer.style.mixBlendMode = 'screen';
            redLayer.style.willChange = 'transform';
            
            const greenLayer = document.createElement('div');
            greenLayer.textContent = text;
            greenLayer.style.position = 'absolute';
            greenLayer.style.top = '0';
            greenLayer.style.left = '0';
            greenLayer.style.color = 'green';
            greenLayer.style.mixBlendMode = 'screen';
            greenLayer.style.willChange = 'transform';
            
            const blueLayer = document.createElement('div');
            blueLayer.textContent = text;
            blueLayer.style.position = 'absolute';
            blueLayer.style.top = '0';
            blueLayer.style.left = '0';
            blueLayer.style.color = 'blue';
            blueLayer.style.mixBlendMode = 'screen';
            blueLayer.style.willChange = 'transform';
            
            element.appendChild(redLayer);
            element.appendChild(greenLayer);
            element.appendChild(blueLayer);
            
            let interval;
            let endTimeout;
            
            // Start RGB split
            const startRgbSplit = () => {
                interval = setInterval(() => {
                    const redX = utils.randomInt(-settings.intensity, settings.intensity);
                    const redY = utils.randomInt(-settings.intensity, settings.intensity);
                    const greenX = utils.randomInt(-settings.intensity, settings.intensity);
                    const greenY = utils.randomInt(-settings.intensity, settings.intensity);
                    const blueX = utils.randomInt(-settings.intensity, settings.intensity);
                    const blueY = utils.randomInt(-settings.intensity, settings.intensity);
                    
                    redLayer.style.transform = `translate(${redX}px, ${redY}px)`;
                    greenLayer.style.transform = `translate(${greenX}px, ${greenY}px)`;
                    blueLayer.style.transform = `translate(${blueX}px, ${blueY}px)`;
                }, settings.interval);
                
                // End RGB split after duration
                endTimeout = setTimeout(() => {
                    clearInterval(interval);
                    element.innerHTML = originalHtml;
                    if (originalPosition === 'static') {
                        element.style.position = originalPosition;
                    }
                }, settings.duration);
            };
            
            startRgbSplit();
            
            // Return a function to stop the effect early if needed
            return function stopRgbSplit() {
                clearInterval(interval);
                clearTimeout(endTimeout);
                element.innerHTML = originalHtml;
                if (originalPosition === 'static') {
                    element.style.position = originalPosition;
                }
            };
        });
    }
};

// Image Glitch Effects
const imageGlitch = {
    // Glitch slice effect for images
    sliceGlitch: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            slices: 10,
            interval: 100,
            glitchChance: 0.3
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            if (element.tagName !== 'IMG') return;
            
            const originalSrc = element.src;
            const originalStyle = element.getAttribute('style') || '';
            const container = document.createElement('div');
            
            // Set up container
            container.style.position = 'relative';
            container.style.width = element.width + 'px';
            container.style.height = element.height + 'px';
            container.style.overflow = 'hidden';
            
            element.parentNode.insertBefore(container, element);
            element.style.display = 'none';
            
            // Create slices
            for (let i = 0; i < settings.slices; i++) {
                const slice = document.createElement('div');
                slice.style.position = 'absolute';
                slice.style.top = '0';
                slice.style.left = '0';
                slice.style.width = '100%';
                slice.style.height = (100 / settings.slices) + '%';
                slice.style.backgroundImage = `url(${originalSrc})`;
                slice.style.backgroundSize = '100% ' + (settings.slices * 100) + '%';
                slice.style.backgroundPosition = '0 ' + (-i * 100) + '%';
                slice.style.transform = 'translateX(0)';
                slice.style.top = (i * (100 / settings.slices)) + '%';
                slice.style.willChange = 'transform, filter';
                
                container.appendChild(slice);
            }
            
            const slices = container.children;
            let glitchInterval;
            let endTimeout;
            
            // Start glitching
            const startGlitch = () => {
                glitchInterval = setInterval(() => {
                    for (let i = 0; i < slices.length; i++) {
                        if (Math.random() < settings.glitchChance) {
                            const slice = slices[i];
                            const xShift = utils.randomInt(-20, 20);
                            const colorShift = utils.randomInt(0, 360);
                            
                            slice.style.transform = `translateX(${xShift}px)`;
                            slice.style.filter = `hue-rotate(${colorShift}deg)`;
                        } else {
                            slices[i].style.transform = 'translateX(0)';
                            slices[i].style.filter = 'none';
                        }
                    }
                }, settings.interval);
                
                // End glitching after duration
                endTimeout = setTimeout(() => {
                    clearInterval(glitchInterval);
                    element.style.display = '';
                    element.setAttribute('style', originalStyle);
                    container.remove();
                }, settings.duration);
            };
            
            startGlitch();
            
            // Return a function to stop the effect early if needed
            return function stopGlitch() {
                clearInterval(glitchInterval);
                clearTimeout(endTimeout);
                element.style.display = '';
                element.setAttribute('style', originalStyle);
                container.remove();
            };
        });
    },
    
    // RGB split effect for images
    rgbSplit: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            intensity: 5,
            interval: 50
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            if (element.tagName !== 'IMG') return;
            
            const originalSrc = element.src;
            const originalStyle = element.getAttribute('style') || '';
            const container = document.createElement('div');
            
            // Set up container
            container.style.position = 'relative';
            container.style.width = element.width + 'px';
            container.style.height = element.height + 'px';
            
            element.parentNode.insertBefore(container, element);
            element.style.display = 'none';
            
            // Create RGB layers
            const redLayer = document.createElement('div');
            redLayer.style.position = 'absolute';
            redLayer.style.top = '0';
            redLayer.style.left = '0';
            redLayer.style.width = '100%';
            redLayer.style.height = '100%';
            redLayer.style.backgroundImage = `url(${originalSrc})`;
            redLayer.style.backgroundSize = 'cover';
            redLayer.style.mixBlendMode = 'screen';
            redLayer.style.filter = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'red\'><feColorMatrix type=\'matrix\' values=\'1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\'/></filter></svg>#red")';
            redLayer.style.willChange = 'transform';
            
            const greenLayer = document.createElement('div');
            greenLayer.style.position = 'absolute';
            greenLayer.style.top = '0';
            greenLayer.style.left = '0';
            greenLayer.style.width = '100%';
            greenLayer.style.height = '100%';
            greenLayer.style.backgroundImage = `url(${originalSrc})`;
            greenLayer.style.backgroundSize = 'cover';
            greenLayer.style.mixBlendMode = 'screen';
            greenLayer.style.filter = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'green\'><feColorMatrix type=\'matrix\' values=\'0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0\'/></filter></svg>#green")';
            greenLayer.style.willChange = 'transform';
            
            const blueLayer = document.createElement('div');
            blueLayer.style.position = 'absolute';
            blueLayer.style.top = '0';
            blueLayer.style.left = '0';
            blueLayer.style.width = '100%';
            blueLayer.style.height = '100%';
            blueLayer.style.backgroundImage = `url(${originalSrc})`;
            blueLayer.style.backgroundSize = 'cover';
            blueLayer.style.mixBlendMode = 'screen';
            blueLayer.style.filter = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'blue\'><feColorMatrix type=\'matrix\' values=\'0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0\'/></filter></svg>#blue")';
            blueLayer.style.willChange = 'transform';
            
            container.appendChild(redLayer);
            container.appendChild(greenLayer);
            container.appendChild(blueLayer);
            
            let interval;
            let endTimeout;
            
            // Start RGB split
            const startRgbSplit = () => {
                interval = setInterval(() => {
                    const redX = utils.randomInt(-settings.intensity, settings.intensity);
                    const redY = utils.randomInt(-settings.intensity, settings.intensity);
                    const greenX = utils.randomInt(-settings.intensity, settings.intensity);
                    const greenY = utils.randomInt(-settings.intensity, settings.intensity);
                    const blueX = utils.randomInt(-settings.intensity, settings.intensity);
                    const blueY = utils.randomInt(-settings.intensity, settings.intensity);
                    
                    redLayer.style.transform = `translate(${redX}px, ${redY}px)`;
                    greenLayer.style.transform = `translate(${greenX}px, ${greenY}px)`;
                    blueLayer.style.transform = `translate(${blueX}px, ${blueY}px)`;
                }, settings.interval);
                
                // End RGB split after duration
                endTimeout = setTimeout(() => {
                    clearInterval(interval);
                    element.style.display = '';
                    element.setAttribute('style', originalStyle);
                    container.remove();
                }, settings.duration);
            };
            
            startRgbSplit();
            
            // Return a function to stop the effect early if needed
            return function stopRgbSplit() {
                clearInterval(interval);
                clearTimeout(endTimeout);
                element.style.display = '';
                element.setAttribute('style', originalStyle);
                container.remove();
            };
        });
    },
    
    // Noise overlay effect for images
    noiseOverlay: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            opacity: 0.2,
            grainSize: 1
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            if (element.tagName !== 'IMG') return;
            
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';
            
            // Wrap the image
            element.parentNode.insertBefore(container, element);
            container.appendChild(element);
            
            // Create noise canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = element.offsetWidth;
            canvas.height = element.offsetHeight;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.opacity = settings.opacity;
            canvas.style.mixBlendMode = 'overlay';
            
            container.appendChild(canvas);
            
            // Generate noise
            const generateNoise = () => {
                const imageData = ctx.createImageData(canvas.width, canvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    // Skip pixels based on grain size
                    if (i % (settings.grainSize * 4) !== 0) continue;
                    
                    const value = Math.random() * 255;
                    
                    // Set RGBA values
                    data[i] = value;
                    data[i + 1] = value;
                    data[i + 2] = value;
                    data[i + 3] = 255;
                    
                    // Fill in skipped pixels for grain size > 1
                    for (let j = 1; j < settings.grainSize && i + j * 4 < data.length; j++) {
                        data[i + j * 4] = value;
                        data[i + j * 4 + 1] = value;
                        data[i + j * 4 + 2] = value;
                        data[i + j * 4 + 3] = 255;
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
            };
            
            generateNoise();
            
            // Remove noise after duration
            const endTimeout = setTimeout(() => {
                canvas.remove();
                // Unwrap the image
                container.parentNode.insertBefore(element, container);
                container.remove();
            }, settings.duration);
            
            // Return a function to stop the effect early if needed
            return function stopNoise() {
                clearTimeout(endTimeout);
                canvas.remove();
                container.parentNode.insertBefore(element, container);
                container.remove();
            };
        });
    }
};

// Randomness Functions
const randomness = {
    // Random hyperlink - redirects to one of several URLs randomly
    randomLink: function(selector, options = {}) {
        const defaults = {
            urls: [],
            probabilities: null, // If null, equal probability for all URLs
            newTab: false
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements || !settings.urls.length) return;
        
        elements.forEach(element => {
            // Store original href if it exists
            const originalHref = element.getAttribute('href');
            
            // Add click event listener
            element.addEventListener('click', function(e) {
                e.preventDefault();
                
                let selectedUrl;
                
                // If probabilities are provided, use them
                if (settings.probabilities && settings.probabilities.length === settings.urls.length) {
                    // Normalize probabilities to sum to 1
                    const sum = settings.probabilities.reduce((a, b) => a + b, 0);
                    const normalizedProbs = settings.probabilities.map(p => p / sum);
                    
                    // Cumulative distribution function
                    const cdf = [];
                    let cumulative = 0;
                    
                    for (let i = 0; i < normalizedProbs.length; i++) {
                        cumulative += normalizedProbs[i];
                        cdf.push(cumulative);
                    }
                    
                    // Select URL based on probabilities
                    const rand = Math.random();
                    for (let i = 0; i < cdf.length; i++) {
                        if (rand <= cdf[i]) {
                            selectedUrl = settings.urls[i];
                            break;
                        }
                    }
                } else {
                    // Equal probability for all URLs
                    const randomIndex = Math.floor(Math.random() * settings.urls.length);
                    selectedUrl = settings.urls[randomIndex];
                }
                
                // Navigate to the selected URL
                if (settings.newTab) {
                    window.open(selectedUrl, '_blank');
                } else {
                    window.location.href = selectedUrl;
                }
            });
            
            // If the element is not an anchor, make it look like one
            if (element.tagName !== 'A') {
                element.style.cursor = 'pointer';
                element.style.textDecoration = 'underline';
            }
        });
    },
    
    // Random search - redirects to a random search result for a given query
    randomSearch: function(selector, options = {}) {
        const defaults = {
            query: '',
            searchEngine: 'google', // google, bing, duckduckgo
            resultCount: 20,
            newTab: true
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements || !settings.query) return;
        
        elements.forEach(element => {
            // Add click event listener
            element.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Construct search URL based on engine
                let searchUrl;
                const randomPage = Math.floor(Math.random() * settings.resultCount) + 1;
                
                switch (settings.searchEngine.toLowerCase()) {
                    case 'google':
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(settings.query)}&start=${(randomPage - 1) * 10}`;
                        break;
                    case 'bing':
                        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(settings.query)}&first=${(randomPage - 1) * 10 + 1}`;
                        break;
                    case 'duckduckgo':
                        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(settings.query)}`;
                        break;
                    default:
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(settings.query)}`;
                }
                
                // Navigate to the search URL
                if (settings.newTab) {
                    window.open(searchUrl, '_blank');
                } else {
                    window.location.href = searchUrl;
                }
            });
            
            // If the element is not an anchor, make it look like one
            if (element.tagName !== 'A') {
                element.style.cursor = 'pointer';
                element.style.textDecoration = 'underline';
            }
        });
    },
    
    // Random word - displays a random word from an array
    randomWord: function(selector, options = {}) {
        const defaults = {
            words: [],
            interval: null, // If null, changes only on page load or manual trigger
            changeOnClick: false
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements || !settings.words.length) return;
        
        elements.forEach(element => {
            const originalContent = element.innerHTML;
            
            // Function to set a random word
            const setRandomWord = () => {
                const randomIndex = Math.floor(Math.random() * settings.words.length);
                element.textContent = settings.words[randomIndex];
            };
            
            // Set initial random word
            setRandomWord();
            
            // Set up interval if specified
            let intervalId;
            if (settings.interval) {
                intervalId = setInterval(setRandomWord, settings.interval);
            }
            
            // Set up click handler if specified
            if (settings.changeOnClick) {
                element.style.cursor = 'pointer';
                element.addEventListener('click', setRandomWord);
            }
            
            // Return a function to stop the effect and restore original content
            return function stopRandomWord() {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                
                if (settings.changeOnClick) {
                    element.removeEventListener('click', setRandomWord);
                }
                
                element.innerHTML = originalContent;
            };
        });
    },
    
    // Random position - randomly changes the position of elements
    randomPosition: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            interval: 200,
            radius: 10, // Maximum distance in pixels
            resetAfter: true
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            // Store original position and styling
            const originalPosition = window.getComputedStyle(element).position;
            const originalTop = window.getComputedStyle(element).top;
            const originalLeft = window.getComputedStyle(element).left;
            const originalTransform = window.getComputedStyle(element).transform;
            
            // Set position to relative if it's static
            if (originalPosition === 'static') {
                element.style.position = 'relative';
            }
            
            let intervalId;
            let endTimeout;
            
            // Start random positioning
            const startRandomPosition = () => {
                intervalId = setInterval(() => {
                    const xOffset = utils.randomInt(-settings.radius, settings.radius);
                    const yOffset = utils.randomInt(-settings.radius, settings.radius);
                    
                    element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                }, settings.interval);
                
                // End random positioning after duration
                if (settings.resetAfter) {
                    endTimeout = setTimeout(() => {
                        clearInterval(intervalId);
                        element.style.position = originalPosition;
                        element.style.top = originalTop;
                        element.style.left = originalLeft;
                        element.style.transform = originalTransform;
                    }, settings.duration);
                }
            };
            
            startRandomPosition();
            
            // Return a function to stop the effect early if needed
            return function stopRandomPosition() {
                clearInterval(intervalId);
                clearTimeout(endTimeout);
                
                if (settings.resetAfter) {
                    element.style.position = originalPosition;
                    element.style.top = originalTop;
                    element.style.left = originalLeft;
                    element.style.transform = originalTransform;
                }
            };
        });
    },
    
    // Random opacity - randomly changes the opacity of elements
    randomOpacity: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            interval: 100,
            minOpacity: 0.3,
            maxOpacity: 1,
            resetAfter: true
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            // Store original opacity
            const originalOpacity = window.getComputedStyle(element).opacity;
            
            let intervalId;
            let endTimeout;
            
            // Start random opacity
            const startRandomOpacity = () => {
                intervalId = setInterval(() => {
                    const opacity = settings.minOpacity + Math.random() * (settings.maxOpacity - settings.minOpacity);
                    element.style.opacity = opacity;
                }, settings.interval);
                
                // End random opacity after duration
                if (settings.resetAfter) {
                    endTimeout = setTimeout(() => {
                        clearInterval(intervalId);
                        element.style.opacity = originalOpacity;
                    }, settings.duration);
                }
            };
            
            startRandomOpacity();
            
            // Return a function to stop the effect early if needed
            return function stopRandomOpacity() {
                clearInterval(intervalId);
                clearTimeout(endTimeout);
                
                if (settings.resetAfter) {
                    element.style.opacity = originalOpacity;
                }
            };
        });
    },
    
    // Random color - randomly changes the color of elements
    randomColor: function(selector, options = {}) {
        const defaults = {
            duration: 2000,
            interval: 200,
            property: 'color', // color, backgroundColor, borderColor
            resetAfter: true
        };
        
        const settings = {...defaults, ...options};
        const elements = utils.getElements(selector);
        
        if (!elements) return;
        
        elements.forEach(element => {
            // Store original color
            const originalColor = window.getComputedStyle(element)[settings.property];
            
            let intervalId;
            let endTimeout;
            
            // Generate random color
            const randomColor = () => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgb(${r}, ${g}, ${b})`;
            };
            
            // Start random color
            const startRandomColor = () => {
                intervalId = setInterval(() => {
                    element.style[settings.property] = randomColor();
                }, settings.interval);
                
                // End random color after duration
                if (settings.resetAfter) {
                    endTimeout = setTimeout(() => {
                        clearInterval(intervalId);
                        element.style[settings.property] = originalColor;
                    }, settings.duration);
                }
            };
            
            startRandomColor();
            
            // Return a function to stop the effect early if needed
            return function stopRandomColor() {
                clearInterval(intervalId);
                clearTimeout(endTimeout);
                
                if (settings.resetAfter) {
                    element.style[settings.property] = originalColor;
                }
            };
        });
    }
};

// Export the main functionality
const GlitchRandom = {
    // Text Glitch Effects
    characterScramble: textGlitch.characterScramble,
    glitchSlice: textGlitch.glitchSlice,
    textDistortion: textGlitch.distortion,
    textRgbSplit: textGlitch.rgbSplit,
    
    // Image Glitch Effects
    imageSliceGlitch: imageGlitch.sliceGlitch,
    imageRgbSplit: imageGlitch.rgbSplit,
    imageNoiseOverlay: imageGlitch.noiseOverlay,
    
    // Randomness Functions
    randomLink: randomness.randomLink,
    randomSearch: randomness.randomSearch,
    randomWord: randomness.randomWord,
    randomPosition: randomness.randomPosition,
    randomOpacity: randomness.randomOpacity,
    randomColor: randomness.randomColor,
    
    // Utility Functions
    utils: utils
};

// Export for Rails importmaps
window.GlitchRandom = GlitchRandom;
export { GlitchRandom };
export default GlitchRandom;
