'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableRows = await queryInterface.sequelize.query(
      `SELECT id, photo FROM Addresses`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    for (const row of tableRows) {
      let updatePhoto = []
      try {
        if (row.photo && row.photo.image !== '') {
          updatePhoto.push({ image: row.photo.image })
        } else {
          updatePhoto = []
        }
      } catch (error) {
        updatePhoto = []
      }

      await queryInterface.sequelize.query(
        `UPDATE Addresses SET photo = :photo WHERE id = :id`,
        {
          replacements: { photo: JSON.stringify(updatePhoto), id: row.id },
          type: Sequelize.QueryTypes.UPDATE,
        }
      )
    }

    await queryInterface.changeColumn('Addresses', 'photo', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Addresses', 'photo', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  }
};
