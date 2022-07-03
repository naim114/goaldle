const { getFirestore, collection, getDocs, doc, runTransaction, orderBy, query } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { schedule } = require('@netlify/functions');

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
module.exports.handler = schedule('@hourly', async (event) => {
  console.log('======================================================');
  console.log("GENERATE PLAYER X");
  console.log(`UTC: ${new Date().toUTCString()}`);

  // get all players id
  let players = [];

  const firebaseConfig = {
    apiKey: "AIzaSyDOOa_4kXyQ2Fqsvg9HDpmEDa_QHz7riCY",
    authDomain: "goaldle.firebaseapp.com",
    projectId: "goaldle",
    storageBucket: "goaldle.appspot.com",
    messagingSenderId: "1057267795639",
    appId: "1:1057267795639:web:e8c78acaa7271919762f32",
    measurementId: "G-TX3HQM4DJN"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);

  const querySnapshot = await getDocs(query(collection(db, "Player"), orderBy("name", "asc")));

  querySnapshot.forEach(async (doc) => {
    players.push(doc.id);
  });
  let random = players[Math.floor(Math.random() * players.length)];
  console.log("Selected random players: " + random);

  const docRef = doc(db, "Settings", "settings_mystery_player");
  try {
    await runTransaction(db, async (transaction) => {
      const targetDoc = await transaction.get(docRef);
      if (!targetDoc.exists()) {
        throw "Document does not exist!";
      }
      transaction.update(docRef, { id: random });
    });
    console.log("Player X updated to " + random);
  } catch (e) {
    console.error(e);
  }

  const eventBody = JSON.parse(event.body);
  console.log(`Next function run at ${eventBody.next_run}.`);
  console.log('======================================================');

  return {
    statusCode: 200,
  }
})
