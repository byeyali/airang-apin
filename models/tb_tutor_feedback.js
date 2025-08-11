module.exports = (sequelize, DataTypes) => {
  const TutorFeedback = sequelize.define(
    "TutorFeedback",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tutor_id: { type: DataTypes.INTEGER, allowNull: false },
      contract_id: { type: DataTypes.INTEGER, allowNull: false },
      target: { type: DataTypes.STRING(100), allowNull: false },
      session_date: { type: DataTypes.DATEONLY, allowNull: false },
      start_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
      end_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      next_plan: { type: DataTypes.TEXT, allowNull: true },
      parent_id: { type: DataTypes.INTEGER, allowNull: false },
      parent_confirm_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
      parent_comment: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "start", // start : 시작, feedback : 종료 및 피드백, complete : 피드백확인
      },
    },
    {
      tableName: "tb_tutor_feedback",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  TutorFeedback.associate = (models) => {
    TutorFeedback.belongsTo(models.Tutor, { foreignKey: "tutor_id" });
    TutorFeedback.belongsTo(models.TutorContract, {
      foreignKey: "contract_id",
    });
  };

  return TutorFeedback;
};
