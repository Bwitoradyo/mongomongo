const MongoClient = require("mongodb").MongoClient;

const dbhost = "mongodb://localhost:27017/test3", 
    myCollection = "chapter2";

const seedData = (db, callback) => {
  db.collection(myCollection).find({},{},{})
	  .toArray(
	    (err,docs) => {
	      if (docs.length <= 0){
	        console.log("No data. Seeding...");

		//count each record as it's inserted
		const ihandler = (err, recs) => {
		  if(err) throw err;
		  inserted++;
		}

		const toinsert = 3,
		      inserted = 0;

		//perform a MongoDB insert for each record
		db.collection(myCollection).insert({
		  "title":"Snow Blower",
		  "author":"Sumohikiro"
		}, ihandler);
		

		db.collection(myCollection).insert({
		  "title":"Snow Crash",
		  "author":"Neal Stephenson"
		}, ihandler);

		db.collection(myCollection).insert({
		  "title":"Neuromancer",
		  "author":"William Gibson"
		}, ihandler);

		//wait for the second record above to be fininised inserting
		const sync = setInterval(() => {
		  if(inserted === toinsert){
		    clearInterval(sync);
		    callback(db);
		  }
		}, 50);
                return;
	      }
	      callback(db);
	      return;
	    }		  
	  );
}

const showDocs = (db) => {
  console.log("Listing books: ");
  const options = {
    sort:[
      ["Title", 1]
    ]
  };
  db.collection(myCollection).find({},{}, options)
    .toArray(
      (err, docs) => {
        if(err) throw err;

	for (var d=0; d < docs.length; d++){
	  console.log(docs[d].title + "; " + docs[d].author);
	}
	db.close();
      }		    
    );
}

MongoClient.connect(dbhost, function(err, db){
  if(err) throw err;
  seedData(db, showDocs);
});
