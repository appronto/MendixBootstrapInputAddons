/*global logger*/
/*
    BootstrapCacheAddons
    ========================

    @file      : BootstrapCacheAddons.js
    @version   : 1.0.0
    @author    : JvdGraaf
    @date      : Tue, 18 Jun 2019 12:58:14 GMT
    @copyright : Appronto B.V.
    @license   : Apache V2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mendix/validator",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/_base/kernel",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/html",
    "dojo/_base/event",
    "dojo/text!BootstrapInputAddons/widget/template/BootstrapCacheAddons.html",
], function (declare, validator, _WidgetBase, _TemplatedMixin, dojo, dojoConstruct, dojoAttr, dojoArray, lang, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("BootstrapInputAddons.widget.BootstrapCacheAddons", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor BootstrapCacheAddons");
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            this._updateRendering();
//            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            
            // Only render when the Object really changes
            if(this._contextObj && obj && this._contextObj.getGuid() != obj.getGuid())
            {
                // Change object
                this._updateRendering();
            } else if(!this._contextObj && obj)
            {
                // New object
                this._updateRendering();
            }

            this._contextObj = obj;
            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
        
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
        
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
        
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
        },
        
        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
            
            this._execMf(this.retrieveMF, lang.hitch(this, this._updateCache));
        },
        
        _updateCache: function(data) {
            if(data){
                //console.log(this.id +"._updateCache");
                document.cookie = "bootstrapcache="+data+";max-age=86400";                
            } else {
                document.cookie = "bootstrapcache=[]";
            }
        },

        _execMf: function (mf,cb) {
            logger.debug(this.id + "._execMf: " + mf);
            if (mf) {
                mx.data.action({
                    params: {
                        actionname: mf
                    },
                    origin: this.mxform,
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.log(error.description);
                    }
                }, this);
            }
        },

        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["BootstrapInputAddons/widget/BootstrapCacheAddons"]);
