# BadApple-On-Github-Activity-Graph


> A single line of code to play the iconic `Bad Apple!! 🍎` animation on your GitHub activity graph!

<div align="center" style="margin: 40px auto">
    <img src="https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/.github/demo.gif" width="600" alt="Bad Apple!! on Github Activity Graph"/>
    <p>Feel free to use, modify, and share this code as you wish! 🚀</p>
</div>

## How to run it

### Run it from local

1. Clone this repository. `git clone https://github.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph.git`
2. Open the `index.html` file stored in the `src` folder.

### Run it on your profile

1. Copy the minified code provided below or
   from [here](https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/badapple.min.js).

```js
var a=document.querySelector(".js-activity-overview-graph"),b=a.querySelector("path"),c=a.querySelectorAll("ellipse"),d,e=0,f,g=!1,h=!1,i=h?"data/frames.json":"https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/data/frames.json",j=h?"data/track.ogg":"https://raw.githubusercontent.com/GuillaumeMCK/BadApple-On-Github-Activity-Graph/main/src/data/track.ogg",k=1000/30;async function l(){try {if(!l.cachedData){var A=await fetch(i);l.cachedData=await A.json()}return l.cachedData} catch (_) {console.error("Error reading frames.json:",_)}}async function m(){try {if(!m.cachedData){var A=await fetch(j);m.cachedData=await A.arrayBuffer()}return m.cachedData} catch (_) {console.error("Error reading track.ogg:",_)}}function n(A){return A.map(polygon=>`M${polygon.join(" L")} Z`).join(" ")}function o(A){b.setAttribute("d",n(A.polygons))}function p(){clearInterval(f);a.parentNode.replaceChild(d.cloneNode(!0),a);console.log("Animation finished!");g=!1}function q(A){o(A[e]);e=(e+1)%A.length;!e&&p()}function r(){console.log('%c Bad Apple!! 🍎','background: #222; color: white; font-size: 24px; padding: 10px; border-radius: 5px;');!d&&(d=a.cloneNode(!0));s()}async function s(){if(!g){g=!0;var[A,_]=await Promise.all([m(),l()]),B=await u(A);t();B.start();f=setInterval(()=>q(_),k)}}function t(){var A=a.querySelector("g").getCTM().inverse();b.setAttribute("transform",`translate(${A.e+8}, ${A.f})`);b.setAttribute("stroke-width",".5");for(const _ of c)(_.style.display="none")}async function u(A,_=0.25){try {var B=new (window.AudioContext||window.webkitAudioContext)(),C=await B.decodeAudioData(A),_c=B.createBufferSource(),D=B.createGain();_c.buffer=C;D.gain.value=_;_c.connect(D);D.connect(B.destination);return _c} catch (_a) {console.error("Error loading audio:",_a);throw _a}}r();
```

`SHA-256: 64ab9ed59d42d0c0c8c7161ff7511a97f2d5b6b32518e047115f7adfe5f5a2ef`

2. Go to your GitHub profile page and open the developer console (Ctrl+Shift+I or F12).
3. Paste the code into the console and press Enter.
4. Enjoy the show! 🍿


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

Code minified using [minify](https://www.npmjs.com/package/minify).

```bash
cd ./src
minify badapple.js > badapple.min.js 
```

## Credits

Audio & Animation Data: [Bad Apple!!](https://www.youtube.com/watch?v=FtutLA63Cp8)

