module.exports = (sequelize, DataTypes) => {
  const TutorRegion = sequelize.define(
    "TutorRegion",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tutor_id: { type: DataTypes.INTEGER, allowNull: false },
      region_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "tb_tutor_region",
      timestamps: false,
      underscored: true,
      indexes: [
        {
          name: "idx_tutor_region_tutor_id",
          fields: ["tutor_id"],
        },
      ],
    }
  );

  TutorRegion.associate = (models) => {
    TutorRegion.belongsTo(models.Tutor, { foreignKey: "tutor_id" });
  };

  return TutorRegion;
};
