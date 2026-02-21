const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const maintenanceController = require('../controllers/maintenanceController');

router.get('/', auth, maintenanceController.getMaintenanceLogs);
router.post('/', auth, maintenanceController.addMaintenanceLog);
router.put('/:id', auth, maintenanceController.updateMaintenanceLog);
router.delete('/:id', auth, maintenanceController.deleteMaintenanceLog);

module.exports = router;
