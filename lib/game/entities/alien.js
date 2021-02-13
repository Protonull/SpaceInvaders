ig.module (
    "game.entities.alien"
)
.requires(
    "impact.entity"
)
.defines(function(){
    Aliens = ig.Entity.extend({
        /* Metrics */
        size: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        
        /* Formalities */
        maxVel: { x: 0, y: 0 },
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        
        /* Sub Entities */
        aliens: [],
        
        /* Sub Entity Variables */
        opt: {
            // Grouping
            amount: 17,
            length: 6,
            // Metrics
            size: { x: 30, y: 30 },
            direction: Math.random() > 0.5 ? 1 : -1,
            // Position
            between: 15,
            // Movement
            moveCount: 0,
            moveCountWait: 1.5,
            didFall: false,
            // Time
            difficulty: 1
        },
        
        /* Custom Functions */
        isDead: function () {
            var target = this.opt.amount, length = this.aliens.length, current = 0;
            if ( length == 0 ) return false;
            for ( var i = 0; i < length; i++ ) if ( this.aliens[ i ].dead == true ) current++;
            if ( current == target ) return true; else return false;
        },
        testWin: function () {
            for ( var i = 0, l = this.aliens.length; i < l; i++ ) this.aliens[ i ].dead = true;
            return true;
        },
        lowestAlive: function () {
            for ( var i = 0, l = this.aliens.length, r = -1; i < l; i++ ) if ( this.aliens[ i ].dead == false ) r = i + 1;
            return r;
        },
        
        /* Default Functions */
        init: function ( x, y, opt ) {
            // Formalities
            this.parent();
            // Calculations
            var totalRows = Math.ceil( this.opt.amount / this.opt.length );
            // Size
            this.size.x = ( this.opt.length * this.opt.size.x ) + ( Math.max( this.opt.length - 1, 0 ) * this.opt.between );
            this.size.y = ( totalRows * this.opt.size.y ) + ( Math.max( totalRows - 1, 0 ) * this.opt.between );
            // Position
            this.pos.x = ( ig.game.width() / 2 ) - ( this.size.x / 2 );
            this.pos.y = 60;
            // Add individual aliens
            for ( var i = 1; i <= this.opt.amount; i++ ) {
                var locCol = (function( i, l ){ return i !== 0 && ( i % l ) == 0 ? l : i % l; })( i, this.opt.length ),
                    locRow = Math.ceil( i / this.opt.length ),
                    curLen = Math.clamp( this.opt.amount - ( this.opt.length * ( locRow - 1 ) ), 1, this.opt.length ),
                    xOffset = ( this.size.x / 2 ) - ( curLen * this.opt.size.x / 2 ) - ( ( ( curLen - 1 ) * this.opt.size.x / 2 ) / 2 );
                
                this.aliens.push({
                    dead: false,
                    offset: xOffset,
                    x: xOffset + ( ( locCol - 1 ) * ( this.opt.size.x / 2 ) ) + ( ( locCol - 1 ) * this.opt.size.x ),
                    y: ( ( locRow - 1 ) * this.opt.size.y ) + ( ( locRow - 1 ) * ( this.opt.size.y / 2 ) )
                });
            }
        },
        update: function () {
            this.parent();
            if ( ig.game.playing ) {
                // Size
                var totalRows = Math.ceil( this.lowestAlive() / this.opt.length );
                this.size.y = ( totalRows * this.opt.size.y ) + ( Math.max( totalRows - 1, 0 ) * this.opt.between );
                // Velocity
                this.opt.moveCount += ig.system.tick * this.opt.difficulty;
                if ( this.opt.moveCount >= this.opt.moveCountWait ) {
                    this.opt.moveCount -= this.opt.moveCountWait;
                    this.pos.x += this.opt.size.x / 2 * this.opt.direction;
                }
            }
            // Direction
            var xMin = 0 + this.opt.size.x / 2,
                xMax = ig.game.width() - this.size.x - this.opt.size.x / 2;
            if ( this.pos.x < xMin || this.pos.x > xMax ) {
                this.opt.direction *= -1;
                this.pos.x += this.opt.size.x / 2 * this.opt.direction;
                this.pos.y += this.opt.size.y / 2;
                this.opt.difficulty *= 1.15;
            }
            // Self Regulation
            this.pos.x = Math.clamp( this.pos.x, xMin, xMax );
        },
        check: function ( entity ) {
            if ( !entity ) return false;
            if ( !ig.game.playing ) return false;
            for ( var i = 0, l = this.aliens.length; i < l; i++ ) {
                if ( this.aliens[ i ].dead !== true ) {
                    var b1 = { x: entity.pos.x, y: entity.pos.y, w: entity.size.x, h: entity.size.y }; // Bullet
                    var b2 = { x: this.pos.x + this.aliens[ i ].x, y: this.pos.y + this.aliens[ i ].y, w: this.opt.size.x, h: this.opt.size.y }; // Alien
                    if ( b1.x < b2.x + b2.w && b1.x + b1.w > b2.x && b1.y < b2.y + b2.h && b1.h + b1.y > b2.y ) {
                        this.aliens[ i ].dead = true;
                        entity.kill();
                        ig.game.bullets++;
                        ig.game.bulletCount = 0;
                    }
                }
            }
        },
        draw: function () {
            var ctx = ig.system.context;
            var anchor = this.pos,
                size = this.opt.size,
                aliens = this.aliens;
            if ( ig.game.debug == true ) {
                // Draw Middle Line
                ctx.beginPath();
                ctx.strokeStyle = "#FF0000";
                ctx.moveTo( anchor.x + ( this.size.x / 2 ), anchor.y - 10 );
                ctx.lineTo( anchor.x + ( this.size.x / 2 ), anchor.y );
                ctx.stroke();
                // Draw Outline
                ctx.beginPath();
                ctx.strokeStyle = "#4AFF62";
                ctx.rect( anchor.x, anchor.y, this.size.x, this.size.y );
                ctx.stroke();
            }
            for ( var i = 0, l = aliens.length; i < l; i++ ) {
                if ( ig.game.debug == true ) {
                    // See offset
                    ctx.beginPath();
                    ctx.strokeStyle = "#FF0000";
                    ctx.moveTo( anchor.x + aliens[ i ].offset, ( anchor.y + aliens[ i ].y ) - 5 || 0 );
                    ctx.lineTo( anchor.x + aliens[ i ].offset, ( anchor.y + aliens[ i ].y ) + 5 || 0 );
                    ctx.stroke();
                }
                // Draw Aliens
                if ( aliens[ i ].dead !== true ) {
                    ctx.beginPath();
                    ctx.fillStyle = "#E5FF66";
                    ctx.fillRect( ( anchor.x + aliens[ i ].x ) || 0, ( anchor.y + aliens[ i ].y ) || 0, size.x || 0, size.y || 0 );
                    ctx.stroke();
                }
            }
            this.parent();
        }
    });
});