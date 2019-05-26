import DataTypes, { Model, INTEGER } from 'sequelize';

class Store extends Model {
    static init(sequelize) {
        const { STRING } = DataTypes;
        return super.init({
            name: {
                type: STRING,
                allowNull: false,
                unique: true
            },
            location: {
                type: STRING
            },
            cash: {
                type: INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'store',
            timestamps: false
        });
    }
    static associate(models) {
        const { User, Task } = models
        this.belongsTo(User);
        this.hasMany(Task); 
    }
}

export default Store;