(function() {

    "use strict";

    var co = require("co");
    var CeramicDbAPI = require("../lib/ceramic-db-api");

    module.exports = function(dbBackend, backendName) {

        describe("Ceramic DB API with " + backendName, function() {

            before(function() {
                return co(function*() {

                    //Delete database if it exists
                    var dbApi = new CeramicDbAPI(dbBackend);
                    yield* dbApi.deleteDatabase();

                });
            });


            it("save must save records", function() {
                return co(function*() {

                    var batmanPublisher = {
                        name: "The Batman Publishing Company",
                        labels: ["Comica", "Lyrica"]
                    };

                    yield* odm.save(batmanPublisher, publisherSchema, ceramic, dbApi);

                    var markKnopfler = {
                        name: "Mark Freuder Knopfler",
                        location: "Gosforth, England",
                        age: 65
                    };

                    var davidKnopfler = {
                        name: "David Knopfler",
                        location: "Newcastle-upon-Tyne, England",
                        age: 62
                    };

                    yield* odm.save(markKnopfler, authorSchema, ceramic, dbApi);
                    yield* odm.save(davidKnopfler, authorSchema, ceramic, dbApi);

                    markKnopflerId = markKnopfler._id.toString();
                    davidKnopflerId = davidKnopfler._id.toString();

                    var busyBeingBorn    = {
                        title: "Busy Being Born",
                        content: "The days keep dragging on, Those rats keep pushing on,  The slowest race around, We all just race around ...",
                        published: "yes",
                        author: {
                            name: "Middle Class Rut",
                            location: "USA"
                        },
                        publisherId: batmanPublisher._id.toString()
                    };

                    var brosInArms = {
                        title: "Brothers in Arms",
                        content: "These mist covered mountains, Are a home now for me, But my home is the lowlands ...",
                        published: "yes",
                        author: {
                            name: "Dire Straits",
                            location: "UK"
                        },
                        publisherId: batmanPublisher._id.toString()
                    };

                    yield* odm.save(busyBeingBorn, postSchema, ceramic, dbApi);
                    yield* odm.save(brosInArms, postSchema, ceramic, dbApi);

                    busyBeingBornId = busyBeingBorn._id.toString();
                    brosInArmsId = brosInArms._id.toString();

                    assert.equal(typeof markKnopflerId === "string", true, "_id after saving must be a string");
                    assert.equal(typeof davidKnopflerId === "string", true, "_id after saving must be a string");
                    assert.equal(typeof busyBeingBornId === "string", true, "_id after saving must be a string");
                    assert.equal(typeof brosInArmsId === "string", true, "_id after saving must be a string");
                });
            });

            it("findById must return the record with the specific id", function() {
                return co(function*() {
                    var rec = yield* odm.findById(postSchema, busyBeingBornId, ceramic, dbApi);
                    assert.equal(rec.title, "Busy Being Born");
                });
            });


            it("findById must return null with missing id", function() {
                return co(function*() {
                    var rec = yield* odm.findById(postSchema, "id6666666666", ceramic, dbApi);
                    assert.equal(rec, null);
                });
            });


            it("find must return an array of matching records", function() {
                return co(function*() {
                    var rec = yield* odm.find(postSchema, { published: "yes" }, ceramic, dbApi);
                    assert.equal(rec.length, 2);
                });
            });


            it("findOne must return a single matching record", function() {
                return co(function*() {
                    var rec = yield* odm.findOne(postSchema, { title: "Busy Being Born" }, ceramic, dbApi);
                    assert.equal(rec.title, "Busy Being Born");
                });
            });


            it("count must return the number of matching records", function() {
                return co(function*() {
                    var count = yield* odm.count(postSchema, { title: "Busy Being Born" }, ceramic, dbApi);
                    assert.equal(count, 1);

                    count = yield* odm.count(postSchema, {}, ceramic, dbApi);
                    assert.equal(count, 2);
                });
            });


            it("link must retrieve corresponding record", function() {
                return co(function*() {
                    var rec = yield* odm.findOne(postSchema, { title: "Busy Being Born" }, ceramic, dbApi);
                    var publisher = yield* odm.link(rec, postSchema, "publisher", ceramic, dbApi);
                    assert.equal(publisher.name, "The Batman Publishing Company");
                });
            });


            it("destroy must delete a record", function() {
                return co(function*() {
                    var busyBeingBorn = yield* odm.findOne(postSchema, { title: "Busy Being Born" }, ceramic, dbApi);
                    yield* odm.destroy(busyBeingBorn, postSchema, ceramic, dbApi);
                    var count = yield* odm.count(postSchema, {}, ceramic, dbApi);
                    assert.equal(count, 1);
                });
            });


            it("destroyAll must throw an Error if canDestroyAll is not defined", function(done) {
                co(function*() {
                    try {
                        yield* odm.destroyAll(postSchema, {}, ceramic, dbApi);
                        done(new Error("Should not delete without calling canDestroyAll()"));
                    } catch (ex) {
                        done();
                    }
                });
            });


            it("destroyAll must NOT throw an Error if canDestroyAll is defined", function(done) {
                co(function*() {
                    try {
                        yield* odm.destroyAll(authorSchema, {}, ceramic, dbApi);
                        done();
                    } catch (ex) {
                        done(new Error("Can delete if canDestroyAll() returns true"));
                    }
                });
            });

        });
    };

})();
