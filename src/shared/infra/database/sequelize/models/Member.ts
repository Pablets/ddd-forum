import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize';

const Member = sequelize.define(
  'Member',
  {
    member_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    member_base_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'base_user',
        key: 'base_user_id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    reputation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'member',
    modelName: 'Member',
  }
);



export { Member };
