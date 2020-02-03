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

        //                  WRITE CONTROLLER LOGIC HERE                // 

    })
        .then(() => {
            console.log(chalk.green("Question Read "))
            resolve({
                statusCode: 200,
                payload: {
                    msg: "Question ready to be displayed"
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
}


//controller for reading all the question
const readAllQuestion = () => {
    return new Promise((resolve, reject) => {
        //                  WRITE CONTROLLER LOGIC HERE                //
        const questionRef = database.collection('Questions').doc('question');
        questionRef.get()
    })
        .then((doc) => {
            console.log(chalk.green("All Question Read"))
            resolve({
                statusCode: 200,
                payload: {
                    msg: "All Question Successfully Read",
                    question: doc
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
}


//controller for updating a question
const updateQuestion = (ques) => {
    return new Promise((resolve, reject) => {

        //                  WRITE CONTROLLER LOGIC HERE                //

    })
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
}


//controller for deleting a question
const deleteQuestion = (ques) => {
    return new Promise((resolve, reject) => {

        //                  WRITE CONTROLLER LOGIC HERE                //

    })
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
}




module.exports = {
    createQuestion,
    readQuestion,
    readAllQuestion,
    updateQuestion,
    deleteQuestion
}