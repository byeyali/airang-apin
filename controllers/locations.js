require("dotenv").config();
const axios = require("axios");
const { error } = require("console");

// 행안부 주소검색
const ADDR_BASE_URL = process.env.ADDRESS_BASE_URL;
const ADDR_API_KEY = process.env.ADDRESS_API_KEY;

const getAddress = async (req, res) => {
  const { keyword, currentPage = 1, countPerPage = 10 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "주소를 입력하세요." });
  }

  try {
    const response = await axios.get(ADDR_BASE_URL, {
      params: {
        confmKey: ADDR_API_KEY,
        currentPage,
        countPerPage,
        keyword,
        resultType: "json",
      },
    });

    const results = response.data.results;

    if (results.common.errorCode !== "0") {
      return res.status(500).json({ error: results.common.errorMessage });
    }

    const addresses = results.juso.map((item) => ({
      address: item.roadAddr, // 도로명주소
      city: item.siNm, // 시도명
      area: item.sggNm ? item.sggNm : item.emdNm ? item.emdNm : " ", // 공백을 fallback으로
    }));

    return res.status(200).json({
      addresses: addresses,
      totalCount: Number(results.common.totalCount),
      currentPage: Number(currentPage),
      countPerPage: Number(countPerPage),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAddressArea = async (req, res) => {
  const { keyword, currentPage = 1, countPerpage = 100 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "동명 입력 ex. 삼성동, 목동" });
  }

  try {
    const response = await axios.get(ADDR_BASE_URL, {
      params: {
        confmKey: ADDR_API_KEY,
        currentPage,
        countPerpage,
        keyword,
        resultType: "json",
      },
    });

    const results = response.data.results;

    if (results.common.errorCode !== "0") {
      return res.status(500).json({ error: results.common.errorMessage });
    }

    const regions = results.juso;
    console.log(regions);

    const uniqueKeySet = new Set();
    const regionArray = [];
    let idCounter = 1;

    regions.forEach((item) => {
      const key = `${item.siNm}-${item.sggNm}-${item.emdNm}`;

      if (!uniqueKeySet.has(key)) {
        uniqueKeySet.add(key);
        regionArray.push({
          id: idCounter++,
          regionNm: `${item.siNm} ${item.sggNm} ${item.emdNm}`,
        });
      }
    });

    return res.status(200).json({ regionArray });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 카카오맵 주소검색 .env 가져오기
const headers = {
  Authorization: process.env.KAKAO_REST_API_KEY,
};

const BASE_URL = process.env.KAKAO_ADDRESS_URL; // 환경변수에서 URL prefix 불러오기

const getRegionFromAddress = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "주소를 입력하세요" });
  }

  try {
    // 1. 주소 → 좌표
    const addrRes = await axios.get(`${BASE_URL}/search/address.json`, {
      headers,
      params: { query: address },
    });

    const doc = addrRes.data.documents[0];
    if (!doc) {
      return res.status(404).json({ error: "주소를 찾을 수 없습니다." });
    }

    const { x, y } = doc;

    // 2. 좌표 → 행정구역
    const regionRes = await axios.get(`${BASE_URL}/geo/coord2regioncode.json`, {
      headers,
      params: { x, y },
    });

    const regions = regionRes.data.documents;

    if (!regions || regions.length === 0) {
      return res
        .status(404)
        .json({ error: "행정구역 정보를 찾을 수 없습니다." });
    }

    // 3. 시도 + 구군 기준 중복 제거
    const uniqueKeySet = new Set();
    const regionArray = [];

    regions.forEach((item) => {
      const key = `${item.region_2depth_name}-${item.region_3depth_name}`;

      if (!uniqueKeySet.has(key)) {
        uniqueKeySet.add(key);
        regionArray.push({
          id: regions.length,
          regionNm: `${item.region_2depth_name} ${item.region_3depth_name}`,
        });
      }
    });

    return res.status(200).json({ regionArray });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAddress, getAddressArea, getRegionFromAddress };
