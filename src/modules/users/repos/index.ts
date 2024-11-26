import { SequelizeUserRepo } from './implementations/sequelizeUserRepo';
import { BaseUser } from '../../../shared/infra/database/sequelize/models';

const userRepo = new SequelizeUserRepo({ BaseUser });

export { userRepo };
