
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
            gaGrid[iLoop][iLoop2] = new GridNode(iLoop, iLoop2, 1);
        }
    }

    if (chkMaze.checked) {
        for (let iIndex = gaMaze.length; iIndex--;) {
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[0] = gaMaze[iIndex].walls[0];
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[1] = gaMaze[iIndex].walls[1];
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[2] = gaMaze[iIndex].walls[2];
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[3] = gaMaze[iIndex].walls[3];
        }
    }

    for (let iLoop = gaNibblers.length; iLoop--;) {

        if (!gaNibblers[iLoop].Dead) {
            gaGrid[gaNibblers[iLoop].PositionX][gaNibblers[iLoop].PositionY].weight = 0;

            for (let iLoop2 = gaNibblers[iLoop].Trail.length; iLoop2--;) {
                try {
                    gaGrid[gaNibblers[iLoop].Trail[iLoop2].x][gaNibblers[iLoop].Trail[iLoop2].y].weight = 0;
                } catch {
                }
            }
        }
    }

    if (gaBrainspawns) {
        for (let iLoop = gaBrainspawns.length; iLoop--;) {
            gaGrid[gaBrainspawns[iLoop].PositionX][gaBrainspawns[iLoop].PositionY].weight = 0;
        }
    }

    let oGraph = new Graph(gaGrid, { diagonal: gbDiagonalMovement });
    let oStart = oGraph.grid[oPlayer.PositionX][oPlayer.PositionY];
    let oTarget = oGraph.grid[oPlayer.Target.PositionX][oPlayer.Target.PositionY];
    let oResult = astar.search(oGraph, oStart, oTarget);
    // result is an array containing the shortest path

    if (oResult.length !== 0) {
        oPlayer.NoPathFoundCounter = 0;

        oPlayer.DirectionX = oResult[0].x - oPlayer.PositionX;
        oPlayer.DirectionY = oResult[0].y - oPlayer.PositionY;

        if (giVerbosity === goVerbosityEnum.Debug) {
            for (let iIndex = oResult.length; iIndex--;) {
                if (gaMaze[MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY)]) {
                    gaMaze[MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY)].highlight = true;
                    gaMaze[MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY)].fillStyle = oPlayer.fillStyle;
                }
                else {

                    MessageLog("MGIndex: " + MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY), goVerbosityEnum.Error);
                    MessageLog("X, Y: " + oResult[iIndex].x + ", " + oResult[iIndex].x, goVerbosityEnum.Error);
                }
            }
        }
    } else {
        MessageLog(oPlayer.Name + " is in trouble!", goVerbosityEnum.Information);
        oPlayer.Target = null;

        if (oPlayer.NoPathFoundCounter++ > 5) {
            NibblerDied(oPlayer);
        }        
    }
}
function Findpath_Brainspawn(oBrainspawn) {
    // Making a 2D array
    for (let iLoop = 0; iLoop < giArenaSquaresX; iLoop++) {
        gaGrid[iLoop] = new Array(giArenaSquaresY);

        for (let iLoop2 = 0; iLoop2 < giArenaSquaresY; iLoop2++) {
            gaGrid[iLoop][iLoop2] = new GridNode(iLoop, iLoop2, 1);
        }
    }

    if (chkMaze.checked) {
        for (let iIndex = gaMaze.length; iIndex--;) {
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[0] = gaMaze[iIndex].walls[0];
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[1] = gaMaze[iIndex].walls[1];
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[2] = gaMaze[iIndex].walls[2];
            gaGrid[gaMaze[iIndex].i][gaMaze[iIndex].j].walls[3] = gaMaze[iIndex].walls[3];
        }
    }

    for (let iLoop = gaBrainspawns.length; iLoop--;) {
        if (gaBrainspawns[iLoop] === oBrainspawn) {
            gaGrid[gaBrainspawns[iLoop].PositionX][gaBrainspawns[iLoop].PositionY].weight = 1;
        } else {
            gaGrid[gaBrainspawns[iLoop].PositionX][gaBrainspawns[iLoop].PositionY].weight = 0;
        }
    }

    let oGraph = new Graph(gaGrid, { diagonal: gbDiagonalMovement });
    let oStart = oGraph.grid[oBrainspawn.PositionX][oBrainspawn.PositionY];
    let oTarget = oGraph.grid[oBrainspawn.Target.PositionX][oBrainspawn.Target.PositionY];
    let oResult = astar.search(oGraph, oStart, oTarget);
    // result is an array containing the shortest path
    
    if (oResult.length !== 0) {
        oBrainspawn.DirectionX = oResult[0].x - oBrainspawn.PositionX;
        oBrainspawn.DirectionY = oResult[0].y - oBrainspawn.PositionY;   

        if (giVerbosity === goVerbosityEnum.Debug && chkMaze.checked) {
            for (let iIndex = oResult.length; iIndex--;) {
                if (gaMaze[MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY)]) {
                    gaMaze[MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY)].highlight = true;
                    gaMaze[MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY)].fillStyle = oBrainspawn.fillStyle;
                }
                else {

                    MessageLog("MGIndex: " + MGIndex(oResult[iIndex].x, oResult[iIndex].y, giArenaSquaresX, giArenaSquaresY), goVerbosityEnum.Error);
                    MessageLog("X, Y: " + oResult[iIndex].x + ", " + oResult[iIndex].x, goVerbosityEnum.Error);
                }
            }
        }
    }
}