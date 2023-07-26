# BadApple-On-Github-Activity-Graph

![Unicorn Approved](https://img.shields.io/badge/Unicorn-Approved-ff69b4.svg)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> A single line of code to play the iconic `Bad Apple!! 🍎` animation on your GitHub activity graph!

<div align="center" style="margin: 40px auto">
    <img src="https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/" width="600" alt="Bad Apple!! on Github Activity Graph"/>
    <p>Feel free to use, modify, and share this code as you wish! 🚀</p>
</div>

## How to run it

### Run it on your profile

1. Copy the minified code provided below or
   from [here](https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/badapple.min.js).

```js
const svg=document.querySelector(".js-activity-overview-graph");const svgPath=svg.querySelector("path");const existingEllipses=svg.querySelectorAll("ellipse");const frameDelay=1000/30;let originalSvgData;let frameIndex=0;let animationIntervalId;let animationStarted=false;const develop=false;const framesSrc=develop?"data/frames.json":"https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/data/frames.json";const audioSrc=develop?"data/track.ogg":"https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/data/track.ogg";async function fetchAnimationData(){try{if(!fetchAnimationData.cachedData){const response=await fetch(framesSrc);fetchAnimationData.cachedData=await response.json();};return fetchAnimationData.cachedData;}catch(error){console.error("Error reading frames.json:",error);}};async function fetchAudioData(){try{if(!fetchAudioData.cachedData){const response=await fetch(audioSrc);fetchAudioData.cachedData=await response.arrayBuffer();};return fetchAudioData.cachedData;}catch(error){console.error("Error reading track.ogg:",error);}};function getPathFromPolygons(polygons){return polygons.map(polygon=>`M${polygon.join(" L")}Z`).join(" ");};function updateFrame(frame){svgPath.setAttribute("d",getPathFromPolygons(frame.polygons));};function onAnimationFinish(){clearInterval(animationIntervalId);svg.parentNode.replaceChild(originalSvgData.cloneNode(true),svg);console.log("Animation finished!");animationStarted=false;};function playFrames(data){updateFrame(data[frameIndex]);frameIndex=(frameIndex+1)%data.length;if(frameIndex===0){onAnimationFinish();}};function initializeAnimation(){console.log('%c Bad Apple!! 🍎','background: #222; color: white; font-size: 24px; padding: 10px; border-radius: 5px;');if(!originalSvgData){originalSvgData=svg.cloneNode(true);};runAnimation();};async function runAnimation(){const audio=await loadAudio();const animation=await loadAnimation();audio.start();await animation();};async function loadAnimation(){const data=await fetchAnimationData();async function startAnimation(){if(!animationStarted){const transform=svg.querySelector("g").getCTM().inverse();svgPath.setAttribute("transform",`translate(${transform.e},${transform.f})`);svgPath.setAttribute("stroke-width",".5");existingEllipses.forEach(ellipse=>(ellipse.style.display="none"));animationStarted=true;animationIntervalId=setInterval(()=>playFrames(data),frameDelay);}};return startAnimation;};async function loadAudio(gainValue=0.25){try{const audioCtx=new(window.AudioContext||window.webkitAudioContext)();const audioData=await fetchAudioData();const decodedData=await audioCtx.decodeAudioData(audioData);const source=audioCtx.createBufferSource();source.buffer=decodedData;const gainNode=audioCtx.createGain();gainNode.gain.value=gainValue;source.connect(gainNode);gainNode.connect(audioCtx.destination);return source;}catch(error){console.error("Error loading audio:",error);throw error;}};initializeAnimation();
```

`SHA-256: 8a62817e70eb4dd3f8391233c5da7e586ef87d7e9a0d22ab01221c1bffc81dc5`

2. Go to your GitHub profile page and open the developer console (Ctrl+Shift+I or F12).
3. Paste the code into the console and press Enter.

### Run it from local

1. Clone this repository. `git clone https://github.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph.git`
2. Open the `index.html` file stored in the `src` folder.

## How it Works

### Getting the Audio & Video Data manually

In my case I use the [yt-dlp](https://github.com/yt-dlp/yt-dlp) tool to download the video and ffmpeg to extract the
audio track. </br>

- the video is saved in the `src/utils/assets` folder as `badapple.webm` to be processed later.
- the audio track is saved in the `src/data` folder as `track.ogg` to be used by the animation.

```bash
yt-dlp https://www.youtube.com/watch?v=FtutLA63Cp8 -o ./src/utils/assets/badapple.webm
ffmpeg -i ./src/utils/badapple.webm -vn -q:a 4 ./src/data/track.ogg
```

### Converting the Video to SVG paths

We process the video using edge detection (*Sobel operator*) and contour finding technique (*thresholding*)
to extracts polygon points. After iterating over all the frames, we save all polygons in a JSON file.

- the JSON file is saved in the `src/data` folder as `frames.json` to be used by the animation.

**Requirements**

- [OpenCV](https://pypi.org/project/opencv-python/)
- [Numpy](https://pypi.org/project/numpy/)

```bash
cd ./src/utils
python3 polyframe_extractor.py ./assets/badapple.webm 
```

### Playing the Animation

Just a simple DOM manipulation to change the path of the SVG element synchronously with the audio track and
original video frames rate.

```js
const svg = document.querySelector(".js-activity-overview-graph");
const svgPath = svg.querySelector("path");
...

function getPathFromPolygons(polygons) {
    return polygons.map(polygon => `M${polygon.join(" L")} Z`).join(" ");
}
```

## Minified Code

**Requirements**

- [jsmin](https://pypi.org/project/jsmin/)

```bash
cd ./src/utils
python3 minify.py
```

## Credits

Audio & Animation Data: [Bad Apple!!](https://www.youtube.com/watch?v=FtutLA63Cp8)

