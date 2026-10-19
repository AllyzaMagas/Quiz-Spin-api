'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add user_id column to hosts (nullable first)
    await queryInterface.addColumn('hosts', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: { model: 'users', key: 'user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Create users for existing hosts and link them
    const hosts = await queryInterface.sequelize.query(
      'SELECT host_id FROM hosts',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const host of hosts) {
      const [user] = await queryInterface.bulkInsert('users', [{
        username: `host_${host.host_id}`,
        password_hash: '$2a$10$dummyhash', // placeholder
        role: 'host',
        created_at: new Date(),
      }], { returning: ['user_id'] });

      await queryInterface.sequelize.query(
        'UPDATE hosts SET user_id = ? WHERE host_id = ?',
        { replacements: [user.user_id, host.host_id] }
      );
    }

    // Now make user_id non-nullable
    await queryInterface.changeColumn('hosts', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Remove username and password_hash from hosts (now in users)
    await queryInterface.removeColumn('hosts', 'username');
    await queryInterface.removeColumn('hosts', 'password_hash');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('hosts', 'username', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });
    await queryInterface.addColumn('hosts', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.removeColumn('hosts', 'user_id');
  },
};