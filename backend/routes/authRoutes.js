const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
// Di dalam aplikasi Anda
const { ACCESS_TOKEN_SECRET } = require('../config/config');
//const SECRET_KEY = '1fy0uc4n$33Me'; // Ganti dengan kunci rahasia yang lebih aman

router.post('/login', async (req, res) => {
  //console.log('Login request received:', req.body);
  const { memberNumber, password } = req.body;

  try {
    const member = await Member.findOne({ where: { memberNumber } });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    if (member.password !== hashedPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: member.id, isAdmin: member.isAdmin }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
