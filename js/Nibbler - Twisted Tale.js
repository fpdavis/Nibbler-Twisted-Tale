window.onload = function () {

    console.info("Message logging set to " + goVerbosityEnum.Lookup[giVerbosity] + ", hit \"`\" to cycle through debugging levels.");

    window.addEventListener('resize', ResizeEvent, false);
    document.addEventListener("keydown", KeydownEvent);
    document.addEventListener("keyup", KeyupEvent);
    //document.addEventListener("click", ClickEvent, { passive: true });
    window.addEventListener("gamepadconnected", GamepadConnectedEvent);
    window.addEventListener("gamepaddisconnected", GamepadDisonnectedEvent);

    goHammer = new Hammer(document);
    goHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    goHammer.on("swipeleft swiperight swipeup swipedown tap press", function (oEvent) { TouchEvent(oEvent); });    

    addClass(oDivGameMenu, "showGameMenu");
    addClass(oDivScoreboard, "modal-blur");
    addClass(canvArena, "modal-blur");

    LoadSounds(gaSoundData);
    LoadMusic(gaMusicData);

    Sounds.Effects["Crawling"].loop = true;
       
    InitializePlayerControls();
};

function SetupArena() {

    switch (selectArenaSize.value) {
        case "Small":
            giGridSize = 62;
            break;
        case "Large":
            giGridSize = 20;
            break;
        default:
            giGridSize = 40;
    }

    giGridSizeHalf = giGridSize / 2;

    ResizeEvent();

    gaMaze.length = 0;
    if (chkMaze.checked) {        
        gaMaze = GenerateMaze(giArenaSquaresX, giArenaSquaresY);
    }
    else {
        gaMaze = GenerateEmptyMaze(giArenaSquaresX, giArenaSquaresY);        
    }

    HideDivs(oDivGameMenu);

    StartGame();
}

