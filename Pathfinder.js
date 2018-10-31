function DumbNibbler(oPlayer) {
    let iDirection = oPlayer.Direction;

    if (Math.abs(oPlayer.PositionX - oPlayer.TargetPellet.PositionX) >
        Math.abs(oPlayer.PositionY - oPlayer.TargetPellet.PositionY)) {
        if (oPlayer.TargetPellet.PositionX > oPlayer.PositionX) {
            iDirection = 3;
        } else if (oPlayer.TargetPellet.PositionX < oPlayer.PositionX) {
            iDirection = 1;
        }
    }

    if (Math.abs(oPlayer.PositionX - oPlayer.TargetPellet.PositionX) <
        Math.abs(oPlayer.PositionY - oPlayer.TargetPellet.PositionY) ||
        (iDirection + oPlayer.Direction) % 2 === 0) {
        if (oPlayer.TargetPellet.PositionY > oPlayer.PositionY) {
            iDirection = 4;
        } else if (oPlayer.TargetPellet.PositionY < oPlayer.PositionY) {
            iDirection = 2;
        }
    }

    if ((iDirection + oPlayer.Direction) % 2 === 0) {
        if (oPlayer.TargetPellet.PositionX > oPlayer.PositionX) {
            iDirection = 3;
        } else if (oPlayer.TargetPellet.PositionX < oPlayer.PositionX) {
            iDirection = 1;
        }
    }

    if ((iDirection + oPlayer.Direction) % 2 === 0) {
        iDirection = oPlayer.Direction;
    }

    let bHitTail = false;

    let oPlayerVector =
        CalculateNewPosition(oPlayer.PositionX, oPlayer.PositionY, oPlayer.DirectionX, oPlayer.DirectionY);

    // Check for wall collision
    if (oPlayerVector.HitWall) {
        if (oPlayerVector.DirectionX === 1) iDirection = 3;
        else if (oPlayerVector.DirectionX === -1) iDirection = 1;
        else if (oPlayerVector.DirectionY === 1) iDirection = 4;
        else if (oPlayerVector.DirectionY === -1) iDirection = 2;
    } else if (CollidedWithTail(oPlayer.Trail, oPlayerVector.PositionX, oPlayerVector.PositionY)) {
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

function SmartNibbler(oPlayer) {
    // Making a 2D array
    for (let iLoop = 0; iLoop < giArenaSquaresX; iLoop++) {
        gaGrid[iLoop] = new Array(giArenaSquaresY);

        for (var iLoop2 = 0; iLoop2 < giArenaSquaresY; iLoop2++) {
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

    let oGraph = new Graph(gaGrid);
    let oStart = oGraph.grid[oPlayer.PositionX][oPlayer.PositionY];
    let oTarget = oGraph.grid[oPlayer.TargetPellet.PositionX][oPlayer.TargetPellet.PositionY];
    let oResult = astar.search(oGraph, oStart, oTarget);
    // result is an array containing the shortest path

    oPlayer.DirectionX = oResult[0].x - oPlayer.PositionX;
    oPlayer.DirectionY = oResult[0].y - oPlayer.PositionY;
}