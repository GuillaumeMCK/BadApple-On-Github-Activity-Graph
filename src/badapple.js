/**
 * Get the SVG element for the activity overview graph and its child elements.
 */
const svg = document.querySelector(".js-activity-overview-graph");
const svgPath = svg.querySelector("path");
const existingEllipses = svg.querySelectorAll("ellipse");
const frameDelay = 1000 / 30;

// Variables to hold animation data and state
let originalSvgData;
let frameIndex = 0;
let animationIntervalId;
let animationStarted = false;

// Development mode flag and data sources
const develop = false;
const framesSrc = develop ? "data/frames.json" : "https://raw.githubusercontent.com/GuillaumeMCK/BadApple/main/src/data/frames.json";
const audioSrc = develop ? "data/track.json" : "https://raw.githubusercontent.com/GuillaumeMCK/BadApple/main/src/data/track.json";

/**
 * Fetches the animation data from the specified data source (local or remote).
 * @returns {Promise} A Promise that resolves to the animation data.
 */
async function fetchAnimationData() {
    try {
        if (!fetchAnimationData.cachedData) {
            const response = await fetch(framesSrc);
            fetchAnimationData.cachedData = await response.json();
        }
        return fetchAnimationData.cachedData;
    } catch (error) {
        console.error("Error reading frames.json:", error);
    }
}


/**
 * Fetches the audio data from the specified data source (local or remote).
 * @returns {Promise} A Promise that resolves to the audio data.
 */
async function fetchAudioData() {
    try {
        if (!fetchAudioData.cachedData) {
            const response = await fetch(audioSrc);
            fetchAudioData.cachedData = await response.json();
        }
        return fetchAudioData.cachedData;
    } catch (error) {
        console.error("Error reading track.json:", error);
    }
}


/**
 * Converts the polygon data into an SVG path string.
 * @param {Array} polygons - The array of polygons representing the SVG path.
 * @returns {string} The SVG path string.
 */
function getPathFromPolygons(polygons) {
    return polygons.map(polygon => `M${polygon.join(" L")} Z`).join(" ");
}

/**
 * Updates the SVG path and its transformation matrix based on the given frame data.
 * @param {Object} frame - The frame data containing polygons to update the SVG path.
 */
function updateFrame(frame) {
    const transform = svg.querySelector("g").getCTM().inverse();
    svgPath.setAttribute("d", getPathFromPolygons(frame.polygons));
    svgPath.setAttribute("transform", `translate(${transform.e}, ${transform.f})`);
}

/**
 * Handles the finish of the animation by cleaning up and restoring the original SVG.
 */
function onAnimationFinish() {
    clearInterval(animationIntervalId);
    svg.parentNode.replaceChild(originalSvgData.cloneNode(true), svg);
    console.log("Animation finished!");
    animationStarted = false;

    // Remove event listeners
    document.removeEventListener("keypress", handleKeyPress);
    document.removeEventListener("click", handleKeyPress);
}

/**
 * Plays a single frame of the animation based on the provided data.
 * @param {Array} data - The array of frames containing polygon data for the animation.
 */
function playFrames(data) {
    updateFrame(data[frameIndex]);
    frameIndex = (frameIndex + 1) % data.length;
    if (frameIndex === 0) {
        onAnimationFinish();
    }
}

/**
 * Initializes the animation by cloning the original SVG and preparing the event listeners.
 */
function initializeAnimation() {
    console.log('%c Bad Apple!! 🍎', 'background: #222; color: white; font-size: 24px; padding: 10px; border-radius: 5px;');

    if (!originalSvgData) {
        originalSvgData = svg.cloneNode(true);
    }

    runAnimation();
}

/**
 * Runs the animation by initializing it and starting the audio and animation.
 */
async function runAnimation() {
    const audio = await loadAudio();
    const animation = await loadAnimation();
    audio.start();
    await animation();
}

/**
 * Loads the animation data and returns a function to start the animation.
 * @returns {Function} A function to start the animation.
 */
async function loadAnimation() {
    const data = await fetchAnimationData()

    async function startAnimation() {
        if (!animationStarted) {
            existingEllipses.forEach(ellipse => (ellipse.style.display = "none"));
            animationStarted = true;
            animationIntervalId = setInterval(() => playFrames(data), frameDelay);
        }

    }

    return startAnimation;
}

/**
 * Loads the audio track for the animation.
 * @returns {Promise} A Promise that resolves to the audio source object.
 */
function loadAudio() {
    return new Promise((resolve, reject) => {
        fetchAudioData().then(data => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const buffer = new Uint8Array(data.hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            audioCtx.decodeAudioData(buffer.buffer, function (decodedData) {
                const source = audioCtx.createBufferSource();
                source.buffer = decodedData;

                const gainNode = audioCtx.createGain();
                gainNode.gain.value = 0.25;
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                resolve(source);
            }).catch(e => reject(e));
        }).catch((error) => console.error("Error reading track.json:", error));
    });
}

initializeAnimation();