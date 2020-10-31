const { admin, database } = require('../utils/firebase')
const chalk = require('chalk')
const bcrypt = require('bcrypt')
const crypto = require("crypto");

const ctfTimeControls = require('./ctfTimeControls');

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const userRef = database.collection('Users').doc(user.uid)
        const randomString = crypto.randomBytes(5).toString('hex')
        const ctfName = `CTF-${randomString}`
        userRef.set({
            uid: user.uid,
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
                    statusCode: 500,
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
                } else {
                    resolve({
                        statusCode: 400,
                        payload: {
                            msg: "User doesn't exist",
                            responce: resp
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(chalk.red("User uid un-verified from database!"))
                reject({
                    statusCode: 500,
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
                        resolve(doc._fieldsProto)
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
    console.log("Checking Answer...")
    return new Promise(async (resolve, reject) => {
        const question = database.collection('Questions').doc(questionId)
        question.get()
            .then(async (doc) => {
                //check if answer is right or not
                if (bcrypt.compareSync(answer, doc.data().flag)) {
                    //check if hint used or not
                    let hintState = false;
                    let questionAnswered = [];
                    const user = database.collection('Users').doc(uid)
                    await user.get()
                        .then(snap => {
                        temp = snap._fieldsProto.qAnswered.arrayValue.values
                        temp.forEach(obj => {
                            questionAnswered.push(obj.stringValue)
                        })
                        questionAnswered.push(questionId)
                        snap._fieldsProto.hintsUsed.arrayValue.values.forEach(value => {
                            if (value.stringValue == questionId) {
                                hintState = true
                            }
                        })
                    })
                    userDocc = await user.get()
                    //check the number of previously solved
                    const solved = doc._fieldsProto.solved.integerValue
                    console.log(hintState, solved)
                    var points = await calaculatePoints(hintState, solved)
                    user.update({
                        points: admin.firestore.FieldValue.increment(points),
                        qAnswered: questionAnswered
                    })
                    question.update({
                        solved: admin.firestore.FieldValue.increment(1)
                    })
                    console.log("update log function called")
                    var updateLogsBool = await ctfTimeControls.updateLogs(doc.data().name, userDocc.data().userName, doc.data().description, points)
                    resolve({
                        statusCode: 200,
                        payload: {
                            msg: "Answer correct"
                        }
                    })
                } else {
                    const user = database.collection('Users').doc(uid)
                    userDoc = await user.get()
                    console.log("update log function called")
                    var updateLogsBool = await ctfTimeControls.updateLogs(doc.data().name, userDoc.data().userName, doc.data().description, 0)
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
                    statusCode: 500,
                    payload: {
                        msg: "Server Side Error, Contact Support!"
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
                    statusCode: 500,
                    payload: {
                        msg: "Server Side Error, Contact Support",
                        Error: err
                    }
                })
            })
    })
}

const readAllQuestion = (uid) => {
    return new Promise(async (resolve, reject) => {
        const questionRef = database.collection('Questions')

        let allQuestions = []

        const userDoc = await getUserInfo(uid)
        const userHintUsed = userDoc.hintsUsed.arrayValue.values

        questionRef.get()
            .then(snap => {
                snap.forEach(async doc => {

                    let hint = false
                    const id = doc.id
                    const description = doc.data().description
                    const title = doc.data().title
                    const latitude = doc.data().latitude
                    const longitude = doc.data().longitude
                    const name = doc.data().name
                    const url = doc.data().url
                    const solved = doc.data().solved

                    userHintUsed.forEach((Userhint) => {
                        if (Userhint.stringValue == id) {
                            hint = true
                        }
                    })

                    allQuestions.push({
                        id,
                        data: {
                            name,
                            url,
                            title,
                            description,
                            longitude,
                            latitude,
                            solved,
                            hint
                        }
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
                    statusCode: 500,
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
                        const query = database.collection('Users').orderBy('points', 'desc');
                        query.get()
                            .then((snapshot) => {
                                var rank;
                                var temp = 0;
                                snapshot.forEach((doc_user) => {
                                    temp = temp + 1
                                    if (doc_user.data().uid == user.uid) {
                                        console.log(doc_user.data())
                                        rank = temp;
                                    }
                                });
                                const profile = {
                                    "points": doc.data().points,
                                    "qAnswered": doc.data().qAnswered,
                                    "email": doc.data().email,
                                    "user name": doc.data().userName,
                                    "defaultName": doc.data().defaultName,
                                    "rank": rank
                                }

                                console.log(profile)
                                resolve({
                                    statusCode: 200,
                                    payload: {
                                        msg: "Profile ready to be displayed",
                                        userProfile: profile
                                    }
                                })
                            })
                    });
                } else {
                    console.log("entered else")
                    resolve({
                        statusCode: 200,
                        payload: {
                            msg: "Profile not ready to be displayed"
                        }
                    })
                }
            }).catch((err) => {
                console.log(chalk.red("Error in fetching user details!"));
                reject({
                    statusCode: 500,
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
        user.defaultName = false
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
                    statusCode: 500,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}

const getLeaderboard = () => {
    return new Promise((resolve, reject) => {
        const query = database.collection('Users').orderBy('points', 'desc').limit(25);
        query.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            var data = []
            snapshot.forEach(doc => {
                var obj = doc.data();
                var leaderboard = {
                    uid: obj.uid,
                    points: obj.points,
                    userName: obj.userName,
                    questionAnswered: obj.qAnswered
                }
                data.push(leaderboard);
            });
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
                    statusCode: 500,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            });
    })
}

const calaculatePoints = (hintUsed, solved) => {
    return new Promise((resolve, reject) => {
        try {
            const deductIfHint = 10
            let points = 0
            if (solved >= 0 && solved <= 10)
                points = 100
            if (solved > 10 && solved <= 20)
                points = 90
            if (solved > 20 && solved <= 30)
                points = 85
            if (solved > 30)
                points = 75
            if (hintUsed)
                points -= deductIfHint

            resolve(points)

        }
        catch{
            reject()
        }
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



