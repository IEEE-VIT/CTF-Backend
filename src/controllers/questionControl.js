const { admin, database } = require('../utils/firebase')
const chalk = require('chalk')
const uniqid = require('uniqid')
const bcrypt = require('bcrypt')


//controller for creating a question
const createQuestion = (ques) => {
    return new Promise(async (resolve, reject) => {
        const quesID = uniqid()
        const saltRounds = 10;
        const flag = ques.flag
        var salt = bcrypt.genSaltSync(saltRounds);
        var cryptFlag = bcrypt.hashSync(flag, salt);
        const quesRef = database.collection('Questions').doc(quesID)
        await quesRef.set({
            "id": quesID,
            "name": ques.name,
            "description": ques.description,
            "hint": ques.hint,
            "url": ques.url,
            "flag": cryptFlag
        })
            .then(async () => {
                console.log(chalk.green("New question added"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "Question Successfully Added"
                    }
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in saving question details"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}


//controller for reading a question
const readQuestion = (ques) => {
    return new Promise((resolve, reject) => {
        const quesRef = database.collection('Questions').doc(ques.id)
        quesRef.get()
            .then((doc) => {
                console.log(chalk.green("Question Read "))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "Question ready to be displayed",
                        questionData: doc.data()
                    }
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in Reading question details"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}


//controller for reading all the question
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


//controller for updating a question
const updateQuestion = (ques) => {
    return new Promise(async (resolve, reject) => {
        const quesRef = database.collection('Questions').doc(ques.id)
        await quesRef.update(ques)
            .then(() => {
                console.log(chalk.green("New question Update"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "Question Successfully Updated"
                    }
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in Updating question details"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}


//controller for deleting a question
const deleteQuestion = (ques) => {
    return new Promise(async (resolve, reject) => {
        const quesRef = database.collection('Questions').doc(ques.id)
        await quesRef.delete()
            .then(() => {
                console.log(chalk.green("Question Deleted"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "Question Successfully Deleted"
                    }
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in Deleting question details"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                })
            })
    })
}

module.exports = {
    createQuestion,
    readQuestion,
    readAllQuestion,
    updateQuestion,
    deleteQuestion
}