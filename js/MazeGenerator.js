
// https://rosettacode.org/wiki/Maze_generation#JavaScript

// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Videos
// https://youtu.be/HyK_Q5rrcr4
// https://youtu.be/D8UgRyRnvXU
// https://youtu.be/8Ju_uxJ9v44
// https://youtu.be/_p5IH0L63wo

// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm

let iColumns, iRows;
let oaMaze = [];
let aBigMaze = [];
let oCurrentCell;
let oStack = [];
let bOddColumns;

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.highlight = false;
    this.fillStyle = "red";
    this.strokeStyle = "blue";
    this.Nibbler = false;
    this.Brainspawn = false;
    this.Pellet = false;
    this.checkNeighbors = function () {
        let neighbors = [];

        let North = oaMaze[MGIndex(this.i, this.j - 1, iColumns, iRows)];
        let East = oaMaze[MGIndex(this.i + 1, this.j, iColumns, iRows)];
        let South = oaMaze[MGIndex(this.i, this.j + 1, iColumns, iRows)];
        let West = oaMaze[MGIndex(this.i - 1, this.j, iColumns, iRows)];

        if (North && !North.visited) {
            neighbors.push(North);
        }
        if (East && !East.visited) {
            neighbors.push(East);
        }
        if (South && !South.visited) {
            neighbors.push(South);
        }
        if (West && !West.visited) {
            neighbors.push(West);
        }

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    };
}

function GenerateMaze(ColsIn, RowsIn) {

    MessageLog(`Generating Maze ${ColsIn} x ${RowsIn}`, goVerbosityEnum.Debug);
    iColumns = Math.floor(ColsIn / 2);
    iRows = Math.floor(RowsIn / 2);

    if (ColsIn % 2 !== 0) bOddColumns = true;

    oaMaze.length = 0;

    for (let j = 0; j < iRows; j++) {
        for (let i = 0; i < iColumns; i++) {
            let cell = new Cell(i, j);
            oaMaze.push(cell);
        }
    }

    oCurrentCell = oaMaze[0];
    CalculateMaze();

    oaMaze.forEach(function (item) { item.visited = false; });
    oCurrentCell = oaMaze[0];
    RemoveDeadEnds();

    ClearPerimiterAndRemaining();
    ExpandMaze();
    PadoutMaze(ColsIn, RowsIn);

    return aBigMaze;
}
function PadoutMaze(iColumns, iRows) {

    let LastIndicies = ReverseIndex(aBigMaze.length - 1);

    for (let j = LastIndicies.j + 1; j < iRows; j++) {
        for (let i = 0; i < iColumns; i++) {
            let cell = new Cell(i, j);
            cell.walls = [false, false, false, false];
            aBigMaze.push(cell);
        }
    }
}
function GenerateEmptyMaze(iColumns, iRows) {
    
    MessageLog(`Generating Empty Maze ${iColumns} x ${iRows}`, goVerbosityEnum.Debug);
    
    oaMaze.length = 0;

    for (let j = 0; j < iRows; j++) {
        for (let i = 0; i < iColumns; i++) {
            let cell = new Cell(i, j);
            cell.walls = [false, false, false, false];
            oaMaze.push(cell);
        }
    }

    return oaMaze;
}

function CalculateMaze() {

    while (true) {
        oCurrentCell.visited = true;

        let next = oCurrentCell.checkNeighbors();
        if (next) {
            next.visited = true;
            oStack.push(oCurrentCell);
            removeWalls(oCurrentCell, next);
            oCurrentCell = next;
        } else if (oStack.length > 0) {
            oCurrentCell = oStack.pop();
        }
        else {
            break;
        }
    }
}
function removeWalls(a, b) {

    let x = a.j - b.j;
    if (x === 1) {
        a.walls[goWalls.North] = false;
        b.walls[goWalls.South] = false;
    } else if (x === -1) {
        a.walls[goWalls.South] = false;
        b.walls[goWalls.North] = false;
    }

    let y = a.i - b.i;
    if (y === 1) {
        a.walls[goWalls.West] = false;
        b.walls[goWalls.East] = false;
    } else if (y === -1) {
        a.walls[goWalls.East] = false;
        b.walls[goWalls.West] = false;
    }
}

