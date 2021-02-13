ig.module( 
	"game.main"
)
.requires(
	"impact.game",
    "game.entities.player",
    "game.entities.alien",
    "game.entities.bullet"
)
.defines( function () {
    MyGame = ig.Game.extend({
        /* Root */
        root: window.top.location.href.split( "/" ).reverse().splice( 1 ).reverse().join( "/" ) + "/",
        
        /* UI */
        width:  function () { return typeof ig.system == "undefined" ? 0 : Math.max(  ig.system.width || 0,  ig.system.realWidth || 0 ) },
        height: function () { return typeof ig.system == "undefined" ? 0 : Math.max( ig.system.height || 0, ig.system.realHeight || 0 ) },
        debug: true,
        
        /* Game */
        bullets: 5,
        score: 0,
        player: null,
        aliens: null,
        playing: true,
        dead: false,
        won: false,
        deathCount: 0,
        deathCountWait: 5,
        bulletCount: 0,
        bulletCountWait: 10,
        
        /* Custom Function */
        reset: function () {
            this.playing = false;
            this.won = false;
            this.dead = false;
            this.deathCount = 0;
            this.bullets = 5;
            this.score = 0;
            ig.game.entities.forEach( function ( entity ) {
                if ( entity ) entity.kill()
            });
            this.player = ig.game.spawnEntity( Player );
            this.aliens = ig.game.spawnEntity( Aliens );
            this.playing = true;
        },
        
        /* Default Function */
        init: function () {
            /* Keybinds */
            ig.input.bind( ig.KEY.A, "A" );
            ig.input.bind( ig.KEY.LEFT_ARROW, "A" );
            ig.input.bind( ig.KEY.D, "D" );
            ig.input.bind( ig.KEY.RIGHT_ARROW, "D" );
            ig.input.bind( ig.KEY.SPACE, "F" );
            ig.input.bind( ig.KEY.ENTER, "F" );
            ig.input.bind( ig.KEY.W, "F" );
            ig.input.bind( ig.KEY.UP_ARROW, "F" );
            ig.input.bind( ig.KEY.MOUSE1, "L" );
            ig.input.bind( ig.KEY.P, "P" );
            ig.input.bind( ig.KEY.R, "R" );
            ig.input.bind( ig.KEY.B, "B" );
            /* Game */
            this.player = ig.game.spawnEntity( Player );
            this.aliens = ig.game.spawnEntity( Aliens );
        },
        update: function () {
            this.parent();
            /* Clamp Score to 10 */
            this.score = Math.clamp( this.score, 0, 10 );
            /* Bullet Regeneration */
            if ( this.playing ) {
                this.bulletCount += ig.system.tick;
                if ( this.bulletCount >= this.bulletCountWait ) {
                    this.bulletCount -= this.bulletCountWait;
                    this.bullets++
                }
            }
            /* Clamp bullet stock to 5 */
            this.bullets = Math.clamp( this.bullets, 0, 5 );
            /* Click Handle */
            if ( ig.input.pressed( "L" ) ) {
                var m = { x: ig.input.mouse.x, y: ig.input.mouse.y };
                var rb = { x: this.width() - 30, y: 10, w: 20, h: 20 };
                var pb = { x: this.width() - 60, y: 10, w: 20, h: 20 };
                if ( m.x > pb.x && m.x < pb.x + pb.w && m.y > pb.y && m.y < pb.y + pb.h ) {
                    if ( !this.dead ) this.playing = !this.playing;
                }
                if ( m.x > rb.x && m.x < rb.x + rb.w && m.y > rb.y && m.y < rb.y + rb.h ) {
                    this.reset();
                }
            }
            /* Pause Game */
            if ( ig.input.pressed( "P" ) ) {
                if ( !this.dead ) this.playing = !this.playing;
            }
            /* Reset Game */
            if ( ig.input.pressed( "R" ) ) {
                this.reset();
            }
            /* Toggle Debug */
            if ( ig.input.pressed( "B" ) ) {
                this.debug = !this.debug;
            }
            /* Player Death Detection */
            if ( this.playing ) {
                if ( this.aliens.pos.y >= this.height() - 80 - this.aliens.size.y ) {
                    this.dead = true;
                    this.playing = false;
                }
                if ( this.aliens.isDead() ) {
                    this.won = true;
                    this.playing = false;
                }
            }
            /* Death */
            if ( this.dead || this.won ) {
                this.deathCount += ig.system.tick;
                if ( this.deathCount >= this.deathCountWait ) {
                    this.reset();
                }
            }
            /* Debug */
            if ( this.debug == true ) console.log( "Currently: " + this.entities.length + " entities in existence." );
        },
        draw: function () {
            this.parent();
            /* Canvas Context */
            var ctx = ig.system.context;
            /* Bullet Count */
            ctx.beginPath();
            ctx.fillStyle = "#FFF";
            ctx.font = "20px Arial";
            ctx.fillText( ig.game.bullets + " Bullets", 10, 25 );
            /* Death Line */
            ctx.beginPath();
            ctx.strokeStyle = "#FF0000";
            ctx.moveTo( 0, this.height() - 80 );
            ctx.lineTo( this.width(), this.height() - 80 );
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "#FFF";
            ctx.font = "14px Arial";
            ctx.fillText( "Defeat", 5, this.height() - 85 );
            /* Reset Button */
            ctx.beginPath();
            ctx.strokeStyle = "#FFF";
            ctx.rect( this.width() - 30, 10, 20, 20 );
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#FFF";
            ctx.moveTo( this.width() - 25, 15 );
            ctx.lineTo( this.width() - 15, 25 );
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#FFF";
            ctx.moveTo( this.width() - 25, 25 );
            ctx.lineTo( this.width() - 15, 15 );
            ctx.stroke();
            /* Pause Button */
            ctx.beginPath();
            ctx.strokeStyle = "#FFF";
            ctx.rect( this.width() - 60, 10, 20, 20 );
            ctx.stroke();
            if ( this.playing == true ) {
                // Pause Icon
                ctx.beginPath();
                ctx.strokeStyle = "#FFF";
                ctx.moveTo( this.width() - 55, 17 );
                ctx.lineTo( this.width() - 45, 17 );
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "#FFF";
                ctx.moveTo( this.width() - 55, 23 );
                ctx.lineTo( this.width() - 45, 23 );
                ctx.stroke();
            }
            else {
                // Play Icon
                ctx.beginPath();
                ctx.strokeStyle = "#FFF";
                ctx.moveTo( this.width() - 54, 15 );
                ctx.lineTo( this.width() - 45, 20 );
                ctx.lineTo( this.width() - 54, 25 );
                ctx.lineTo( this.width() - 54, 15 );
                ctx.stroke();
            }
            /* Death Screen */
            if ( this.dead ) {
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.fillStyle = "#B3B3B3";
                ctx.fillRect ( 0, 0, this.width(), this.height() );
                ctx.restore();
                ctx.beginPath();
                ctx.fillStyle = "#FFF";
                ctx.font = "70px Arial";
                ctx.fillText( "You dead", ( this.width() / 2 ) - 150, ( this.height() / 2 ) - 40 );
            }
            /* Win Screen */
            if ( this.won ) {
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.fillStyle = "#F7F700";
                ctx.fillRect ( 0, 0, this.width(), this.height() );
                ctx.restore();
                ctx.beginPath();
                ctx.fillStyle = "#FFF";
                ctx.font = "70px Arial";
                ctx.fillText( "YOU WON", ( this.width() / 2 ) - 170, ( this.height() / 2 ) - 40 );
            }
        }
    });
    ig.main( "#game_screen", MyGame, 60, 434, 510, 1 );
});
