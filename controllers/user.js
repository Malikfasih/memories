// here is the place where we put all the logics of signin and signup

// bycrypt is use to hash the password and will secure from the hackers
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // to store the user in the browser for some period of time

import User from "../models/user.js";

export const signin = async (req, res) => {
  // for sigin in we will get the 2 things from the frontend i.e email & password
  // we will get these from req.body through the post request from the frontend
  const { email, password } = req.body;

  try {
    // first we will check the given email is old-email/existing user or not in db.
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User does not exists" });

    // also check the password compares the old password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid credentials" });

    // now if the existingUser and password is correct then we will get his/her jwt and will send to the frontend

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    ); // in sign() we will provided all the information that would stored in first pram and second is a 'secret', 3rd pram is opt obj to specify expiry of the token.

    // now we have the token in the end we will return it,
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  // for signup we have to add the new user to the db
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    // we also have to check/find for the existing user
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match." });

    // hashing the password we don't want to store that in a plain text

    const hashedPassword = await bcrypt.hash(password, 12);

    // now creating the user in db

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    //  creating the token
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: " 1h",
    });
    console.log(token);

    // now we have the user and token we will return it or send it
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
