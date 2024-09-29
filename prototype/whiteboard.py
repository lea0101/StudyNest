"""
Using tkinter in Python to prototype a whiteboard
"""

import tkinter as tk
from tkinter.colorchooser import askcolor

lines = [] # store the drawn lines
redo_stack = [] # store undone lines for redo functionality

def start_drawing(event):
    global is_drawing, prev_x, prev_y
    is_drawing = True # inidcate if a drawing action is in progress
    prev_x = event.x # captures coordinates of cursor at the moment
    prev_y = event.y
    
def draw(event):
    global is_drawing, prev_x, prev_y
    if is_drawing:
        current_x = event.x
        current_y = event.y
        line_info = canvas.create_line(prev_x, prev_y, current_x, current_y, fill=drawing_color, width=line_width, capstyle=tk.ROUND, smooth=True)
        lines.append((line_info, prev_x, prev_y, current_x, current_y, drawing_color, line_width))
        prev_x = event.x 
        prev_y = event.y
        
def stop_drawing(event):
    global is_drawing
    is_drawing = False
    
def change_pen_color():
    global drawing_color
    color = askcolor()[1]
    if color:
        drawing_color = color
            
def change_line_width(value):
    global line_width
    line_width = int(value)
    
def undo(event=None):
    if lines:
        last_line = lines.pop() # remove last drawn line
        redo_stack.append(last_line)
        canvas.delete(last_line[0])

def redo(event=None):
    if redo_stack:
        recent_line = redo_stack.pop()
        line_info = canvas.create_line(recent_line[1], recent_line[2], recent_line[3], recent_line[4], fill=recent_line[5], width=recent_line[6], capstyle=tk.ROUND, smooth=True)
        lines.append((line_info, *recent_line[1:])) # recreate a slice of the recent_line tuple
    
# --- create canvas ---
root = tk.Tk()
root.title("Whiteboard App with Python and Tkinter")

canvas = tk.Canvas(root, bg="white") # create a drawing canvas
canvas.pack(fill="both", expand=True) # configure canvas to fill both horizontal and vertical space

is_drawing = False
drawing_color = "black"
line_width = 2

root.geometry("800x600") # set initial size of application window to be 800 x 600

# --- navigation bar ---
controls_frame = tk.Frame(root)
controls_frame.pack(side="top", fill="x")

color_button = tk.Button(controls_frame, text="Change Color", command=change_pen_color)
clear_button = tk.Button(controls_frame, text="Clear Canvas", command=lambda: canvas.delete("all"))

undo_button = tk.Button(controls_frame, text="Undo", command=undo)
redo_button = tk.Button(controls_frame, text="Redo", command=redo)

color_button.pack(side="left", padx=5, pady=5)
clear_button.pack(side="left", padx=5, pady=5)
undo_button.pack(side="left", padx=5, pady=5)
redo_button.pack(side="left", padx=5, pady=5)

# --- create a slider for line width function ---
line_width_label = tk.Label(controls_frame, text="Line Width:")
line_width_label.pack(side="left", padx=5, pady=5)

line_width_slider = tk.Scale(controls_frame, from_=1, to=10, orient="horizontal", command=lambda val: change_line_width(val))
line_width_slider.set(line_width)
line_width_slider.pack(side="left", padx=5, pady=5)

# --- connect features with GUI ---
canvas.bind("<Button 1>", start_drawing)
canvas.bind("<B1-Motion>", draw)
canvas.bind("<ButtonRelease-1>", stop_drawing)

# for Macs
root.bind("<Command-z>", undo)
root.bind("<Command-y>", redo)

# for Windows
root.bind("<Control-z>", undo)
root.bind("<Control-y>", redo)


# --- run the canvas ---
root.mainloop()