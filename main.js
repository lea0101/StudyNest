let selection = [];

let currentShape = null;
let currentSelection = null;

function setup() {
    let canvas = createCanvas(1200, 700);
    canvas.parent('whiteboard');
}

function draw() {
    background(255);
    for (let shape of strokes) {
        shape.display();
    }
    if (currentSelection) {
        currentSelection.display();
    }
    if (currentShape) {
        switch (getShapeType(currentShape)) {
            case 'rectangle':
                currentShape.width = mouseX - currentShape.x;
                currentShape.height = mouseY - currentShape.y;
                break;
            case 'ellipse':
                currentShape.width = mouseX - currentShape.x;
                currentShape.height = mouseY - currentShape.y;
                break;
            case 'curve':
                currentShape.addPoint({x: mouseX, y: mouseY});
                break;
            }
        currentShape.display();
    }
    if (mouseIsPressed) {
        if (getCurrentTool() === 'erase') {
            for (let i = strokes.length - 1; i >= 0; i--) { // very slow, but works
                if (strokes[i].isNear(mouseX, mouseY)) {
                    // strokes.splice(i, 1);
                    actionManager.append(new ActionErase(i, strokes[i]));
                }
            }
        }
    }
}

function mousePressed() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    let tool = getCurrentTool();
    let shader = getCurrentShader();
    switch (tool) {
        case 'rectangle':
            currentShape = new Rectangle(mouseX, mouseY, 0, 0, shader);
            break;
        case 'ellipse':
            currentShape = new Ellipse(mouseX, mouseY, 0, 0, shader);
            break;
        case 'paint':
            currentShape = new Curve([{x: mouseX, y: mouseY}], shader);
            break;
        case 'select':
            currentShape = new Rectangle(mouseX, mouseY, 0, 0, shader);
            break;
    }
}

function mouseReleased() {
    if (currentShape === null) return;
    let shapeType = getShapeType(currentShape);
    if (shapeType === "rectangle" || shapeType === "ellipse") {
        currentShape.width = mouseX - currentShape.x;
        currentShape.height = mouseY - currentShape.y;
    }
    if (getCurrentTool() === 'select') {
        selection = [];
        for (let i = 0; i < strokes.length; i++) {
            if (strokes[i].isBoundedBy(currentShape)) {
                selection.push(i);
            }
        }
        if (selection.length == 0) {
            currentSelection = null;
            currentShape = null;
            return;
        }
        let right = strokes[selection[0]].x;
        let left = strokes[selection[0]].x;
        let bottom = strokes[selection[0]].y;
        let top = strokes[selection[0]].y;
        for (let i = 0; i < selection.length; i++) {
            // invert the bounds to get the smallest bounding box
            if (getShapeType(strokes[i]) === "rectangle" || getShapeType(strokes[i]) === "ellipse") {
                right = Math.max(right, strokes[i].x + strokes[i].width);
                left = Math.min(left, strokes[i].x);
                bottom = Math.max(bottom, strokes[i].y + strokes[i].height);
                top = Math.min(top, strokes[i].y);
            } else {
                for (let point of strokes[i].points) {
                    right = Math.max(right, point.x);
                    left = Math.min(left, point.x);
                    bottom = Math.max(bottom, point.y);
                    top = Math.min(top, point.y);
                }
            }
        }
        currentShape.x = left;
        currentShape.y = top;
        currentShape.width = right - left;
        currentShape.height = bottom - top;
        currentSelection = currentShape;
    } else {
        // strokes.push(currentShape);
        actionManager.append(new ActionDraw(currentShape));
    }
    currentShape = null;
}