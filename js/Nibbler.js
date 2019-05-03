gaAnimations["BlueExplosion"] = LoadAnimation(24, "Images/Explosions_particles/blue_explosion/bluspark_", ".png");
gaAnimations["RedExplosion"] = LoadAnimation(24, "Images/Explosions_particles/red_explosion/red_snakeplosion_", ".png");
gaAnimations["GreenExplosion"] = LoadAnimation(24, "Images/Explosions_particles/green_explosion/green_explosion_", ".png");
gaAnimations["YellowExplosion"] = LoadAnimation(24, "Images/Explosions_particles/yellow_explosion/yellow_explosion_", ".png");

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

        this.Explosion = gaAnimations["GreenExplosion"];

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
    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        if (gaNibblers[iLoop] != null &&
            this !== gaNibblers[iLoop] &&
            this.PositionX === gaNibblers[iLoop].PositionX &&
            this.PositionY === gaNibblers[iLoop].PositionY) {
            this.SetSpawnPoint();
        }
    }
}
Nibbler.UpdateTail = function (oNibbler) { oNibbler.UpdateTail(); }

function InitializePlayers() {

    for (let iLoop = 0; iLoop < 4; iLoop++) {
        oColorPlayer[iLoop].style.display = 'none';
        oSpanPlayer[iLoop].innerText = ``;
        removeClass(oSpanPlayer[iLoop], "blink_me");
        removeClass(oSpanPlayer[iLoop], "dead");
    }

    let iNumberOfPlayers = 1;

    if (oSelectPlayer[1].value !== "None") iNumberOfPlayers++;
    if (oSelectPlayer[2].value !== "None") iNumberOfPlayers++;
    if (oSelectPlayer[3].value !== "None") iNumberOfPlayers++;

    gaNibblers = new Array(iNumberOfPlayers);

    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        gaNibblers[iLoop] = new Nibbler();
        gaNibblers[iLoop].Index = iLoop;
        gaNibblers[iLoop].SetSpawnPoint();
        gaNibblers[iLoop].Lives = oNumberLives.value;

        oColorPlayer[iLoop].style.display = 'inline-block';
        oColorPlayer[iLoop].value = oColorMenuPlayer[iLoop].value;
        gaNibblers[iLoop].fillStyle = oColorMenuPlayer[iLoop].value;
        gaNibblers[iLoop].Name = oTxtPlayerName[iLoop].value.length > 0 ? oTxtPlayerName[iLoop].value : "Player " + (iLoop + 1);
        gaNibblers[iLoop].Type = oSelectPlayer[iLoop].value;
    }

    if (gaNibblers.length > 1) {
        // Override Player Two Input Keys
        gaNibblers[1].KeyLeft = 65; // "A"
        gaNibblers[1].KeyUp = 87; // "W"
        gaNibblers[1].KeyRight = 68; // "D"
        gaNibblers[1].KeyDown = 83; // "S"
        gaNibblers[1].Explosion = gaAnimations["RedExplosion"];
    }

    if (gaNibblers.length > 2) {
        // Override Player Two Input Keys
        gaNibblers[2].KeyLeft = 74; // "A"
        gaNibblers[2].KeyUp = 73; // "W"
        gaNibblers[2].KeyRight = 76; // "D"
        gaNibblers[2].KeyDown = 75; // "S"
        gaNibblers[2].Explosion = gaAnimations["BlueExplosion"];
    }

    if (gaNibblers.length > 3) {
        // Override Player Two Input Keys
        gaNibblers[3].KeyLeft = 100; // "A"
        gaNibblers[3].KeyUp = 104; // "W"
        gaNibblers[3].KeyRight = 102; // "D"
        gaNibblers[3].KeyDown = 101; // "S"
        gaNibblers[3].Explosion = gaAnimations["YellowExplosion"];
    }
}
function NibblerDied(oPlayer) {

    gaSprites.push(new Sprite(oPlayer.Explosion, oPlayer.PositionX, oPlayer.PositionY, 15));

    oPlayer.Dead = true;
    oPlayer.DirectionX = 0;
    oPlayer.DirectionY = 0;
    oPlayer.Trail.length = 0;
    oPlayer.TailLength = giMinimumTailLength; // Need to remove the tail

    if (oPlayer.Lives > 0) {
        if (--oPlayer.Lives === 0) addClass(oSpanPlayer[oPlayer.Index], "blink_me");

        oPlayer.SetSpawnPoint();
        setTimeout(function () { oPlayer.Dead = false; }, 1000, oPlayer);
    } else {
        removeClass(oSpanPlayer[oPlayer.Index], "blink_me");
        addClass(oSpanPlayer[oPlayer.Index], "dead");

        let iLivesRemaining = 0;
        for (let iLoop = gaNibblers.length; iLoop--;) {
            iLivesRemaining += gaNibblers[iLoop].Lives;
        }

        if (iLivesRemaining <= 0) {
            Pause();
        }
    }
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
    for (let iLoop = gaPellets.length; iLoop--;) {
        if (gaPellets[iLoop].PositionX === oPlayer.PositionX && gaPellets[iLoop].PositionY === oPlayer.PositionY) {
            gaPellets[iLoop].Eatten(oPlayer);
            delete gaPellets[iLoop];
            gaPellets[iLoop] = new Pellet();
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
    for (let iLoop = gaNibblers.length; iLoop--;) {
        if (gaNibblers[iLoop].Trail && gaNibblers[iLoop].Trail !== oPlayer.Trail) {
            for (let iLoop2 = gaNibblers[iLoop].Trail.length; iLoop2--;) {
                if (gaNibblers[iLoop].Trail[iLoop2].x === oPlayer.PositionX &&
                    gaNibblers[iLoop].Trail[iLoop2].y === oPlayer.PositionY) {
                    if (gbDeadlyTails) gaNibblers[iLoop].Kills++;
                    return true;
                }
            }
        }
    }

    return false;
}
