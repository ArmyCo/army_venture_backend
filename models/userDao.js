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

const deleteUserById = async (userId, withdrawReasonId) => {
    const queryRunner = appDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      await queryRunner.query(
        `
        UPDATE withdraw_reasons
        SET count = count + 1
        WHERE id = ?
        `,
        [withdrawReasonId]
      );

      await queryRunner.query(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [userId]
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
}

const deleteUserByIdOtherReason = async (userId, withdrawReasonId, reasonDetail) => {
    const queryRunner = appDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      await queryRunner.query(
        `
        INSERT INTO other_withdraw_reasons (reason_detail)
        VALUES (?)
        `,
        [reasonDetail]
      );
      
      await queryRunner.query(
       `
       UPDATE withdraw_reasons
        SET coumt = count + 1
        WHERE id = ?
        `,
        [withdrawReasonId]
      );

      await queryRunner.query(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [userId]
      );
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
}

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    deleteUserByIdOtherReason
}