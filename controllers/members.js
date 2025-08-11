const bcrypt = require("bcryptjs");
const { error } = require("console");

const { Member } = require("../models");

const createMember = async (req, res) => {
  try {
    const {
      password,
      member_type,
      email,
      name,
      cell_phone,
      residence_no,
      birth_date,
      city,
      area,
      address,
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: "패스워드를 입력해야 합니다." });
    }

    // 주민등록번호 검증
    if (!isValidSSN(residence_no)) {
      return res.status(403).json({ message: "잘못된 주민등록번호 입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = await Member.create({
      password: hashedPassword,
      member_type: member_type,
      email: email,
      name: name,
      cell_phone: cell_phone,
      residence_no: residence_no,
      birth_date: birth_date,
      city: city,
      area: area,
      address: address,
    });

    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const [updated] = await Member.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated)
      return res
        .status(404)
        .json({ message: "회원을 찾을수 없거나 변경된 정보가 없습니다." });
    const updatedMember = await Member.findByPk(req.params.id);
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemberList = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "회원을 찾을수 없습니다." });
    } else {
      return res.json(member);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.destroy({
      where: { id: req.params.id },
    });
    if (!deletedMember) {
      return res.status(404).json({ message: "회원을 찾을수 없습니다." });
    } else {
      res.json({ message: "회원이 삭제되었습니다." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 주민등록번호 유효성 검사
function isValidSSN(ssn) {
  const digits = ssn.replace(/-/g, "");

  if (!/^\d{13}$/.test(digits)) return false;

  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  const sum = digits
    .split("")
    .slice(0, 12)
    .reduce((acc, curr, idx) => acc + parseInt(curr) * weights[idx], 0);

  const checkDigit = (11 - (sum % 11)) % 10;

  return checkDigit === parseInt(digits[12]);
}

module.exports = {
  createMember,
  updateMember,
  getMemberList,
  getMemberById,
  deleteMember,
};
