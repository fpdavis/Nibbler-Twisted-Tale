
const canvArena = document.getElementById("canArena");
const ctxArena = canvArena.getContext("2d");

const oDivScoreboard = document.getElementById('divScoreboard');

const oColorPlayer = new Array(4);
oColorPlayer[0] = document.getElementById('colorPlayer1');
oColorPlayer[1] = document.getElementById('colorPlayer2');
oColorPlayer[2] = document.getElementById('colorPlayer3');
oColorPlayer[3] = document.getElementById('colorPlayer4');

const oSpanPlayer = new Array(4);
oSpanPlayer[0] = document.getElementById('spanPlayer1');
oSpanPlayer[1] = document.getElementById('spanPlayer2');
oSpanPlayer[2] = document.getElementById('spanPlayer3');
oSpanPlayer[3] = document.getElementById('spanPlayer4');

const oDivTime = document.getElementById('divTime');
const oDivHighScore = document.getElementById('divHighScore');

const oDivGameMenu = document.getElementById('divGameMenu');

const oColorMenuPlayer = new Array(4);
oColorMenuPlayer[0] = document.getElementById('colorMenuPlayer1');
oColorMenuPlayer[1] = document.getElementById('colorMenuPlayer2');
oColorMenuPlayer[2] = document.getElementById('colorMenuPlayer3');
oColorMenuPlayer[3] = document.getElementById('colorMenuPlayer4');

const oSelectPlayer = new Array(4);
oSelectPlayer[0] = document.getElementById('selectPlayer1');
oSelectPlayer[1] = document.getElementById('selectPlayer2');
oSelectPlayer[2] = document.getElementById('selectPlayer3');
oSelectPlayer[3] = document.getElementById('selectPlayer4');

const oTxtPlayerName = new Array(4);
oTxtPlayerName[0] = document.getElementById('txtPlayer1Name');
oTxtPlayerName[1] = document.getElementById('txtPlayer2Name');
oTxtPlayerName[2] = document.getElementById('txtPlayer3Name');
oTxtPlayerName[3] = document.getElementById('txtPlayer4Name');

const oNumberLives = document.getElementById('numberLives');
const oSelectTime = document.getElementById('selectTime');
const oSelectSound = document.getElementById('selectSound');

const oNumberTime = document.getElementById('numberTime');
const oSelectWallWrap = document.getElementById('selectWallWrap');
const oSelectDeadlyWalls = document.getElementById('selectDeadlyWalls');
const oSelectDeadlyTails = document.getElementById('selectDeadlyTails');
const oSelectDiagonalMovement = document.getElementById('selectDiagonalMovement');
const oSelectMaze = document.getElementById('selectMaze');
const oSelectEnemies = document.getElementById('selectEnemies');
const oSelectDificulty = document.getElementById('selectDificulty');
const oSelectSpeed = document.getElementById('selectSpeed');
const oBtnStart = document.getElementById('btnStart');

const iPointsLostForTailCollision = 5;
const iPointsLostForWallCollision = 5;

var giGameLoopSpeed;
var gaGrid = [];
var gaMaze = [];
var giGridSize;
var giGridHeight = window.innerHeight - oDivScoreboard.offsetHeight;
var giMaxDistanceToPellet;
var giMinimumTailLength = 3;
var gbGamePaused = true;
var ogPlayer;
var ogPellet;
var ogCountDownTime;
var ogCountdownTimer;
var giTimeRemaining;
var ogGameLoop;
var gbWallWrap;
var gbDeadlyWalls;
var gbDeadlyTails;
var gbDiagonalMovement;

var giArenaSquaresX;
var giArenaSquaresY;

window.onload = function () {

    window.addEventListener('resize', ResizeEvent, false);
    document.addEventListener("keydown", KeydownEvent);
    document.addEventListener("click", ClickEvent);

    addClass(oDivGameMenu, "showGameMenu");
    addClass(oDivScoreboard, "modal-blur");
    addClass(canvArena, "modal-blur");

    Sounds.Crawlig.loop = true;
}

