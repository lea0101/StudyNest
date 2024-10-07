let strokes = [];

class Action {
    constructor() {
        // add user attribute
    }
    apply() {
        console.error("abstract apply method in action class");
    }
    undo() {
        console.error("abstract undo method in action class");
    }
}

class ActionDraw extends Action {
    constructor(shape) {
        super();
        // this.shapeIdx = shapeIdx;
        this.shape = shape;
    }
    apply() {
        strokes.push(this.shape);
    }
    undo() {
        // strokes.splice(this.shapeIdx, 1);
        strokes.pop();
    }
}

class ActionErase extends Action {
    constructor(shapeIdx, shape) {
        super();
        this.shapeIdx = shapeIdx;
        this.shape = shape;
    }
    apply() {
        strokes.splice(this.shapeIdx, 1);
    }
    undo() {
        strokes.splice(this.shapeIdx, 0, this.shape);
    }
}

class ActionManager {
    constructor() {
        this.actions = [];
        this.actionIdx = 0;
    }
    append(action) {
        // garuanteed that actions past actionIdx are not applied --> okay to remove
        this.actions.splice(this.actionIdx, this.actions.length - this.actionIdx);
        this.actions.push(action);
        action.apply();
        this.actionIdx++;
    }
    redo() {
        if (this.actionIdx == this.actions.length) return;
        this.actions[this.actionIdx].apply();
        this.actionIdx++;
    }
    undo() {
        if (this.actions.length == 0) return;
        this.actions[this.actions.length - 1].undo();
        // this.actions.pop();
        this.actionIdx--;
    }
}

let actionManager = new ActionManager();

// TODO: Move manager, highlight manager

// TODO: Stroke manager, action manager