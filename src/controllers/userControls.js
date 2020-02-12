const { admin, database } = require('../utils/firebase')
const chalk = require('chalk')
const bcrypt = require('bcrypt')

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const userRef = database.collection('Users').doc(user.uid)
        userRef.set({
            uid: user.uid,
            name: user.name,
            email: user.email,
            qAnswered: [],
            points: 0,
            hintsUsed: {
                id_one: false,
                id_two: false,
                id_three: false,
                id_four: false,
                id_five: false,
                id_sixth: false,
                id_seventh: false,
                id_eight: false
            }
        })
            .then((resp) => {
                console.log(chalk.green("New user details saved in db"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "User created, Player ready for CTF",
                    },
                    wasUserRegistered: false,
                    isRegSuccess: true,
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in saving user details to db"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                    wasUserRegistered: false,
                    isRegSuccess: false,
                })
            })

    })
}

const checkUserUid = (uid) => {
    return new Promise((resolve, reject) => {
        admin.auth().getUser(uid)
            .then((resp) => {
                console.log(chalk.green("User uid verified!"))
                resolve(resp)
            })
            .catch((err) => {
                console.log(chalk.red("User uid un-verified!"))
                reject({ error: err.message, message: "Unauthorised" })
            })
    })
}

const getUserInfo = (uid) => {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow("Getting user info..."))
        const userRef = database.collection('Users').doc(uid)
        userRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    userRef.onSnapshot((doc) => {
                        console.log(chalk.green("User exists!"));
                        console.log(doc._fieldsProto)
                        resolve(true)
                    });
                }
                else {
                    resolve(false)
                }
            }).catch((err) => {
                console.log(chalk.red("Error in fetching user details!"));
                reject(err)
            })
    })
}

const checkAnswer = (uid, answer, questionId) => {
    return new Promise(async (resolve, reject) => {
        const question = database.collection('Questions').doc(questionId)
        question.get()
            .then(async(doc) => {
                //check if answer is right or not
                if(bcrypt.compareSync(answer, doc.data().flag)) {
                    //check if hint used or not
                    const user = database.collection('Users').doc(uid)
                    await user.get()
                        .then(snap => {
                            snap._fieldsProto.hintsUsed.arrayValue.values.forEach(value => {
                                if(value.stringValue === questionId) {
                                    const updatePoints = user.update({
                                        points: admin.firestore.FieldValue.increment(100)
                                    })
                                    resolve({
                                        statusCode: 200,
                                        payload: {
                                            msg: "Answer correct",
                                            hintUsed: false
                                        }
                                    })
                                } else {
                                    const updatePoints = user.update({
                                        points: admin.firestore.FieldValue.increment(50)
                                    })
                                    resolve({
                                        statusCode: 200,
                                        payload: {
                                            msg: "Answer correct",
                                            hintUsed: true
                                        }
                                    })
                                }
                            });
                        })
                } else {
                    resolve({
                        statusCode: 200,
                        payload: {
                            msg: "Answer incorrect"
                        }
                    })
                }
            }).catch((e) => {
                console.log(e)
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Answer not verified"
                    },
                })
            })
    })
}

module.exports = {
    createUser,
    checkUserUid,
    getUserInfo,
    checkAnswer
}