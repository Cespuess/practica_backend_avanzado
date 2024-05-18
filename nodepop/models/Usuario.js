const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = mongoose.Schema({
  email: { type: String, required: true, index: true },
  password: { type: String, required: true }
});

// método estático para hacer hash de una contraseña
const saltRounds = 10;
usuarioSchema.statics.hashPassword = function (plainTextPassword) {
  return bcrypt.hash(plainTextPassword, saltRounds);
};

// método de instancia para comprobar la contraseña de un usuario
usuarioSchema.methods.comparePassword = function (plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
