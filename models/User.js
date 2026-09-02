const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "usuarios"
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();

  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

UserSchema.methods.senhaCorreta = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);