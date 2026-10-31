// guests log in without email: email stays unique only among users that have it
module.exports = {
  async up(db) {
    const users = db.collection('users');
    const indexes = await users.indexes();

    if (indexes.some((index) => index.name === 'email_1' && !index.partialFilterExpression)) {
      await users.dropIndex('email_1');
    }

    await users.createIndex(
      { email: 1 },
      {
        name: 'email_1',
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } },
      }
    );
  },

  async down(db) {
    const users = db.collection('users');

    // full unique index can't be built while guests without email exist
    await users.deleteMany({ isGuest: true, email: { $exists: false } });
    await users.dropIndex('email_1');
    await users.createIndex({ email: 1 }, { name: 'email_1', unique: true });
  },
};
