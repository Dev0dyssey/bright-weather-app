const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController/searchController');

router.get('/', searchController.searchCityWeather);

module.exports = router;