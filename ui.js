// prepares single select groups
const singleSelectGroups = document.getElementsByClassName('single-select-group');
let singleSelectMappings = {};
for (let i = 0; i < singleSelectGroups.length; i++) {
    const group = singleSelectGroups[i];
    singleSelectMappings[group.id] = null; // requires unique identifier
}

function singleSelect(element) { // currently assumes all elements are direct children of a single-select-group
    const parentID = element.parentElement.id;
    if (singleSelectMappings[parentID] == null) {
        singleSelectMappings[parentID] = element;
        element.classList.add('selected');
        return;
    }
    singleSelectMappings[parentID].classList.remove('selected');
    // no-null-select disables the ability to deselect an element
    if (!element.parentElement.classList.contains('no-null-select')
        && singleSelectMappings[parentID] === element) {
        singleSelectMappings[parentID] = null;
    } else {
        singleSelectMappings[parentID] = element;
        element.classList.add('selected');
    }
}

const defaultSingleSelectOptions = document.getElementsByClassName('default-select');
for (let i = 0; i < defaultSingleSelectOptions.length; i++) {
    singleSelect(defaultSingleSelectOptions[i]);
}

function getCurrentTool() {
    return singleSelectMappings['tool-select'].id;
}

function isFilled() {
    return document.getElementById('fill-enable').checked;
}

function getCurrentShader() {
    const colorMappings = {
        'red': color(255, 0, 0),
        'green': color(0, 255, 0),
        'blue': color(0, 0, 255),
        'black': color(0)
    };
    const currentTool = getCurrentTool();
    const currentColor = currentTool == 'select' ? 
        color(200) : colorMappings[singleSelectMappings['color-select'].id];
    const fill = currentTool == 'select' ? 
        null : (isFilled() ? currentColor : null);
    return new Shader(currentColor, fill, 2, getCurrentTool() === 'select');
}

function popAction() {
    actionManager.undo();
}

function pushAction() {
    actionManager.redo();
}