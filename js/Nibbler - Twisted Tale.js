window.onload = function () {

    window.addEventListener('resize', ResizeEvent, false);
    document.addEventListener("keydown", KeydownEvent);
    document.addEventListener("keyup", KeyupEvent);
    document.addEventListener("click", ClickEvent, { passive: true });

    addClass(oDivGameMenu, "showGameMenu");
    addClass(oDivScoreboard, "modal-blur");
    addClass(canvArena, "modal-blur");

    Sounds.Effects["Crawlig"].loop = true;

    console.info("Message logging set to " + goVerbosityEnum.Lookup[giVerbosity]);
}

function SetupArena() {

    switch (selectArenaSize.value) {
        case "Small":
            giGridSize = 80;
            break;
        case "Large":
            giGridSize = 20;
            break;
        default:
            giGridSize = 40;
    }

    giGridSizeHalf = giGridSize / 2;

    giArenaSquaresX = Math.floor(window.innerWidth / giGridSize);
    giArenaSquaresY = Math.floor(giGridHeight / giGridSize);

    ResizeEvent();

    gaMaze.length = 0;
    if (chkMaze.checked) {
        HideGameMenu();        
        gaMaze = GenerateMaze(giArenaSquaresX, giArenaSquaresY);
    }

    StartGame();

}

function StartGame() {
    if (gaSprites) gaSprites.length = 0;

    InitializePlayers();
    InitializePellets();
    
    gaNibblers.forEach(DrawPlayer);

    if (chkTime.checked) {
        giTimeRemaining = 1000 * oNumberTime.value; // 1,000 ms per second
    }
    else {
        oDivTime.innerText = "";
    }
    
    switch (selectSpeed.value) {
        case "Slow":
            giGameLoopSpeed = 140;
            break;
        case "Fast":
            giGameLoopSpeed = 66;
            break;
        default:
            giGameLoopSpeed = 100;
    }

    gbWallWrap = chkWallWrap.checked;
    gbDeadlyWalls = chkDeadlyWalls.checked;
    gbDeadlyTails = chkDeadlyTails.checked;
    gbDiagonalMovement = chkDiagonalMovement.checked;
    gbStopAfterEachMove = !chkNonStop.checked;
    gbInfiniteTails = chkInfiniteTails.checked;

    InitializeBrainspawn();
    
    Sounds.NotMuted = !chkMuteEffects.checked;
    Music.NotMuted = !chkMuteMusic.checked;

    if (Music.NotMuted) {
        Music.Songs.BossTheme.volume = Music.Volume;
        Music.Songs.BossTheme.play();
    }
    
    UnPause();

    oBtnStart.disabled = true;
}
function StartTimers() {

    if (gaNibblers[0].Type == "Computer") gaNibblers[0].Timer = setInterval(function () { ComputerPlayerLoop(gaNibblers[0]) }, giGameLoopSpeed);
    if (gaNibblers[1] && gaNibblers[1].Type == "Computer") gaNibblers[1].Timer = setInterval(function () { ComputerPlayerLoop(gaNibblers[1]) }, giGameLoopSpeed + 10);
    if (gaNibblers[2] && gaNibblers[2].Type == "Computer") gaNibblers[2].Timer = setInterval(function () { ComputerPlayerLoop(gaNibblers[2]) }, giGameLoopSpeed + 20);
    if (gaNibblers[3] && gaNibblers[3].Type == "Computer") gaNibblers[3].Timer = setInterval(function () { ComputerPlayerLoop(gaNibblers[3]) }, giGameLoopSpeed + 40);

    if (gaBrainspawns) {
        for (let iLoop = gaBrainspawns.length; iLoop--;) {
            gaBrainspawns[iLoop].Timer =
                setInterval(function() { BrainspawnLoop(gaBrainspawns[iLoop]) }, giGameLoopSpeed + 200);
        }
    }
}

