var live = function(){
    function ListenerList () {
        this.listeners = [];
    }
    ListenerList.prototype.add = function(listener) {
        this.listeners.push(listener);
    };
    ListenerList.prototype.remove = function(listener) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
                return true;
            }
        }
        return false;
    };
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
    };

    function Dict() {
        this.store = {};
        this.listeners = new ListenerList();
    }
    Dict.prototype.addPutListener = function(listener) {
        this.listeners.add(listener);
    };
    Dict.prototype.removePutListener = function(listener) {
        return this.listeners.remove(listener);
    };
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
    };
    Dict.prototype.size = function() {
        var size = 0;
        for (var key in this.store) {
            size++;
        }
        return size;
    };

    function List() {
        this.store = [];
        this.pushListeners = new ListenerList();
        this.removeListeners = new ListenerList();
        if (arguments.length > 0) {
            this.push.apply(this, arguments);
        }
    }
    List.prototype.push = function() {
        for (var i = 0; i < arguments.length; i++) {
            this.store.push(arguments[i]);
            this.pushListeners.fire(arguments[i]);
        }
    };
    List.prototype.remove = function(item) {
        for (var i = 0; i < this.store.length; i++) {
            if (this.store[i] === item) {
                this.removeListeners.fire(this.store.splice(i, 1)[0]);
                return true;
            }
        }
        return false;
    };
    List.prototype.addPushListener = function(listener) {
        this.pushListeners.add(listener);
    };
    List.prototype.removePushListener = function(listener) {
        return this.pushListeners.remove(listener);
    };
    List.prototype.addRemoveListener = function(listener) {
        this.removeListeners.add(listener);
    };
    List.prototype.removeRemoveListener = function(listener) {
        return this.removeListeners.remove(listener);
    };
    List.prototype.each = function(callback) {
        for (var i = 0; i < this.store.length; i++) {
            if (callback(this.store[i], i) === false) {
                return;
            }
        }
    };
    List.prototype.map = function(callback) {
      var mapped = [];
      for (var i = 0; i < this.store.length; i++) {
          mapped.push(callback(this.store[i], i));
      }
      return mapped;
    };
    List.prototype.size = function() {
        return this.store.length;
    };

    return {
        Dict:Dict,
        List:List,
        util: {
            ListenerList: ListenerList
        }
    };
}();
