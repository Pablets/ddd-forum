import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize';

const BaseUser = sequelize.define(
  'BaseUser',
  {
    base_user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_admin_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    username: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    social_access_token: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: null,
    },
    user_password: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'base_user',
    modelName: 'BaseUser',
    indexes: [{ unique: true, fields: ['user_email'] }],
  }
);

export { BaseUser };
