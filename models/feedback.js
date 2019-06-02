import DataTypes, { Model } from 'sequelize';

class Feedback extends Model {
    static init(sequelize) {
        const { STRING } = DataTypes;
        return super.init({
            content: {
                type: STRING
            }
        }, {
            sequelize,
            modelName: 'feedback',
            timestamps: false
        });
    }
    static associate(models) {
        const { User } = models;
        this.belongsTo(User);
    }
}

export default Feedback;