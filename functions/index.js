const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

const firestore = admin.firestore();
exports.onUserStatusChanged = functions.database.ref('/status/{uid}').onUpdate(
  (change, context) => {
    const status = change.after.val()
    return firestore.doc(`status/${context.params.uid}`).set({
      state: status.state,
      last_changed: new Date(status.last_changed),
    });
  }
);