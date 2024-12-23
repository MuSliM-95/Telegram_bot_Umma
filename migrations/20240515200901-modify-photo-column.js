'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const image = {image: "default.jpg"}
    const defaultValue = JSON.stringify([image, image, image])
    const tableRows = await queryInterface.sequelize.query(
      `SELECT id, photo FROM Addresses`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    for (const row of tableRows) {
      await queryInterface.sequelize.query(
        `UPDATE Addresses SET photo = :photo WHERE id = :id`,
        {
          replacements: { photo: defaultValue, id: row.id },
          type: Sequelize.QueryTypes.UPDATE,
        }
      )
    }

    await queryInterface.changeColumn('Addresses', 'photo', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: Sequelize.literal(`[]`)
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Addresses', 'photo', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  }
};
