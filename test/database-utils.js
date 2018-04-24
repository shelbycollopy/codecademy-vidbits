const {mongoose, databaseUrl, options} = require('../database');

// Connect database on drop data
const connectDatabaseAndDropData = async () => {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
};

// Disconnect from database
const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDatabaseAndDropData,
  disconnectDatabase,
};
