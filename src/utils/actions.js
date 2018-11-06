// Src: https://github.com/firebase/functions-samples/blob/bddf1dbaac17b63a0c4beac997c77ade85ff4086/presence-firestore/public/index.js
// function rtdb_and_local_fs_presence

export const presence = firebase => {
    var uid = firebase.auth().currentUser.uid;

    var userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`);
    var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    var isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var userStatusFirestoreRef = firebase.firestore().doc(`/status/${uid}`);
    var isOfflineForFirestore = {
        state: 'offline',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };
    var isOnlineForFirestore = {
        state: 'online',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    firebase.database().ref('.info/connected').on('value', snapshot => {
        if (snapshot.val() === false) {
            userStatusFirestoreRef.set(isOfflineForFirestore);
            return;
        };

        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
            userStatusFirestoreRef.set(isOnlineForFirestore);
        });
    });
}