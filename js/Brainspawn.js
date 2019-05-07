gaAnimations["Brainspawn_North"] = LoadAnimation(3, "Images/Slime/Slime_North_", ".png");
gaAnimations["Brainspawn_South"] = LoadAnimation(3, "Images/Slime/Slime_South_", ".png");
gaAnimations["Brainspawn_East"] = LoadAnimation(17, "Images/Slime/Slime_East_", ".png");
gaAnimations["Brainspawn_West"] = LoadAnimation(17, "Images/Slime/Slime_West_", ".png");

class Brainspawn {
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

        this.Sound = new Audio(Sounds.Effects["Splat"].src);
        this.strokeStyle = "yellow";
        this.fillStyle = "purple";

        this.SetSpawnPoint();
        
        this.Sprite = new Sprite(gaAnimations["Brainspawn_South"], this.PositionX, this.PositionY, 10, giGridSize - giGridSize * .1, giGridSize - giGridSize * .1);
        this.Sprite.Image_West = gaAnimations["Brainspawn_West"];
        this.Sprite.Image_East = gaAnimations["Brainspawn_East"];
        this.Sprite.Image_North = gaAnimations["Brainspawn_North"];
        this.Sprite.Image_South = gaAnimations["Brainspawn_South"];
        this.Sprite.Directional = true;
        this.Sprite.Loop = true;
        gaSprites.push(this.Sprite);
    }
}
Brainspawn.prototype.SetSpawnPoint = function () {
    this.PositionX = Math.floor(Math.random() * (giArenaSquaresX - 2)) + 1;
    this.PositionY = Math.floor(Math.random() * (giArenaSquaresY - 2)) + 1;

    // Don't spawn on top a player
    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        if (this.PositionX === gaNibblers[iLoop].PositionX && this.PositionY === gaNibblers[iLoop].PositionY) {
            this.SetSpawnPoint();
            return;
        }
    }

    // Don't spawn on top of another pellet
    for (let iLoop = gaPellets.length; iLoop--;) // Reverse loop for the win
    {
        if (gaPellets[iLoop] != null &&
            this.PositionX === gaPellets[iLoop].PositionX &&
            this.PositionY === gaPellets[iLoop].PositionY) {
            this.SetSpawnPoint();
            return;
        }
    }
}
Brainspawn.prototype.Draw = function () {
    // Check to see if player was killed
    for (let iLoop = gaNibblers.length; iLoop--;) {
        if (!gaNibblers[iLoop].Dead && gaNibblers[iLoop].PositionX === this.PositionX && gaNibblers[iLoop].PositionY === this.PositionY) {

            if (Sounds.NotMuted) {
                this.Sound.volume = Sounds.Volume;
                this.Sound.play();
            }

            NibblerDied(gaNibblers[iLoop]);
            this.Kills++;
            MessageLog(gaNibblers[iLoop].Name + " was killed by " + this.Name + " " + this.Index, goVerbosityEnum.Information);
        }
    }

    //this.DrawTarget();
}
Brainspawn.Draw = function (oBrainspawn) { oBrainspawn.Draw(); }
Brainspawn.prototype.Move = function () {

    let oVector = CalculateNewPosition(this.PositionX, this.PositionY, this.DirectionX, this.DirectionY);
    this.PositionX = this.Sprite.PositionX = oVector.PositionX;
    this.PositionY = this.Sprite.PositionY = oVector.PositionY;
    this.DirectionX = this.Sprite.DirectionX = oVector.DirectionX;
    this.DirectionY = this.Sprite.DirectionY = oVector.DirectionY;
}
Brainspawn.prototype.DrawTarget = function () {
    ctxArena.lineWidth = 2;
    ctxArena.strokeStyle = "white";
    ctxArena.beginPath();

    ctxArena.moveTo(this.PositionX * giGridSize, this.PositionY * giGridSize);
    ctxArena.lineTo(this.Target.PositionX * giGridSize, this.Target.PositionY * giGridSize);
    ctxArena.stroke();
}

function InitializeBrainspawn() {

    if (gaBrainspawns) gaBrainspawns.length = 0;

    if (chkEnemies.checked) {
        gaBrainspawns = new Array(gaNibblers.length > 2 ? gaNibblers.length - 1 : 1);

        for (let iLoop = gaBrainspawns.length; iLoop--;) {
            gaBrainspawns[iLoop] = new Brainspawn();
            gaBrainspawns[iLoop].Index = iLoop;
        }
    }
}
function BrainspawnLoop(oBrainspawn) {

    if (Math.round(Math.random() * 15) < 1) {
        oBrainspawn.Target = gaNibblers[Math.floor(Math.random() * gaNibblers.length)];
    } else {
        oBrainspawn.Target = gaNibblers[0];
        let iClosestDistance = giMaxDistanceToPellet;

        // Find nearest player 
        for (let iLoop = gaNibblers.length; iLoop--;) {
            var iDifferenceX = oBrainspawn.PositionX - gaNibblers[iLoop].PositionX;
            var iDifferenceY = oBrainspawn.PositionY - gaNibblers[iLoop].PositionY;
            var iDistance = Math.sqrt(iDifferenceX * iDifferenceX + iDifferenceY * iDifferenceY);

            if (!gaNibblers[iLoop].Dead && iDistance < iClosestDistance) {
                iClosestDistance = iDistance;
                oBrainspawn.Target = gaNibblers[iLoop];
            }
        }
    }

    Findpath_Brainspawn(oBrainspawn);

    oBrainspawn.Move();
}