function RemoveDeadEnds() {

    while (true) {
        oCurrentCell.visited = true;

        let next = oCurrentCell.checkNeighbors();
        if (next) {
            next.visited = true;
            oStack.push(oCurrentCell);
            removeWallsIfMoreThanTwo(oCurrentCell, next);
            oCurrentCell = next;
        } else if (oStack.length > 0) {
            oCurrentCell = oStack.pop();
        }
        else {
            break;
        }
    }
}
function ClearPerimiterAndRemaining() {
    
    for (let iLoop = 0; iLoop < oaMaze.length; iLoop++) {
        bClearWalls = false;
        if (iLoop < iColumns) { // Top Row
            oaMaze[iLoop].walls[goWalls.North] = oaMaze[iLoop].walls[goWalls.South] = oaMaze[iLoop].walls[goWalls.East] = oaMaze[iLoop].walls[goWalls.West] = false;
        }
        else if (iLoop < iColumns * 2) { // Second Row
            oaMaze[iLoop].walls[goWalls.North] = oaMaze[iLoop].walls[goWalls.East] = oaMaze[iLoop].walls[goWalls.West] = false;
        }
        else if (iLoop > oaMaze.length - iColumns) { // Bottom Row
            oaMaze[iLoop].walls[goWalls.South] = oaMaze[iLoop].walls[goWalls.East] = oaMaze[iLoop].walls[goWalls.West] = false;
        }

        if (iLoop % iColumns === 0) { // First Column
            oaMaze[iLoop].walls[goWalls.North] = oaMaze[iLoop].walls[goWalls.South] = oaMaze[iLoop].walls[goWalls.East] = oaMaze[iLoop].walls[goWalls.West] = false;
        }
        else if ((iLoop + 1) % iColumns === 0) { // Second Column
            oaMaze[iLoop].walls[goWalls.North] = oaMaze[iLoop].walls[goWalls.South] = oaMaze[iLoop].walls[goWalls.West] = false;
        }
        else if ((iLoop - 1) % iColumns === 0) { // Last Column
            oaMaze[iLoop].walls[goWalls.North] = oaMaze[iLoop].walls[goWalls.South] = oaMaze[iLoop].walls[goWalls.East] = false;
        }
                
        removeWallsIfMoreThanTwo(oaMaze[iLoop], oaMaze[iLoop + 1]);
        removeWallsIfMoreThanTwo(oaMaze[iLoop], oaMaze[iLoop + iColumns]);
        removeWallsIfMoreThanTwo(oaMaze[iLoop], oaMaze[iLoop - 1]);        
        
        // TODO - Figure out why I need these
        if (oaMaze.length - iLoop > iColumns && (!oaMaze[iLoop].walls[goWalls.South] || !oaMaze[iLoop + iColumns].walls[goWalls.North])) {
            oaMaze[iLoop].walls[goWalls.South] = false;
            oaMaze[iLoop + iColumns].walls[goWalls.North] = false;
        }

        if (iLoop + 1 < oaMaze.length && (!oaMaze[iLoop].walls[goWalls.East] || !oaMaze[iLoop + 1].walls[goWalls.West])) {
            oaMaze[iLoop].walls[goWalls.East] = false;
            oaMaze[iLoop + 1].walls[goWalls.West] = false;
        }
        
    }
}
function removeWallsIfMoreThanTwo(a, b) {

    if (a === null || b === null) return;

    let iNumberOfWalls = 0;

    if (a.walls[goWalls.North]) iNumberOfWalls++;
    if (a.walls[goWalls.South]) iNumberOfWalls++;
    if (a.walls[goWalls.East]) iNumberOfWalls++;
    if (a.walls[goWalls.West]) iNumberOfWalls++;

    if (iNumberOfWalls > 2) {
        removeWalls(a, b);
    }
}

function MGIndex(i, j, iColumns, iRows) {
    if (i < 0 || j < 0 || i > iColumns - 1 || j > iRows - 1) {
        return -1;
    }

    return i + j * iColumns;
}
function ReverseIndex(index) {

    j = Math.floor(index / giArenaSquaresX);
    i = index % giArenaSquaresX;

    if (i === 0 && Math.floor(index / giArenaSquaresX) !== (index / giArenaSquaresX)) i = giArenaSquaresX;

    //console.log(`${index} = (${i}, ${j})`);
    return { i: i, j: j };
}

