const express = require('express');
const cors = require('cors');
const memberRoutes = require('./routes/memberRoutes');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', memberRoutes);
app.use('/api/auth', authRoutes);

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
