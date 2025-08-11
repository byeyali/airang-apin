module.exports = (sequelize, DataTypes) => {
  const TutorJobCategory = sequelize.define('TutorJobCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tutor_job_id: { type: DataTypes.INTEGER, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'tb_tutor_job_category',
    timestamps: false,
    underscored: true,
  });

  TutorJobCategory.associate = (models) => {
    TutorJobCategory.belongsTo(models.TutorJob, { foreignKey: 'tutor_job_id' });
    TutorJobCategory.belongsTo(models.Category, { foreignKey: 'category_id' });
  };

  return TutorJobCategory;
};