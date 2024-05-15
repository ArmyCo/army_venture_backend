const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    name: {
      type: 'char',
      length: 50,
    },
    gender: {
      type: 'char',
      length: 8,
    },
    birth: {
      type: 'datetime',
    },
    user_army_number: {
      type: 'char',
      length: 20,
    },
    user_status_id: {
      type: 'int',
    },
    phone_number: {
      type: 'varchar',
      length: 50,
    },
    belonged_unit_id: {
      type: 'int',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      nullable: true,
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
});