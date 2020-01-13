(function ($) {
    if(!$) { return }

    var api = {
        init: function(element, context, options) {
            if (!context) {
                context = new GuitPy.Platform.JavaScript.JsApi(element[0], options);
                element.data('GuitPy', context);
                
                for(var i = 0; i < api._initListeners.length; i++) {
                    api._initListeners[i](element, context, options);
                }
            }
        },
        
        destroy: function(element, context, tex) {
            element.removeData('GuitPy');
            context.Destroy();
        },
        
        tex: function(element, context, tex) {
            context.Tex(tex);
        },
         
        load: function(element, context, file) {
            context.Load(file);
        },
       
        tracks: function(element, context, tracks) {
            if(tracks) {
                context.SetTracks(tracks, true);
            }
            else {
                return context.get_Tracks();
            }
        },
        
        api: function(element, context) {
            return context;
        },
        
        score: function(element, context, score) {
            if(score) {
                context.ScoreLoaded(score);
            }
            else {
                return context.Score;
            }
        },
        
        renderer: function(element, context) {
            return context.Renderer;
        },
        
        layout: function(element, context, value) {
            if(typeof value === 'undefined') {
                return context.Settings.Layout;
            } 
            else {
                context.UpdateLayout(value);
            }            
        },
        
        print: function(element, context, width) {
            context.Print(width);
        },
               
        _initListeners: [],
        _oninit: function(handler) {
            api._initListeners.push(handler);
        },
    };
        
    var apiExec = function(element, method, args) {
        if(typeof(method) != "string") {
            args = [method];
            method = 'init';
        }
        
        if(method.charAt(0) === '_') {
            return;           
        }
        
        var $element = $(element);
        var context = $(element).data('GuitPy');
        if (method == 'destroy' && !context) { 
            return;
        }
        if (method != 'init' && !context) { 
            throw new Error('GuitPy not initialized!'); 
        }
                
        if (api[method]) {
            var realArgs = [ $element, context ].concat(args);
            return api[method].apply(this, realArgs);
        }
        else {
            console.error('Method ' + method + ' does not exist on jQuery.GuitPy');
        }
    };
       
    $.fn.GuitPy = function (method) {        
        // if only a single element is affected, we use this
        if(this.length == 1) {
            return apiExec(this[0], method, Array.prototype.slice.call(arguments, 1));
        }
        // if multiple elements are affected we provide chaining
        else {
            return this.each(function() {
                apiExec(this, method, Array.prototype.slice.call(arguments, 1));
            });
        }
    };
    $.GuitPy = {
        restore: function(selector) {
            $(selector).empty().removeData('GuitPy');
        }
    };
    // allow plugins to add methods
    $.fn.GuitPy.fn = api;
    
})(typeof jQuery !== 'undefined' ? jQuery : null);