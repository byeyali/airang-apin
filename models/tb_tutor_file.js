module.exports = (sequelize, DataTypes) => {
  const TutorFile = sequelize.define(
    "TutorFile",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tutor_id: { type: DataTypes.INTEGER, allowNull: false },
      file_doc_type: { type: DataTypes.STRING, allowNull: false },
      file_title: { type: DataTypes.STRING, allowNull: false },
      file_name: { type: DataTypes.STRING, allowNull: false },
      file_path: { type: DataTypes.STRING, allowNull: false },
      file_type: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "tb_tutor_file",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "idx_tutor_file_tutor_id",
          fields: ["tutor_id"],
        },
      ],
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  TutorFile.associate = (models) => {
    TutorFile.belongsTo(models.Tutor, { foreignKey: "tutor_id" });
  };

  return TutorFile;
};
