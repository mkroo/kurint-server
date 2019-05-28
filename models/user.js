import DataTypes, { Model, INTEGER } from 'sequelize';

class User extends Model {
    static init(sequelize) {
        const { STRING, ENUM } = DataTypes;
        return super.init({
            name: {
                type: STRING
            },
            id: {
                type: STRING,
                primaryKey: true,
            },
            salt: {
                type: STRING
            },
            hash: {
                type: STRING
            },
            socialId: {
                type: STRING,
                unique: 'account'
            },
            provider: {
                type: ENUM,
                values: ['google','naver','facebook'],
                unique: 'account'
            },
            cash: {
                type: INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'user',
            timestamps: false
        });
    }
    static associate(models) {
        const { Task, Store } = models;
        this.hasMany(Task);
        this.hasOne(Store);
    }
}

export default User;