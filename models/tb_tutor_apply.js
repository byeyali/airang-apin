module.exports = (sequelize, DataTypes) => {
  const TutorApply = sequelize.define('TutorApply', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tutor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tutor_job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    apply_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ready', // ready, accept, reject, confirm, contract
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'tb_tutor_apply',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  TutorApply.associate = (models) => {
    TutorApply.belongsTo(models.Tutor, { foreignKey: 'tutor_id' });
    TutorApply.belongsTo(models.TutorJob, { foreignKey: 'tutor_job_id' });
  };

  return TutorApply;
};