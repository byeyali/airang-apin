module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      grp_cd: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      grp_nm: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      category_cd: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // 유니크 제약
      },
      category_nm: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      order_no: {
        type: DataTypes.INTEGER,
        default: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "tb_category",
      timestamps: false,
      underscored: true,
      indexes: [
        {
          name: "idx_grp_category_cd",
          fields: ["grp_cd", "category_cd"],
        },
      ],
    }
  );

  return Category;
};
