class GridCreator {
    constructor(canvasId, numTilesWide, numTilesHigh, borderWidth) {
        this.rootId = canvasId;
        this.areaNames = {};
        this.cornerNames = {};
        this.numTilesWide = numTilesWide;
        this.numTilesHigh = numTilesHigh;
        this.borderWidth = borderWidth;
    }

    get root() {
        return document.getElementById(this.rootId);
    }

    get ctx() {
        return this.root.getContext("2d");
    }

    get height() {
        return this.root.height;
    }

    get width() {
        return this.root.width;
    }

    get tileHeight() {
        return this.height / this.numTilesHigh;
    }

    get tileWidth() {
        return this.width / this.numTilesWide;
    }

    get xmlString() {
        var result = "<xml>\n";
        for (const areaName in this.areaNames) {
            let coord = this.getAreaCoord(areaName);
            result += '  <value key="'+ areaName + "_LL_x" + '">' + coord[0] + '</value>\n';
            result += '  <value key="'+ areaName + "_LL_y" + '">' + coord[1] + '</value>\n';
            result += '  <value key="'+ areaName + "_UR_x" + '">' + coord[2] + '</value>\n';
            result += '  <value key="'+ areaName + "_UR_y" + '">' + coord[3] + '</value>\n';
        }
        return result + "</xml>"
    }

    addAreaIdentifier(areaName, color) {
        this.areaNames[areaName] = color;
    }

    addPointIdentifier(cornerName, color){
        this.cornerNames[cornerName] = color;
    }

    getAreaCoord(areaName) {
        let x1 = parseInt(document.getElementById(areaName + "_LL_x").value);
        let y1 = parseInt(document.getElementById(areaName + "_LL_y").value);
        let x2 = parseInt(document.getElementById(areaName + "_UR_x").value);
        let y2 = parseInt(document.getElementById(areaName + "_UR_y").value);
        return [x1, y1, x2, y2];
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.root.width, this.root.height);
    }

    createGridSquare(x, y, color) {
        // 0,0 will be at (0 * height, numTilesWide - 1 * height)
        let lx = x * this.tileWidth;
        let ly = Math.abs(this.numTilesHigh - y - 1) * this.tileHeight;
        
        let c = this.ctx;
        c.fillStyle = "#ffffff";
        c.fillRect(lx, ly, this.tileWidth,this.tileHeight);
        c.fillStyle = color;
        c.fillRect(lx + this.borderWidth, ly + this.borderWidth, this.tileWidth - this.borderWidth * 2, this.tileHeight - this.borderWidth * 2);
    }

    convertCornerIndex(index) {
        // 0 is origin, 1 is lower right, 2 is upper right, and 3 is upper left
        var x = 0;
        var y = 0;
        switch (index) {
            case 1:
                x = this.numTilesWide - 1;
                break;
            case 2:
                x = this.numTilesWide - 1;
                y = this.numTilesHigh - 1;
                break;
            case 3:
                y = this.numTilesHigh - 1;
                break;
            default:
                break;
        }
        return [x,y]
    }

    createCornerPoint(x,y, color) {
        let lx = x * this.tileWidth;
        let ly = Math.abs(this.numTilesHigh - y - 1) * this.tileHeight;
        let c = this.ctx;
        
        let reduceY = this.tileHeight * 2 / 3;
        let reduceX = this.tileHeight * 2 / 3;
        c.fillStyle = "#ffffff";
        c.fillRect(lx + (reduceX+this.borderWidth*2), ly + (reduceY+this.borderWidth*2), this.tileWidth - (reduceX+this.borderWidth*2) * 2, this.tileHeight - (reduceY+this.borderWidth*2) * 2);
        c.fillStyle = color;
        c.fillRect(lx + reduceX, ly + reduceY, this.tileWidth - reduceX * 2, this.tileHeight - reduceY * 2);
        
    }

    createAreaExpanded(x1, y1, x2, y2, color) {
        for (let i = x1; i < x2; i++) {
            for (let j = y1; j < y2; j++) {
                this.createGridSquare(i, j, color);
            }
        }
    }

    createArea(coordinates, color) {
        let c = coordinates;
        this.createAreaExpanded(c[0],c[1],c[2],c[3], color);
    }

    updateCanvas() {
        this.clearCanvas();
        this.createAreaExpanded(0,0,this.numTilesWide,this.numTilesHigh,"#CFE7EE");
        for (const areaName in this.areaNames) {
            let coord = this.getAreaCoord(areaName);
            this.createArea(coord, this.areaNames[areaName]);
        }
        for (const cornerName in this.cornerNames) {
            let index = parseInt(document.getElementById(cornerName).value);
            this.createCornerPoint(...this.convertCornerIndex(index), this.cornerNames[cornerName]);
        }
    }
}

async function parseXmlFileToInputs(xmlFile) {
    let response = xmlFile;
    if (typeof xmlFile == "string") {
        response = await fetch(xmlFile);
    }
    let text =  await response.text();
    parseXmlToInputs(text);
}

function parseXmlToInputs(text) {
    var root = new DOMParser().parseFromString(text, 'text/xml');
    var nodes = root.getElementsByTagName('value');
    for (var i = 0; i < nodes.length; i++) {
        let id = nodes[i].getAttribute('key');
        let val = nodes[i].textContent
        try {
            document.getElementById(id).value = parseInt(val);
        } catch (err) {
            console.log(err);
        }
    }
}

function getAsXmlValueTag(elementId){
    try {
        return '<value key="'+ elementId + '">'+ document.getElementById(elementId).value +'</value>\n';
    } catch (err) {
        console.log(elementId);
        return '';
    }
}

class InputValueTracker {
    constructor() {
        this.elements = {};
    }

    addElementId(id, properties) {
        this.elements[id] = properties;
    }

    createValueBasedXML() {
        let result = "<xml>\n";
        for (let element in this.elements) {
            result += '  ' + getAsXmlValueTag(element);
        }
        return result + "</xml>\n";
    }

    resetElementsToDefault() {
        for (let element in this.elements) {
            let prop = this.elements[element];
            if (prop.hasOwnProperty('default')) {
                document.getElementById(element).value = prop['default'];
            }
        }
    }
}