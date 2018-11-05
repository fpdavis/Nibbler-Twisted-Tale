// #region Constant Declrations
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
const chkTime = document.getElementById('chkTime');
const chkMuteMusic = document.getElementById('chkMuteMusic');
const rangeMusicVolume = document.getElementById('rangeMusicVolume');
const chkMuteEffects = document.getElementById('chkMuteEffects');
const rangeEffectsVolume = document.getElementById('rangeEffectsVolume');

const oNumberTime = document.getElementById('numberTime');
const chkWallWrap = document.getElementById('chkWallWrap');
const chkDeadlyWalls = document.getElementById('chkDeadlyWalls');
const chkDeadlyTails = document.getElementById('chkDeadlyTails');
const chkDiagonalMovement = document.getElementById('chkDiagonalMovement');
const chkMaze = document.getElementById('chkMaze');
const chkEnemies = document.getElementById('chkEnemies');
const oSelectDificulty = document.getElementById('selectDificulty');
const selectArenaSize = document.getElementById('selectArenaSize');
const selectSpeed = document.getElementById('selectSpeed');
const chkNonStop = document.getElementById('chkNonStop');
const chkInfiniteTails = document.getElementById('chkInfiniteTails');

const oBtnStart = document.getElementById('btnStart');

const iPointsLostForTailCollision = 5;
const iPointsLostForWallCollision = 5;
// #endregion

giVerbosity = goVerbosityEnum.Debug;

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
var ogBrainspawn;
var ogSprite = [];
var ogCountDownTime;
var giTimeRemaining;
var ogGameLoop;
var gbWallWrap;
var gbDeadlyWalls;
var gbDeadlyTails;
var gbDiagonalMovement;
var gbStopAfterEachMove;
var gbInfiniteTails;

var giArenaSquaresX;
var giArenaSquaresY;

window.onload = function () {

    window.addEventListener('resize', ResizeEvent, false);
    document.addEventListener("keydown", KeydownEvent);
    document.addEventListener("keyup", KeyupEvent);
    document.addEventListener("click", ClickEvent, { passive: true });

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
    Crawlig: new Audio('Sounds/termites_and_ants-mike-koenig.mp3'),
    Splat: new Audio('Sounds/Lava.flac')
}

var Music = {
    Volume: .5,
    NotMuted: true,
    One: new Audio('Music/BossTheme.mp3')
}

class Animations {
    constructor() {
        this.BlueExplosion = this.Load(24, "Images/Explosions_particles/blue_explosion/bluspark_000", ".png");
        this.RedExplosion = this.Load(24, "Images/Explosions_particles/red_explosion/red_snakeplosion_000", ".png");
        this.GreenExplosion = this.Load(24, "Images/Explosions_particles/green_explosion/green_explosion_000", ".png");
        this.YellowExplosion = this.Load(24, "Images/Explosions_particles/yellow_explosion/yellow_explosion_000", ".png");
        this.Brainspawn = this.Load(17, "Images/Slime/Slime_000", ".png");
        }
}
Animations.prototype.Load = function(Frames, SourcePrefix, SourceSuffix) {
    let aImage = [];
    let iIndex;
    for (let iLoop = 1; iLoop <= Frames; iLoop++) {
        iIndex = ('00' + iLoop).substr(-2);
        aImage.push(new Image());
        aImage[aImage.length - 1].src = SourcePrefix + iIndex + SourceSuffix;
        MessageLog("aImage.src = " + aImage[aImage.length - 1].src, goVerbosityEnum.Debug);
    }

    return aImage;
}
const constAnimations = new Animations();

