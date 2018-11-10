function FindPath_Simple_Nibbler(oPlayer) {
    let iDirection = oPlayer.Direction;

    if (Math.abs(oPlayer.PositionX - oPlayer.Target.PositionX) >
        Math.abs(oPlayer.PositionY - oPlayer.Target.PositionY)) {
        if (oPlayer.Target.PositionX > oPlayer.PositionX) {
            iDirection = 3;
        } else if (oPlayer.Target.PositionX < oPlayer.PositionX) {
            iDirection = 1;
        }
    }

    if (Math.abs(oPlayer.PositionX - oPlayer.Target.PositionX) <
        Math.abs(oPlayer.PositionY - oPlayer.Target.PositionY) ||
        (iDirection + oPlayer.Direction) % 2 === 0) {
        if (oPlayer.Target.PositionY > oPlayer.PositionY) {
            iDirection = 4;
        } else if (oPlayer.Target.PositionY < oPlayer.PositionY) {
            iDirection = 2;
        }
    }

    if ((iDirection + oPlayer.Direction) % 2 === 0) {
        if (oPlayer.Target.PositionX > oPlayer.PositionX) {
            iDirection = 3;
        } else if (oPlayer.Target.PositionX < oPlayer.PositionX) {
            iDirection = 1;
        }
    }

    if ((iDirection + oPlayer.Direction) % 2 === 0) {
        iDirection = oPlayer.Direction;
    }

    let bHitTail = false;

    let oPlayerVector =
        CalculateNewPosition(oPlayer.PositionX, oPlayer.PositionY, oPlayer.DirectionX, oPlayer.DirectionY);
    
    oPlayerVector.Trail = oPlayer.Trail;

    // Check for wall collision
    if (oPlayerVector.HitWall) {
        if (oPlayerVector.DirectionX === 1) iDirection = 3;
        else if (oPlayerVector.DirectionX === -1) iDirection = 1;
        else if (oPlayerVector.DirectionY === 1) iDirection = 4;
        else if (oPlayerVector.DirectionY === -1) iDirection = 2;
    } else if (CollidedWithTail(oPlayerVector)) {
        bHitTail = true;
        iDirection = Math.round(Math.random() * 4);
    }

    // Add a bit of randomness
    if (Math.round(Math.random() * 100) < 1) {
        iDirection = Math.round(Math.random() * 10 + 1);
    }

    if (iDirection !== oPlayer.Direction) {
        switch (iDirection) {
            case 1: // Left
                oPlayer.DirectionX = -1;
                oPlayer.DirectionY = 0;
                oPlayer.Direction = iDirection;
                break;
            case 2: // Up
                oPlayer.DirectionX = 0;
                oPlayer.DirectionY = -1;
                oPlayer.Direction = iDirection;
                break;
            case 3: // Right
                oPlayer.DirectionX = 1;
                oPlayer.DirectionY = 0;
                oPlayer.Direction = iDirection;
                break;
            case 4: // Down
                oPlayer.DirectionX = 0;
                oPlayer.DirectionY = 1;
                oPlayer.Direction = iDirection;
                break;
            default: // Same direction

        }
    }
}

function Findpath_Nibbler(oPlayer) {
    // Making a 2D array
    for (let iLoop = 0; iLoop < giArenaSquaresX; iLoop++) {
        gaGrid[iLoop] = new Array(giArenaSquaresY);

        for (let iLoop2 = 0; iLoop2 < giArenaSquaresY; iLoop2++) {
            gaGrid[iLoop][iLoop2] = 1;
        }
    }

    for (let iLoop = ogPlayer.length; iLoop--;) {

        gaGrid[ogPlayer[iLoop].PositionX][ogPlayer[iLoop].PositionY] = 0;

        for (let iLoop2 = ogPlayer[iLoop].Trail.length; iLoop2--;) {
            try {
                gaGrid[ogPlayer[iLoop].Trail[iLoop2].x][ogPlayer[iLoop].Trail[iLoop2].y] = 0;
            } catch {
            }
        }
    }

    if (ogBrainspawn) {
        for (let iLoop = ogBrainspawn.length; iLoop--;) {
            gaGrid[ogBrainspawn[iLoop].PositionX][ogBrainspawn[iLoop].PositionY] = 0;
        }
    }

    let oGraph = new Graph(gaGrid, { diagonal: gbDiagonalMovement });
    let oStart = oGraph.grid[oPlayer.PositionX][oPlayer.PositionY];
    let oTarget = oGraph.grid[oPlayer.Target.PositionX][oPlayer.Target.PositionY];
    let oResult = astar.search(oGraph, oStart, oTarget);
    // result is an array containing the shortest path

    if (oResult.length !== 0) {
        oPlayer.DirectionX = oResult[0].x - oPlayer.PositionX;
        oPlayer.DirectionY = oResult[0].y - oPlayer.PositionY;
    }
}
function Findpath_Brainspawn(oPlayer) {
    // Making a 2D array
    for (let iLoop = 0; iLoop < giArenaSquaresX; iLoop++) {
        gaGrid[iLoop] = new Array(giArenaSquaresY);

        for (let iLoop2 = 0; iLoop2 < giArenaSquaresY; iLoop2++) {
            gaGrid[iLoop][iLoop2] = 1;
        }
    }

    for (let iLoop = ogBrainspawn.length; iLoop--;) {
        if (ogBrainspawn[iLoop] == oPlayer) {
            gaGrid[ogBrainspawn[iLoop].PositionX][ogBrainspawn[iLoop].PositionY] = 1;
        } else {
            gaGrid[ogBrainspawn[iLoop].PositionX][ogBrainspawn[iLoop].PositionY] = 0;
        }
    }

    let oGraph = new Graph(gaGrid, { diagonal: gbDiagonalMovement });
    let oStart = oGraph.grid[oPlayer.PositionX][oPlayer.PositionY];
    let oTarget = oGraph.grid[oPlayer.Target.PositionX][oPlayer.Target.PositionY];
    let oResult = astar.search(oGraph, oStart, oTarget);
    // result is an array containing the shortest path
    
    if (oResult.length !== 0) {
        oPlayer.DirectionX = oResult[0].x - oPlayer.PositionX;
        oPlayer.DirectionY = oResult[0].y - oPlayer.PositionY;    
    }
}