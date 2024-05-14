const { appDataSource } = require("./data-source.js");

const getPlaceById = async (placeId) => {
    const placeDetail = await appDataSource.query(
      `SELECT * FROM places WHERE id = ?`,
      [placeId]
    )
    return placeDetail;
};

module.exports = {
    getPlaceById
}