function StartGame() {
    if (gaSprites) gaSprites.length = 0;

    InitializePlayers();
    InitializePellets();
    
    gaNibblers.forEach(DrawLivingPlayer);

    if (chkTime.checked) {
        giTimeRemaining = 1000 * oNumberTime.value; // 1,000 ms per second
    }
    else {
        giTimeElapsed = 0;
        oSpanTime.innerHTML = "TIME 00:00";
    }
    
    switch (selectSpeed.value) {
        case "Slow":
            giGameLoopSpeed = 140;
            break;
        case "Fast":
            giGameLoopSpeed = 60;
            break;
        case "Normal":
            giGameLoopSpeed = 100;
            break;
        default:
            giGameLoopSpeed = Number(selectSpeed.value);
            break;
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

    ChangeCurrentSong(0);
    
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

    GamepadCheck();

    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        MovePlayer(gaNibblers[iLoop]);
    }
   
    DrawGrid();
        
    gaNibblers.forEach(PreDrawChecks);
    gaNibblers.forEach(DrawDeadPlayer);

    if (gaPellets) {
        gaPellets.forEach(Pellet.Draw);
    }

    gaNibblers.forEach(DrawLivingPlayer);    

    if (gaBrainspawns) {
        gaBrainspawns.forEach(Brainspawn.Draw);
    }

    gaSprites.sort(function (a, b) { return a.ZIndex - b.ZIndex });
    for (let iLoop = gaSprites.length; iLoop--;) {
        if (gaSprites[iLoop].Complete) {
            gaSprites.splice(iLoop, 1);
        } else {
            gaSprites[iLoop].Draw();
        }
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

    if (Math.round(Math.random() * 40) < 1) {
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
function RandomOpenNeighbor(oPlayer) {

    let oaNeighbors = OpenNeighbors(oPlayer);

    if (oaNeighbors.length > 0) {
        let iRandomIndex = Math.floor(Math.random() * oaNeighbors.length);
        return oaNeighbors[iRandomIndex];
    } else {
        return undefined;
    }
}
function OpenNeighbors(i, j) {
    let oaNeighbors = [];
    let oNode = gaMaze[MGIndex(i, j, giArenaSquaresX, giArenaSquaresY)];

    // TODO: Secondary wall checks are here (backword looking) due to some walls not having both sides in the grid.
    // This should be fixed in grid generation.

    let North = gaMaze[MGIndex(i,    j - 1, giArenaSquaresX, giArenaSquaresY)];
    let East = gaMaze[MGIndex(i + 1, j,     giArenaSquaresX, giArenaSquaresY)];
    let South = gaMaze[MGIndex(i,    j + 1, giArenaSquaresX, giArenaSquaresY)];
    let West = gaMaze[MGIndex(i - 1, j,     giArenaSquaresX, giArenaSquaresY)];

    if (North && !oNode.walls[goWalls.North]) {
        oaNeighbors.push(North);
    }
    if (South && !oNode.walls[goWalls.South]) {
        oaNeighbors.push(South);
    }
    if (East && !oNode.walls[goWalls.East]) {
        oaNeighbors.push(East);
    }
    if (West && !oNode.walls[goWalls.West]) {
        oaNeighbors.push(West);
    }
          
    if (gbDiagonalMovement) {
        let NorthEast = gaMaze[MGIndex(i + 1, j - 1, giArenaSquaresX, giArenaSquaresY)];
        let SouthEast = gaMaze[MGIndex(i + 1, j + 1, giArenaSquaresX, giArenaSquaresY)];
        let SouthWest = gaMaze[MGIndex(i - 1, j + 1, giArenaSquaresX, giArenaSquaresY)];
        let NorthWest = gaMaze[MGIndex(i - 1, j - 1, giArenaSquaresX, giArenaSquaresY)];

        if (!oNode.walls[goWalls.North]) {
            if (NorthWest && !oNode.walls[goWalls.West]) {
                oaNeighbors.push(NorthWest);
            }

            if (NorthEast && !oNode.walls[goWalls.East]) {
                oaNeighbors.push(NorthEast);
            }
        }

        if (!oNode.walls[goWalls.South]) {
            if (SouthWest && !oNode.walls[goWalls.West]) {
                oaNeighbors.push(SouthWest);
            }

            if (SouthEast && !oNode.walls[goWalls.East]) {
                oaNeighbors.push(SouthEast);
            }
        }
    }

    return oaNeighbors;
}

function KeydownEvent(oEvent) {

    if (CheckForSpecialKeys(oEvent)) {
        return;
    } else {
        if (giGameState === goGameStateEnum.Running && gaNibblers) {
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
        case 19: // "Pause/Break"
            TogglePause(oDivPaused);
            break;
        case 27: // Escape
            TogglePause(oDivGameMenu);
            break;
        case 77: // Mute
            if (chkMuteEffects.checked === Sounds.NotMuted
                || chkMuteMusic.checked === Music.NotMuted
                || Sounds.NotMuted !== Music.NotMuted) {
                chkMuteEffects.checked = chkMuteMusic.checked = true;
                Sounds.NotMuted = Music.NotMuted = false;
            } else {
                chkMuteEffects.checked = !chkMuteEffects.checked;
                Sounds.NotMuted = !Sounds.NotMuted;
                chkMuteMusic.checked = !chkMuteMusic.checked;
                Music.NotMuted = !Music.NotMuted;
            }

            if (Sounds.NotMuted) {
                Sounds.Effects["Crawling"].play();
                Music.Songs[giCurrentSong].play();
                ShowNotification(`UnMuted`, "Notification");
            } else {
                Sounds.Effects["Crawling"].pause();
                Music.Songs[giCurrentSong].pause();
                ShowNotification(`Muted`, "Notification");
            }
            break;
        case 109: // Numpad -
        case 173: // Minus (Firefox), mute/unmute
        case 182: // Decrease Volume Level (Firefox)
        case 189: // -
            rangeEffectsVolume.value = Sounds.Volume = (Sounds.Volume > 0) ? Math.floor((Sounds.Volume - 0.1) * 10) / 10 : 0;
            rangeMusicVolume.value = Music.Songs[giCurrentSong].volume = Music.Volume = (Music.Volume > .1) ? Math.floor((Music.Volume - 0.2) * 10) / 10 : 0;
            Sounds.Effects["Crawling"].volume = Sounds.Volume;
            ShowNotification("Volume: " + "|".repeat((Sounds.Volume + Music.Volume) * 10), "Notification");                
            break;
        case 61: // =
        case 107: // Numpad +
        case 183: // Increase Volume Level (Firefox)
        case 187: // =        
            chkMuteEffects.checked = false;
            Sounds.NotMuted = true;
            rangeEffectsVolume.value = Sounds.Volume = Sounds.Volume < 1 ? Math.ceil((Sounds.Volume + 0.1) * 10) / 10 : 1;
            rangeMusicVolume.value = Music.Songs[giCurrentSong].volume = Music.Volume = Music.Volume < 1 ? Math.ceil((Music.Volume + 0.1) * 10) / 10 : 1;
            Sounds.Effects["Crawling"].volume = Sounds.Volume;
            ShowNotification("Volume: " + "|".repeat((Sounds.Volume + Music.Volume) * 10), "Notification");                
            break;
        case 188: // ,
            ChangeCurrentSong(-1);
            break;
        case 190: // .
            ChangeCurrentSong(1);
            break;
        case 192: // `
            ChangeVerbosity(1);
            break;
        case 33: // Page Up  
            giGameLoopSpeed = giGameLoopSpeed <= 99 ? 60 : giGameLoopSpeed - 40;
            ShowNotification("Speed: " + UpdateGameLoopSpeed(), "Notification");                
            break;
        case 34: // Page Down
            giGameLoopSpeed += 40;
            ShowNotification("Speed: " + UpdateGameLoopSpeed(), "Notification");
            break;
        case 112: // F1
            Pause();
            Credits();
            break;
        default:
            MessageLog(`No special key match for (` + oEvent.keyCode + ' / ' + keyCodes[oEvent.keyCode] + ')', goVerbosityEnum.Debug);

            if (oTxtControllerMenuUp === document.activeElement) oTxtControllerMenuUp.value = keyCodes[oEvent.keyCode];
            else if (oTxtControllerMenuDown === document.activeElement) oTxtControllerMenuDown.value = keyCodes[oEvent.keyCode];
            else if (oTxtControllerMenuLeft === document.activeElement) oTxtControllerMenuLeft.value = keyCodes[oEvent.keyCode];
            else if (oTxtControllerMenuRight === document.activeElement) oTxtControllerMenuRight.value = keyCodes[oEvent.keyCode];
            
            return false;
    }

    if (oTxtControllerMenuUp === document.activeElement
        || oTxtControllerMenuDown === document.activeElement
        || oTxtControllerMenuLeft === document.activeElement
        || oTxtControllerMenuRight === document.activeElement) {
        oSpanControllerMenuStatusBar.innerHTML = "The " + keyCodes[oEvent.keyCode] + " key is reserved";
    }

    return true;
}
function UpdateGameLoopSpeed() {
    
    MessageLog(`Game Loop Speed = ` + giGameLoopSpeed, goVerbosityEnum.Information);

    if (gaNibblers) {
        clearInterval(goGameLoop);
        goGameLoop = setInterval(GameLoop, giGameLoopSpeed);
    }

    switch (giGameLoopSpeed) {
        case 140:
            selectSpeed.value = "Slow";
            return selectSpeed.value;
        case 60:
            selectSpeed.value = "Fast";
            return selectSpeed.value;
        case 100:
            selectSpeed.value = "Normal";
            return selectSpeed.value;
    }

    let oCustomOption = document.getElementById("CustomOption");
    if (!oCustomOption) {
        oCustomOption = document.createElement('option');
        oCustomOption.id = "CustomOption";
                
        selectSpeed.appendChild(oCustomOption);        
    }

    oCustomOption.innerHTML = "Custom (" + giGameLoopSpeed + ")";
    oCustomOption.value = giGameLoopSpeed;
    selectSpeed.value = giGameLoopSpeed;

    return oCustomOption.innerHTML;
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

    if (gaPlayerControls[oPlayer.Index].SelectedControllerType === "Keyboard") {
    switch (oEvent.keyCode) {
        case gaPlayerControls[oPlayer.Index].Left:
            oPlayer.KeyLeftPressed = true;
            break;
        case gaPlayerControls[oPlayer.Index].Up:
            oPlayer.KeyUpPressed = true;
            break;
        case gaPlayerControls[oPlayer.Index].Right:
            oPlayer.KeyRightPressed = true;
            break;
        case gaPlayerControls[oPlayer.Index].Down:
            oPlayer.KeyDownPressed = true;
            break;
        default:
            return false;
    }

        return true;
    }
    else {
        return false;
    }
}

function KeyupEvent(oEvent) {

    if (giGameState === goGameStateEnum.Running && gaNibblers) {
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

    if (gaPlayerControls[oPlayer.Index].SelectedControllerType === "Keyboard") {
        switch (oEvent.keyCode) {
            case gaPlayerControls[oPlayer.Index].Left:
                oPlayer.KeyLeftPressed = false;
                break;
            case gaPlayerControls[oPlayer.Index].Up:
                oPlayer.KeyUpPressed = false;
                break;
            case gaPlayerControls[oPlayer.Index].Right:
                oPlayer.KeyRightPressed = false;
                break;
            case gaPlayerControls[oPlayer.Index].Down:
                oPlayer.KeyDownPressed = false;
                break;
            default:
                return false;
        }

        return true;
    }
    else {
        return false;
    }
}

function ClickEvent(oEvent) {
    
    if (giVerbosity === goVerbosityEnum.Debug) {

        MessageLog(`==============================================`, goVerbosityEnum.Debug);
        MessageLog(`  Mouse Coordinates: (${oEvent.pageX}, ${oEvent.pageY})`, goVerbosityEnum.Debug);
        
        if (giGameState !== goGameStateEnum.Running) {
            return;
        }

        if (gaMaze.length > 0) {

            let iPositionX = Math.floor(oEvent.pageX / giGridSize);
            let iPositionY = Math.floor((oEvent.pageY - 100) / giGridSize);
            let iIndex = MGIndex(iPositionX, iPositionY, giArenaSquaresX, giArenaSquaresY);

            MessageLog(`        Coordinates: (${iPositionX}, ${iPositionY})`, goVerbosityEnum.Debug);
            MessageLog(`Reduced Coordinates: ${iIndex}`, goVerbosityEnum.Debug);

            let oNode = gaMaze[iIndex];
            let sWalls = "";

            MessageLog(`   Node Coordinates: (${oNode.i}, ${oNode.j})`, goVerbosityEnum.Debug);
            if (oNode.walls[goWalls.West]) sWalls += "["
            if (oNode.walls[goWalls.South] && oNode.walls[goWalls.North]) sWalls += "=";
            else if (oNode.walls[goWalls.South]) sWalls += "_";
            else if (oNode.walls[goWalls.North]) sWalls += "¯";
            if (oNode.walls[goWalls.East]) sWalls += "]";

            if (oEvent.button === 1) {
                gaMaze.forEach(function (oNode) { oNode.highlight = false; });
            }

            MessageLog(`Walls: ${sWalls}`, goVerbosityEnum.Debug);
            let oaOpenNeighbors = OpenNeighbors(iPositionX, iPositionY);
            MessageLog(`Neighbors: ` + oaOpenNeighbors.length, goVerbosityEnum.Debug);
            oaOpenNeighbors.forEach(function (oNeighbor) { oNeighbor.highlight = true; });
        }
    }
    
    let iXOffset = Math.abs(gaNibblers[0].PositionX * giGridSize - oEvent.pageX);
    let iYOffset = Math.abs(gaNibblers[0].PositionY * giGridSize - oEvent.pageY);

    if (iXOffset >= iYOffset && gaNibblers[0].PositionX * giGridSize < oEvent.pageX) {
        gaNibblers[0].DirectionX = 1;
        gaNibblers[0].DirectionY = 0;
    } else if (iXOffset >= iYOffset) {
        gaNibblers[0].DirectionX = -1;
        gaNibblers[0].DirectionY = 0;
    } else if (iXOffset < iYOffset && gaNibblers[0].PositionY * giGridSize < oEvent.pageY) {
        gaNibblers[0].DirectionY = 1;
        gaNibblers[0].DirectionX = 0;
    } else if (iXOffset < iYOffset) {
        gaNibblers[0].DirectionY = -1;
        gaNibblers[0].DirectionX = 0;
    }
}
function TouchEvent(oEvent) {

    switch (oEvent.type) {
        case "swipeleft":
            document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: gaPlayerControls[0].Left }));
            document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: gaPlayerControls[0].Left }));
            break;
        case "swiperight":
            document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: gaPlayerControls[0].Right }));
            document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: gaPlayerControls[0].Right }));
            break;
        case "swipeup":
            document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: gaPlayerControls[0].Up }));
            document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: gaPlayerControls[0].Up }));
            break;
        case "swipedown":
            document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: gaPlayerControls[0].Down }));
            document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: gaPlayerControls[0].Down }));
            break;
        case "tap":
            if (!hasClass(oDivGameMenu, "showGameMenu") && !hasClass(oDivControllerMenu, "showGameMenu")) {
                document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 19 }));
                document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 19 }));
            }
            break;
        case "press":
            document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
            document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 27 }));
            break;
    }
}

