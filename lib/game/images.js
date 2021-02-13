ig.module(
	"game.images"
)
.requires(
	"impact.entity"
)
.defines(function(){
    rawImage = ig.Entity.extend({
        name: "Image" + Math.floor( Math.random() * 1000000 ),
        size: { x: 0, y: 0 },
        pos: { x: -1000, y: -1000 },
        maxVel: { x: 0, y: 0 },
        
        /* Metrics */
        width: 0,
        height: 0,
        
        /* Image Saves */
        impact: null,
        image: null,
        canvas: null,
        init: function ( w, h, u ) {
            // Process Variables
            if ( typeof u !== "string" ) return false; else u = ig.game.rootLoc + String( u );
            if ( typeof w !== "number" ) return false; else w = parseFloat ( String( w ).replace( /[^\d.-]/g, "" ) ) || 0;
            if ( typeof h !== "number" ) return false; else h = parseFloat ( String( h ).replace( /[^\d.-]/g, "" ) ) || 0;
            // Set Variables
            this.width = w;
            this.height = h;
            // Begin Load
            this.impact = ig.Image.cache.hasOwnProperty( u ) ? ig.Image.cache[ u ] : new ig.Image( u );
            // Wait for Load
            var waitCount = 0, waitRef = this, waitLoop = setInterval( waitFunc, 10 );
            function waitFunc () {
                if ( waitRef.impact.loaded == true ) {
                    clearInterval( waitLoop );
                    waitRef.image = waitRef.impact.data;
                    waitRef.canvas = waitRef.get();
                }
                else {
                    waitCount += 10;
                    if ( waitCount > 10000 ) {
                        clearInterval( waitLoop );
                        ig.game.removeEntity( waitRef );
                    }
                }
            }
        },
        get: function () {
            return this.canvas || this.getArea( 0, 0, this.width, this.height );
        },
        getAreaCache: {},
        getArea: function ( x, y, w, h ) {
            // Process Variables
            x = typeof x !== "number" ? 0 : parseFloat ( String( x ).replace( /[^\d.-]/g, "" ) ) || 0;
            y = typeof x !== "number" ? 0 : parseFloat ( String( y ).replace( /[^\d.-]/g, "" ) ) || 0;
            w = typeof x !== "number" ? 0 : parseFloat ( String( w ).replace( /[^\d.-]/g, "" ) ) || 0;
            h = typeof x !== "number" ? 0 : parseFloat ( String( h ).replace( /[^\d.-]/g, "" ) ) || 0;
            // Check if Already Exists
            var areaName = [ x, y, w, h ].join( "," );
            if ( this.getAreaCache.hasOwnProperty( areaName ) ) return this.getAreaCache[ areaName ];
            // Create Canvas
            var canvasContext = (function( w, h ){
                var c = document.createElement( "canvas" ), x = c.getContext( "2d" );
                c.width = c.style.width = c.style.minWidth = c.style.maxWidth = w;
                c.height = c.style.height = c.style.minHeight = c.style.maxHeight = h;
                return x;
            })( w, h );
            // Check if image loaded
            if ( this.impact.loaded == true ) {
                var useImage = this.canvas ? this.canvas : this.image ? this.image : this.impact.data;
                if ( useImage ) canvasContext.drawImage( useImage, x, y, w, h, 0, 0, w, h );
            }
            return canvasContext.canvas;
        }
    })
});