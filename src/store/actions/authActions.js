import * as Types from '../constants/actionTypes'
import { presence } from '../../utils/actions'

export const signIn = credentials => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase()

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            presence(firebase)
            dispatch({ type: Types.SIGNIN_SUCCESS })
        }).catch(err => {
            dispatch({ type: Types.SIGNIN_ERROR, err })
        })
    } 
}

export const signInWithGoogle = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase()
        const firestore = getFirestore()
        const googleProvider = new firebase.auth.GoogleAuthProvider()

        firebase.auth().signInWithPopup(googleProvider).then(resp => {
            const { profile } = resp.additionalUserInfo
            const firstName = profile.given_name
            const lastName = profile.family_name
            const { picture } = profile

            firestore.collection('users').doc(resp.user.uid).get().then(res => {
                if (!res.exists) {
                    firestore.collection('users').doc(resp.user.uid).set({
                        firstName: firstName,
                        lastName: lastName,
                        initials: firstName[0] + lastName[0],
                        picture: picture
                    })
                }
            })
        }).then(() => {
            presence(firebase)
            dispatch({ type: Types.SIGNIN_WITH_GOOGLE_SUCCESS })
        })
    }
}

export const signOut = () => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase()

        firebase.auth().signOut().then(() => {
            const { auth } = getState().firebase
            firebase.database().ref(`/status/${auth.uid}`).set({
                state: 'offline',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
            });
            dispatch({ type: Types.SIGNOUT_SUCCESS })
        })
    }
}

export const signUp = newUser => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase()
        const firestore = getFirestore()

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then(resp => {
            firestore.collection('users').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                initials: newUser.firstName[0] + newUser.lastName[0],
                picture: null
            })
        }).then(() => {
            presence(firebase)
            dispatch({ type: Types.SIGNUP_SUCCESS })
        }).catch(err => {
            dispatch({ type: Types.SIGNUP_ERROR, err })
        })
    }
}