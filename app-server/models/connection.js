const mongoose = require('mongoose')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.connectMongo = async function (dbUri){
    while (true){
        try {
            await mongoose.connect(dbUri)
            console.log("monogDB connected");
            break
        } catch {
            console.log('Error connecting to MongoDB. Retrying...');
            await sleep(2000)
        }
    }
} 