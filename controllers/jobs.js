const fs = require("fs");
const { error } = require("console");
const { TutorJob, Member, TutorJobCategory } = require("../models");

const createTutorJob = async (req, res) => {
  try {
    const requesterId = req.member.id;
    const { title, ...etc } = req.body;
    const tutorJob = { title, ...etc };

    // 요청자가 부모 회원이 아닐 경우 에러 RETURN
    const member = await Member.findOne({
      where: { id: requesterId, member_type: "mommy" },
    });

    if (!member) {
      return res.status(404).json({
        message: "요청자가 부모 회원이 아닙니다.",
      });
    }

    const newTutorJob = await TutorJob.create({
      title: tutorJob.title,
      requester_id: requesterId, // 보호자
      target: tutorJob.target,
      objective: tutorJob.objective,
      work_type: tutorJob.work_type,
      start_date: tutorJob.start_date,
      end_date: tutorJob.end_date,
      start_time: tutorJob.start_time,
      end_time: tutorJob.end_time,
      work_day: tutorJob.work_day,
      work_place: tutorJob.work_place, // 시/도 구/군 지역
      payment: tutorJob.payment,
      payment_cycle: tutorJob.payment_cycle,
      preferred_tutor_id: tutorJob.preferred_tutor_id,
      tutor_age: tutorJob.tutor_age,
      tutor_sex: tutorJob.tutor_sex,
      description: tutorJob.description,
      etc: tutorJob.etc,
    });

    res.status(201).json(newTutorJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTutorJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const { title, ...matched_at } = req.body;
    const tobeTutorJob = { title, ...matched_at };

    // TUTOR 공고 조회
    const asisTutorJob = await TutorJob.findOne({
      where: { id: jobId },
    });
    if (!asisTutorJob) {
      return res.status(404).json({
        message: "도와줘요~쌤 공고를 찾을 수 없습니다.",
      });
    }

    const updatedData = {};
    // 변경사항 비교
    if (asisTutorJob.title !== tobeTutorJob.title)
      updatedData.title = tobeTutorJob.title;
    if (asisTutorJob.target !== tobeTutorJob.target)
      updatedData.target = tobeTutorJob.target;
    if (asisTutorJob.objective !== tobeTutorJob.objective)
      updatedData.objective = tobeTutorJob.objective;
    if (asisTutorJob.work_type !== tobeTutorJob.work_type)
      updatedData.work_type = tobeTutorJob.work_type;
    if (asisTutorJob.start_date !== tobeTutorJob.start_date)
      updatedData.start_date = tobeTutorJob.start_date;
    if (asisTutorJob.end_date !== tobeTutorJob.end_date)
      updatedData.end_date = tobeTutorJob.end_date;
    if (asisTutorJob.start_time !== tobeTutorJob.start_time)
      updatedData.start_time = tobeTutorJob.start_time;
    if (asisTutorJob.end_time !== tobeTutorJob.end_time)
      updatedData.end_time = tobeTutorJob.end_time;
    if (asisTutorJob.work_day !== tobeTutorJob.work_day)
      updatedData.work_day = tobeTutorJob.work_day;
    if (asisTutorJob.work_place !== tobeTutorJob.work_place)
      updatedData.work_place = tobeTutorJob.work_place;
    if (asisTutorJob.payment !== tobeTutorJob.payment)
      updatedData.payment = tobeTutorJob.payment;
    if (asisTutorJob.payment_cycle !== tobeTutorJob.payment_cycle)
      updatedData.payment_cycle = tobeTutorJob.payment_cycle;
    if (asisTutorJob.preferred_tutor_id !== tobeTutorJob.preferred_tutor_id)
      updatedData.preferred_tutor_id = tobeTutorJob.preferred_tutor_id;
    if (asisTutorJob.tutor_age !== tobeTutorJob.tutor_age)
      updatedData.tutor_age = tobeTutorJob.tutor_age;
    if (asisTutorJob.tutor_sex !== tobeTutorJob.tutor_sex)
      updatedData.tutor_sex = tobeTutorJob.tutor_sex;
    if (asisTutorJob.description !== tobeTutorJob.description)
      updatedData.description = tobeTutorJob.description;
    if (asisTutorJob.etc !== tobeTutorJob.etc)
      updatedData.etc = tobeTutorJob.etc;
    if (asisTutorJob.status !== tobeTutorJob.status)
      updatedData.status = tobeTutorJob.status;
    if (asisTutorJob.matched_tutor_id !== tobeTutorJob.matched_tutor_id)
      updatedData.matched_tutor_id = tobeTutorJob.matched_tutor_id;
    if (asisTutorJob.matched_at !== tobeTutorJob.matched_at)
      updatedData.matched_at = tobeTutorJob.matched_at;

    const [updated] = await TutorJob.update(updatedData, {
      where: { id: jobId },
    });

    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 업데이트 후 새 데이터 조회
    const updatedJob = await TutorJob.findOne({
      where: { id: jobId },
    });

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorJobById = async (req, res) => {
  try {
    const job = await TutorJob.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "도와줘요 쌤 공고가 없습니다." });
    } else {
      return res.json(job);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorJob = async (req, res) => {
  try {
    // 공고상태 확인
    const jobId = req.params.id;

    const job = await TutorJob.findByPk(jobId);

    if (job.status !== "registered") {
      return res.status(403).json({
        message: "도와줘요~쌤 공고를 삭제할 수 없는 상태입니다.",
      });
    }

    const deletedJob = await TutorJob.destroy({
      where: { id: req.params.id },
    });
    if (!deletedJob) {
      return res.status(404).json({ message: "삭제할 공고가 없습니다." });
    } else {
      res.json({ message: "공고가 삭제되었습니다." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTutorJobCategory = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const categories = req.body.categories;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "카테고리를 선택하세요" });
    }

    const result = [];
    for (const categoryId of categories) {
      const category = await TutorJobCategory.findOne({
        where: {
          tutor_job_id: jobId,
          category_id: categoryId,
        },
      });

      if (!category) {
        const newCategory = await TutorJobCategory.create({
          tutor_job_id: jobId,
          category_id: categoryId,
        });
        result.push(newCategory);
      }
    }

    res
      .status(200)
      .json({ message: "튜터 공지 카테고리 정보 등록완료", added: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorJobCategory = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const deletedCount = await TutorJobCategory.destroy({
      where: { tutor_job_id: jobId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 카테고리가 없습니다." });
    }

    return res.status(200).json({
      message: "카테고리 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTutorJob,
  updateTutorJob,
  getTutorJobById,
  deleteTutorJob,
  addTutorJobCategory,
  deleteTutorJobCategory,
};
