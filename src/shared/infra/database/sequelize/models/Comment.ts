import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize';

const Comment = sequelize.define(
  'Comment',
  {
    comment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'member',
        key: 'member_id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'post',
        key: 'post_id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    parent_comment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comment',
        key: 'comment_id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'comment',
    modelName: 'Comment',
  }
);



export { Comment };
