module.exports = (sequelize, DataTypes) => {
  const TutorCategory = sequelize.define(
    "TutorCategory",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tutor_id: { type: DataTypes.INTEGER, allowNull: false },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "tb_tutor_category",
      timestamps: false,
      underscored: true,
      indexes: [
        {
          name: "idx_tutor_category_tutor_id",
          fields: ["tutor_id"],
        },
      ],
    }
  );

  TutorCategory.associate = (models) => {
    TutorCategory.belongsTo(models.Tutor, { foreignKey: "tutor_id" });
    TutorCategory.belongsTo(models.Category, { foreignKey: "category_id" });
  };

  return TutorCategory;
};