// Define Sounds
var aSounds = [];
var Sounds = {
    Volume: .8,
    NotMuted: true,
    Bite: new Audio('Sounds/Bite-SoundBible.com-2056759375.mp3'),
    Pause: new Audio('Sounds/Splat And Squirt-SoundBible.com-2136633229.mp3'),
    Crawlig: new Audio('Sounds/termites_and_ants-mike-koenig.mp3')
}

class Nibbler {
    constructor() {
        this.Index;
        this.Name = "Player ";
        this.Lives = 3;
        this.Score = 0;
        this.Dead = false;
        this.Type = "";
        this.ComputerPlayerTimer = null;

        this.PositionX = 0;
        this.PositionY = 0;

        this.DirectionX = 0;
        this.DirectionY = 0;
        this.Direction = 0;
        this.TargetPellet = null;

        this.Trail = [];
        this.TailLength = giMinimumTailLength;

        this.KeyLeft = 37; // Left Arrow
        this.KeyUp = 38; // Up Arrow
        this.KeyRight = 39; // Right Arrow
        this.KeyDown = 40; // Down Arrow

        this.fillStyle = "lime";
    }
}
Nibbler.prototype.UpdateTail = function () {
    this.Trail.push({ x: this.PositionX, y: this.PositionY });

    while (this.Trail.length > this.TailLength) {
        this.Trail.shift();
    }
}
Nibbler.prototype.SetSpawnPoint = function () {
    this.PositionX = Math.floor(Math.random() * (giArenaSquaresX - 2)) + 1;
    this.PositionY = Math.floor(Math.random() * (giArenaSquaresY - 2)) + 1;

    // Don't spawn on top of another player
    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        if (ogPlayer[iLoop] != null &&
            this !== ogPlayer[iLoop] &&
            this.PositionX === ogPlayer[iLoop].PositionX &&
            this.PositionY === ogPlayer[iLoop].PositionY) {
            this.SetSpawnPoint();
        }
    }
}
Nibbler.UpdateTail = function (oNibbler) { oNibbler.UpdateTail(); }

class Pellet {
    constructor() {
        this.Name = "Pellet";
        this.Points = 10;
        this.TailAdjustment = 1;
        this.Type = Math.round(Math.random());
        this.PositionX = 0;
        this.PositionY = 0;

        this.Sound = new Audio(Sounds.Bite.src);
        this.strokeStyle = "grey";
        this.fillStyle = "Red";

        this.SetSpawnPoint();
    }
}
Pellet.prototype.SetSpawnPoint = function () {
    this.PositionX = Math.floor(Math.random() * (giArenaSquaresX - 2)) + 1;
    this.PositionY = Math.floor(Math.random() * (giArenaSquaresY - 2)) + 1;

    // Don't spawn on top a player
    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        if (this.PositionX === ogPlayer[iLoop].PositionX && this.PositionY === ogPlayer[iLoop].PositionY) {
            this.SetSpawnPoint();
        }
    }

    // Don't spawn on top of another pellet
    for (let iLoop = ogPellet.length; iLoop--;) // Reverse loop for the win
    {
        if (ogPellet[iLoop] != null &&
            this !== ogPellet[iLoop] &&
            this.PositionX === ogPellet[iLoop].PositionX &&
            this.PositionY === ogPellet[iLoop].PositionY) {
            this.SetSpawnPoint();
        }
    }

}
Pellet.prototype.Eatten = function (oPlayer) {

    if (Sounds.NotMuted) {
        this.Sound.volume = Sounds.Volume;
        this.Sound.play();
    }

    this.Power(oPlayer);

    // Tell other players this pellet has been eaten
    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        if (this === ogPlayer[iLoop].TargetPellet) ogPlayer[iLoop].TargetPellet = null;
    }
}
Pellet.prototype.Power = function (oPlayer) {

    switch (this.Type) {
        case 0:
            oPlayer.TailLength += this.TailAdjustment;
            oPlayer.Score += this.Points;
            break;
        case 1:
            oPlayer.Score += this.Points;
            break;
    }
}

