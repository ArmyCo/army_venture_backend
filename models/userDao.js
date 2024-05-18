const { appDataSource } = require("./data-source.js");

const getUserById = async (userId) => {
    const userDetail = await appDataSource.query(
      `
      SELECT * FROM users
      WHERE id = ?
      `,
      [userId]
    )
    return userDetail;
};

module.exports = {
    getUserById,
}