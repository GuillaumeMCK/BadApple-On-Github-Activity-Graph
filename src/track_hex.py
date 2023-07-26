#!/usr/bin/env python3
import json

file_path = "./track.ogg"
output = 'data/track.json'


def ogg_to_json(input_file_path, output_file_path):
    with open(input_file_path, 'rb') as ogg_file:
        ogg_data = ogg_file.read()
        encoded_data = ogg_data.hex()

    data = {"hex": encoded_data}
    with open(output_file_path, 'w') as json_file:
        json.dump(data, json_file)


ogg_to_json(file_path, output)
