import { sequelize } from '../config/sequelize';

import { DataTypes } from 'sequelize';
import { BaseUser } from './BaseUser';
import { Comment } from './Comment';
import { CommentVote } from './CommentVote';
import { Member } from './Member';
import { Post } from './Post';
import { PostVote } from './PostVote';

BaseUser.hasOne(sequelize.models.Member, { as: 'Member', foreignKey: 'member_id' });

PostVote.belongsTo(sequelize.models.Member, {
  foreignKey: 'member_id',
  targetKey: 'member_id',
  as: 'Member',
});

PostVote.belongsTo(sequelize.models.Post, {
  foreignKey: 'post_id',
  targetKey: 'post_id',
  as: 'Post',
});

Member.belongsTo(sequelize.models.BaseUser, {
  foreignKey: 'member_base_id',
  targetKey: 'base_user_id',
  as: 'BaseUser',
});

Member.hasMany(sequelize.models.Post, { foreignKey: 'member_id', as: 'Post' });

Comment.belongsTo(sequelize.models.Member, {
  foreignKey: 'member_id',
  targetKey: 'member_id',
  as: 'Member',
});

Comment.belongsTo(sequelize.models.Post, {
  foreignKey: 'post_id',
  targetKey: 'post_id',
  as: 'Post',
});

Comment.hasMany(sequelize.models.CommentVote, { foreignKey: 'comment_id', as: 'CommentVotes' });

CommentVote.belongsTo(sequelize.models.Member, {
  foreignKey: 'member_id',
  targetKey: 'member_id',
  as: 'Member',
});

CommentVote.belongsTo(sequelize.models.Comment, {
  foreignKey: 'comment_id',
  targetKey: 'comment_id',
  as: 'Comment',
});

Post.belongsTo(sequelize.models.Member, {
  foreignKey: 'member_id',
  targetKey: 'member_id',
  as: 'Member',
});

Post.hasMany(sequelize.models.PostVote, { foreignKey: 'post_id', as: 'Votes' });

export { DataTypes, BaseUser, Comment, CommentVote, Member, Post, PostVote };
