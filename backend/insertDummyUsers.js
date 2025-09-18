import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

mongoose.connect("mongodb://127.0.0.1:27017/tamil-trip-planner")
  .then(async () => {
    console.log("MongoDB connected");

    const users = [
      { name: "Hari", email: "hari@example.com", password: "123456" },
      { name: "Anu", email: "anu@example.com", password: "password" },
      { name: "Ravi", email: "ravi@example.com", password: "qwerty" },
    ];

    for (let u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ name: u.name, email: u.email, password: hashedPassword });
        console.log(`Inserted user: ${u.email}`);
      }
    }

    console.log("Dummy users added");
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