function StartGame() {

    switch (oSelectDificulty.value) {
        case "Easy":
            giGridSize = 60;
            break;
        case "Hard":
            giGridSize = 30;
            break;
        default:
            giGridSize = 40;
    }

    giArenaSquaresX = Math.floor(window.innerWidth / giGridSize);
    giArenaSquaresY = Math.floor(giGridHeight / giGridSize);

    InitializePlayers();

    ogPellet = new Array(ogPlayer.length + 1);
    InitializePellets(ogPellet);

    ResizeEvent();

    ogPlayer.forEach(DrawPlayer);

    if (oSelectTime.value == "On") {
        giTimeRemaining = 1000 * oNumberTime.value; // 1,000 ms per second
    }
    else {
        oDivTime.innerText = "";
    }

    Sounds.NotMuted = oSelectSound.value == "true";

    switch (oSelectSpeed.value) {
        case "Slow":
            giGameLoopSpeed = 120;
            break;
        case "Fast":
            giGameLoopSpeed = 40;
            break;
        default:
            giGameLoopSpeed = 66;
    }

    gbWallWrap = (oSelectWallWrap.value == "On") ? true : false;
    gbDeadlyWalls = (oSelectDeadlyWalls.value == "On") ? true : false;
    gbDeadlyTails = (oSelectDeadlyTails.value == "On") ? true : false;
    gbDiagonalMovement = (oSelectDiagonalMovement.value == "On") ? true : false;

    // Todo:
    //selectDiagonalMovement
    //selectMaze
    //selectEnemies

    gaMaze = GenerateMaze(giArenaSquaresX, giArenaSquaresY);
    
    UnPause();
    
    UpdateScoreboard();

    oBtnStart.disabled = true;
}
function InitializePlayers() {

    for (let iLoop = 1; iLoop < 4; iLoop++)
    {
        oColorPlayer[iLoop].style.display = 'none';
        oSpanPlayer[iLoop].innerText = ``;
        removeClass(oSpanPlayer[iLoop], "blink_me");
    }

    let iNumberOfPlayers = 1;

    if (oSelectPlayer[1].value !== "None") iNumberOfPlayers++;
    if (oSelectPlayer[2].value !== "None") iNumberOfPlayers++;
    if (oSelectPlayer[3].value !== "None") iNumberOfPlayers++;

    ogPlayer = new Array(iNumberOfPlayers);

    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        ogPlayer[iLoop] = new Nibbler();
        ogPlayer[iLoop].Index = iLoop;
        ogPlayer[iLoop].SetSpawnPoint();
        ogPlayer[iLoop].Lives = oNumberLives.value;

        oColorPlayer[iLoop].style.display = 'inline-block';
        oColorPlayer[iLoop].value = oColorMenuPlayer[iLoop].value;
        ogPlayer[iLoop].fillStyle = oColorMenuPlayer[iLoop].value;
        ogPlayer[iLoop].Name = oTxtPlayerName[iLoop].value;
        ogPlayer[iLoop].Type = oSelectPlayer[iLoop].value;
    }

    if (ogPlayer.length > 1) {
        // Override Player Two Input Keys
        ogPlayer[1].KeyLeft = 65; // "A"
        ogPlayer[1].KeyUp = 87; // "W"
        ogPlayer[1].KeyRight = 68; // "D"
        ogPlayer[1].KeyDown = 83; // "S"
    }

    if (ogPlayer.length > 2) {
        // Override Player Two Input Keys
        ogPlayer[2].KeyLeft = 74; // "A"
        ogPlayer[2].KeyUp = 73; // "W"
        ogPlayer[2].KeyRight = 76; // "D"
        ogPlayer[2].KeyDown = 75; // "S"
    }

    if (ogPlayer.length > 3) {
        // Override Player Two Input Keys
        ogPlayer[3].KeyLeft = 100; // "A"
        ogPlayer[3].KeyUp = 104; // "W"
        ogPlayer[3].KeyRight = 102; // "D"
        ogPlayer[3].KeyDown = 101; // "S"
    }
}
function StartComputerPlayerTimers() {

    if (ogPlayer[0].Type == "Computer") ogPlayer[0].ComputerPlayerTimer = setInterval(function () { ComputerPlayerLoop(ogPlayer[0]) }, giGameLoopSpeed);
    if (ogPlayer[1] && ogPlayer[1].Type == "Computer") ogPlayer[1].ComputerPlayerTimer = setInterval(function () { ComputerPlayerLoop(ogPlayer[1]) }, giGameLoopSpeed + 10);
    if (ogPlayer[2] && ogPlayer[2].Type == "Computer") ogPlayer[2].ComputerPlayerTimer = setInterval(function () { ComputerPlayerLoop(ogPlayer[2]) }, giGameLoopSpeed + 20);
    if (ogPlayer[3] && ogPlayer[3].Type == "Computer") ogPlayer[3].ComputerPlayerTimer = setInterval(function () { ComputerPlayerLoop(ogPlayer[3]) }, giGameLoopSpeed + 40);
}
function InitializePellets(ogPellet) {

    for (let iLoop = ogPellet.length; iLoop--;) {
        ogPellet[iLoop] = new Pellet();
        ogPellet[iLoop].SetSpawnPoint();
    }
}

