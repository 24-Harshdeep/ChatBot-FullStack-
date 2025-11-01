const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptive-chatbot';

async function fixDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fix users with old mode values
    const usersResult = await mongoose.connection.db.collection('users').updateMany(
      { 'preferences.defaultMode': { $in: ['dev', 'learn', 'hr'] } },
      [
        {
          $set: {
            'preferences.defaultMode': {
              $switch: {
                branches: [
                  { case: { $eq: ['$preferences.defaultMode', 'dev'] }, then: 'developer' },
                  { case: { $eq: ['$preferences.defaultMode', 'learn'] }, then: 'learner' },
                  { case: { $eq: ['$preferences.defaultMode', 'hr'] }, then: 'hr' }
                ],
                default: 'developer'
              }
            }
          }
        }
      ]
    );
    console.log(`✅ Fixed ${usersResult.modifiedCount} users`);

    // Fix chats with old mode values
    const chatsResult = await mongoose.connection.db.collection('chats').updateMany(
      { mode: { $in: ['dev', 'learn'] } },
      [
        {
          $set: {
            mode: {
              $switch: {
                branches: [
                  { case: { $eq: ['$mode', 'dev'] }, then: 'developer' },
                  { case: { $eq: ['$mode', 'learn'] }, then: 'learner' }
                ],
                default: 'developer'
              }
            }
          }
        }
      ]
    );
    console.log(`✅ Fixed ${chatsResult.modifiedCount} chats`);

    console.log('✅ Database migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

fixDatabase();
