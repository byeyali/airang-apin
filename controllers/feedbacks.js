const fs = require("fs");
const { error } = require("console");
const { TutorJob, TutorContract, Tutor, TutorFeedback } = require("../models");
const { Op } = require("sequelize");

const createTutorFeedback = async (req, res) => {
  try {
    const tutorId = req.member.id;

    const { job_id, session_date, start_flag } = req.body;

    // 공고 정보가 있는지 확인
    const job = await TutorJob.findByPk(job_id);
    if (!job) {
      return res.status(404).json({ message: "미공고 정보입니다." });
    }
    const target = job.target;

    // contract 이 있는지 확인
    const contract = await TutorContract.findOne({
      where: {
        job_id: job_id,
        tutor_id: tutorId,
        contract_status: { [Op.in]: ["write", "service"] },
      },
    });

    if (!contract) {
      return res.status(404).json({ message: "계약된 정보가 없습니다." });
    }
    const parentId = contract.member_id;

    // Feedback 정보 등록
    const newFeedback = await TutorFeedback.create({
      tutor_id: tutorId,
      job_id: job_id,
      target: target,
      session_date: session_date,
      start_flag: true,
      parent_id: parentId,
    });

    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTutorFeedback = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      end_flag,
      content,
      next_plan,
      parent_confirm_flag,
      parent_comment,
    } = req.body;

    // 피드백 정보가 있는지 확인
    const feedback = await TutorFeedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: "피드백 정보가 없습니다." });
    }

    const updateData = {};
    if (end_flag !== feedback.end_flag) {
      updateData.end_flag = end_flag;
    }
    if (content !== feedback.content) {
      updateData.content = content;
    }
    if (next_plan !== feedback.next_plan) {
      updateData.next_plan = next_plan;
    }
    if (parent_confirm_flag !== feedback.parent_confirm_flag) {
      updateData.parent_confirm_flag = parent_confirm_flag;
    }
    if (parent_comment !== feedback.parent_comment) {
      updateData.parent_comment = parent_comment;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "변경할 항목이 없습니다." });
    }

    // update 실행
    const [updated] = await TutorFeedback.update(updateData, {
      where: { id: id },
    });

    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 업데이트 후 새 데이터 조회
    const updatedTutorFeedback = await TutorFeedback.findOne({
      where: { id: id },
    });

    res.json(updatedTutorFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorFeedbackList = async (req, res) => {
  try {
    // tutor_id, parent_id 별 조회
    const memberId = req.member.id;
    const memberType = req.member.member_type;

    const feedbackList = await TutorFeedback.findAll({
      where:
        memberType === "tutor"
          ? { tutor_id: memberId }
          : { parent_id: memberId },
    });

    res.json(feedbackList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorFeedbackById = async (req, res) => {
  try {
    const feedback = await TutorFeedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "피드백을 찾을수 없습니다." });
    } else {
      return res.json(feedback);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorFeedback = async (req, res) => {
  try {
    const deletedFeedback = await TutorFeedback.destroy({
      where: { id: req.params.id },
    });
    if (!deletedFeedback) {
      return res.status(404).json({ message: "피드백을 찾을수 없습니다." });
    } else {
      res.json({ message: "삭제 성공" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTutorFeedback,
  updateTutorFeedback,
  getTutorFeedbackList,
  getTutorFeedbackById,
  deleteTutorFeedback,
};
