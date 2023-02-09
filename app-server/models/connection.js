const mongoose = require('mongoose')

module.exports.connectMongo = async function (dbUri){
    let tries = 0
    while (true){
        try {
            await mongoose.connect(dbUri)
            console.log("monogDB connected");
            break
        } catch {
            if (tries > 1) break
            console.log('Error connecting to MongoDB. Retrying...');
            tries++
        }
    }
} 