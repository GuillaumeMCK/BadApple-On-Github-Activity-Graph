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
// Minified code
```

`hash: 0x0`

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
yt-dlp https://www.youtube.com/watch?v=FtutLA63Cp8 -o ./src/utils/badapple.webm
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
python3 ./src/utils/polyframes_extractor.py ./src/utils/assets/badapple.webm
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

