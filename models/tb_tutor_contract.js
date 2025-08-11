module.exports = (sequelize, DataTypes) => {
  const TutorContract = sequelize.define(
    "TutorContract",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      apply_id: { type: DataTypes.INTEGER, allowNull: false },
      job_id: { type: DataTypes.INTEGER, allowNull: false },
      tutor_id: { type: DataTypes.INTEGER, allowNull: false },
      member_id: { type: DataTypes.INTEGER, allowNull: false },
      contract_title: { type: DataTypes.STRING(255), allowNull: false },
      contract_terms: { type: DataTypes.TEXT, allowNull: true },
      contract_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "write", // write:작성, service:서비스진행중, complete:서비스완료(계약서 보관상태), cancel(계약서파기) 등
      },
      start_date: { type: DataTypes.DATE, allowNull: true },
      end_date: { type: DataTypes.DATE, allowNull: true },
      signed_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "tb_tutor_contract",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  TutorContract.associate = (models) => {
    TutorContract.belongsTo(models.TutorApply, { foreignKey: "apply_id" });
    TutorContract.belongsTo(models.TutorJob, { foreignKey: "job_id" });
    TutorContract.belongsTo(models.Tutor, { foreignKey: "tutor_id" });
    TutorContract.belongsTo(models.Member, { foreignKey: "member_id" });
  };

  return TutorContract;
};
