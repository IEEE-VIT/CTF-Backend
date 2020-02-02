const { admin, database } = require('../utils/firebase')
const chalk = require('chalk')


//controller for creating a question
const createQuestion = (ques) => {
    return new Promise((resolve, reject) => {
        const quesRef = database.collection('Questions').doc(ques.uid)
        quesRef.set({
            uid: ques.uid,
            name: ques.name,
            description: ques.description,
            hint: ques.hint
        })
            .then(() => {
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

    })
}


//controller for reading all the question
const readAllQuestion = () => {
    return new Promise((resolve, reject) => {

    })
}


//controller for updating a question
const updateQuestion = (ques) => {
    return new Promise((resolve, reject) => {

    })
}


//controller for deleting a question
const deleteQuestion = (ques) => {
    return new Promise((resolve, reject) => {

    })
}




module.exports = {
    createQuestion,
    readQuestion,
    readAllQuestion,
    updateQuestion,
    deleteQuestion
}