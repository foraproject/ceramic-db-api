(function() {

    var DbAPI = function(backend, rowId) {
        this.backend = backend;
        this.rowId = rowId || "_id";
    };


    DbAPI.prototype.getCursor = function*(collectionName, query, options) {
        return yield* this.backend.getCursor(collectionName, query, options);
    };


    DbAPI.prototype.insert = function*(collectionName, document) {
        return yield* this.backend.insert(collectionName, document);
    };


    DbAPI.prototype.insertMany = function*(collectionName, documents) {
        return yield* this.backend.insertMany(collectionName, document);
    };


    DbAPI.prototype.update = function*(collectionName, query, document) {
        return yield* this.backend.update(collectionName, query, document);
    };


    DbAPI.prototype.updateMany = function*(collectionName, filter, update) {
        return yield* this.backend.updateMany(collectionName, query, document);
    };


    DbAPI.prototype.count = function*(collectionName, query) {
        return yield* this.backend.count(collectionName, query);
    };


    DbAPI.prototype.find = function*(collectionName, query, options) {
        return yield* this.backend.find(collectionName, query, options);
    };


    DbAPI.prototype.findOne = function*(collectionName, query, options) {
        return yield* this.backend.findOne(collectionName, query, options);
    };


    DbAPI.prototype.remove = function*(collectionName, query, options) {
        return yield* this.backend.remove(collectionName, query, options);
    };


    DbAPI.prototype.deleteDatabase = function*() {
        return yield* this.backend.deleteDatabase();
    };


    DbAPI.prototype.setupIndexes = function*(entitySchemas) {
        return yield* this.backend.setupIndexes(entitySchemas);
    };


    DbAPI.prototype.ObjectId = function(id) {
        return this.backend.ObjectId(id);
    };


    DbAPI.prototype.getRowId = function(obj) {
        return obj[this.rowId] ? obj[this.rowId].toString() : null;
    };


    DbAPI.prototype.setRowId = function(obj, val) {
        if (val) {
            if (typeof val === 'string') {
                val = this.ObjectId(val);
            }
            obj[this.rowId] = val;
        }
        return obj;
    };

    module.exports = DbAPI;

}).call(this);
