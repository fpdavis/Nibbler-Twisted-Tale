LoadAnimation = function (Frames, SourcePrefix, SourceSuffix) {
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
LoadImage = function(Source) {
    let aImage = [];
    aImage.push(new Image());
    aImage[0].src = Source;
    MessageLog("Source = " + aImage[0].src, goVerbosityEnum.Debug);

    return aImage;
}

var gaAnimations = new Object();
gaAnimations["BlueExplosion"] = LoadAnimation(24, "Images/Explosions_particles/blue_explosion/bluspark_000", ".png");
gaAnimations["RedExplosion"] = LoadAnimation(24, "Images/Explosions_particles/red_explosion/red_snakeplosion_000", ".png");
gaAnimations["GreenExplosion"] = LoadAnimation(24, "Images/Explosions_particles/green_explosion/green_explosion_000", ".png");
gaAnimations["YellowExplosion"] = LoadAnimation(24, "Images/Explosions_particles/yellow_explosion/yellow_explosion_000", ".png");
gaAnimations["Brainspawn"] = LoadAnimation(17, "Images/Slime/Slime_000", ".png");
gaAnimations["BlueBean"] = LoadImage("Images/yaycandies/size1/bean_blue.png");

class Sprite {
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
Sprite.prototype.Draw = function () {
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
