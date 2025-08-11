const fs = require("fs");
const { error } = require("console");
const { TutorJob, Tutor, TutorApply, TutorContract } = require("../models");

const createJobApply = async (req, res) => {
  try {
    const tutorId = req.member.id;
    const { tutor_job_id, message } = req.body;

    // 공고가 있는지 확인
    const job = await TutorJob.findOne({
      where: {
        id: tutor_job_id,
        status: "open",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "모집 가능 공고정보가 없습니다.",
      });
    }

    // 튜터 체크
    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(403).json({
        message: "등록된 쌤이 아닙니다. 쌤 정보를 등록후에 지원해 주세요.",
      });
    }
    const newTutorApply = await TutorApply.create({
      tutor_id: tutorId,
      tutor_job_id: tutor_job_id,
      message: message,
    });

    res.status(201).json(newTutorApply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateJobApply = async (req, res) => {
  try {
    const id = req.params.id;
    const loginId = req.member.id; // 로그인한 사용자 ID
    const { status, message } = req.body;

    // 지원 데이터 유무 확인
    const apply = await TutorApply.findOne({
      where: { id: id },
    });

    if (!apply) {
      return res.status(404).json({
        message: "지원내역을 찾을수 없습니다.",
      });
    }

    // 권한 및 상태 체크
    if (apply.status !== "apply" || apply.tutor_id !== loginId) {
      return res.status(403).json({
        message: "지원내용을 수정할 수 없습니다.",
      });
    }

    const updated = await TutorApply.update(
      { status, message },
      { where: { id: id } }
    );

    if (updated[0] === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    const updatedApply = await TutorApply.findByPk(id);
    res.status(200).json(updatedApply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createContract = async (req, res) => {
  try {
    const {
      apply_id,
      job_id,
      tutor_id,
      member_id,
      contract_title,
      contract_terms,
      contract_status,
      start_date,
      end_date,
      signed_at,
    } = req.body;

    // 지원상태 변경
    const updatedApply = await TutorApply.update(
      { status: "contract" },
      { where: { id: apply_id } }
    );

    // 공고 데이터 변경
    const updatedJob = await TutorJob.update(
      { matched_tutor_id: tutor_id, status: "closed" },
      { where: { id: job_id } }
    );

    // 계약 데이터 생성
    const newContract = await TutorContract.create({
      apply_id: apply_id,
      job_id: job_id, // 보호자
      tutor_id: tutor_id,
      member_id: member_id,
      contract_title: contract_title,
      contract_terms: contract_terms,
      contract_status: contract_status,
      start_date: start_date,
      end_date: end_date,
      signed_at: signed_at,
    });

    res.status(201).json(newContract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createJobApply,
  updateJobApply,
  createContract,
};
