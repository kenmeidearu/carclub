const { DataTypes, Sequelize, Model } = require('sequelize');
const sequelize = require('../config/database');
class Member extends Model {
  get expiredDate() {
    const renewalDate = this.getDataValue('renewalDate');
    const joinDate = this.getDataValue('joinDate');
    const renewalYear = this.getDataValue('renewalYear');

    let baseDate;
    if (renewalDate) {
      baseDate = new Date(renewalDate);
    } else if (joinDate) {
      baseDate = new Date(joinDate);
    }

    if (baseDate && renewalYear) {
      return new Date(baseDate.setFullYear(baseDate.getFullYear() + renewalYear));
    }
    return null;
  }

  get memberStatus() {
    const expiredDate = this.expiredDate;
    const renewalDate = this.getDataValue('renewalDate');
    const joinDate = this.getDataValue('joinDate');
    const now = new Date();

    if (expiredDate > now) {
      if (renewalDate) {
        return 'Aktif (Perpanjang KTA)';
      } else {
        return 'Aktif (KTA Baru)';
      }
    } else {
      return 'Tidak Aktif';
    }
  }
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    memberNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    memberName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    carPlate: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    carYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    renewalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    renewalYear: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      set(value) {
        this.setDataValue('password', crypto.createHash('md5').update(value).digest('hex'));
      },
    },
    isAdmin: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0, // 0: no access, 1: add/edit, 2: add/edit/delete
      allowNull: false,
    },
    expiredDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const renewalDate = this.getDataValue('renewalDate');
        const joinDate = this.getDataValue('joinDate');
        const renewalYear = this.getDataValue('renewalYear');

        let baseDate;
        if (renewalDate) {
          baseDate = new Date(renewalDate);
        } else if (joinDate) {
          baseDate = new Date(joinDate);
        }

        if (baseDate && renewalYear) {
          return new Date(baseDate.setFullYear(baseDate.getFullYear() + renewalYear));
        }
        return null;
      },
    },
    memberStatus: {
      type: DataTypes.VIRTUAL,
      get() {
        const expiredDate = this.expiredDate;
        const renewalDate = this.getDataValue('renewalDate');
        const joinDate = this.getDataValue('joinDate');
        const now = new Date();

        if (expiredDate > now) {
          if (renewalDate) {
            return 'Aktif (Perpanjang KTA)';
          } else {
            return 'Aktif (KTA Baru)';
          }
        } else {
          return 'Tidak Aktif';
        }
      },
    },
  },
  {
    sequelize,
    modelName: 'Member',
  }
);
// Before create hook to set default password based on memberNumber
Member.beforeCreate(async (member) => {
  const defaultPassword = `dxic${member.memberNumber}`;
  member.password = crypto.createHash('md5').update(defaultPassword).digest('hex');
});

module.exports = Member;