class Sprite  {
    constructor(Image, x, y, z = 0, width = 0, height = 0) {
        this.PositionX = x;
        this.PositionY = y;
        this.ZIndex = z;
        this.Loop = false;
        this.Complete = false;
        this.CurrentFrame = 0;
        this.Frames = Image.length;
        this.Image = Image;
        this.Width = width !== 0 ? width : this.Image[0].width;
        this.Height = height !== 0 ? height : this.Image[0].height;
        this.HalfWidth = this.Width / 2;
        this.HalfHeight = this.Height / 2;
        this.AdjustmentX = giGridSize / 2 - this.HalfWidth;
        this.AdjustmentY = giGridSize / 2 - this.HalfHeight;
    }
}
Sprite.prototype.Draw = function()
{
    if (this.CurrentFrame < this.Frames) {
        let iOffsetX = (this.PositionX * giGridSize) + this.AdjustmentX;
        let iOffsetY = (this.PositionY * giGridSize) + this.AdjustmentY;
        
        ctxArena.drawImage(this.Image[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
    }

    if (this.CurrentFrame >= this.Frames) {
        if (this.Loop) {
            this.CurrentFrame = 0;
        } else {
            this.Complete = true;
        }
    }
}
Sprite.Draw = function (oSprite) { oSprite.Draw(); }


class Nibbler {
    constructor() {
        this.Index = 0;
        this.Name = "Player";
        this.Lives = 3;
        this.Score = 0;
        this.Dead = false;
        this.Type = "";
        this.Timer = null;
        this.Kills = 0;
        this.Suicides = 0;

        this.PositionX = 0;
        this.PositionY = 0;

        this.DirectionX = 0;
        this.DirectionY = 0;
        this.Direction = 0;
        this.Target = null;

        this.Trail = [];
        this.TailLength = giMinimumTailLength;

        this.Explosion = constAnimations.GreenExplosion;

        this.KeyLeft = 37; // Left Arrow
        this.KeyUp = 38; // Up Arrow
        this.KeyRight = 39; // Right Arrow
        this.KeyDown = 40; // Down Arrow

        this.KeyLeftPressed = false;
        this.KeyUpPressed = false;
        this.KeyRightPressed = false;
        this.KeyDownPressed = false;

        this.fillStyle = "lime";
    }
}
Nibbler.prototype.UpdateTail = function () {

    if (this.Trail.length > 0 && this.PositionX == this.Trail[this.Trail.length - 1].x && this.PositionY == this.Trail[this.Trail.length - 1].y) return;

    this.Trail.push({ x: this.PositionX, y: this.PositionY });

    if (gbInfiniteTails) {
        this.TailLength++;
    } else {
        while (this.Trail.length > this.TailLength) {
            this.Trail.shift();
        }
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
        this.Index = 0;
        this.Name = "Pellet";
        this.Points = 10;
        this.TailAdjustment = 1;
        this.Type = Math.round(Math.random());
        this.PositionX = 0;
        this.PositionY = 0;

        this.Sound = new Audio(Sounds.Bite.src);

        this.Image = [];
        this.Image.push(new Image());
        this.Image[0].src = "Images/yaycandies/size1/bean_blue.png";
        MessageLog("bean_blue.src = " + this.Image[this.Image.length - 1].src, goVerbosityEnum.Debug);

        this.SetSpawnPoint();

        this.Sprite = new Sprite(this.Image, this.PositionX, this.PositionY, 30, giGridSize - giGridSize * .3, giGridSize - giGridSize * .3);
        this.Sprite.Loop = true;
        ogSprite.push(this.Sprite);
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
            return;
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
            return;
        }
    }
}
Pellet.prototype.Eatten = function (oPlayer) {

    if (Sounds.NotMuted) {
        this.Sound.volume = Sounds.Volume;
        this.Sound.play();
    }

    this.Sprite.Loop = false;
    this.Sprite = null;

    this.Power(oPlayer);

    // Tell other players this pellet has been eaten
    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        if (this === ogPlayer[iLoop].Target) ogPlayer[iLoop].Target = null;
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
Pellet.prototype.Draw = function () {

    //ctxArena.lineWidth = 2;
    //ctxArena.strokeStyle = this.strokeStyle;
    //ctxArena.fillStyle = this.fillStyle;
    //ctxArena.beginPath();
    //ctxArena.arc(this.PositionX * giGridSize + (giGridSize / 2),
    //    this.PositionY * giGridSize + (giGridSize / 2),
    //    giGridSize / 2.8,
    //    0,
    //    2 * Math.PI);
    //ctxArena.fill();
    //ctxArena.stroke();
}
Pellet.Draw = function (oPellet) { oPellet.Draw(); }

class Brainspawn  {
    constructor() {
        this.Index = 0;
        this.Name = "Brainspawn";
        this.Type = Math.round(Math.random());
        this.Timer = null;
        this.Kills = 0;

        this.PositionX = 0;
        this.PositionY = 0;
        this.DirectionX = 0;
        this.DirectionY = 0;
        this.Direction = 0;
        this.Target = null;

        this.Sound = new Audio(Sounds.Splat.src);
        this.strokeStyle = "purple";
        this.fillStyle = "yellow";

        this.SetSpawnPoint();
        
        this.Sprite = new Sprite(constAnimations.Brainspawn, this.PositionX, this.PositionY, 10, giGridSize - giGridSize * .1, giGridSize - giGridSize * .1);
        this.Sprite.Loop = true;
        ogSprite.push(this.Sprite);
    }
}
Brainspawn.prototype.SetSpawnPoint = function () {
    this.PositionX = Math.floor(Math.random() * (giArenaSquaresX - 2)) + 1;
    this.PositionY = Math.floor(Math.random() * (giArenaSquaresY - 2)) + 1;

    // Don't spawn on top a player
    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        if (this.PositionX === ogPlayer[iLoop].PositionX && this.PositionY === ogPlayer[iLoop].PositionY) {
            this.SetSpawnPoint();
            return;
        }
    }

    // Don't spawn on top of another pellet
    for (let iLoop = ogPellet.length; iLoop--;) // Reverse loop for the win
    {
        if (ogPellet[iLoop] != null &&
            this.PositionX === ogPellet[iLoop].PositionX &&
            this.PositionY === ogPellet[iLoop].PositionY) {
            this.SetSpawnPoint();
            return;
        }
    }
}
Brainspawn.prototype.Draw = function () {    
    // Check to see if player was killed
    for (let iLoop = ogPlayer.length; iLoop--;) {
        if (ogPlayer[iLoop].PositionX === this.PositionX && ogPlayer[iLoop].PositionY === this.PositionY) {

            if (Sounds.NotMuted) {
                this.Sound.volume = Sounds.Volume;
                this.Sound.play();
            }

            NibblerDied(ogPlayer[iLoop]);
            this.Kills++;
            MessageLog(ogPlayer[iLoop].Name + " was killed by " + this.Name + " " + this.Index, goVerbosityEnum.Information);
        }
    }

    //this.DrawTarget();
}
Brainspawn.Draw = function (oBrainspawn) { oBrainspawn.Draw(); }
Brainspawn.prototype.Move = function() {

    let oVector = CalculateNewPosition(this.PositionX, this.PositionY, this.DirectionX, this.DirectionY);
    this.PositionX = this.Sprite.PositionX = oVector.PositionX;
    this.PositionY = this.Sprite.PositionY = oVector.PositionY;
    this.DirectionX = oVector.DirectionX;
    this.DirectionY = oVector.DirectionY;
    
}
Brainspawn.prototype.DrawTarget = function () {
    ctxArena.lineWidth = 2;
    ctxArena.strokeStyle = "white";
    ctxArena.beginPath();

    ctxArena.moveTo(this.PositionX * giGridSize, this.PositionY * giGridSize);
    ctxArena.lineTo(this.Target.PositionX * giGridSize, this.Target.PositionY * giGridSize);
    ctxArena.stroke();
}

function StartGame() {

    if (ogSprite) ogSprite.length = 0;

    switch (selectArenaSize.value) {
        case "Small":
            giGridSize = 60;
            break;
        case "Large":
            giGridSize = 30;
            break;
        default:
            giGridSize = 40;
    }

    giArenaSquaresX = Math.floor(window.innerWidth / giGridSize);
    giArenaSquaresY = Math.floor(giGridHeight / giGridSize);

    InitializePlayers();
    InitializePellets();

    ResizeEvent();

    ogPlayer.forEach(DrawPlayer);

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

    if (chkMaze.checked) {
       // gaMaze = GenerateMaze(giArenaSquaresX, giArenaSquaresY);
    }

    InitializeBrainspawn();
    
    Sounds.NotMuted = !chkMuteEffects.checked;
    Music.NotMuted = !chkMuteMusic.checked;

    if (Music.NotMuted) {
        Music.One.volume = Music.Volume;
        Music.One.play();
    }
    
    UnPause();

    oBtnStart.disabled = true;
}
function InitializePlayers() {

    for (let iLoop = 0; iLoop < 4; iLoop++)
    {
        oColorPlayer[iLoop].style.display = 'none';
        oSpanPlayer[iLoop].innerText = ``;
        removeClass(oSpanPlayer[iLoop], "blink_me");
        removeClass(oSpanPlayer[iLoop], "dead");
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
        ogPlayer[iLoop].Name = oTxtPlayerName[iLoop].value.length > 0 ? oTxtPlayerName[iLoop].value : "Player " + (iLoop + 1);
        ogPlayer[iLoop].Type = oSelectPlayer[iLoop].value;
    }

    if (ogPlayer.length > 1) {
        // Override Player Two Input Keys
        ogPlayer[1].KeyLeft = 65; // "A"
        ogPlayer[1].KeyUp = 87; // "W"
        ogPlayer[1].KeyRight = 68; // "D"
        ogPlayer[1].KeyDown = 83; // "S"
        ogPlayer[1].Explosion = constAnimations.RedExplosion;
    }

    if (ogPlayer.length > 2) {
        // Override Player Two Input Keys
        ogPlayer[2].KeyLeft = 74; // "A"
        ogPlayer[2].KeyUp = 73; // "W"
        ogPlayer[2].KeyRight = 76; // "D"
        ogPlayer[2].KeyDown = 75; // "S"
        ogPlayer[2].Explosion = constAnimations.BlueExplosion;
    }

    if (ogPlayer.length > 3) {
        // Override Player Two Input Keys
        ogPlayer[3].KeyLeft = 100; // "A"
        ogPlayer[3].KeyUp = 104; // "W"
        ogPlayer[3].KeyRight = 102; // "D"
        ogPlayer[3].KeyDown = 101; // "S"
        ogPlayer[3].Explosion = constAnimations.YellowExplosion;
    }
}
function StartTimers() {

    if (ogPlayer[0].Type == "Computer") ogPlayer[0].Timer = setInterval(function () { ComputerPlayerLoop(ogPlayer[0]) }, giGameLoopSpeed);
    if (ogPlayer[1] && ogPlayer[1].Type == "Computer") ogPlayer[1].Timer = setInterval(function () { ComputerPlayerLoop(ogPlayer[1]) }, giGameLoopSpeed + 10);
    if (ogPlayer[2] && ogPlayer[2].Type == "Computer") ogPlayer[2].Timer = setInterval(function () { ComputerPlayerLoop(ogPlayer[2]) }, giGameLoopSpeed + 20);
    if (ogPlayer[3] && ogPlayer[3].Type == "Computer") ogPlayer[3].Timer = setInterval(function () { ComputerPlayerLoop(ogPlayer[3]) }, giGameLoopSpeed + 40);

    if (ogBrainspawn) {
        for (let iLoop = ogBrainspawn.length; iLoop--;) {
            ogBrainspawn[iLoop].Timer =
                setInterval(function() { BrainspawnLoop(ogBrainspawn[iLoop]) }, giGameLoopSpeed + 200);
        }
    }
}
function InitializePellets() {

    if (ogPellet) ogPellet.length = 0;

    ogPellet = new Array(ogPlayer.length + 1);
    for (let iLoop = ogPellet.length; iLoop--;) {
        ogPellet[iLoop] = new Pellet();
        ogPellet[iLoop].Index = iLoop;
    }
}
function InitializeBrainspawn() {
    
    if (ogBrainspawn) ogBrainspawn.length = 0;

    if (chkEnemies.checked) {
        ogBrainspawn = new Array(ogPlayer.length > 2 ? ogPlayer.length - 1 : 1);
        
        for (let iLoop = ogBrainspawn.length; iLoop--;) {
            ogBrainspawn[iLoop] = new Brainspawn();
            ogBrainspawn[iLoop].Index = iLoop;
        }
    }
}

function GameLoop() {

    for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
    {
        MovePlayer(ogPlayer[iLoop]);
    }
   
    DrawGrid();

    ogPlayer.forEach(DrawPlayer);

    ogSprite.sort(function (a, b) { return a.ZIndex - b.ZIndex });
    for (let iLoop = ogSprite.length; iLoop--;) {
        if (ogSprite[iLoop].Complete) {
            ogSprite.splice(iLoop, 1);
        } else {
            ogSprite[iLoop].Draw();
        }
    }
    
    if (ogPellet) {
        ogPellet.forEach(Pellet.Draw);
    }

    if (ogBrainspawn) {
        ogBrainspawn.forEach(Brainspawn.Draw);
    }


    ogPlayer.forEach(Nibbler.UpdateTail);
    UpdateScoreboard();
}
function ComputerPlayerLoop(oPlayer) {

    if (oPlayer.Dead) return false;

    if (oPlayer.Target === null) {

        if (Math.round(Math.random() * 10) < 1) {
            oPlayer.Target = ogPellet[Math.floor(Math.random() * ogPellet.length)];
        } else {
            oPlayer.Target = ogPellet[0];
            let iClosestDistance = giMaxDistanceToPellet;

            // Find nearest pellet 
            for (let iLoop = ogPellet.length; iLoop--;) {
                var iDifferenceX = oPlayer.PositionX - ogPellet[iLoop].PositionX;
                var iDifferenceY = oPlayer.PositionY - ogPellet[iLoop].PositionY;
                var iDistance = Math.sqrt(iDifferenceX * iDifferenceX + iDifferenceY * iDifferenceY);

                if (iDistance < iClosestDistance) {
                    iClosestDistance = iDistance;
                    oPlayer.Target = ogPellet[iLoop];
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
function CollidedWithTail(oPlayer) {

    // Check to see if the player encountered their tale
    // We exclude the check if they are at the minimum length
    // if the tail is the minimum length already.
    if (oPlayer.Trail && oPlayer.Trail.length > giMinimumTailLength) {
        for (let iLoop = 0; iLoop < oPlayer.Trail.length - giMinimumTailLength; iLoop++) {
            if (oPlayer.Trail[iLoop].x === oPlayer.PositionX &&
                oPlayer.Trail[iLoop].y === oPlayer.PositionY) {
                if (gbDeadlyTails) oPlayer.Suicides++;
                return true;
            }
        }
    }

    // Check for collisions with other player tails
    for (let iLoop = ogPlayer.length; iLoop--;) {
        if (ogPlayer[iLoop].Trail && ogPlayer[iLoop].Trail !== oPlayer.Trail) {
            for (let iLoop2 = ogPlayer[iLoop].Trail.length; iLoop2--;) {
                if (ogPlayer[iLoop].Trail[iLoop2].x === oPlayer.PositionX &&
                    ogPlayer[iLoop].Trail[iLoop2].y === oPlayer.PositionY) {
                    if (gbDeadlyTails) ogPlayer[iLoop].Kills++;
                    return true;
                }
            }
        }
    }

    return false;
}
function MovePlayer(oPlayer) {

    if (oPlayer.Dead || (oPlayer.DirectionX === 0 && oPlayer.DirectionY === 0)) {
        return;
    }

    let oPlayerVector = CalculateNewPosition(oPlayer.PositionX, oPlayer.PositionY, oPlayer.DirectionX, oPlayer.DirectionY);
    oPlayer.PositionX = oPlayerVector.PositionX;
    oPlayer.PositionY = oPlayerVector.PositionY;
    oPlayer.DirectionX = oPlayerVector.DirectionX;
    oPlayer.DirectionY = oPlayerVector.DirectionY;

    if (gbStopAfterEachMove) { oPlayer.DirectionX = oPlayer.DirectionY = 0; }

    // Check for wall hit
    if (oPlayerVector.HitWall) {
        if (gbDeadlyWalls) {
            oPlayer.Suicides++;
            NibblerDied(oPlayer);
            MessageLog(oPlayer.Name + " hit wall and died.", goVerbosityEnum.Information);
        } else {
            oPlayer.Score -= iPointsLostForWallCollision;
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
    
    ogSprite.push(new Sprite(oPlayer.Explosion, oPlayer.PositionX, oPlayer.PositionY, 15));

    oPlayer.Dead = true;
    oPlayer.DirectionX = 0;
    oPlayer.DirectionY = 0;
    oPlayer.Trail.length = 0;
    oPlayer.TailLength = giMinimumTailLength; // Need to remove the tail

    if (oPlayer.Lives > 0) {
        if (--oPlayer.Lives == 0) addClass(oSpanPlayer[oPlayer.Index], "blink_me");

        oPlayer.SetSpawnPoint();
        setTimeout(function () { oPlayer.Dead = false; }, 1000, oPlayer);
    } else {
        removeClass(oSpanPlayer[oPlayer.Index], "blink_me");
        addClass(oSpanPlayer[oPlayer.Index], "dead");

        let iLivesRemaining = 0;
        for (let iLoop = ogPlayer.length; iLoop--;) {
            iLivesRemaining += ogPlayer[iLoop].Lives;
        }

        if (iLivesRemaining <= 0) {
            Pause();
        }
    }
}

function BrainspawnLoop(oBrainspawn) {

    if (Math.round(Math.random() * 15) < 1) {
        oBrainspawn.Target = ogPlayer[Math.floor(Math.random() * ogPlayer.length)];
    } else {
        oBrainspawn.Target = ogPlayer[0];
        let iClosestDistance = giMaxDistanceToPellet;

        // Find nearest player 
        for (let iLoop = ogPlayer.length; iLoop--;) {
            var iDifferenceX = oBrainspawn.PositionX - ogPlayer[iLoop].PositionX;
            var iDifferenceY = oBrainspawn.PositionY - ogPlayer[iLoop].PositionY;
            var iDistance = Math.sqrt(iDifferenceX * iDifferenceX + iDifferenceY * iDifferenceY);

            if (!ogPlayer[iLoop].Dead && iDistance < iClosestDistance) {
                iClosestDistance = iDistance;
                oBrainspawn.Target = ogPlayer[iLoop];
            }
        }
    }

    Findpath_Brainspawn(oBrainspawn);
    
    oBrainspawn.Move();
}

function KeydownEvent(oEvent) {

    if (CheckForSpecialKeys(oEvent)) {
        return;
    } else {
        if (!gbGamePaused && ogPlayer) {
            for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
            {
                if (ogPlayer[iLoop].Type == "Human" && CheckForKeyDown(oEvent, ogPlayer[iLoop])) {
                    CheckForKeyEvents(ogPlayer[iLoop]);
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
                Sounds.Crawlig.play();
                Music.One.play();
            } else {
                Sounds.Crawlig.pause();
                Music.One.pause();
            }
            break;
        case 189: // -
            rangeEffectsVolume.value = Sounds.Volume = (Sounds.Volume > 0) ? Math.floor((Sounds.Volume - 0.1) * 10) / 10 : 0;
            rangeMusicVolume.value = Music.One.volume = Music.Volume = (Music.Volume > .1) ? Math.floor((Music.Volume - 0.2) * 10) / 10 : 0;
            Sounds.Crawlig.volume = Sounds.Volume;
            Sounds.Pause.volume = Sounds.Volume;
            break;
        case 187: // =
            chkMuteEffects.checked = false;
            Sounds.NotMuted = true;
            rangeEffectsVolume.value = Sounds.Volume = Sounds.Volume < 1 ? Math.ceil((Sounds.Volume + 0.1) * 10) / 10 : 1;
            rangeMusicVolume.value = Music.One.volume = Music.Volume = Music.Volume < 1 ? Math.ceil((Music.Volume + 0.1) * 10) / 10 : 1;
            Sounds.Crawlig.volume = Sounds.Volume;
            Sounds.Pause.volume = Sounds.Volume;
            break;
        default:
            return false;
    }
    ;
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

    if (!gbGamePaused && ogPlayer) {
        for (let iLoop = ogPlayer.length; iLoop--;) // Reverse loop for the win
        {
            if (ogPlayer[iLoop].Type == "Human" && CheckForKeyup(oEvent, ogPlayer[iLoop])) {
                CheckForKeyEvents(ogPlayer[iLoop]);
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
    ogPlayer.forEach(function (oPlayer) { clearInterval(oPlayer.Timer) });

    if (ogBrainspawn) ogBrainspawn.forEach(function (oBrainspawn) { clearInterval(oBrainspawn.Timer) });

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

    if (chkTime.checked) {
        ogCountDownTime = new Date().setTime(new Date().getTime() + giTimeRemaining);
        ogCountdownTimer = setInterval(CountdownTimer, 500);
    }

    StartTimers();
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
}

function DrawPlayer(oPlayer) {
    ctxArena.fillStyle = oPlayer.fillStyle;
    
    if (oPlayer.Trail.length === 0) {
        ctxArena.fillRect(oPlayer.PositionX * giGridSize + 3,
            oPlayer.PositionY * giGridSize + 3,
            giGridSize - 6,
            giGridSize - 6);
    } else {
        for (let iLoop = oPlayer.Trail.length; iLoop--;) {
            ctxArena.fillRect(oPlayer.Trail[iLoop].x * giGridSize + 3,
                oPlayer.Trail[iLoop].y * giGridSize + 3,
                giGridSize - 6,
                giGridSize - 6);
        }
    }

    // Check for tail collision
    if (CollidedWithTail(oPlayer)) {

        oPlayer.TailLength = giMinimumTailLength;

        if (gbDeadlyTails) {
            NibblerDied(oPlayer);
            MessageLog(oPlayer.Name + " hit tail and died.", goVerbosityEnum.Information);
        } else {
            oPlayer.Score -= iPointsLostForTailCollision;
        }
    }

    // Check to see if the pellet was eaten
    for (let iLoop = ogPellet.length; iLoop--;) {
        if (ogPellet[iLoop].PositionX === oPlayer.PositionX && ogPellet[iLoop].PositionY === oPlayer.PositionY) {
            ogPellet[iLoop].Eatten(oPlayer);
            delete ogPellet[iLoop];
            ogPellet[iLoop] = new Pellet();
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

function tintImage(imgElement, tintColor) {
    // create hidden canvas (using image dimensions)
    let canvas = document.createElement("canvas");
    canvas.width = imgElement.offsetWidth;
    canvas.height = imgElement.offsetHeight;
   
    let ctx = canvas.getContext("2d");
    ctx.drawImage(imgElement, 0, 0);

    let map = ctx.getImageData(0, 0, 320, 240);
    let imdata = map.data;

    // convert image to grayscale
    var r, g, b, avg;
    var alphas = [];
    for (var p = 0, len = imdata.length; p < len; p += 4) {
        r = imdata[p];
        g = imdata[p + 1];
        b = imdata[p + 2];
        alphas[p + 3] = imdata[p + 3];

        avg = Math.floor((r + g + b) / 3);

        imdata[p] = imdata[p + 1] = imdata[p + 2] = avg;
    }

    ctx.putImageData(map, 0, 0);

    // overlay filled rectangle using lighter composition
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = tintColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Replace alpha channel over remastered images
    map = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imdata = map.data;
    for (let p = 0, len = imdata.length; p < len; p += 4) {
        imdata[p + 3] = alphas[p + 3];
    }
    ctx.putImageData(map, 0, 0);

    // replace image source with canvas data
    imgElement.src = canvas.toDataURL();
}
