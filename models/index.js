import Sequelize from 'sequelize';
import config from '../config/database.json';

import StoreModel from './store';
import TaskModel from './task';
import UserModel from './user'

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
    Store: StoreModel.init(sequelize),
    Task: TaskModel.init(sequelize),
    User: UserModel.init(sequelize)
}

Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

const db = models;
db.sequelize = sequelize;

module.exports = db;