function GameLoop() {

    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        HandlePlayer(ogPlayer[iLoop]);
    }

    DrawGrid();

    ogPlayer.forEach(DrawPlayer);
    ogPlayer.forEach(Nibbler.UpdateTail);
}
function ComputerPlayerLoop(oPlayer) {

    if (oPlayer.Dead) return false;

    if (oPlayer.TargetPellet === null) {

        if (Math.round(Math.random() * 20) < 1) {
            oPlayer.TargetPellet = ogPellet[Math.floor(Math.random() * ogPellet.length)];
        } else {
            oPlayer.TargetPellet = ogPellet[0];
            let iClosestDistance = giMaxDistanceToPellet;

            // Find nearest pellet 
            for (let iLoop = ogPellet.length; iLoop--;) {
                var iDifferenceX = oPlayer.PositionX - ogPellet[iLoop].PositionX;
                var iDifferenceY = oPlayer.PositionY - ogPellet[iLoop].PositionY;
                var iDistance = Math.sqrt(iDifferenceX * iDifferenceX + iDifferenceY * iDifferenceY);

                if (iDistance < iClosestDistance) {
                    iClosestDistance = iDistance;
                    oPlayer.TargetPellet = ogPellet[iLoop];
                }
            }
        }
    }

    if (Math.round(Math.random() * 100) < 1) {
        DumbNibbler(oPlayer);
    } else {
        SmartNibbler(oPlayer);
    }
}

