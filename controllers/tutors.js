const fs = require("fs");
const { error } = require("console");
const {
  Member,
  Category,
  Tutor,
  TutorCategory,
  TutorRegion,
  TutorFile,
} = require("../models");

const createTutor = async (req, res) => {
  const memberId = req.member.id;

  try {
    const {
      school,
      major,
      is_graduate,
      birth_year,
      gender,
      career_years,
      introduction,
      certification,
    } = req.body;

    // tutor 사진 경로
    const photo_path = req.file ? req.file.url : null;

    const newTutor = await Tutor.create({
      member_id: memberId,
      school: school,
      major: major,
      is_graduate: is_graduate,
      birth_year: birth_year,
      gender: gender,
      career_years: career_years,
      introduction: introduction,
      certification: certification,
      photo_path: photo_path,
    });
    console.log("Photo path to save:", photo_path);

    res.status(201).json(newTutor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorByMemberId = async (req, res) => {
  try {
    // memberId가 제공되었는지 확인
    if (!req.query.memberId) {
      return res.status(400).json({
        message: "memberId 파라미터가 필요합니다.",
      });
    }

    const tutor = await Tutor.findOne({
      where: {
        member_id: req.query.memberId,
      },
    });

    if (!tutor) {
      return res.status(404).json({
        message: "쌤 정보를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tutor,
      message: "쌤 정보를 성공적으로 조회했습니다.",
    });
  } catch (err) {
    console.error("getTutorByMemberId 에러:", err);
    return res.status(500).json({
      success: false,
      message: "서버 내부 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

const updateTutor = async (req, res) => {
  try {
    // 파라미터값 세팅
    const id = req.params.id;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "튜터를 찾을 수 없습니다." });
    }

    // 변경 가능값 지정
    const {
      school,
      major,
      is_graduate,
      career_years,
      introduction,
      certification,
    } = req.body;

    // 이미지 업로드시 파일 삭제
    let photo_path = tutor.photo_path;
    if (req.file) {
      if (photo_path && fs.existsSync(photo_path)) {
        fs.unlinkSync(photo_path);
      }
      photo_path = req.file.path;
    }

    // UPDATE 항목 검사
    const updateData = {};
    if (school && school !== tutor.school) updateData.school = school;
    if (major && major !== tutor.major) updateData.major = major;
    if (is_graduate !== undefined && is_graduate !== tutor.is_graduate)
      updateData.is_graduate = is_graduate;
    if (career_years !== undefined && career_years !== tutor.career_years)
      updateData.career_years = career_years;
    if (introduction && introduction !== tutor.introduction)
      updateData.introduction = introduction;
    if (certification && certification !== tutor.certification)
      updateData.certification = certification;

    if (photo_path !== tutor.photo_path) {
      updateData.photo_path = photo_path;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "변경할 항목이 없습니다." });
    }

    // TABLE UPDATE
    await Tutor.update(updateData, {
      where: { id: id },
    });

    // UPDATE 후 재조회
    const updatedTutor = await Tutor.findByPk(id);
    res.json(updatedTutor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const { Op, fn, col } = require("sequelize");

const getTutorList = async (req, res) => {
  try {
    const name = (req.query.name || "").trim();

    const tutorList = await Member.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      attributes: [
        "name",
        "email",
        // 문자열로 연결된 카테고리명 추가
        [
          fn(
            "STRING_AGG",
            col("Tutor.TutorCategories.Category.category_nm"),
            ", "
          ),
          "categories",
        ],
      ],
      include: [
        {
          model: Tutor,
          attributes: ["birth_year", "gender"],
          include: [
            {
              model: TutorCategory,
              attributes: [],
              include: [
                {
                  model: Category,
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
      group: ["Member.id", "Tutor.id"],
    });

    console.log("조회된 튜터 목록:", tutorList);
    return res.json(tutorList);
  } catch (err) {
    console.error("getTutorList 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTutor = async (req, res) => {
  try {
    // 튜터 카테고리, 지역, 파일 우선 삭제
    const id = req.params.id;

    const deletedCategoryCount = await TutorCategory.destroy({
      where: { tutor_id: id },
    });

    const deletedRegionCount = await TutorRegion.destroy({
      where: { tutor_id: id },
    });

    const deletedFileCount = await TutorFile.destroy({
      where: { tutor_id: id },
    });

    const deletedTutor = await Tutor.destroy({
      where: { id: id },
    });

    if (!deletedTutor) {
      return res.status(404).json({ message: "정보가 없습니다." });
    } else {
      res.json({ message: "삭제완료" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTutorCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const categories = req.body.categories;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "카테고리를 선택하세요" });
    }

    const result = [];
    for (const categoryId of categories) {
      const category = await TutorCategory.findOne({
        where: {
          tutor_id: id,
          category_id: categoryId,
        },
      });

      if (!category) {
        const newCategory = await TutorCategory.create({
          tutor_id: id,
          category_id: categoryId,
        });
        result.push(newCategory);
      }
    }

    res
      .status(200)
      .json({ message: "튜터 카테고리 정보 등록완료", added: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorCategoryList = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("요청된 tutor ID:", id);

    // tutor_id로 해당 쌤의 모든 분야 조회
    const tutorCategories = await TutorCategory.findAll({
      where: { tutor_id: id },
    });

    // 분야가 없어도 빈 배열 반환 (404 에러 대신)
    return res.json(tutorCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCount = await TutorCategory.destroy({
      where: { tutor_id: id },
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

const addTutorRegion = async (req, res) => {
  try {
    const id = req.params.id;
    const regions = req.body.regions;

    if (!Array.isArray(regions)) {
      return res.status(400).json({ message: "선택한 지역이 없습니다." });
    }

    const result = [];
    for (const regionItem of regions) {
      const { region_name } = regionItem;
      const exists = await TutorRegion.findOne({
        where: {
          tutor_id: id,
          region_name,
        },
      });

      if (!exists) {
        const newRegion = await TutorRegion.create({
          tutor_id: id,
          region_name,
        });
        result.push(newRegion);
      }
    }

    res.status(200).json({ message: "튜터 지역 등록 완료", added: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTutorRegionList = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("요청된 tutor ID:", id);

    // tutor_id로 해당 쌤의 모든 지역 조회
    const tutorRegions = await TutorRegion.findAll({
      where: { tutor_id: id },
    });

    console.log("조회된 지역 목록:", tutorRegions);

    // 지역이 없어도 빈 배열 반환 (404 에러 대신)
    return res.json(tutorRegions);
  } catch (err) {
    console.error("getTutorRegionList 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorRegion = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCount = await TutorRegion.destroy({
      where: { tutor_id: id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 지역이 없습니다." });
    }

    return res.status(200).json({
      message: "지역 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTutorFile = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "파일이 첨부되지 않았습니다." });
    }

    const addFiles = await Promise.all(
      req.files.map((file, index) => {
        return TutorFile.create({
          tutor_id: id,
          file_doc_type: Array.isArray(req.body.file_doc_type)
            ? req.body.file_doc_type[index]
            : req.body.file_doc_type || "portfolio", // 1. idcard, 2. health, 3. license, 4. portfolio, 5. account
          file_title: file.originalname,
          file_name: file.filename,
          file_path: file.path,
          file_type: file.mimetype,
        });
      })
    );

    res.status(201).json({ message: "파일 첨부 완료", added: addFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTutorFile = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCount = await TutorFile.destroy({
      where: { tutor_id: id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "삭제할 첨부 파일이 없습니다." });
    }

    return res.status(200).json({
      message: "첨부파일 삭제 완료",
      count: deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTutor,
  getTutorByMemberId,
  updateTutor,
  getTutorList,
  deleteTutor,
  addTutorCategory,
  getTutorCategoryList,
  deleteTutorCategory,
  addTutorRegion,
  getTutorRegionList,
  deleteTutorRegion,
  addTutorFile,
  deleteTutorFile,
};
