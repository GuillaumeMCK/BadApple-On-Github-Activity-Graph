from jsmin import jsmin

with open('../badapple.js') as js_file:
    minified = jsmin(js_file.read()).replace('\n', ';')

with open('../badapple.min.js', 'w') as min_file:
    min_file.write(minified)
