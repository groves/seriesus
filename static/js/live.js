var live = function(){
    function Dict() {
        this.store = {};
        this.listeners = [];
    }

    Dict.prototype.addPutListener = function(listener) {
        this.listeners.push(listener);
    };

    Dict.prototype.put = function(key, val) {
        this.store[key] = val;
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](key, val);
        }
    };
    Dict.prototype.get = function(key) {
        return this.store[key];
    };
    return {
        Dict:Dict
    };
}();
