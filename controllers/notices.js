const { error } = require("console");
const { Notice } = require("../models");

const createNotice = async (req, res) => {
  try {
    const { title, content, is_notice } = req.body;
    const writer = req.member.id; // 로그인한 사용자 ID

    const newNotice = await Notice.create({
      title,
      content,
      writer,
      is_notice,
    });

    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;

    const notice = await Notice.findOne({ where: { id: id } });
    if (!notice) {
      return res.status(404).json({ message: "공지를 찾을 수 없습니다." });
    }

    const updateData = {};
    if (title && title !== notice.title) updateData.title = title;
    if (content && content !== notice.content) updateData.content = content;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "변경할 항목이 없습니다." });
    }

    const [updated] = await Notice.update(updateData, { where: { id: id } });
    if (updated === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    const updatedNotice = await Notice.findOne({ where: { id: id } });
    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNoticeList = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "공지를 찾을수 없습니다." });
    } else {
      return res.json(notice);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const deletedNotice = await Notice.destroy({
      where: { id: req.params.id },
    });
    if (!deletedNotice) {
      return res.status(404).json({ message: "공지를 찾을수 없습니다." });
    } else {
      res.json({ message: "삭제 성공" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotice,
  updateNotice,
  getNoticeList,
  getNoticeById,
  deleteNotice,
};
