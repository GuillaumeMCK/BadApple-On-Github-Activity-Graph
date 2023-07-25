#!/usr/bin/env python3
import json
import sys

import cv2
import numpy as np


class PolygonFrame:
    def __init__(self, count, polygons, image):
        self.frame = count
        self.polygons = polygons
        self.image = image

    def show_image(self):
        canvas = np.zeros_like(self.image, dtype=np.uint8)
        for polygon in self.polygons:
            pts = np.array(polygon, np.int32)
            pts = pts.reshape((-1, 1, 2))
            cv2.polylines(canvas, [pts], isClosed=True, color=(0, 255, 0), thickness=2)
        result_frame = cv2.addWeighted(self.image, 0.0, canvas, 1.0, 0)
        cv2.imshow('frame', result_frame)

    def as_dict(self):
        return {"frame": self.frame, "polygons": self.polygons}


# Function to process a single frame and extract polygons
def process_frame(src: cv2.UMat, count: int, target_width: int, target_height: int) -> PolygonFrame:
    # Resize the frame to the target width and height
    resized_frame = cv2.resize(src, (target_width, target_height))

    # Convert the resized frame to grayscale
    gray_frame = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2GRAY)

    # Apply the Sobel operator to detect edges in both x and y directions
    gradient_x = cv2.Sobel(gray_frame, cv2.CV_64F, 1, 0, ksize=3)
    gradient_y = cv2.Sobel(gray_frame, cv2.CV_64F, 0, 1, ksize=3)
    gradient_magnitude = np.sqrt(gradient_x ** 2 + gradient_y ** 2)

    # Find contours in the gradient magnitude image
    _, binary_edges = cv2.threshold(gradient_magnitude, 90, 255, cv2.THRESH_BINARY)

    # Find contours in the binary image
    contours, _ = cv2.findContours(binary_edges.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Store the polygons as tuples
    polygons = [tuple(approx_poly.squeeze().tolist()) for contour in contours
                for approx_poly in [cv2.approxPolyDP(contour, .001 * cv2.arcLength(contour, True), True)]]
    # Filter out polygons with less than 3 points
    polygons = [polygon for polygon in polygons if len(polygon) > 3]
    # Create and return the Frame object with polygons and the resized image
    return PolygonFrame(count, polygons, resized_frame)


# Function to process a video and extract polygons for each frame
def process_video(video_path: str) -> list[PolygonFrame]:
    target_width = 282
    target_height = 246

    cap = cv2.VideoCapture(video_path)
    frames = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_obj = process_frame(frame, len(frames), target_width, target_height)
        frames.append(frame_obj)
        frame_obj.show_image()

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return frames


# Function to save Frame objects to a JSON file
def save_frames_to_json(frames: list[PolygonFrame], output_file: str):
    data = [frame.as_dict() for frame in frames]
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file)


# Testing the process_frame function with a sample image
def test_process_frame():
    sample_image_url = './sample_image.png'
    sample_image = cv2.imread(sample_image_url)
    frame = process_frame(sample_image, 0, 282, 246)
    print("Polygons for the sample image:")
    print(frame.polygons)
    frame.show_image()
    cv2.waitKey(0)


# Testing the process_video function with a sample video
def test_process_video():
    video_url = './badapple.webm'
    frames = process_video(video_url)
    print("Video processing complete. Saving to JSON file...")
    save_frames_to_json(frames, 'data.json')
    print("Saved to JSON file.")


# Run the testing functions
if __name__ == "__main__":
    if len(sys.argv) > 1:
        quit(0)
    test_process_frame()
    test_process_video()
    quit(0)
