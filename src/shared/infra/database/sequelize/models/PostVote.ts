import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize';

const PostVote = sequelize.define(
  'PostVote',
  {
    post_vote_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'post_vote',
    modelName: 'PostVote',
  }
);

export { PostVote };