function GameLoop() {

    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        MovePlayer(gaNibblers[iLoop]);
    }
   
    DrawGrid();

    gaNibblers.forEach(DrawPlayer);

    gaSprites.sort(function (a, b) { return a.ZIndex - b.ZIndex });
    for (let iLoop = gaSprites.length; iLoop--;) {
        if (gaSprites[iLoop].Complete) {
            gaSprites.splice(iLoop, 1);
        } else {
            gaSprites[iLoop].Draw();
        }
    }
    
    if (gaPellets) {
        gaPellets.forEach(Pellet.Draw);
    }

    if (gaBrainspawns) {
        gaBrainspawns.forEach(Brainspawn.Draw);
    }


    gaNibblers.forEach(Nibbler.UpdateTail);
    UpdateScoreboard();
}
function ComputerPlayerLoop(oPlayer) {

    if (oPlayer.Dead) return false;

    if (oPlayer.Target === null) {

        if (Math.round(Math.random() * 10) < 1) {
            oPlayer.Target = gaPellets[Math.floor(Math.random() * gaPellets.length)];
        } else {
            oPlayer.Target = gaPellets[0];
            let iClosestDistance = giMaxDistanceToPellet;

            // Find nearest pellet 
            for (let iLoop = gaPellets.length; iLoop--;) {
                var iDifferenceX = oPlayer.PositionX - gaPellets[iLoop].PositionX;
                var iDifferenceY = oPlayer.PositionY - gaPellets[iLoop].PositionY;
                var iDistance = Math.sqrt(iDifferenceX * iDifferenceX + iDifferenceY * iDifferenceY);

                if (iDistance < iClosestDistance) {
                    iClosestDistance = iDistance;
                    oPlayer.Target = gaPellets[iLoop];
                }
            }
        }
    }

    if (Math.round(Math.random() * 50) < 1) {
        FindPath_Simple_Nibbler(oPlayer);
    } else {
        Findpath_Nibbler(oPlayer);
    }
}

function CalculateNewPosition(NewPositionX, NewPositionY, NewDirectionX, NewDirectionY) {
    
    if (chkMaze.checked) {
        let iIndex = MGIndex(NewPositionX, NewPositionY, giArenaSquaresX, giArenaSquaresY);

        if (gaMaze[iIndex]) {
            if (NewDirectionX > 0 && gaMaze[iIndex].walls[goWalls.East]) {
                NewDirectionX = 0;
            }
            else if (NewDirectionX < 0 && gaMaze[iIndex].walls[goWalls.West]) {
                NewDirectionX = 0;
            }
            if (NewDirectionY < 0 && gaMaze[iIndex].walls[goWalls.North]) {
                NewDirectionY = 0;
            }
            else if (NewDirectionY > 0 && gaMaze[iIndex].walls[goWalls.South]) {
                NewDirectionY = 0;
            }
        }
    }

    NewPositionX += NewDirectionX;
    NewPositionY += NewDirectionY;
    let bHitWall = false;

    if (gbWallWrap) {
        if (NewPositionX < 1) {
            NewPositionX = giArenaSquaresX - 1;
        } else if (NewPositionX >= giArenaSquaresX) {
            NewPositionX = 1;
        } else if (NewPositionY < 1) {
            NewPositionY = giArenaSquaresY - 1;
        } else if (NewPositionY > giArenaSquaresY - 1) {
            NewPositionY = 1;
        }
    } else {
        if (NewPositionX < 1) {
            NewPositionX = 1;
            NewDirectionX = 0;
            NewDirectionY = Math.random() < 0.5 ? -1 : 1;
            bHitWall = true;
        } else if (NewPositionX >= giArenaSquaresX) {
            NewPositionX = giArenaSquaresX - 1;
            NewDirectionX = 0;
            NewDirectionY = Math.random() < 0.5 ? -1 : 1;
            bHitWall = true;
        } else if (NewPositionY < 1) {
            NewPositionY = 1;
            NewDirectionY = 0;
            NewDirectionX = Math.random() < 0.5 ? -1 : 1;
            bHitWall = true;
        } else if (NewPositionY > giArenaSquaresY - 1) {
            NewPositionY = giArenaSquaresY - 1;
            NewDirectionY = 0;
            NewDirectionX = Math.random() < 0.5 ? -1 : 1;
            bHitWall = true;
        }
    }

    return {
        PositionX: NewPositionX,
        PositionY: NewPositionY,
        DirectionX: NewDirectionX,
        DirectionY: NewDirectionY,
        HitWall: bHitWall
    };

}

