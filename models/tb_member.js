module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "Member",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      member_type: {
        // parent, tutor, admin
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // 이메일 중복 방지
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cell_phone: {
        type: DataTypes.STRING(20),
      },
      residence_no: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      birth_date: {
        type: DataTypes.DATEONLY,
      },
      city: {
        type: DataTypes.STRING(50),
      },
      area: {
        type: DataTypes.STRING(50),
      },
      address: {
        type: DataTypes.STRING(255),
      },
      member_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "active", // 회원 상태: active, suspended 등
      },
      accumulated_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "tb_member",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Member;
};
