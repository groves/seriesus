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
    function List() {
        this.store = [];
        this.listeners = [];
    }
    List.prototype.push = function(item) {
        this.store.push(item);
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](item);
        }
    }
    List.prototype.addPushListener = function(listener) {
        this.listeners.push(listener);
    }
    return {
        Dict:Dict,
        List:List
    };
}();