function KeydownEvent(oEvent) {

    if (CheckForSpecialKeys(oEvent)) {
        return;
    } else {
        if (!gbGamePaused && gaNibblers) {
            for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
            {
                if (gaNibblers[iLoop].Type == "Human" && CheckForKeyDown(oEvent, gaNibblers[iLoop])) {
                    CheckForKeyEvents(gaNibblers[iLoop]);
                    break;
                }
            }
        }
    }
}
function CheckForSpecialKeys(oEvent) {
 
    switch (oEvent.keyCode) {
        case 32: // Space
            gbSpaceBarHit = true;
            break;
        case 80: // "P"
        case 27: // Escape
            TogglePause();
            break;
        case 77: // Mute
            if (chkMuteEffects.checked === Sounds.NotMuted
                || chkMuteMusic.checked === Music.NotMuted
                || Sounds.NotMuted != Music.NotMuted) {
                chkMuteEffects.checked = chkMuteMusic.checked = true;
                Sounds.NotMuted = Music.NotMuted = false;
            } else {
                chkMuteEffects.checked = !chkMuteEffects.checked;
                Sounds.NotMuted = !Sounds.NotMuted;
                chkMuteMusic.checked = !chkMuteMusic.checked;
                Music.NotMuted = !Music.NotMuted;
            }

            if (Sounds.NotMuted) {
                Sounds.Effects["Crawlig"].play();
                Music.Songs.BossTheme.play();
            } else {
                Sounds.Effects["Crawlig"].pause();
                Music.Songs.BossTheme.pause();
            }
            break;
        case 189: // -
            rangeEffectsVolume.value = Sounds.Volume = (Sounds.Volume > 0) ? Math.floor((Sounds.Volume - 0.1) * 10) / 10 : 0;
            rangeMusicVolume.value = Music.Songs.BossTheme.volume = Music.Volume = (Music.Volume > .1) ? Math.floor((Music.Volume - 0.2) * 10) / 10 : 0;
            Sounds.Effects["Crawlig"].volume = Sounds.Volume;
            Sounds.Pause.volume = Sounds.Volume;
            break;
        case 187: // =
            chkMuteEffects.checked = false;
            Sounds.NotMuted = true;
            rangeEffectsVolume.value = Sounds.Volume = Sounds.Volume < 1 ? Math.ceil((Sounds.Volume + 0.1) * 10) / 10 : 1;
            rangeMusicVolume.value = Music.Songs.BossTheme.volume = Music.Volume = Music.Volume < 1 ? Math.ceil((Music.Volume + 0.1) * 10) / 10 : 1;
            Sounds.Effects["Crawlig"].volume = Sounds.Volume;
            Sounds.Pause.volume = Sounds.Volume;
            break;
        default:
            return false;
    }
    
    return true;
}
function CheckForKeyEvents(oPlayer) {
    
    if (oPlayer.KeyLeftPressed) {
        oPlayer.DirectionX = -1;
        oPlayer.DirectionY = 0;
    }
    else if (oPlayer.KeyRightPressed) {
        oPlayer.DirectionX = 1;
        oPlayer.DirectionY = 0;
    }

    if (oPlayer.KeyUpPressed) {
        oPlayer.DirectionX = 0;
        oPlayer.DirectionY = -1;
    }
    else if (oPlayer.KeyDownPressed) {
        oPlayer.DirectionX = 0;
        oPlayer.DirectionY = 1;
    }

    if (gbDiagonalMovement) {

        if (oPlayer.KeyLeftPressed) {
            oPlayer.DirectionX = -1;
        }
        else if (oPlayer.KeyRightPressed) {
            oPlayer.DirectionX = 1;
        }
    }
}
function CheckForKeyDown(oEvent, oPlayer) {

    switch (oEvent.keyCode) {
        case oPlayer.KeyLeft:
            oPlayer.KeyLeftPressed = true;
            break;
        case oPlayer.KeyUp:
            oPlayer.KeyUpPressed = true;
            break;
        case oPlayer.KeyRight:
            oPlayer.KeyRightPressed = true;
            break;
        case oPlayer.KeyDown:
            oPlayer.KeyDownPressed = true;
            break;
        default:
            return false;
    }

    return true;
}
function KeyupEvent(oEvent) {

    if (!gbGamePaused && gaNibblers) {
        for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
        {
            if (gaNibblers[iLoop].Type == "Human" && CheckForKeyup(oEvent, gaNibblers[iLoop])) {
                CheckForKeyEvents(gaNibblers[iLoop]);
                break;
            }
        }
    }
}
function CheckForKeyup(oEvent, oPlayer) {

    switch (oEvent.keyCode) {
        case oPlayer.KeyLeft:
            oPlayer.KeyLeftPressed = false;
            break;
        case oPlayer.KeyUp:
            oPlayer.KeyUpPressed = false;
            break;
        case oPlayer.KeyRight:
            oPlayer.KeyRightPressed = false;
            break;
        case oPlayer.KeyDown:
            oPlayer.KeyDownPressed = false;
            break;
        default:
            return false;
    }

    return true;
}

