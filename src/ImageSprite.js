import Sprite from "./Sprite.js";

export default class ImageSprite extends Sprite{
    constructor(x,y,fwd,speed,width,height,image,type){
        super(x,y,fwd,speed);
        this.width = width;
        this.height = height;
        this.image = image;
        this.type = type;
    }

    //For sprites that do not animate
    draw(ctx){
        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    //for sprites that animate
    draw(ctx, sampleRect){
        ctx.save();
        ctx.drawImage(this.image, sampleRect.x, sampleRect.y, sampleRect.w, sampleRect.h, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}