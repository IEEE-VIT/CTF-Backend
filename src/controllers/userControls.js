const { admin, database } = require('../utils/firebase')
const chalk = require('chalk')
const bcrypt = require('bcrypt')
const crypto = require("crypto");

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const userRef = database.collection('Users').doc(user.uid)
        const randomString = crypto.randomBytes(5).toString('hex')
        const ctfName = `CTF-${randomString}`
        userRef.set({
            uid: user.uid,
            name: user.name,
            email: user.email,
            userName: ctfName,
            qAnswered: [],
            points: 0,
            hintsUsed: [],
            defaultName: true
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
                console.log(chalk.red("User UID Not verified from authentication!"))
                reject({ error: err.message, message: "Unauthorised" })
            })
    })
}

const checkUserObject = (uid, resp) => {
    return new Promise(async (resolve, reject) => {
        console.log("Entered checkUserObject")
        const userRef = await database.collection('Users').doc(uid)
        console.log("wait")
        userRef.get()
            .then((docSnapshot) => {
                console.log("got docSnapshot")
                if (docSnapshot.exists) {
                    console.log(docSnapshot.exists)
                    resolve({
                        statusCode: 200,
                        payload: {
                            msg: "User Checked",
                            responce: resp
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(chalk.red("User uid un-verified from database!"))
                reject({
                    statusCode: 400,
                    error: err.message,
                    message: "Unauthorised"
                })
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
            .then(async (doc) => {
                //check if answer is right or not
                if (bcrypt.compareSync(answer, doc.data().flag)) {
                    //check if hint used or not
                    const user = database.collection('Users').doc(uid)
                    await user.get()
                        .then(snap => {
                            snap._fieldsProto.hintsUsed.arrayValue.values.forEach(value => {
                                if (value.stringValue === questionId) {
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

const fetchHint = (questionID, uid) => {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow("Getting hint..."));
        const questRef = database.collection('Questions').doc(questionID);
        questRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    questRef.onSnapshot((doc) => {
                        console.log(chalk.yellow("Question exists, Updating user schema"));
                        const userRef = database.collection('Users').doc(uid)
                        userRef.update({
                            hintsUsed: admin.firestore.FieldValue.arrayUnion(questionID)
                        })
                        console.log(chalk.green("User schema updated"))
                        const hint = doc._fieldsProto.hint.stringValue
                        resolve({
                            statusCode: 200,
                            payload: {
                                msg: "Hint Available",
                                hint: hint
                            }
                        })
                    })
                } else {
                    reject({
                        statusCode: 400,
                        payload: {
                            msg: "Question Not Found in DataBase!"
                        }
                    })
                }
            }).catch((err) => {
                console.log(chalk.red("Error in fetching question details!"));
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side Error, Contact Support",
                        Error: err
                    }
                })
            })
    })
}

const readAllQuestion = () => {
    return new Promise(async (resolve, reject) => {
        const questionRef = database.collection('Questions')
        await questionRef.get()
            .then(snap => {
                allQuestions = []
                snap.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data()
                    allQuestions.push({
                        id,
                        data
                    })
                })
                console.log(chalk.green("All question Retrived"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "Question Successfully fetched",
                        body: allQuestions
                    }
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in Reading all the question details"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}

const showProfile = (user) => {
    return new Promise(async (resolve, reject) => {
        console.log(chalk.yellow("Getting user Profile..."))
        const userRef = database.collection('Users').doc(user.uid)
        await userRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    userRef.onSnapshot((doc) => {
                        console.log(chalk.green("User exists!"));
                        const profile = {
                            "points": doc._fieldsProto.points.integerValue,
                            "name": doc._fieldsProto.name.stringValue,
                            "email": doc._fieldsProto.email.stringValue,
                            "user name": doc._fieldsProto.userName.stringValue,
                            "defaultName": doc._fieldsProto.defaultName.booleanValue
                        }

                        console.log(profile)
                        resolve({
                            statusCode: 200,
                            payload: {
                                msg: "Profile ready to be displayed",
                                userProfile: profile
                            }
                        })
                    });
                }
            }).catch((err) => {
                console.log(chalk.red("Error in fetching user details!"));
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    }
                })
            })
    })
}

const updateProfile = (user) => {
    return new Promise(async (resolve, reject) => {
        const userRef = database.collection('Users').doc(user.uid)
        await userRef.update(user)
            .then(() => {
                console.log(chalk.green("User Update"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "User Name Successfully Updated"
                    }
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in Updating User details"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}

const getLeaderboard = () => {
    return new Promise((resolve, reject) => {
        const query = database.collection('Users').orderBy('points', 'desc');
        query.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            var data = []
            snapshot.forEach(doc => {
                var obj = doc.data();
                var leaderboard = {
                    points: obj.points,
                    name: obj.name
                }
                data.push(leaderboard);
            });
            console.log(data)
            resolve({
                statusCode: 200,
                payload: {
                    msg: "Leaderboards successfully fetched",
                    data: data
                }
            })
        })
            .catch(err => {
                console.log('Error getting documents', err);
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            });
    })
}


module.exports = {
    createUser,
    checkUserUid,
    getUserInfo,
    checkAnswer,
    fetchHint,
    readAllQuestion,
    checkUserObject,
    showProfile,
    updateProfile,
    getLeaderboard
}