function ClickEvent(event) {

    if (gbGamePaused) {
        return;
    }

    let iXOffset = Math.abs(gaNibblers[0].PositionX * giGridSize - event.pageX);
    let iYOffset = Math.abs(gaNibblers[0].PositionY * giGridSize - event.pageY);

    if (iXOffset >= iYOffset && gaNibblers[0].PositionX * giGridSize < event.pageX) {
        gaNibblers[0].DirectionX = 1;
        gaNibblers[0].DirectionY = 0;
    } else if (iXOffset >= iYOffset) {
        gaNibblers[0].DirectionX = -1;
        gaNibblers[0].DirectionY = 0;
    } else if (iXOffset < iYOffset && gaNibblers[0].PositionY * giGridSize < event.pageY) {
        gaNibblers[0].DirectionY = 1;
        gaNibblers[0].DirectionX = 0;
    } else if (iXOffset < iYOffset) {
        gaNibblers[0].DirectionY = -1;
        gaNibblers[0].DirectionX = 0;
    }
}

function TogglePause() {

    if (gbGamePaused && !gaNibblers) return;

    gbGamePaused = !gbGamePaused;

    if (gbGamePaused) {
        Pause();
    } else {
        UnPause();
    }
}
function Pause() {

    gbGamePaused = true;

    addClass(oDivGameMenu, "showGameMenu");
    addClass(oDivScoreboard, "modal-blur");
    addClass(canvArena, "modal-blur");
    addClass(oDivTime, "blink_me");

    clearInterval(goGameLoop);

    if (chkTime.checked) {
        clearInterval(ogCountdownTimer);
    }

    gaNibblers.forEach(function (oPlayer) { clearInterval(oPlayer.Timer) });

    if (gaBrainspawns) gaBrainspawns.forEach(function (oBrainspawn) { clearInterval(oBrainspawn.Timer) });

    Sounds.Effects["Crawlig"].pause();
    if (Sounds.NotMuted) Sounds.Effects["Pause"].play();
    
    oBtnStart.disabled = false;
}
function UnPause() {
    gbGamePaused = false;

    HideGameMenu();

    if (Sounds.NotMuted) Sounds.Effects["Crawlig"].play();

    goGameLoop = setInterval(GameLoop, giGameLoopSpeed);

    if (chkTime.checked) {
        goCountDownTime = new Date().setTime(new Date().getTime() + giTimeRemaining);
        ogCountdownTimer = setInterval(CountdownTimer, 500);
    }

    StartTimers();
}
function HideGameMenu() {
    removeClass(oDivGameMenu, "showGameMenu");
    removeClass(oDivScoreboard, "modal-blur");
    removeClass(canvArena, "modal-blur");
    removeClass(oDivTime, "blink_me");
}
function ResizeEvent() {
    // Runs each time the DOM window resize event fires.
    // Resets the canvas dimensions to match window,
    // then draws the new borders accordingly.
    giGridHeight = window.innerHeight - oDivScoreboard.offsetHeight;

    canvArena.width = window.innerWidth;
    canvArena.height = giGridHeight;

    giArenaSquaresX = Math.floor(window.innerWidth / giGridSize);
    giArenaSquaresY = Math.floor(giGridHeight / giGridSize);

    giMaxDistanceToPellet = Math.sqrt((giGridHeight * giGridHeight) + (window.innerWidth * window.innerWidth));

    DrawGrid();
}

