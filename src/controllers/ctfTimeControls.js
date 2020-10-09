const { admin, database } = require('../utils/firebase')

const getMinimalScoreboard = () => {
    return new Promise((resolve, reject) => {
        const query = database.collection('Users').orderBy('points', 'desc');
        query.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            var data = [], i = 1;
            snapshot.forEach(doc => {
                var obj = doc.data();
                var scoreboard = {
                    pos: i,
                    team: obj.userName,
                    score: obj.points
                }
                data.push(scoreboard);
                i++;
            });
            resolve({
                standings: data
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

const getLogs = (id) => {
    return new Promise((resolve, reject) => {
        const query = database.collection('Logs')
        query.get()
        .then(snapshot => {
            var data = [];
            snapshot.forEach(doc => {
                var obj = doc.data();
                console.log(obj)
                var log = {
                    id: obj.id,
                    time: obj.time,
                    type: obj.type,
                    team: obj.team,
                    task: obj.task,
                    pointsDelta: obj.pointsDelta
                }
                data.push(log);
            });
            data = data.splice(id);
            resolve(data)
        })
        .catch(err => {
            console.log('Error getting logs', err);
            reject({
                statusCode: 500,
                payload: {
                    msg: "Server Side error contact support"
                },
            })
        });
    })
}

const updateLogs = (type, username, question, pointsAdded) => {
    return new Promise((resolve, reject) => {
        var ts = 0;
        var ts = Math.round((new Date()). getTime() / 1000);
        const query = database.collection('Logs').doc(ts.toString())
        query.set({
            time: ts,
            type: type,
            team: username,
            task: question,
            pointsDelta: pointsAdded
        })
        .then(() => {
            resolve(true);
        })
        .catch(() => {
            reject(false);
        })
    })
}

module.exports = {
    getMinimalScoreboard,
    getLogs,
    updateLogs
}