function ExpandMaze() {    
    let aMazeTopLeft = oaMaze;
    let aMazeTopRight = TransposeMazeH(JSON.parse(JSON.stringify(oaMaze)));
    let aMazeBottomLeft = TransposeMazeV(JSON.parse(JSON.stringify(oaMaze)));
    let aMazeBottomRight = TransposeMazeV(JSON.parse(JSON.stringify(aMazeTopRight)));
    let iIndex = 0;
    let iCurrentRow = 0;
    
    while (iIndex < oaMaze.length * 2) {

        for (let iTopLeftIndex = iCurrentRow * iColumns; iTopLeftIndex < iCurrentRow * iColumns + iColumns; iTopLeftIndex++) {
            aBigMaze[iIndex++] = aMazeTopLeft[iTopLeftIndex];
        }

        if (bOddColumns) {
            aBigMaze[iIndex] = new Cell();
            let NewIndicies = ReverseIndex(iIndex);
            aBigMaze[iIndex].walls[goWalls.North] = aBigMaze[iIndex].walls[goWalls.South] = aBigMaze[iIndex].walls[goWalls.East] = aBigMaze[iIndex].walls[goWalls.West] = false;
            aBigMaze[iIndex].i = NewIndicies.i;
            aBigMaze[iIndex].j = NewIndicies.j;

            iIndex++;
        }

        for (let iTopRightIndex = iCurrentRow * iColumns; iTopRightIndex < iCurrentRow * iColumns + iColumns; iTopRightIndex++) {
            aBigMaze[iIndex] = aMazeTopRight[iTopRightIndex];
            let NewIndicies = ReverseIndex(iIndex);
            aBigMaze[iIndex].i = NewIndicies.i;
            aBigMaze[iIndex].j = NewIndicies.j;

            iIndex++;
        }

        iCurrentRow++;
    }

    iCurrentRow = 0;
    while (iIndex < oaMaze.length * 4) {

        for (let iBottomLeftIndex = iCurrentRow * iColumns; iBottomLeftIndex < iCurrentRow * iColumns + iColumns; iBottomLeftIndex++) {

            aBigMaze[iIndex] = aMazeBottomLeft[iBottomLeftIndex];
            let NewIndicies = ReverseIndex(iIndex);
            aBigMaze[iIndex].i = NewIndicies.i;
            aBigMaze[iIndex].j = NewIndicies.j;

            iIndex++;
        }

        if (bOddColumns) {
            aBigMaze[iIndex] = new Cell();
            let NewIndicies = ReverseIndex(iIndex);
            aBigMaze[iIndex].walls[goWalls.North] = aBigMaze[iIndex].walls[goWalls.South] = aBigMaze[iIndex].walls[goWalls.East] = aBigMaze[iIndex].walls[goWalls.West] = false;
            aBigMaze[iIndex].i = NewIndicies.i;
            aBigMaze[iIndex].j = NewIndicies.j;

            iIndex++;
        }

        for (let iBottomRightIndex = iCurrentRow * iColumns; iBottomRightIndex < iCurrentRow * iColumns + iColumns; iBottomRightIndex++) {
            aBigMaze[iIndex] = aMazeBottomRight[iBottomRightIndex];
            let NewIndicies = ReverseIndex(iIndex);
            aBigMaze[iIndex].i = NewIndicies.i;
            aBigMaze[iIndex].j = NewIndicies.j;

            iIndex++;
        }

        iCurrentRow++;
    }

   return aBigMaze;
}
function TransposeMazeH(Maze) {

    let oTempCell = new Cell;
    let iTransposeIndex;
    let iCurrentRow;
    let iEndOfThisRow;
    let iDistanceToEndOfRow;

    for (let iLoop = 0; iLoop < Maze.length; iLoop++) {
        oTempCell.walls[goWalls.North] = Maze[iLoop].walls[goWalls.North];
        oTempCell.walls[goWalls.South] = Maze[iLoop].walls[goWalls.South];
        oTempCell.walls[goWalls.East]  = Maze[iLoop].walls[goWalls.East];
        oTempCell.walls[goWalls.West]  = Maze[iLoop].walls[goWalls.West];

        iCurrentRow = Math.floor(iLoop / iColumns);
        iEndOfThisRow = iColumns + (iCurrentRow * iColumns);
        iBeginingThisRow = iColumns * iCurrentRow;
        iDistanceToEndOfRow = iEndOfThisRow - iLoop;

        iTransposeIndex = iBeginingThisRow + iDistanceToEndOfRow - 1;

        //console.log(`${iCurrentRow}, ${iEndOfThisRow}, ${iBeginingThisRow}, ${iDistanceToEndOfRow}, ${iLoop} <=> ${iTransposeIndex}`);

        if (iTransposeIndex - iLoop >= 0) {

            Maze[iLoop].walls[goWalls.North] = Maze[iTransposeIndex].walls[goWalls.North];
            Maze[iLoop].walls[goWalls.South] = Maze[iTransposeIndex].walls[goWalls.South];
            Maze[iLoop].walls[goWalls.East]  = Maze[iTransposeIndex].walls[goWalls.West];
            Maze[iLoop].walls[goWalls.West]  = Maze[iTransposeIndex].walls[goWalls.East];

            Maze[iTransposeIndex].walls[goWalls.North] = oTempCell.walls[goWalls.North];
            Maze[iTransposeIndex].walls[goWalls.South] = oTempCell.walls[goWalls.South];
            Maze[iTransposeIndex].walls[goWalls.East]  = oTempCell.walls[goWalls.West];
            Maze[iTransposeIndex].walls[goWalls.West]  = oTempCell.walls[goWalls.East];
        }
        else {
            iLoop += Math.floor(iColumns / 2) - 1;
        }
    }

    return Maze;
}
function TransposeMazeV(Maze) {

    let oTempCell = new Cell;
    let iTransposeIndex;
    let iCurrentRow;
    let iTransposeRow;
    let iRowsToSkip;
    let iCellsToSkip;

    console.log(`${Maze.length}, ${iColumns}, ${Maze.length / iColumns}`);
    for (let iLoop = 0; iLoop < Math.ceil(Maze.length / iColumns / 2) * iColumns; iLoop++) {
        oTempCell.walls[goWalls.North] = Maze[iLoop].walls[goWalls.North];
        oTempCell.walls[goWalls.South] = Maze[iLoop].walls[goWalls.South];
        oTempCell.walls[goWalls.East]  = Maze[iLoop].walls[goWalls.East];
        oTempCell.walls[goWalls.West]  = Maze[iLoop].walls[goWalls.West];

        iCurrentRow = Math.floor(iLoop / iColumns); // 0
        iTransposeRow = iRows - iCurrentRow - 1; // 10
        iRowsToSkip = iTransposeRow - iCurrentRow; // 10
        iCellsToSkip = iRowsToSkip * iColumns; // 130

        iTransposeIndex = iLoop + iCellsToSkip;

        console.log(`${iCurrentRow}, ${iTransposeRow}, ${iRowsToSkip}, ${iCellsToSkip}, ${iLoop} <=> ${iTransposeIndex}`);

        Maze[iLoop].walls[goWalls.North] = Maze[iTransposeIndex].walls[goWalls.South];
        Maze[iLoop].walls[goWalls.South] = Maze[iTransposeIndex].walls[goWalls.North];
        Maze[iLoop].walls[goWalls.East] = Maze[iTransposeIndex].walls[goWalls.East];
        Maze[iLoop].walls[goWalls.West] = Maze[iTransposeIndex].walls[goWalls.West];

        Maze[iTransposeIndex].walls[goWalls.North] = oTempCell.walls[goWalls.South];
        Maze[iTransposeIndex].walls[goWalls.South] = oTempCell.walls[goWalls.North];
        Maze[iTransposeIndex].walls[goWalls.East]  = oTempCell.walls[goWalls.East];
        Maze[iTransposeIndex].walls[goWalls.West]  = oTempCell.walls[goWalls.West];
    }

    return Maze;
}