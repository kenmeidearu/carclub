const sequelize = require('../config/database');
const Member = require('../models/Member');

const seedMembers = async () => {
  await sequelize.sync({ force: true });

  await Member.bulkCreate([
    {
      memberNumber: '001',
      region: 'East',
      carPlate: 'B1234CD',
      carYear: 2015,
      phoneNumber: '081234567890',
      email: 'member1@example.com',
      status: 'Active',
      photo: 'https://via.placeholder.com/150'
    },
    {
      memberNumber: '002',
      region: 'West',
      carPlate: 'B5678EF',
      carYear: 2017,
      phoneNumber: '081234567891',
      email: 'member2@example.com',
      status: 'Active',
      photo: 'https://via.placeholder.com/150'
    }
    // Add more members as needed
  ]);

  console.log('Seed data has been added!');
  process.exit();
};

seedMembers();
