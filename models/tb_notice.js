module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define("Notice", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    writer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_notice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "tb_notice",
    timestamps: false,
    underscored: true,
  });

  // 관계 설정 (선택)
  Notice.associate = (models) => {
    Notice.belongsTo(models.Member, {
      foreignKey: 'writer',
      as: 'author', // 별칭 (선택)
    });
  };

  return Notice;
};