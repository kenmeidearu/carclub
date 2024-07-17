const Member = require('../models/Member');
const { Op, fn, col } = require('sequelize'); 
const sequelize = require('../config/database'); 
//const authenticateToken = require('../authenticateToken');

exports.getAllMembers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100; 
    const page = parseInt(req.query.page) || 0;
    const offset = page * limit;
    const searchConditions = [];
    if (req.query.search) {
      searchConditions.push(
        { memberName: { [Op.like]: `%${req.query.search}%` } },
        { carPlate: { [Op.like]: `%${req.query.search}%` } },
        { phoneNumber: { [Op.like]: `%${req.query.search}%` } },
        { memberNumber: { [Op.like]: `%${req.query.search}%` } },
        { region: { [Op.like]: `%${req.query.search}%` } }
      );
    }

    const searchQuery = {
where: searchConditions.length ? { [Op.or]: searchConditions } : {},
      limit,
      offset,
    };

    const { count, rows } = await Member.findAndCountAll(searchQuery);

    res.json({
      totalPages: Math.ceil(count / limit),
      members: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateMember = async (req, res) => {
  try {
    const [updated] = await Member.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedMember = await Member.findByPk(req.params.id);
      res.status(200).json(updatedMember);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteMember = async (req, res) => {
  try {
    const deleted = await Member.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemberStats = async (req, res) => {
  try {
    // Total members
    const allMembersCount = await Member.count();
    // Members joined this month
    const currentMonth = new Date().getMonth() + 1;
    const joinThisMonthCount = await Member.count({
      where: sequelize.where(fn('MONTH', col('joinDate')), 
      currentMonth)
    });
    // Active members
    const activeMembersCount = await Member.count({ where: 
      { status: 'active' } });
    // Non-active members
    const nonActiveMembersCount = await Member.count({ where:
       { status: 'non-active' } });
    // Return the statistics
    res.json({
      allMembers: allMembersCount,
      joinThisMonth: joinThisMonthCount,
      activeMembers: activeMembersCount,
      nonActiveMembers: nonActiveMembersCount
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};