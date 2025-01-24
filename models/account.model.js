const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const typeRoles = require('../constants/type.role');

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [...Object.values(typeRoles)],
      default: typeRoles.USER,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

accountSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
  },
});

accountSchema.pre('save', function (next) {
  const user = this;
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, 10);
  }
  next();
});

accountSchema.pre('findOneAndUpdate', function (next) {
  const account = { ...this.getUpdate() };
  if (account.password) {
    account.password = bcryptjs.hashSync(account.password, 10);
  }
  this.setUpdate(account);
  next();
});

accountSchema.pre('findByIdAndUpdate', function (next) {
  const account = { ...this.getUpdate() };
  if (account.password) {
    account.password = bcryptjs.hashSync(account.password, 10);
  }
  this.setUpdate(account);
  next();
});

module.exports = mongoose.model('account', accountSchema);
