import { MemberRepo } from './implementations/sequelizeMemberRepo';
// import models from "../../../shared/infra/database/sequelize/models";
import { PostRepo } from './implementations/sequelizePostRepo';
import { CommentRepo } from './implementations/commentRepo';
import { PostVotesRepo } from './implementations/sequelizePostVotesRepo';
import { CommentVotesRepo } from './implementations/sequelizeCommentVotesRepo';
import { sequelize } from '../../../shared/infra/database/sequelize/config/sequelize';


const commentVotesRepo = new CommentVotesRepo(sequelize.models);
const postVotesRepo = new PostVotesRepo(sequelize.models);
const memberRepo = new MemberRepo(sequelize.models);
const commentRepo = new CommentRepo(sequelize.models, commentVotesRepo);
const postRepo = new PostRepo(sequelize.models, commentRepo, postVotesRepo);

export { memberRepo, postRepo, commentRepo, postVotesRepo, commentVotesRepo };
