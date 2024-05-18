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

const updateUserById = async (userId, nickname, user_army_number, phone_number, belonged_unit_id) => {
    await appDataSource.query(
      `
      UPDATE users
      SET nickname = ?, user_army_number = ?, phone_number = ?, belonged_unit_id = ?
      WHERE id = ?
      `,
      [nickname, user_army_number, phone_number, belonged_unit_id, userId]
    )

    const result = await appDataSource.query(
      `
      SELECT * FROM users
      WHERE id = ?
      `,
      [userId]
    )
    return result;
}

const deleteUserById = async (userId) => {
    await appDataSource.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [userId]
    )
}

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById
}