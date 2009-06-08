var live = function(){
    function ListenerList () {
        this.listeners = [];
    }
    ListenerList.prototype.add = function(listener) {
        this.listeners.push(listener);
    }
    ListenerList.prototype.remove = function(listener) {
        var i = 0;
        for (; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    ListenerList.prototype.fire = function() {
        var toRemove = [];
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].apply(null, arguments) === false) {
                toRemove.push(this.listeners[i]);
            }
        }
        for (var i = 0; i < toRemove.length; i++) {
            this.remove(toRemove[i]);
        }
    }

    function Dict() {
        this.store = {};
        this.listeners = new ListenerList();
    }
    Dict.prototype.addPutListener = function(listener) {
        this.listeners.add(listener);
    };
    Dict.prototype.removePutListener = function(listener) {
        return this.listeners.remove(listener);
    }
    Dict.prototype.put = function(key, val) {
        this.store[key] = val;
        this.listeners.fire(key, val);
    };
    Dict.prototype.get = function(key) {
        return this.store[key];
    };
    Dict.prototype.remove = function(key) {
        var val = this.store[key];
        if (val != null) {
            delete this.store[key];
        }
        return val;
    };
    Dict.prototype.each = function(callback) {
        for (var key in this.store) {
            if (callback(key, this.store[key]) === false) {
                return;
            }
        }
    }

    function List() {
        this.store = [];
        this.listeners = new ListenerList();
    }
    List.prototype.push = function(item) {
        this.store.push(item);
        this.listeners.fire(item);
    }
    List.prototype.addPushListener = function(listener) {
        this.listeners.add(listener);
    }
    List.prototype.removePushListener = function(listener) {
        return this.listeners.remove(listener);
    }
    List.prototype.each = function(callback) {
        for (var i = 0; i < this.store.length; i++) {
            if (callback(this.store[i], i) === false) {
                return;
            }
        }
    }

    return {
        Dict:Dict,
        List:List,
        util: {
            ListenerList: ListenerList
        }
    };
}();