function DrawGrid(Maze = gaMaze) {
    ctxArena.fillStyle = "black";
    ctxArena.fillRect(0, 0, window.innerWidth, giGridHeight);

    DrawMaze(Maze);

    ctxArena.strokeStyle = 'orange';
    ctxArena.lineWidth = giGridSizeHalf;
    ctxArena.strokeRect(0, 0, window.innerWidth, giGridHeight);
}
function DrawMaze(Maze) {

    ctxArena.lineWidth = 2;
    ctxArena.strokeStyle = "white";

    for (let iIndex = Maze.length; iIndex--;) {

        if (Maze[iIndex]) {

            let x = Maze[iIndex].i * giGridSize;
            let y = Maze[iIndex].j * giGridSize;

            if (Maze[iIndex].highlight) {
                ctxArena.fillStyle = "red";
                ctxArena.fillRect(x, y, giGridSize, giGridSize);
            }

            if (giVerbosity = goVerbosityEnum.Debug) DrawCharacter(iIndex, x, y);

            // Draw the spot
            ctxArena.beginPath();

            if (Maze[iIndex].walls[0]) {
                ctxArena.moveTo(x, y);
                ctxArena.lineTo(x, y + giGridSize);
                ctxArena.stroke();
            }

            if (Maze[iIndex].walls[1]) {
                ctxArena.moveTo(x, y + giGridSize);
                ctxArena.lineTo(x + giGridSize, y + giGridSize);
                ctxArena.stroke();
            }

            if (Maze[iIndex].walls[2]) {
                ctxArena.moveTo(x + giGridSize, y + giGridSize);
                ctxArena.lineTo(x + giGridSize, y);
                ctxArena.stroke();
            }

            if (Maze[iIndex].walls[3]) {
                ctxArena.moveTo(x + giGridSize, y);
                ctxArena.lineTo(x, y);
                ctxArena.stroke();
            }
        }
    }
}
function DrawCharacter(Character, x, y) {
    ctxArena.font = giGridSizeHalf + "px Comic Sans MS";
    ctxArena.fillStyle = "#383838";
    ctxArena.textAlign = "center";
    ctxArena.fillText(Character, x + giGridSizeHalf, y + giGridSizeHalf);
}
function DrawBegin() {
    ctxArena.font = giGridSize + "px Comic Sans MS";
    ctxArena.fillStyle = "blue";
    ctxArena.textAlign = "center";
    ctxArena.fillText("Click to Begin", window.innerWidth / 2, giGridSizeHalf);
}

function UpdateScoreboard() {

    let iPlayerWithHighScore = 0;
    for (let iLoop = gaNibblers.length; iLoop--;) {
        oSpanPlayer[iLoop].innerText = `${gaNibblers[iLoop].Name} (${gaNibblers[iLoop].Lives}) ${gaNibblers[iLoop].Score}`;

        if (gaNibblers[iLoop].Score > gaNibblers[iPlayerWithHighScore].Score) {
            iPlayerWithHighScore = iLoop;
        }
    }

    oDivHighScore.innerText = `HIGHSCORE (${gaNibblers[iPlayerWithHighScore].Name}) ${gaNibblers[iPlayerWithHighScore].Score}`;
}

function CountdownTimer() {

    // Find the time remaining between now and the count down date
    giTimeRemaining = goCountDownTime - new Date().getTime();
    let iSeconds = Math.floor(giTimeRemaining / 1000);

    oDivTime.innerHTML = `TIME ${iSeconds}`;

    if (iSeconds === 10) {
        addClass(oDivTime, "blink_me");
    }

    // If the count down is finished, write some text
    if (giTimeRemaining < 0) {
        oDivTime.innerHTML = "TIME EXPIRED";
        Pause();
    }
}
