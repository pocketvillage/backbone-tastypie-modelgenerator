/*
* Backbone-tastypie model generator
* Created by Marco Montanari
* released under 3 clause BSD 
*/


if (typeof(String.prototype.startsWith) !== 'function') {
    String.prototype.startsWith = function (str) {
        return this.splice(0, str.length) === str;
    };
};

if (typeof(String.prototype.endsWith) !== 'function') {
    String.prototype.endsWith = function (str) {
        return this.splice(-str.length) === str;
    };
};

(function (factory) {
    if (typeof define === 'function' && define.amd) {
    // An AMD compatible require library is available
    define(['backbone'], factory);
    } else {
    // No require library, assume backbone is available and edit global
    factory(Backbone);
    }
}(function (Backbone) {
    Backbone.SchemaUrl = "";
    Backbone.GeneratedModels = {};

    Backbone.LoadModelsFromUrl = function(url, models){
        Backbone.SchemaUrl = url;
        Backbone.BaseUrl = Backbone.SchemaUrl.split('/').splice(0,3).join('/');
        $.getJSON(Backbone.SchemaUrl, function(data){
            Backbone.LoadModels(data, models);
        });
    }
    
    Backbone.LoadModels = function(object, models) {
        for (var model in object) {
            var _mdl = {};
            _mdl['name'] = Backbone.ModelNameGenerator(model);
            _mdl['url'] = Backbone.BaseUrl + object[model]['list_endpoint'].slice(0,-1);
            _mdl['container_name'] = Backbone.ModelNameGenerator(model) + "Container";
            _mdl['schema'] = Backbone.BaseUrl + object[model]['schema'];
            
            _mdl['validator'] = {};
            
            $.getJSON(_mdl['schema'] , function(data) {
                for (var field in data['fields']) {
                    _mdl['validator'][field] = {};
                    _mdl['validator'][field]['type'] = data['fields']['type'];
                    if (data['fields']['blank'] == false) {
                        _mdl['validator'][field]['required'] = true;
                    }
                }
            });
            
            Backbone.GeneratedModels[_mdl['name']] = Backbone.Model.extend({
                urlRoot: _mdl['url'],
                validate:_mdl['validator']
            });
            
            Backbone.GeneratedModels[_mdl['container_name']] = Backbone.Collection.extend({
                urlRoot: _mdl['url'], 
                model: Backbone.GeneratedModels[_mdl['name']]
            });
        }
    }
    
    Backbone.ModelNameGenerator = function (string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    
    Backbone.TPValidator = function(model, attrib_set){
        var url = model.url();
    }
    
    Backbone.Validators = {};
    
    Backbone.Validators['string'] = function(attribute, value) {
        if (typeof value != "string") {
            return "Not valid string for attribute "+attribute;
        }
    }
    
    Backbone.Validators['object']= function(attribute, value) {
        if (typeof value != "object") {
            return "Not valid object for attribute "+attribute;
        }
    }
    
    Backbone.Validators['number']= function(attribute, value) {
        if (typeof value != "number") {
            return "Not valid number for attribute "+attribute;
        }
    }
    
    Backbone.Validators['boolean']= function(attribute, value) {
        if (typeof value != "boolean") {
            return "Not valid boolean for attribute "+attribute;
        }
    }
}));
