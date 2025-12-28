const mongoose = require("mongoose");
// mongoose-unique-validator is used to ensure unique fields in Mongoose schemas
const uniqueValidator = require("mongoose-unique-validator");

// Define the Place schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // for unique no need to install extra package
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], // one to many relationship
});
// Apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
