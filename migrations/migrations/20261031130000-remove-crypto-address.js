module.exports = {
  async up(db) {
    await db.collection('users').updateMany(
      { address: { $exists: true } },
      { $unset: { address: '' } }
    );
  },

  // removed wallet addresses can't be restored
  async down() {},
};
