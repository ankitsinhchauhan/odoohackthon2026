const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const driverController = require('../controllers/driverController');

router.get('/', auth, driverController.getDrivers);
router.post('/', auth, driverController.addDriver);
router.put('/:id', auth, driverController.updateDriver);
router.delete('/:id', auth, driverController.deleteDriver);

module.exports = router;
