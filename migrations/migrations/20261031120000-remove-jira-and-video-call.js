const NAMESPACE_NOT_FOUND = 26;
const INDEX_NOT_FOUND = 27;

module.exports = {
  async up(db) {
    await Promise.all([
      db.collection('users').updateMany(
        { jiraIntegrations: { $exists: true } },
        { $unset: { jiraIntegrations: '' } }
      ),
      db.collection('pokersessions').updateMany(
        { $or: [{ jira: { $exists: true } }, { isVideoCall: { $exists: true } }] },
        { $unset: { jira: '', isVideoCall: '' } }
      ),
      db.collection('stories').updateMany(
        { jiraData: { $exists: true } },
        { $unset: { jiraData: '' } }
      ),
    ]);

    try {
      await db.collection('stories').dropIndex('jiraData.self_1');
    } catch (err) {
      if (![NAMESPACE_NOT_FOUND, INDEX_NOT_FOUND].includes(err.code)) {
        throw err;
      }
    }
  },

  // removed jira and video call data can't be restored
  async down() {},
};