function CollidedWithTail(Trail, PositionX, PositionY) {

    // Check to see if the player encountered their tale
    // We exclude the segment behind the head since they couldn't run into that
    // easily and it makes wall calculations much easier. We also don't check
    // if the tail is the minimum length already.
    let iSegmentToExclude = Trail.length - 1;
    for (let iLoop = Trail.length; iLoop--;) {
        if (iLoop !== iSegmentToExclude && Trail.length > giMinimumTailLength &&
            Trail[iLoop].x === PositionX &&
            Trail[iLoop].y === PositionY) {
            return true;
        }
    }

    // Check for collisions with other player tails
    for (let iLoop = ogPlayer.length; iLoop--;) {
        if (ogPlayer[iLoop].Trail !== Trail) {
            for (let iLoop2 = ogPlayer[iLoop].Trail.length; iLoop2--;) {
                if (ogPlayer[iLoop].Trail[iLoop2].x === PositionX &&
                    ogPlayer[iLoop].Trail[iLoop2].y === PositionY) {
                    return true;
                }
            }
        }
    }


    return false;
}
function HandlePlayer(oPlayer) {

    if (oPlayer.Dead || (oPlayer.DirectionX === 0 && oPlayer.DirectionY === 0)) {
        return;
    }

    let oPlayerVector = CalculateNewPosition(oPlayer.PositionX, oPlayer.PositionY, oPlayer.DirectionX, oPlayer.DirectionY);
    oPlayer.PositionX = oPlayerVector.PositionX;
    oPlayer.PositionY = oPlayerVector.PositionY;
    oPlayer.DirectionX = oPlayerVector.DirectionX;
    oPlayer.DirectionY = oPlayerVector.DirectionY;

    if (oPlayerVector.HitWall) {
        if (gbDeadlyWalls) {
            NibblerDied(oPlayer);
            return;
        } else {
            oPlayer.Score -= iPointsLostForWallCollision;
            UpdateScoreboard(oPlayer);
        }
    }

    // Check to see if the pellet was eaten
    for (let iLoop = ogPellet.length; iLoop--;) {
        if (ogPellet[iLoop].PositionX === oPlayer.PositionX && ogPellet[iLoop].PositionY === oPlayer.PositionY) {
            ogPellet[iLoop].Eatten(oPlayer);
            delete ogPellet[iLoop];
            ogPellet[iLoop] = new Pellet();

            UpdateScoreboard(oPlayer);
        }
    }
}
function CalculateNewPosition(NewPositionX, NewPositionY, NewDirectionX, NewDirectionY) {

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
function NibblerDied(oPlayer) {
    oPlayer.Dead = true;
    oPlayer.DirectionX = 0;
    oPlayer.DirectionY = 0;
    oPlayer.TailLength = giMinimumTailLength;

    if (oPlayer.Lives > 0) {
        if (--oPlayer.Lives == 0) addClass(oSpanPlayer[oPlayer.Index], "blink_me");

        oPlayer.SetSpawnPoint();
        setTimeout(function () { oPlayer.Dead = false; }, 1000, oPlayer);
    } else {
        removeClass(oSpanPlayer[oPlayer.Index], "blink_me");

        let iLivesRemaining = 0;
        for (let iLoop = ogPlayer.length; iLoop--;) {
            iLivesRemaining += ogPlayer[iLoop].Lives;
        }

        if (iLivesRemaining <= 0) {
            Pause();
        }
    }

    UpdateScoreboard();

}

function KeydownEvent(oEvent) {

    if (CheckForSpecialKeys(oEvent)) {
        return;
    } else {
        if (!gbGamePaused && ogPlayer) {
            for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
            {
                if (ogPlayer[iLoop].Type == "Human" && CheckForKeyEvents(oEvent, ogPlayer[iLoop])) {
                    break;
                }
            }
        }
    }
}

function CheckForSpecialKeys(oEvent) {

    switch (oEvent.keyCode) {
        case 32: // Space
        case 80: // "P"
        case 27: // Escape
            TogglePause();
            break;
        case 77: // Mute
            oSelectSound.value = Sounds.NotMuted = !Sounds.NotMuted;
            if (Sounds.NotMuted) Sounds.Crawlig.play();
            else Sounds.Crawlig.pause();
            break;
        case 189: // -
            Sounds.Volume = (Sounds.Volume > 0) ? Math.floor((Sounds.Volume - 0.1) * 10) / 10 : 0;
            Sounds.Crawlig.volume = Sounds.Volume;
            Sounds.Pause.volume = Sounds.Volume;
            break;
        case 187: // =
            oSelectSound.value = Sounds.NotMuted = true;
            Sounds.Volume = Sounds.Volume < 1 ? Math.ceil((Sounds.Volume + 0.1) * 10) / 10 : 1;
            Sounds.Crawlig.volume = Sounds.Volume;
            Sounds.Pause.volume = Sounds.Volume;
            break;
        default:
            return false;
    }
    ;
    return true;
}

function CheckForKeyEvents(oEvent, oPlayer) {

    switch (oEvent.keyCode) {
        case oPlayer.KeyLeft:
            oPlayer.DirectionX = -1;
            oPlayer.DirectionY = 0;
            break;
        case oPlayer.KeyUp:
            oPlayer.DirectionX = 0;
            oPlayer.DirectionY = -1;
            break;
        case oPlayer.KeyRight:
            oPlayer.DirectionX = 1;
            oPlayer.DirectionY = 0;
            break;
        case oPlayer.KeyDown:
            oPlayer.DirectionX = 0;
            oPlayer.DirectionY = 1;
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

    let iXOffset = Math.abs(ogPlayer[0].PositionX * giGridSize - event.pageX);
    let iYOffset = Math.abs(ogPlayer[0].PositionY * giGridSize - event.pageY);

    if (iXOffset >= iYOffset && ogPlayer[0].PositionX * giGridSize < event.pageX) {
        ogPlayer[0].DirectionX = 1;
        ogPlayer[0].DirectionY = 0;
    } else if (iXOffset >= iYOffset) {
        ogPlayer[0].DirectionX = -1;
        ogPlayer[0].DirectionY = 0;
    } else if (iXOffset < iYOffset && ogPlayer[0].PositionY * giGridSize < event.pageY) {
        ogPlayer[0].DirectionY = 1;
        ogPlayer[0].DirectionX = 0;
    } else if (iXOffset < iYOffset) {
        ogPlayer[0].DirectionY = -1;
        ogPlayer[0].DirectionX = 0;
    }
}

function TogglePause() {

    if (gbGamePaused && !ogPlayer) return;

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

    clearInterval(ogGameLoop);
    clearInterval(ogCountdownTimer);
    ogPlayer.forEach(function (oPlayer) { clearInterval(oPlayer.ComputerPlayerTimer) });

    Sounds.Crawlig.pause();
    if (Sounds.NotMuted) Sounds.Pause.play();
    
    oBtnStart.disabled = false;
}
function UnPause() {
    gbGamePaused = false;

    removeClass(oDivGameMenu, "showGameMenu");
    removeClass(oDivScoreboard, "modal-blur");
    removeClass(canvArena, "modal-blur");
    removeClass(oDivTime, "blink_me");

    if (Sounds.NotMuted) Sounds.Crawlig.play();

    ogGameLoop = setInterval(GameLoop, giGameLoopSpeed);

    if (oSelectTime.value == "On") {
        ogCountDownTime = new Date().setTime(new Date().getTime() + giTimeRemaining);
        ogCountdownTimer = setInterval(CountdownTimer, 500);
    }

    StartComputerPlayerTimers();
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

function DrawGrid() {
    ctxArena.fillStyle = "black";
    ctxArena.fillRect(0, 0, window.innerWidth, giGridHeight);

    DrawMaze();

    ctxArena.strokeStyle = 'orange';
    ctxArena.lineWidth = giGridSize / 2;
    ctxArena.strokeRect(0, 0, window.innerWidth, giGridHeight);
    
    if (ogPellet) {
        ogPellet.forEach(DrawPellet);
    }
}

function DrawPlayer(oPlayer) {
    ctxArena.fillStyle = oPlayer.fillStyle;

    if (oPlayer.Trail.length === 0) {
        ctxArena.fillRect(oPlayer.PositionX * giGridSize,
            oPlayer.PositionY * giGridSize,
            giGridSize - 2,
            giGridSize - 2);
    } else {
        if (CollidedWithTail(oPlayer.Trail, oPlayer.PositionX, oPlayer.PositionY)) {

            oPlayer.TailLength = giMinimumTailLength;

            if (gbDeadlyTails) {
                NibblerDied(oPlayer);
                return;
            } else {
                oPlayer.Score -= iPointsLostForTailCollision;
                UpdateScoreboard();
            }
        }

        for (let iLoop = oPlayer.Trail.length; iLoop--;) {
            ctxArena.fillRect(oPlayer.Trail[iLoop].x * giGridSize + 6,
                oPlayer.Trail[iLoop].y * giGridSize + 6,
                giGridSize - 12,
                giGridSize - 12);
        }
    }

    if (oPlayer.Dead) {
        ctxArena.fillStyle = "black";
        ctxArena.fillRect(oPlayer.PositionX * giGridSize + 6,
            oPlayer.PositionY * giGridSize + 6,
            giGridSize - 12,
            giGridSize - 12);
    }
}

function DrawPellet(oPellet) {

    // Draw the pellet
    ctxArena.lineWidth = 2;
    ctxArena.strokeStyle = oPellet.strokeStyle;
    ctxArena.fillStyle = oPellet.fillStyle;
    ctxArena.beginPath();
    ctxArena.arc(oPellet.PositionX * giGridSize + (giGridSize / 2),
        oPellet.PositionY * giGridSize + (giGridSize / 2),
        giGridSize / 2.8,
        0,
        2 * Math.PI);
    ctxArena.fill();
    ctxArena.stroke();
}

function DrawMaze() {
    return;
    let iIndex;

    for (let iLoop = 0; iLoop < giArenaSquaresX; iLoop++) {
        for (let iLoop2 = 0; iLoop2 < giArenaSquaresY; iLoop2++) {

            iIndex = index(iLoop, iLoop2);

            if (gaMaze[iIndex]) {
                // Draw the spot
                ctxArena.lineWidth = 2;
                ctxArena.strokeStyle = "white";
                ctxArena.beginPath();

                if (gaMaze[iIndex].walls[0]) {
                    ctxArena.moveTo(iLoop * giGridSize, iLoop2 * giGridSize);
                    ctxArena.lineTo(iLoop * giGridSize, iLoop2 * giGridSize + giGridSize);
                    ctxArena.stroke();
                }

                if (gaMaze[iIndex].walls[1]) {
                    ctxArena.moveTo(iLoop * giGridSize,              iLoop2 * giGridSize + giGridSize);
                    ctxArena.lineTo(iLoop * giGridSize + giGridSize, iLoop2 * giGridSize + giGridSize);
                    ctxArena.stroke();
                }

                if (gaMaze[iIndex].walls[2]) {
                    ctxArena.moveTo(iLoop * giGridSize + giGridSize, iLoop2 * giGridSize + giGridSize);
                    ctxArena.lineTo(iLoop * giGridSize + giGridSize, iLoop2 * giGridSize);
                    ctxArena.stroke();
                }

                if (gaMaze[iIndex].walls[3]) {
                    ctxArena.moveTo(iLoop * giGridSize + giGridSize, iLoop2 * giGridSize);
                    ctxArena.lineTo(iLoop * giGridSize,              iLoop2 * giGridSize);
                    ctxArena.stroke();
                }
            }
        }
    }
}

function DrawBegin() {
    ctxArena.font = giGridSize + "px Comic Sans MS";
    ctxArena.fillStyle = "blue";
    ctxArena.textAlign = "center";
    ctxArena.fillText("Click to Begin", window.innerWidth / 2, giGridHeight / 2);
}

function UpdateScoreboard() {

    let iPlayerWithHighScore = 0;
    for (let iLoop = ogPlayer.length; iLoop--;) {
        oSpanPlayer[iLoop].innerText = `${ogPlayer[iLoop].Name} (${ogPlayer[iLoop].Lives}) ${ogPlayer[iLoop].Score}`;

        if (ogPlayer[iLoop].Score > ogPlayer[iPlayerWithHighScore].Score) {
            iPlayerWithHighScore = iLoop;
        }
    }

    oDivHighScore.innerText = `HIGHSCORE (${ogPlayer[iPlayerWithHighScore].Name}) ${ogPlayer[iPlayerWithHighScore].Score}`;
}

function CountdownTimer() {

    // Find the time remaining between now and the count down date
    giTimeRemaining = ogCountDownTime - new Date().getTime();
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

function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ` ${cls}`;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
