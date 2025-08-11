const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const TutorJob = sequelize.define(
    "TutorJob",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      title: { type: DataTypes.STRING(200), allowNull: false }, // 제목

      requester_id: { type: DataTypes.INTEGER, allowNull: false }, // 요청자=보호자
      target: { type: DataTypes.STRING(100), allowNull: false }, // 대상자
      objective: { type: DataTypes.STRING(100), allowNull: false }, // 요청목적
      work_type: { type: DataTypes.STRING(50), allowNull: false }, // 서비스 타입(정기-Regular, 1회-Onetime)

      start_date: { type: DataTypes.DATE, allowNull: true }, // 서비스 시작기간
      end_date: { type: DataTypes.DATE, allowNull: true }, // 서비스 종료기간
      start_time: { type: DataTypes.TIME, allowNull: true }, // 서비스 시작시간
      end_time: { type: DataTypes.TIME, allowNull: true }, // 서비스 종료시간
      work_day: { type: DataTypes.STRING(20), allowNull: true }, // 서비스 요일
      work_place: { type: DataTypes.STRING(255), allowNull: true }, // 시/도 구/군 지역

      payment: { type: DataTypes.DECIMAL(10,2), allowNull: true }, // 시급
      payment_cycle: { type: DataTypes.STRING(50), allowNull: true }, // 입금주기

      preferred_tutor_id: { type: DataTypes.INTEGER, allowNull: true }, // 희망 튜터 ID (optional)
      tutor_age: { type: DataTypes.INTEGER, allowNull: true }, // 선생님 나이
      tutor_sex: { type: DataTypes.STRING(50), allowNull: true }, // 선생님 성별

      description: { type: DataTypes.TEXT, allowNull: true }, // 상세내용
      etc: { type: DataTypes.TEXT, allowNull: true }, // 기타내용

      // 상태
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "registered", // registered, open, matched, closed 등
      },

      matched_tutor_id: { type: DataTypes.INTEGER, allowNull: true }, // 실제 매칭된 튜터 ID
      matched_at: { type: DataTypes.DATE, allowNull: true }, // 매칭일
    },
    {
      tableName: "tb_tutor_job",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  TutorJob.associate = (models) => {
    TutorJob.belongsTo(models.Member, {
      foreignKey: "requester_id",
      targetKey: "id",
      as: "requester",
    });

    TutorJob.belongsTo(models.Tutor, {
      foreignKey: "preferred_tutor_id",
      as: "preferred_tutor",
    });

    TutorJob.belongsTo(models.Tutor, {
      foreignKey: "matched_tutor_id",
      as: "matched_tutor",
    });

    TutorJob.belongsToMany(models.Category, {
      through: models.TutorJobCategory,
      foreignKey: "tutor_job_id",
      otherKey: "category_id",
      as: "categories",
    });
  };

  return TutorJob;
};
