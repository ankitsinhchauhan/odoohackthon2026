const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tripController = require('../controllers/tripController');

router.get('/', auth, tripController.getTrips);
router.post('/', auth, tripController.addTrip);
router.put('/:id', auth, tripController.updateTrip);
router.delete('/:id', auth, tripController.deleteTrip);

module.exports = router;
