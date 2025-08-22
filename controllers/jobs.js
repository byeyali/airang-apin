const fs = require("fs");
const { error } = require("console");
const { TutorJob, Member, TutorJobCategory, Category } = require("../models");

const createTutorJob = async (req, res) => {
  try {
    const requesterId = req.member.id;
    const { title, ...etc } = req.body;
    const tutorJob = { title, ...etc };

    // 요청자가 부모 회원이 아닐 경우 에러 RETURN
    const member = await Member.findOne({
      where: { id: requesterId, member_type: "parents" },
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
      work_place_address: tutorJob.work_place_address,
      payment: tutorJob.payment,
      negotiable: tutorJob.negotiable,
      payment_cycle: tutorJob.payment_cycle,
      preferred_tutor_id: tutorJob.preferred_tutor_id,
      tutor_age_fr: tutorJob.tutor_age_fr,
      tutor_age_to: tutorJob.tutor_age_to,
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
    if (asisTutorJob.negotiable !== tobeTutorJob.negotiable)
      updatedData.negotiable = tobeTutorJob.negotiable;
    if (asisTutorJob.payment_cycle !== tobeTutorJob.payment_cycle)
      updatedData.payment_cycle = tobeTutorJob.payment_cycle;
    if (asisTutorJob.preferred_tutor_id !== tobeTutorJob.preferred_tutor_id)
      updatedData.preferred_tutor_id = tobeTutorJob.preferred_tutor_id;
    if (asisTutorJob.tutor_age_fr !== tobeTutorJob.tutor_age_fr)
      updatedData.tutor_age_fr = tobeTutorJob.tutor_age_fr;
    if (asisTutorJob.tutor_age_to !== tobeTutorJob.tutor_age_to)
      updatedData.tutor_age_to = tobeTutorJob.tutor_age_to;
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

const getTutorJobList = async (req, res) => {
  try {
    // 쿼리 파라미터에서 member_id와 member_type 추출
    const memberId = req.query.member_id;
    const memberType = req.query.member_type;

    // 쿼리 파라미터 추출
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
      status,
      startDate,
      endDate,
      categoryId,
      searchKeyword,
    } = req.query;

    // 사용자 타입 검증
    if (!memberType || !["parents", "tutor", "admin"].includes(memberType)) {
      return res
        .status(400)
        .json({ error: "유효하지 않은 사용자 타입입니다." });
    }

    // 기본 WHERE 조건
    let whereCondition = {};

    if (memberType === "parents") {
      whereCondition.requester_id = memberId;
    } else if (memberType === "tutors") {
      whereCondition[Op.or] = [
        { status: "open" },
        { matched_tutor_id: memberId },
        { preferred_tutor_id: memberId },
      ];
    }
    // admin은 전체 공고를 볼 수 있도록 whereCondition을 빈 객체로 유지

    // 추가 필터 조건
    if (status) {
      // tutors의 경우 Op.or 조건이 있으므로 status 필터를 조정
      if (memberType === "tutors" && whereCondition[Op.or]) {
        // tutors의 경우 status가 "open"인 경우만 필터링
        if (status !== "open") {
          whereCondition[Op.or] = whereCondition[Op.or].filter(
            (condition) => !condition.status || condition.status === status
          );
        }
      } else {
        whereCondition.status = status;
      }
    }

    if (startDate && endDate) {
      whereCondition.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereCondition.created_at = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereCondition.created_at = {
        [Op.lte]: new Date(endDate),
      };
    }

    if (searchKeyword) {
      // 검색 조건을 Op.and로 감싸서 기존 조건과 AND 연산
      const searchCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${searchKeyword}%` } },
          { description: { [Op.like]: `%${searchKeyword}%` } },
        ],
      };

      if (Object.keys(whereCondition).length > 0) {
        whereCondition = {
          [Op.and]: [whereCondition, searchCondition],
        };
      } else {
        whereCondition = searchCondition;
      }
    }

    // 정렬 조건
    const orderCondition = [[sortBy, sortOrder.toUpperCase()]];

    // 페이지네이션
    const offset = (page - 1) * limit;

    // 임시로 카테고리 정보 없이 기본 데이터만 조회
    const includeConditions = [
      {
        model: Member,
        as: "requester",
        attributes: ["id", "name", "email"],
      },
    ];

    // 데이터 조회 (카테고리 정보 제외)
    const { count, rows: jobList } = await TutorJob.findAndCountAll({
      where: whereCondition,
      include: includeConditions,
      order: orderCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // 응답 데이터 가공
    const processedJobList = jobList.map((job) => {
      const jobData = job.toJSON();

      // 카테고리 정보는 빈 배열로 설정 (나중에 별도 조회)
      jobData.categories = [];

      return jobData;
    });

    // 페이지네이션 정보
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: processedJobList,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount: count,
        limit: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        status,
        startDate,
        endDate,
        categoryId,
        searchKeyword,
        sortBy,
        sortOrder,
      },
    });
  } catch (err) {
    console.error("getTutorJobList 에러:", err);
    res.status(500).json({
      error: "공고 목록 조회 중 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const getTutorJobById = async (req, res) => {
  try {
    console.log("=== getTutorJobById 시작 ===");
    console.log("요청된 ID:", req.params.id);
    console.log("사용자 정보:", req.member);

    const job = await TutorJob.findByPk(req.params.id, {
      include: [
        {
          model: Member,
          as: "requester",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] }, // 중간 테이블 속성은 제외
          attributes: ["id", "category_nm", "category_cd", "grp_cd"],
        },
      ],
    });

    console.log("조회된 job:", job ? "성공" : "실패");

    if (!job) {
      return res.status(404).json({ message: "도와줘요 쌤 공고가 없습니다." });
    }

    const jobData = job.toJSON();
    console.log("카테고리 개수:", jobData.categories?.length || 0);

    jobData.categories =
      jobData.categories?.map((cat) => ({
        id: cat.id,
        name: cat.category_nm,
        category_cd: cat.category_cd,
        grp_cd: cat.grp_cd,
      })) || [];

    console.log("최종 응답 데이터 준비 완료");
    return res.json(jobData);
  } catch (err) {
    console.error("=== getTutorJobById 에러 ===");
    console.error("에러 메시지:", err.message);
    console.error("에러 스택:", err.stack);
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
    const jobId = req.params.id;
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
  getTutorJobList,
  getTutorJobById,
  deleteTutorJob,
  addTutorJobCategory,
  deleteTutorJobCategory,
};
