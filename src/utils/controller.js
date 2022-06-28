import { doc, collection, getDocs, query, orderBy, getDoc } from 'firebase/firestore'
import { db } from './firebase';
import { Country } from './model/country';
import { League } from './model/league';
import { Player } from './model/player';
import { Team } from './model/team';

export const fetchCountry = async (docID) => {
    const docRef = doc(db, "Country", docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let data = new Country(
            docSnap.id,
            docSnap.data().name,
            docSnap.data().continent,
        );
        // console.log(data);
        return data;
    } else {
        // doc.data() will be undefined in this case
        console.log("Country not found");
        return false;
    }
}

export const fetchLeague = async (docID) => {
    const docRef = doc(db, "League", docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let data = new League(
            docSnap.id,
            docSnap.data().name,
            await fetchCountry(docSnap.data().country),
        );
        // console.log(data);
        return data;
    } else {
        // doc.data() will be undefined in this case
        console.log("League not found");
        return false;
    }
}

export const fetchTeam = async (docID) => {
    const docRef = doc(db, "Team", docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let data = new Team(
            docSnap.id,
            docSnap.data().name,
            await fetchLeague(docSnap.data().league),
        );
        // console.log(data);
        return data;
    } else {
        // doc.data() will be undefined in this case
        console.log("Team not found");
        return false;
    }
}

export const fetchPlayer = async (docID) => {
    const docRef = doc(db, "Player", docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let data = new Player(
            docSnap.id,
            docSnap.data().age,
            await fetchCountry(docSnap.data().country),
            docSnap.data().name,
            docSnap.data().number,
            docSnap.data().position,
            docSnap.data().showCount,
            await fetchTeam(docSnap.data().team),
        );
        // console.log(data);
        return data;
    } else {
        // doc.data() will be undefined in this case
        console.log("Player not found");
        return false;
    }
}

export const fetchPlayers = async () => {
    let players = [];

    const querySnapshot = await getDocs(collection(db, "Player"));
    querySnapshot.forEach(async (doc) => {
        let player = await fetchPlayer(doc.id);
        players.push(player);
    });

    return players;
}
