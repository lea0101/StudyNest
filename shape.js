class Shader {
    constructor(stroke, fill, weight, dashed) {
        this.stroke = stroke;
        this.fill = fill;
        this.weight = weight;
        this.dashed = dashed;
    }
    apply() {
        if (this.stroke) {
            stroke(this.stroke);
        } else {
            noStroke();
        }
        if (this.fill) {
            fill(this.fill);
        } else {
            noFill();
        }
        strokeWeight(this.weight);
        if (this.dashed) {
            drawingContext.setLineDash([5]);
        } else {
            drawingContext.setLineDash([]);
        }
    }
}

// abstract shape class with draw method
class Shape {
    constructor(x, y, shader) {
        this.x = x;
        this.y = y;
        this.shader = shader;
    }
    display() {
        this.shader.apply();
        console.error("abstract display method in shape class");
    }
    isNear(x, y) {
        console.error("abstract isNear method in shape class");
        return false;
    }
    isBoundedBy(rect) {
        console.error("abstract isBoundedBy method in shape class");
        return false;
    }
}

// rectangle class that extends shape
class Rectangle extends Shape {
    constructor(x, y, width, height, shader) {
        super(x, y, shader);
        this.width = width;
        this.height = height;
    }
    display() {
        this.shader.apply();
        rect(this.x, this.y, this.width, this.height);
    }
    isNear(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
    containsPoint(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
    isBoundedBy(rect) {
        return rect.containsPoint(this.x, this.y) && rect.containsPoint(this.x + this.width, this.y + this.height);
    }
}

// ellipse class that extends shape
class Ellipse extends Shape {
    constructor(x, y, width, height, shader) {
        super(x, y, shader);
        this.width = width;
        this.height = height;
    }
    display() {
        this.shader.apply();
        ellipse(this.x+this.width/2, this.y+this.height/2, this.width, this.height);
    }
    isNear(x, y) {
        return dist(x, y, this.x + this.width / 2, this.y + this.height / 2) < this.width / 2;
    }
    isBoundedBy(rect) {
        return rect.containsPoint(this.x, this.y) && rect.containsPoint(this.x + this.width, this.y + this.height);
    }
}

function dotProduct(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

function distancePointToSegment(px, py, ax, ay, bx, by) {
    const ABx = bx - ax;
    const ABy = by - ay;
    const APx = px - ax;
    const APy = py - ay;

    const AB_AB = dotProduct(ABx, ABy, ABx, ABy);
    const AB_AP = dotProduct(ABx, ABy, APx, APy);

    let t = AB_AP / AB_AB;

    t = Math.max(0, Math.min(1, t));

    const closestX = ax + t * ABx;
    const closestY = ay + t * ABy;

    return dist(px, py, closestX, closestY);
}


// curve class that extends shape, array of points that draws a line between every two points
class Curve extends Shape {
    constructor(points, shader) {
        super(points[0].x, points[0].y, shader);
        this.points = points;
    }
    display() {
        this.shader.apply();
        for (let i = 0; i < this.points.length - 1; i++) {
            line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
        }
    }
    addPoint(point) {
        this.points.push(point);
    }
    isNear(x, y) {
        let prev = this.points[0];
        for (let point of this.points) {
            if (distancePointToSegment(x, y, prev.x, prev.y, point.x, point.y) < 5) {
                return true;
            }
            prev = point;
        }
        return false;
    }
    isBoundedBy(rect) {
        for (let point of this.points) {
            rect.containsPoint(point.x, point.y);
        }
        return true;
    }
}

function getShapeType(shape) {
    if (shape instanceof Rectangle) {
        return "rectangle";
    } else if (shape instanceof Ellipse) {
        return "ellipse";
    } else if (shape instanceof Curve) {
        return "curve";
    } else {
        console.error("shape type not found");
        return null;
    }
}