const { getFirestore, collection, getDocs, doc, runTransaction, orderBy, query, getDoc } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { schedule } = require('@netlify/functions');

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
module.exports.handler = schedule('@daily', async (event) => {
  console.log('======================================================');
  console.log("GENERATE PLAYER X");
  console.log(`UTC: ${new Date().toUTCString()}`);

  // get all players id
  let players = [];

  // Firebase config
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

  let player = null;
  let playerID = null;

  do {
    // Get list of all player
    const querySnapshot = await getDocs(query(collection(db, "Player"), orderBy("name", "asc")));
    querySnapshot.forEach(async (doc) => {
      players.push(doc.id);
    });

    // Get random player
    let random = players[Math.floor(Math.random() * players.length)];
    console.log("Selected random players id before inspection: " + random);

    // Get min player show count
    const playerDoc = await getDoc(doc(db, "Player", random));
    if (playerDoc.exists()) {
      player = playerDoc.data();
      playerID = playerDoc.id;
      console.log("Player Count: " + player.showCount);
    } else {
      // doc.data() will be undefined in this case
      console.log("Player not found");
      return false;
    }
  } while (player.showCount == 1);

  console.log("Selected players: " + playerID);

  // Update player id in settings
  const docRef = doc(db, "Settings", "settings_mystery_player");
  try {
    await runTransaction(db, async (transaction) => {
      const targetDoc = await transaction.get(docRef);
      if (!targetDoc.exists()) {
        throw "Document does not exist!";
      }
      transaction.update(docRef, { id: playerID });
    });
    console.log("Player X updated to " + playerID);
  } catch (e) {
    console.error(e);
  }

  // Update show count at player doc
  const playerDocRef = doc(db, "Player", playerID);
  try {
    await runTransaction(db, async (transaction) => {
      const targetDoc = await transaction.get(playerDocRef);
      if (!targetDoc.exists()) {
        throw "Document does not exist!";
      }
      transaction.update(playerDocRef, { showCount: 1 });
    });
    console.log("Player X show count updated to " + 1);
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