function TogglePause(oDiv) {
    
    if (giGameState === goGameStateEnum.Running) {
        giGameState = goGameStateEnum.Paused;
    }
    else if (giGameState === goGameStateEnum.Paused) {

        // This if allows us to change from the pause screen to the menu directly
        if (oDiv !== oDivGameMenu || !hasClass(oDivPaused, "showGameMenu")) {
            giGameState = goGameStateEnum.Running;
        }
    }
    else if (giGameState === goGameStateEnum.Over)
    {
        oDiv = oDivGameMenu;
        clearTimeout(goRestartAllComputersTimer);
    }

    if (giGameState !== goGameStateEnum.Running) {
        Pause(oDiv);
    } else {
        UnPause();
    }
}
function Pause(oDiv) {
    
    HideDivs();

    if (oDiv !== null) {
        addClass(oDiv, "showGameMenu");
    }

    addClass(oDivScoreboard, "modal-blur");
    addClass(canvArena, "modal-blur");
    addClass(oSpanTime.parentElement, "blink_me");

    clearInterval(goGameLoop);
    clearInterval(goTimer);
    
    if (gaNibblers) gaNibblers.forEach(function (oPlayer) { clearInterval(oPlayer.Timer); });

    if (gaBrainspawns) gaBrainspawns.forEach(function (oBrainspawn) { clearInterval(oBrainspawn.Timer); });

    Sounds.Effects["Crawling"].pause();
    if (Sounds.NotMuted) Sounds.Effects["Pause"].play();
    
    oBtnStart.disabled = false;
}
function UnPause() {
    giGameState = goGameStateEnum.Running;

    HideDivs();

    if (Sounds.NotMuted) Sounds.Effects["Crawling"].play();

    goGameLoop = setInterval(GameLoop, giGameLoopSpeed);

    if (chkTime.checked) {
        goCountDownTime = new Date().setTime(new Date().getTime() + giTimeRemaining);
        goTimer = setInterval(Timer, 500);
    }
    else {
        goTimer = setInterval(Timer, 500);
    }

    StartTimers();
}
function HideDivs() {

    removeClass(oDivGameMenu, "showGameMenu");
    removeClass(oDivPaused, "showGameMenu");
    removeClass(oDivGameOver, "showGameMenu");
    removeClass(oDivCredits, "showGameMenu");
    
    removeClass(oDivScoreboard, "modal-blur");
    removeClass(canvArena, "modal-blur");
    removeClass(oSpanTime.parentElement, "blink_me");

    canvArena.focus();
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
            
            if (giVerbosity === goVerbosityEnum.Debug) {
                DrawCharacter(iIndex, x, y);

                if (Maze[iIndex].highlight) {
                    ctxArena.beginPath();
                    ctxArena.fillStyle = Maze[iIndex].fillStyle;
                    ctxArena.arc(x + giGridSizeHalf, y + giGridSizeHalf, giGridSizeHalf * .2, 0, 2 * Math.PI);
                    ctxArena.fill();
                    Maze[iIndex].highlight = false;
                }
            } 

            // Draw the spot
            ctxArena.beginPath();

            if (Maze[iIndex].walls[goWalls.North]) {
                ctxArena.moveTo(x,              y);
                ctxArena.lineTo(x + giGridSize, y);
                ctxArena.stroke();
            }
            if (Maze[iIndex].walls[goWalls.South]) {
                ctxArena.moveTo(x,              y + giGridSize);
                ctxArena.lineTo(x + giGridSize, y + giGridSize);
                ctxArena.stroke();
            }
            if (Maze[iIndex].walls[goWalls.East]) {
                ctxArena.moveTo(x + giGridSize, y);
                ctxArena.lineTo(x + giGridSize, y + giGridSize);
                ctxArena.stroke();
            }

            if (Maze[iIndex].walls[goWalls.West]) {
                ctxArena.moveTo(x, y);
                ctxArena.lineTo(x, y + giGridSize);
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

function ShowNotification(sText, sId) {

    // Restart CSS Animation - https://css-tricks.com/restart-css-animation/
    let oSpanOldNotification = document.getElementById("spanNotification_" + sId);
    if (oSpanOldNotification !== null) {
        let oSpanNotification = document.createElement('span');
        oSpanNotification.id = oSpanOldNotification.id + "_ExplodingNow";
        oSpanNotification.innerHTML = oSpanOldNotification.innerHTML;
        addClass(oSpanNotification, "explodeNow"); 
        oSpanOldNotification.parentNode.appendChild(oSpanNotification); 
        oSpanOldNotification.parentNode.removeChild(oSpanOldNotification);
    }

    let oDivNotification = document.createElement('div');
    oDivNotification.id = "divNotification_" + sId;

    let oSpanNotification = document.createElement('span');
    oSpanNotification.id = "spanNotification_" + sId;
    oSpanNotification.innerHTML = sText;

    addClass(oDivNotification, "notifcation");
    addClass(oDivNotification, "neonScoreboard");
        
    addClass(oSpanNotification, "explode");    

    oDivNotification.appendChild(oSpanNotification); 
    document.body.appendChild(oDivNotification);     

    setTimeout(function () { if (oDivNotification.parentNode) { oDivNotification.parentNode.removeChild(oDivNotification); }}, 3700);
}

function UpdateScoreboard() {

    let iPlayerWithHighScore = 0;
    for (let iLoop = gaNibblers.length; iLoop--;) {
        oSpanPlayer[iLoop].innerHTML = `${gaNibblers[iLoop].Name} (${gaNibblers[iLoop].Lives}) ${gaNibblers[iLoop].Score}`;

        if (gaNibblers[iLoop].Score > gaNibblers[iPlayerWithHighScore].Score) {
            iPlayerWithHighScore = iLoop;
        }
    }

    oSpanHighScore.innerText = `HIGHSCORE (${gaNibblers[iPlayerWithHighScore].Name}) ${gaNibblers[iPlayerWithHighScore].Score}`;
}

function Timer() {

    if (chkTime.checked) {
        // Find the time remaining between now and the count down date
        giTimeRemaining = goCountDownTime - new Date().getTime();
        let sFormatedTime = FormatTime(Math.floor(giTimeRemaining / 1000));

        oSpanTime.innerHTML = `TIME ${sFormatedTime}`;

        if (sFormatedTime === "00:10") {
            addClass(oSpanTime.parentElement, "blink_me");
        }

        // If the count down is finished end game
        if (giTimeRemaining < 0) {            
            GameOver();
        }
    }
    else {
        giTimeElapsed += .5;

        oSpanTime.innerHTML = "TIME " + FormatTime(giTimeElapsed);
    }
}

function FormatTime(iTimeInSeconds) {

    if (iTimeInSeconds > 6000) {
        return "99:99";
    }
    else if (iTimeInSeconds <= 0) {
        return "EXPIRED";
    }
    else {
        let iMinutes = Math.floor(iTimeInSeconds / 60);
        let iSeconds = Math.floor(iTimeInSeconds % 60);

        iMinutes = (iMinutes < 10) ? '0' + iMinutes : iMinutes;
        iSeconds = (iSeconds < 10) ? '0' + iSeconds : iSeconds;

        return `${iMinutes}:${iSeconds}`;
    }
    

}

function GameOver() {

    Pause();
    giGameState = goGameStateEnum.Over;

    let bAllComputers = true;

    let iPlayerWithHighScore = 0;
    let sWinnerNames = gaNibblers[0].Name;
    let iWinners = 1;
    for (let iLoop = 0; iLoop < gaNibblers.length; iLoop++) {
        if (gaNibblers[iLoop].Score > gaNibblers[iPlayerWithHighScore].Score
            || (iLoop !== iPlayerWithHighScore && gaNibblers[iLoop].Score === gaNibblers[iPlayerWithHighScore].Score && gaNibblers[iLoop].Lives > gaNibblers[iPlayerWithHighScore].Lives)
            ) {
            iPlayerWithHighScore = iLoop;
            sWinnerNames = gaNibblers[iPlayerWithHighScore].Name;
            iWinners = 1;
        }
        else if (iLoop !== iPlayerWithHighScore && gaNibblers[iLoop].Score === gaNibblers[iPlayerWithHighScore].Score
            && gaNibblers[iLoop].Lives === gaNibblers[iPlayerWithHighScore].Lives) {
            sWinnerNames += " and " + gaNibblers[iLoop].Name;
            iWinners++;
        }

        if (gaNibblers[iLoop].Type !== "Computer") { bAllComputers = false; }
    }

    if (iWinners === 1) {
        oDivGameOver.childNodes[1].childNodes[3].innerHTML = `*** ${sWinnerNames} Wins ***`;
    }
    else {
        oDivGameOver.childNodes[1].childNodes[3].innerHTML = `${sWinnerNames} Tie!`;
    }

    removeClass(oDivGameOver, "scroll-gameover-up"); 
    addClass(oDivGameOver, "showGameMenu");

    // If all the placers are bots restart the game
    if (bAllComputers) {
        goRestartAllComputersTimer = setTimeout(function () { NewGameTimer(5000); }, 15000);
    }
    else {
        setTimeout(function () { Credits(); }, 9000);
    }
}

function NewGameTimer(iMiliSeconds) {
    if (iMiliSeconds < 1) {
        ShowNotification("Zero!", "Notification");
        SetupArena();
    }
    else {
        ShowNotification("New Game In " + Math.floor(iMiliSeconds / 1000), "Notification");
        goRestartAllComputersTimer = setTimeout(function () { NewGameTimer(iMiliSeconds - 1000); }, 1000);
    }
}

function CurrentDiv() {

    if (hasClass(oDivGameMenu, "showGameMenu")) {
        return oDivGameMenu;
    }
    else if (hasClass(oDivPaused, "showGameMenu")) {
        return oDivPaused;
    }
    else if (hasClass(oDivGameOver, "showGameMenu")) {
        return oDivGameOver;
    }
    else if (hasClass(oDivCredits, "showGameMenu")) {
        return oDivCredits;
    }
    else if (hasClass(oDivControllerMenu, "showGameMenu")) {
        return oDivControllerMenu;
    }
    else {
        return null;
    }
}

function Credits() {
    let oDivCurrent = CurrentDiv();

    if (oDivCurrent !== oDivCredits) {
        if (oDivCurrent === oDivGameOver) {
            
           // if (!hasClass(oDivGameOver, "scroll-gameover-up")) {
                //removeClass(oDivGameOver, "showGameMenu");
                addClass(oDivGameOver, "scroll-gameover-up");                
                //addClass(oDivGameOver, "showGameMenu");
            //}
            //else {
            //    // Need to restart the animation
            //    oDivGameOver.parentNode.replaceChild(oDivGameOver.cloneNode(true), oDivGameOver);
            //    oDivGameOver = document.getElementById("divGameOver");
            //}   
        }

        if (!hasClass(oDivCredits, "scroll-credits-up")) {
            let oBrCreditsEnd = document.getElementById("brMusicCreditsEnd");
            let oElement;

            for (let iLoop = 0; iLoop < gaMusicData.length; iLoop++) {
                if (gaMusicData[iLoop]['src'] !== "" && gaMusicData[iLoop]['Contributor'] !== "") {
                    oElement = document.createElement('span');                    
                    oElement.innerHTML = gaMusicData[iLoop]['src'].split("/").pop().split(".")[0];
                    addClass(oElement, "neonCreditName");
                    oBrCreditsEnd.parentNode.insertBefore(oElement, oBrCreditsEnd);

                    oElement = document.createElement('span');                    
                    oElement.innerHTML = gaMusicData[iLoop]['Contributor'];
                    addClass(oElement, "neonCreditValue");
                    oBrCreditsEnd.parentNode.insertBefore(oElement, oBrCreditsEnd);

                    oElement = document.createElement('br');                    
                    oBrCreditsEnd.parentNode.insertBefore(oElement, oBrCreditsEnd);
                }
            }                

            oBrCreditsEnd = document.getElementById("brSoundCreditsEnd");
            for (let iLoop = 0; iLoop < gaSoundData.length; iLoop++) {
                if (gaMusicData[iLoop]['src'] !== "" && gaSoundData[iLoop]['Contributor'] !== "") {
                    oElement = document.createElement('span');
                    oElement.innerHTML = gaSoundData[iLoop]['title'];
                    addClass(oElement, "neonCreditName");
                    oBrCreditsEnd.parentNode.insertBefore(oElement, oBrCreditsEnd);

                    oElement = document.createElement('span');
                    oElement.innerHTML = gaSoundData[iLoop]['Contributor'];
                    addClass(oElement, "neonCreditValue");
                    oBrCreditsEnd.parentNode.insertBefore(oElement, oBrCreditsEnd);

                    oElement = document.createElement('br');
                    oBrCreditsEnd.parentNode.insertBefore(oElement, oBrCreditsEnd);
                }
            }    

            addClass(oDivCredits, "scroll-credits-up");
            addClass(oDivCredits, "showGameMenu");            
        }
        else {
            // Need to restart the animation
            oDivCredits.parentNode.replaceChild(oDivCredits.cloneNode(true), oDivCredits);
            oDivCredits = document.getElementById("divCredits");
            addClass(oDivCredits, "showGameMenu");
        }        
    }
    else {
        TogglePause(oDivGameMenu);
    }
}