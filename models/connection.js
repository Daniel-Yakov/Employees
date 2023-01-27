const mongoose = require('mongoose')

module.exports.connectMongo = async function (dbUri){
    while (true){
        try {
            await mongoose.connect(dbUri)
            console.log("monogDB connected");
            break
        } catch {
            setTimeout(() => {
                console.log('Error connecting to MongoDB. Retrying in 1 second...');
            }, 1000)
        }
    }
} 