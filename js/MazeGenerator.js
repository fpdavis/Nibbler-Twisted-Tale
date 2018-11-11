
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
let oCurrentCell;
let oStack = [];

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.highlight = false;

    this.checkNeighbors = function () {
        let neighbors = [];

        let top = oaMaze[index(this.i, this.j - 1)];
        let right = oaMaze[index(this.i + 1, this.j)];
        let bottom = oaMaze[index(this.i, this.j + 1)];
        let left = oaMaze[index(this.i - 1, this.j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
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

    iColumns = Math.floor(ColsIn / 2);
    iRows = Math.floor(RowsIn / 2);
    oaMaze.length = 0;

    for (let j = 0; j < iRows; j++) {
        for (let i = 0; i < iColumns; i++) {
            let cell = new Cell(i, j);
            oaMaze.push(cell);
        }
    }

    oCurrentCell = oaMaze[0];
    gbSpaceBarHit = false;
    setTimeout(function () { CalculateMaze(); }, 15);
}

function CalculateMaze() {

    oCurrentCell.visited = true;
    oCurrentCell.highlight = true;
    //DrawGrid(oaMaze);
    oCurrentCell.highlight = false;

    let next = oCurrentCell.checkNeighbors();
    if (next) {
        next.visited = true;
        oStack.push(oCurrentCell);
        removeWalls(oCurrentCell, next);
        oCurrentCell = next;

        setTimeout(function () { CalculateMaze(); }, 0);
    } else if (oStack.length > 0) {
        oCurrentCell = oStack.pop();

        setTimeout(function () { CalculateMaze(); }, 0);
    }
    else {
        oaMaze.forEach(function (item) { item.visited = false; });
        oCurrentCell = oaMaze[0];
        setTimeout(function () { RemoveDeadEnds(); }, 0);
    }

    //console.log(`${current.i} + ${current.j} * ${cols}`);

}

function RemoveDeadEnds() {

    oCurrentCell.visited = true;
    oCurrentCell.highlight = true;
    //DrawGrid(oaMaze);
    oCurrentCell.highlight = false;

    let next = oCurrentCell.checkNeighbors();
    if (next) {
        next.visited = true;
        oStack.push(oCurrentCell);
        removeDead(oCurrentCell, next);
        oCurrentCell = next;
        setTimeout(function () { RemoveDeadEnds(); }, 0);
    } else if (oStack.length > 0) {
        oCurrentCell = oStack.pop();
        setTimeout(function () { RemoveDeadEnds(); }, 0);
    }
    else {
        ClearPerimiterAndRemaining();
        ExpandMaze();
    }
}

function ClearPerimiterAndRemaining() {
    let bClearWalls;

    for (let iLoop = 0; iLoop < oaMaze.length; iLoop++) {
        bClearWalls = false;
        if (iLoop < iColumns) {
            bClearWalls = true;
        }
        else if (iLoop > oaMaze.length - iColumns) {
            bClearWalls = true;
        }
        else if (iLoop % iColumns === 0) {
            bClearWalls = true;
        }
        else if ((iLoop + 1) % iColumns === 0) {
            bClearWalls = true;
        }

        if (bClearWalls) {
            oaMaze[iLoop].walls[0] = oaMaze[iLoop].walls[1] = oaMaze[iLoop].walls[2] = oaMaze[iLoop].walls[3] = false;
        }

        if (iLoop < oaMaze.length - 1) {
            removeDead(oaMaze[iLoop], oaMaze[iLoop + 1]);
            removeDead(oaMaze[iLoop + 1], oaMaze[iLoop]);
        }
    }
}

function index(i, j) {
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

function removeDead(a, b) {

    let iNumberOfWalls = 0;

    if (a.walls[0]) iNumberOfWalls++;
    if (a.walls[1]) iNumberOfWalls++;
    if (a.walls[2]) iNumberOfWalls++;
    if (a.walls[3]) iNumberOfWalls++;
       
    if (iNumberOfWalls > 2) {
        let x = a.j - b.j;
        if (x === 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if (x === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }

        let y = a.i - b.i;
        if (y === 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if (y === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
}

function removeWalls(a, b) {

    let x = a.j - b.j;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    let y = a.i - b.i;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function ExpandMaze() {

    let aBigMaze = [];

    let iTotalCols = iColumns * 2;
    let iTotalRows = iRows * 2;
    let iCurrentRow = 0;

    let aMazeTopLeft = oaMaze;
    let aMazeTopRight = TransposeMazeH(JSON.parse(JSON.stringify(oaMaze)), 1);
    let aMazeBottomLeft = TransposeMazeV(JSON.parse(JSON.stringify(oaMaze)));
    let aMazeBottomRight = TransposeMazeV(JSON.parse(JSON.stringify(aMazeTopRight)));
    let iIndex = 0;

    while (iIndex < oaMaze.length * 2) {

        for (let iTopLeftIndex = iCurrentRow * iColumns; iTopLeftIndex < iCurrentRow * iColumns + iColumns; iTopLeftIndex++) {
            aBigMaze[iIndex++] = aMazeTopLeft[iTopLeftIndex];
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

        for (let iBottomRightIndex = iCurrentRow * iColumns; iBottomRightIndex < iCurrentRow * iColumns + iColumns; iBottomRightIndex++) {
            if (aMazeBottomRight[iBottomRightIndex]) {
                aBigMaze[iIndex] = aMazeBottomRight[iBottomRightIndex];
                let NewIndicies = ReverseIndex(iIndex);
                aBigMaze[iIndex].i = NewIndicies.i;
                aBigMaze[iIndex].j = NewIndicies.j;
            }

            iIndex++;
        }

        iCurrentRow++;
    }

    gaMaze = aBigMaze;
    StartGame();
}

function TransposeMazeH(Maze) {

    let oTempCell = new Cell;
    let iTransposeIndex;
    let iCurrentRow;
    let iEndOfThisRow;
    let iDistanceToEndOfRow;

    for (let iLoop = 0; iLoop < Maze.length - iColumns; iLoop++) {
        oTempCell.walls[0] = Maze[iLoop].walls[0];
        oTempCell.walls[1] = Maze[iLoop].walls[1];
        oTempCell.walls[2] = Maze[iLoop].walls[2];
        oTempCell.walls[3] = Maze[iLoop].walls[3];

        iCurrentRow = Math.floor(iLoop / iColumns);
        iEndOfThisRow = iColumns + (iCurrentRow * iColumns);
        iBeginingThisRow = iColumns * iCurrentRow;
        iDistanceToEndOfRow = iEndOfThisRow - iLoop;

        iTransposeIndex = iBeginingThisRow + iDistanceToEndOfRow - 1;

        //console.log(`${iCurrentRow}, ${iEndOfThisRow}, ${iBeginingThisRow}, ${iDistanceToEndOfRow}, ${iLoop} <=> ${iTransposeIndex}`);

        if (iTransposeIndex - iLoop >= 0) {

            Maze[iLoop].walls[0] = Maze[iTransposeIndex].walls[2];
            Maze[iLoop].walls[1] = Maze[iTransposeIndex].walls[1];
            Maze[iLoop].walls[2] = Maze[iTransposeIndex].walls[0];
            Maze[iLoop].walls[3] = Maze[iTransposeIndex].walls[3];

            Maze[iTransposeIndex].walls[0] = oTempCell.walls[2];
            Maze[iTransposeIndex].walls[1] = oTempCell.walls[1];
            Maze[iTransposeIndex].walls[2] = oTempCell.walls[0];
            Maze[iTransposeIndex].walls[3] = oTempCell.walls[3];
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

    for (let iLoop = 0; iLoop < Maze.length / 2; iLoop++) {
        oTempCell.walls[0] = Maze[iLoop].walls[0];
        oTempCell.walls[1] = Maze[iLoop].walls[1];
        oTempCell.walls[2] = Maze[iLoop].walls[2];
        oTempCell.walls[3] = Maze[iLoop].walls[3];

        iCurrentRow = Math.floor(iLoop / iColumns); // 0
        iTransposeRow = iRows - iCurrentRow - 1; // 10
        iRowsToSkip = iTransposeRow - iCurrentRow; // 10
        iCellsToSkip = iRowsToSkip * iColumns; // 130

        iTransposeIndex = iLoop + iCellsToSkip;

        //console.log(`${iCurrentRow}, ${iTransposeRow}, ${iRowsToSkip}, ${iCellsToSkip}, ${iLoop} <=> ${iTransposeIndex}`);

        Maze[iLoop].walls[0] = Maze[iTransposeIndex].walls[0];
        Maze[iLoop].walls[1] = Maze[iTransposeIndex].walls[3];
        Maze[iLoop].walls[2] = Maze[iTransposeIndex].walls[2];
        Maze[iLoop].walls[3] = Maze[iTransposeIndex].walls[1];

        Maze[iTransposeIndex].walls[0] = oTempCell.walls[0];
        Maze[iTransposeIndex].walls[1] = oTempCell.walls[3];
        Maze[iTransposeIndex].walls[2] = oTempCell.walls[2];
        Maze[iTransposeIndex].walls[3] = oTempCell.walls[1];
    }

    return Maze;
}