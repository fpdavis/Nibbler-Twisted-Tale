LoadAnimation = function (Frames, SourcePrefix, SourceSuffix) {
    let aImage = [];
    let iIndex;
    let sImageURL;

    for (let iLoop = 1; iLoop <= Frames; iLoop++) {

        // TODO - Would like to eventually check if image exists. Not easy to do while in loop and they need to be in order.
        sImageURL = SourcePrefix + iLoop + SourceSuffix;

        aImage.push(new Image());
        aImage[aImage.length - 1].src = sImageURL;
        MessageLog("aImage.src = " + aImage[aImage.length - 1].src, goVerbosityEnum.Debug);
    }

    setTimeout(function () { TruncateImageArray(aImage); }, 4000);

    return aImage;
};

LoadImage = function (Source) {
    let aImage = [];
    aImage.push(new Image());
    aImage[0].src = Source;
    MessageLog("Source = " + aImage[0].src, goVerbosityEnum.Debug);

    return aImage;
};

TruncateImageArray = function (aImage) {

    for (let iLoop = 0; iLoop < aImage.length; iLoop++) {

        if (aImage[iLoop].complete && aImage[iLoop].width === 0) {
            
            MessageLog("Animation truncated at " + aImage[iLoop].src, goVerbosityEnum.Information);
            aImage.length = iLoop;
            
            return;
        }
    }
};
 
class Sprite {
    constructor(Image, x, y, z = 0, width = 0, height = 0) {
        this.PositionX = x;
        this.PositionY = y;
        this.DirectionX = 0;
        this.DirectionY = 0;
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

        if (this.DirectionX === 0 && this.DirectionY === 0 && this.Image.length > 0) {
            ctxArena.drawImage(this.Image[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
        }
        else if (this.DirectionX === -1 && this.DirectionY === 0 && this.Image_West && this.Image_West.length > 0) {
            ctxArena.drawImage(this.Image_West[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
        }
        else if (this.DirectionX === 1 && this.DirectionY === 0 && this.Image_East && this.Image_East.length > 0) {
            ctxArena.drawImage(this.Image_East[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
        }
        else if (this.DirectionX === 0 && this.DirectionY === -1 && this.Image_North && this.Image_North.length > 0) {
            ctxArena.drawImage(this.Image_North[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
        }
        else if (this.DirectionX === 0 && this.DirectionY === 1 && this.Image_South && this.Image_South.length > 0) {
            ctxArena.drawImage(this.Image_South[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
        }
        else if (gbDiagonalMovement) {
            if (this.DirectionX === 1 && this.DirectionY === 1 && this.Image_SouthEast && this.Image_SouthEast.length > 0) {
                ctxArena.drawImage(this.Image_SouthEast[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
            }
            else if (this.DirectionX === 1 && this.DirectionY === -1 && this.Image_NorthEast && this.Image_NorthEast.length > 0) {
                ctxArena.drawImage(this.Image_NorthEast[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
            }
            else if (this.DirectionX === -1 && this.DirectionY === -1 && this.Image_NorthWest && this.Image_NorthWest.length > 0) {
                ctxArena.drawImage(this.Image_NorthWest[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
            }
            else if (this.DirectionX === -1 && this.DirectionY === 1 && this.Image_SouthWest && this.Image_SouthWest.length > 0) {
                ctxArena.drawImage(this.Image_South[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
            }
            else {
                ctxArena.drawImage(this.Image[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
            }
        }
        else  {
            ctxArena.drawImage(this.Image[this.CurrentFrame++], iOffsetX, iOffsetY, this.Width, this.Height);
        }
    }

    if (this.CurrentFrame >= this.Frames) {
        if (this.Loop) {
            this.CurrentFrame = 0;
        } else {
            this.Complete = true;
        }
    }
};
Sprite.Draw = function (oSprite) { oSprite.Draw(); };
