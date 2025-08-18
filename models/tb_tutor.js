module.exports = (sequelize, DataTypes) => {
  const Tutor = sequelize.define(
    "Tutor",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      member_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { tyep: DataTypes.STRING, allowNull: false },
      birth_year: { tyep: DataTypes.STRING, allowNull: false },
      gender: { tyep: DataTypes.STRING, allowNull: false },
      school: DataTypes.STRING,
      major: DataTypes.STRING,
      is_graduate: DataTypes.STRING,
      career_years: DataTypes.INTEGER,
      introduction: DataTypes.TEXT,
      certification: DataTypes.TEXT,
      photo_path: DataTypes.STRING,
    },
    {
      tableName: "tb_tutor",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "idx_tutor_member_id",
          fields: ["member_id"],
        },
      ],
    }
  );

  Tutor.associate = (models) => {
    Tutor.belongsTo(models.Member, {
      foreignKey: "member_id",
      onDelete: "CASCADE",
    });
    Tutor.hasMany(models.TutorRegion, {
      foreignKey: "tutor_id",
      as: "regions",
    });
    Tutor.belongsToMany(models.Category, {
      through: models.TutorCategory,
      foreignKey: "tutor_id",
      otherKey: "category_id",
      as: "categories",
    });
    Tutor.hasMany(models.TutorFile, {
      foreignKey: "tutor_id",
      as: "files",
    });
  };

  return Tutor;
};
