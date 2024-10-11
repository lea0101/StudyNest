class Shader {
    constructor(stroke, fill, weight, dashed) {
        this.stroke = stroke;
        this.fill = fill;
        this.weight = weight;
        this.dashed = dashed;
    }
    apply(p) {
        if (this.stroke) {
            p.stroke(this.stroke);
        } else {
            p.noStroke();
        }
        if (this.fill) {
            p.fill(this.fill);
        } else {
            p.noFill();
        }
        p.strokeWeight(this.weight);
        if (this.dashed) {
            p.drawingContext.setLineDash([5]);
        } else {
            p.drawingContext.setLineDash([]);
        }
    }
    toJSON() {
        return {
            stroke: this.stroke,
            fill: this.fill,
            weight: this.weight,
            dashed: this.dashed
        };
    }
}

// abstract shape class with draw method
class Shape {
    constructor(x, y, shader) {
        this.x = x;
        this.y = y;
        this.shader = shader;
        this.id = null;
        this.createdAt = new Date();
    }
    setID(id) {
        this.id = id;
    }
    display(p) {
        this.shader.apply(p);
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
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            shader: this.shader.toJSON(),
            type: getShapeType(this)
        };
    }
}

// rectangle class that extends shape
class Rectangle extends Shape {
    constructor(x, y, width, height, shader) {
        super(x, y, shader);
        this.width = width;
        this.height = height;
    }
    display(p) {
        this.shader.apply(p);
        p.rect(this.x, this.y, this.width, this.height);
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
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            shader: this.shader.toJSON(),
            type: getShapeType(this)
        };
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// ellipse class that extends shape
class Ellipse extends Shape {
    constructor(x, y, width, height, shader) {
        super(x, y, shader);
        this.width = width;
        this.height = height;
    }
    display(p) {
        this.shader.apply(p);
        p.ellipse(this.x+this.width/2, this.y+this.height/2, this.width, this.height);
    }
    isNear(x, y) {
        return dist(x, y, this.x + this.width / 2, this.y + this.height / 2) < this.width / 2;
    }
    isBoundedBy(rect) {
        return rect.containsPoint(this.x, this.y) && rect.containsPoint(this.x + this.width, this.y + this.height);
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            shader: this.shader.toJSON(),
            type: getShapeType(this)
        };
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
    display(p) {
        this.shader.apply(p);
        for (let i = 0; i < this.points.length - 1; i++) {
            p.line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
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
    toJSON() {
        return {
            points: this.points,
            shader: this.shader.toJSON(),
            type: getShapeType(this)
        };
    }
}

function generateShapeFromJSON(json) {
    let shader = new Shader(json.shader.stroke, json.shader.fill, json.shader.weight, json.shader.dashed);
    let out;
    switch (json.type) {
        case "rectangle":
            out = new Rectangle(json.x, json.y, json.width, json.height, shader);
            break;
        case "ellipse":
            out = new Ellipse(json.x, json.y, json.width, json.height, shader);
            break;
        case "curve":
            out = new Curve(json.points, shader);
            break;
        default:
            console.error("shape type not found");
            return null;
    }
    out.createdAt = json.createdAt;
    return out;
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

export { Shader, Shape, Rectangle, Ellipse, Curve, getShapeType, generateShapeFromJSON};