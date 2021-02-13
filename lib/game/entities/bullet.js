ig.module (
    "game.entities.bullet"
)
.requires(
    "impact.entity"
)
.defines(function(){
    Bullet = ig.Entity.extend({
        /* Identification */
        name: "Bullet" + parseInt( Math.random().toString().substring( 2, 8 ) ),
        
        /* Metrics */
        size: { x: 5, y: 5 },
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        
        /* Formalities */
        maxVel: { x: 0, y: 1000 },
        
        /* Custom Variables */
        speed: 0,
        
        /* Default Functions */
        init: function ( x, y, opt ) {
            this.parent( x, y, opt );
        },
        update: function () {
            this.parent();
            // Velocity
            this.vel.y = ig.game.playing ? this.speed : 0;
            // Out of bounds
            if ( this.pos.x < 0 - 10 - this.size.x ) this.kill();
            if ( this.pos.y < 0 - 10 - this.size.y ) this.kill();
            if ( this.pos.x > ig.game.width() + 10 + this.size.x ) this.kill();
            if ( this.pos.y > ig.game.height() + 10 + this.size.y ) this.kill();
        },
        draw: function () {
            var ctx = ig.system.context;
            /* Draw Bullet */
            ctx.beginPath();
            ctx.fillStyle = "#FFF";
            ctx.fillRect( this.pos.x || 0, this.pos.y || 0, this.size.x, this.size.y );
            ctx.stroke();
            /* Done */
            this.parent();
        }
    });
});