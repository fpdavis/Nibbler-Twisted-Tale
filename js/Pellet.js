class Pellet {
    constructor() {
        this.Index = 0;
        this.Name = "Pellet";
        this.Points = 10;
        this.TailAdjustment = 1;
        this.Type = Math.floor(Math.random() * 3);
        this.PositionX = 0;
        this.PositionY = 0;

        this.Sound = new Audio(Sounds.Effects["Bite"].src);

        this.SetSpawnPoint();

        this.Image = gaAnimations["Pellet_" + this.Type];
        this.Sprite = new Sprite(this.Image, this.PositionX, this.PositionY, 30, giGridSize - giGridSize * .3, giGridSize - giGridSize * .3);
        this.Sprite.Loop = true;
        gaSprites.push(this.Sprite);
    }
}
Pellet.prototype.SetSpawnPoint = function () {
    this.PositionX = Math.floor(Math.random() * (giArenaSquaresX - 2)) + 1;
    this.PositionY = Math.floor(Math.random() * (giArenaSquaresY - 2)) + 1;

    // Don't spawn on top of another pellet
    for (let iLoop = gaPellets.length; iLoop--;) // Reverse loop for the win
    {
        if (gaPellets[iLoop] != null &&
            this !== gaPellets[iLoop] &&
            this.PositionX === gaPellets[iLoop].PositionX &&
            this.PositionY === gaPellets[iLoop].PositionY) {
            this.SetSpawnPoint();
            return;
        }
    }

    // Don't spawn on top a player or the tail
    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        if (gaNibblers[iLoop] != null && !gaNibblers[iLoop].Dead) {
            if (this.PositionX === gaNibblers[iLoop].PositionX && this.PositionY === gaNibblers[iLoop].PositionY) {
                this.SetSpawnPoint();
                return;
            }
            for (let iLoop2 = gaNibblers[iLoop].Trail.length; iLoop2--;) {
                if (this.PositionX === gaNibblers[iLoop].Trail[iLoop2].x && this.PositionY === gaNibblers[iLoop].Trail[iLoop2].y) {
                    this.SetSpawnPoint();
                    return;
                }
            }
        }
    }
};
Pellet.prototype.Eatten = function (oPlayer) {

    if (Sounds.NotMuted) {
        this.Sound.volume = Sounds.Volume;
        this.Sound.play();
    }

    this.Sprite.Loop = false;
    this.Sprite = null;

    this.Power(oPlayer);

    // Tell other players this pellet has been eaten
    for (let iLoop = gaNibblers.length; iLoop--;) // Reverse loop for the win
    {
        if (this === gaNibblers[iLoop].Target) gaNibblers[iLoop].Target = null;
    }
}
Pellet.prototype.Power = function (oPlayer) {

    // Pellets should be sorted from best (0) to worst (n)
    switch (this.Type) {
        case 0: // Score a Point            
            oPlayer.Score += this.Points;
            break;
        case 1: // Lengthen Tail/Score a Point
            oPlayer.TailLength += this.TailAdjustment;
            oPlayer.Score += this.Points;
            break;
        case 2: // Loose Tail/Loose a Point
            oPlayer.TailLength = giMinimumTailLength;
            oPlayer.Score -= this.Points;
            break;
    }
};
Pellet.prototype.Draw = function () {

}
Pellet.Draw = function (oPellet) { oPellet.Draw(); };

function InitializePellets() {

    if (gaPellets) gaPellets.length = 0;

    gaPellets = new Array(gaNibblers.length + 1);
    for (let iLoop = gaPellets.length; iLoop--;) {
        gaPellets[iLoop] = new Pellet();
        gaPellets[iLoop].Index = iLoop;
    }
}