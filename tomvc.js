// Todo, keep away from global space

var ToMvc = function() {
    this.views  = [];
    this.models = [];
    this.events = [];

    this.listen = function( event, fn ) {
        base.events.push( {
            view     : this.name,
            event    : event,
            callback : fn.bind( this )
        });
    }

    this.broadcastTo = function ( event, data ) {
        base.events.forEach( function( item ) {
            if ( item.event === event ) {
                item.callback( data );
            }
        });
    }

};

ToMvc.prototype.registerView = function( name, el ) {
    var view = new base.View( this, name, el );
    this.views.push( view );
    return view;
};

ToMvc.prototype.registerModel = function( name ) {
    var model = new base.Model( this, name );
    this.models.push( model );
    return model;
};


ToMvc.prototype.View = function( base, name, el ) {
    this.base = base;
    this.name = name ? name : 'view';
    this.el   = el;
    this.listenTo = function( event ) {
        base.listen.call( this, event, function( data ) {
            console.info('view ' + this.name + ' called listener with data: ' + data );
        } );
    };
    this.broadcast = function( event, data ) {
        base.broadcastTo.call( this, event, data );
    }
};

ToMvc.prototype.Model = function( base, name ) {
    this.base = base;
    this.name = name ? name : 'model';
    this.broadcast = function( event ) {
        base.broadcastTo.call( this, event, 'apples' );
    }
};


// TESTS

var base  = new ToMvc();
var viewA = base.registerView( 'A', 'element' );
viewA.listenTo( 'eventA' );
viewA.listenTo( 'eventB' );

var viewB = base.registerView( 'B', 'element' );
viewB.listenTo( 'eventB' );

var modelA = base.registerModel( 'C' );
modelA.broadcast ( 'eventB');
