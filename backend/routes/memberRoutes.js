const express = require('express');
const router = express.Router();
//const { authenticateToken } = require('../middleware/authenticateToken');
const authenticateToken = require('../middleware/authenticateToken');
const memberController = require('../controllers/memberController');

router.get('/members',authenticateToken, memberController.getAllMembers);
router.get('/members/:id',authenticateToken, memberController.getMemberById);
router.post('/members',authenticateToken, memberController.createMember);
router.put('/members/:id',authenticateToken, memberController.updateMember);
router.delete('/members/:id',authenticateToken, memberController.deleteMember);
router.get('/memberstats',authenticateToken, memberController.getMemberStats);

module.exports = router;
