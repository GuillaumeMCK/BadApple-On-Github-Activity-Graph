// Get the SVG element for the activity overview graph and its child elements.
const svg = document.querySelector(".js-activity-overview-graph");
const svgPath = svg.querySelector("path");
const existingEllipses = svg.querySelectorAll("ellipse");

// Variables to hold animation data and state
let originalSvgData;
let frameIndex = 0;
let animationIntervalId;
let animationStarted = false;

// Development mode flag and data sources
const develop = false;
const framesSrc = develop ? "data/frames.json" : "https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/data/frames.json";
const audioSrc = develop ? "data/track.ogg" : "https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/data/track.ogg";

// Animation settings
const frameDelay = 1000 / 30;

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
            fetchAudioData.cachedData = await response.arrayBuffer();
        }
        return fetchAudioData.cachedData;
    } catch (error) {
        console.error("Error reading track.ogg:", error);
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
    svgPath.setAttribute("d", getPathFromPolygons(frame.polygons));
}

/**
 * Handles the finish of the animation by cleaning up and restoring the original SVG.
 */
function onAnimationFinish() {
    clearInterval(animationIntervalId);
    svg.parentNode.replaceChild(originalSvgData.cloneNode(true), svg);
    console.log("Animation finished!");
    animationStarted = false;
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
    if (!animationStarted) {
        animationStarted = true;
        const [audioData, animationData] = await Promise.all([
            fetchAudioData(),
            fetchAnimationData()
        ]);
        clearSvg();
        const audio = await loadAudio(audioData);
        audio.start();
        animationIntervalId = setInterval(() => playFrames(animationData), frameDelay);
    }
}

/**
 * Clear the SVG by removing the ellipses and setting the stroke width to 0.5.
 */
function clearSvg() {
    const transform = svg.querySelector("g").getCTM().inverse();
    svgPath.setAttribute("transform", `translate(${transform.e + 8}, ${transform.f})`);
    svgPath.setAttribute("stroke-width", ".5");
    existingEllipses.forEach(ellipse => (ellipse.style.display = "none"));
}

/**
 * Loads the audio data for the animation.
 * @param {ArrayBuffer} audioData - The audio data to be loaded.
 * @param {number} gainValue - The gain value for controlling the volume (between 0 and 1).
 * @returns {Promise<AudioBufferSourceNode>} A Promise that resolves to the audio source object.
 */
async function loadAudio(audioData, gainValue = 0.25) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const decodedData = await audioCtx.decodeAudioData(audioData);
        const source = audioCtx.createBufferSource();
        source.buffer = decodedData;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = gainValue;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        return source;
    } catch (error) {
        console.error("Error loading audio:", error);
        throw error;
    }
}

initializeAnimation();