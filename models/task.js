import DataTypes, { Model } from 'sequelize';

class Task extends Model {
    static init(sequelize) {
        const { STRING, INTEGER, ENUM, BOOLEAN } = DataTypes;
        return super.init({
            filePath: {
                type: STRING,
                allowNull: false
            },
            copies: {
                type: INTEGER,
                allowNull: false
            },
            isSingle: {
                type: BOOLEAN,
                allowNull: false
            },
            isColor: {
                type: BOOLEAN,
                allowNull: false
            },
            startPage: {
                type: INTEGER,
                allowNull: false
            },
            endPage: {
                type: INTEGER,
                allowNull: false
            },
            pagesPerSheet: {
                type: INTEGER,
                allowNull: false
            },
            size: {
                type: ENUM,
                values: ['A3', 'A4', 'B5'],
                allowNull: false
            },
            status: {
                type: ENUM,
                values: ['fetching', 'complete', 'cancel', 'reject'],
                defaultValue: 'fetching'
            }
        }, {
            sequelize,
            modelName: 'task'
        });
    }
    static associate(models) {
        const { Store, User } = models;
        this.belongsTo(Store);
        this.belongsTo(User);
    }
}

export default Task;