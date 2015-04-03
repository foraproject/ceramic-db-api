(function() {

    var Parser = require('./query-parser');

    var DbAPI = function(backend) {
        this.backend = backend;
        this.rowId = this.conf.rowId || "_id";
    };


    DbAPI.prototype.getCursor = function*(collectionName, query, options) {
        query = this.parser.parse(query);
        return yield* this.backend.getCursor(collectionName, query, options);
    };


    DbAPI.prototype.insert = function*(collectionName, document) {
        return yield* this.backend.insert(collectionName, document);
    };


    DbAPI.prototype.update = function*(collectionName, query, document) {
        query = this.parser.parse(query);
        return yield* this.backend.update(collectionName, query, document);
    };


    DbAPI.prototype.count = function*(collectionName, query) {
        query = this.parser.parse(query);
        return yield* this.backend.count(collectionName, query);
    };


    DbAPI.prototype.find = function*(collectionName, query, options) {
        query = this.parser.parse(query);
        return yield* this.backend.find(collectionName, query, options);
    };


    DbAPI.prototype.findOne = function*(collectionName, query, options) {
        query = this.parser.parse(query);
        return yield* this.backend.findOne(collectionName, query, options);
    };


    DbAPI.prototype.remove = function*(collectionName, query, options) {
        query = this.parser.parse(query);
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
