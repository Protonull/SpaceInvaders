ig.module (
    "game.entities.player"
)
.requires(
    "impact.entity"
)
.defines(function(){
    Player = ig.Entity.extend({
        /* Metrics */
        size: { x: 50, y: 30 },
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        
        /* Formalities */
        maxVel: { x: 1000, y: 0 },
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        
        /* Game Variabes */
        cooldown: 0,
        
        /* Default Functions */
        init: function ( x, y, opt ) {
            this.parent();
            this.pos.x = ( ig.game.width() / 2 ) - ( this.size.x / 2 );
            this.pos.y = ig.game.height() - 40;
        },
        update: function () {
            this.parent();
            this.vel.x = ig.input.state( "A" ) && ig.game.playing ? -350 : ig.input.state( "D" ) && ig.game.playing ? 350 : 0;
            this.pos.x = Math.clamp( this.pos.x, 15, ig.game.width() - this.size.x - 15 );
            
            this.cooldown = Math.clamp( this.cooldown -= ig.system.tick, 0, 10 );
            if ( ig.input.pressed( "F" ) && this.cooldown == 0 && ig.game.bullets > 0 && ig.game.playing ) {
                this.cooldown += 0.1;
                ig.game.bullets--;
                var spawnLocX = this.pos.x + ( this.size.x / 2 ) - 2.5,
                    bulletProps = { 
                        type: ig.Entity.TYPE.A,
                        speed: -1000
                    };
                ig.game.spawnEntity( Bullet, spawnLocX, this.pos.y, bulletProps );
            }
        },
        draw: function () {
            var ctx = ig.system.context;
            /* Draw Land */
            ctx.beginPath();
            ctx.fillStyle = "#09B500";
            ctx.fillRect( 0, ig.game.height() - 30, ig.game.width(), 30 );
            ctx.stroke();
            /* Draw Player */
            ctx.beginPath();
            ctx.fillStyle = "#FFF";
            ctx.fillRect( this.pos.x, this.pos.y, this.size.x, this.size.y );
            ctx.stroke();
            /* Done */
            this.parent();
        }
    });
});