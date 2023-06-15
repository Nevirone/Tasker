const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  admin: { type: Boolean, default: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// JWT
userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '30m',
    },
  );
  return token;
};

userSchema.statics.validateFirstName = function (name) {
  if (!name) return 'First name must be provided!';
  if (name.length < 3) return 'First name must contain at least 3 characters!';
  if (!name.match(/^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]*$/))
    return 'First letter must be capital, all other must be lower case!';
};

userSchema.statics.validateLastName = function (name) {
  if (!name) return 'Last name must be provided!';
  if (name.length < 3) return 'Last name must contain at least 3 characters!';
  if (!name.match(/^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]*$/))
    return 'First letter must be capital, all other must be lower case!';
};

userSchema.statics.validateEmail = function (email) {
  if (!email) return 'Email must be provided';
  // eslint-disable-next-line no-useless-escape
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email.match(regex)) return 'Invalid email!';
};

userSchema.statics.validatePassword = function (password) {
  if (!password) return 'Password must be provided!';
  if (password.length < 6)
    return 'Password must contain at least 6 characters!';
  if (!password.match(/.*[A-ZĘÓĄŚŁŻŹĆŃ].*/))
    return 'Password must contain at least one capital letter!';
  if (!password.match(/.*[0123456789].*/))
    return 'Password must contain at least one number letter!';
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
