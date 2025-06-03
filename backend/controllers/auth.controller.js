const db = require("../utils/knex.js");
const { hashPassword, comparePassword } = require("../utils/hash");
const sendEmail = require("../services/mail.service");
const { generateToken } = require("../utils/jwt");
const { getTableByType } = require("../utils/helper_functions.js");
const bcrypt = require("bcrypt");

// table: 'users', 'companies', or 'tour_guides'
exports.register = async (req, res, next) => {
  const { name, email, password, type, phone, bio, reg_no, description } =
    req.body;
  const profile_image = req.file ? `uploads/${req.file.filename}` : null;

  let table;
  let fields = ["email", "password"];
  let values = [email];
  let placeholders = [];

  const userTypes = {
    users: "User",
    tour_guides: "Guide",
    companies: "Company",
  };

  try {
    for (const [tbl, label] of Object.entries(userTypes)) {
      const existing = await db(tbl).where({ email }).first();
      if (existing) {
        return res.status(400).json({
          message: `You are already registered as a ${label}, please continue login as that ${label.toLowerCase()}.`,
        });
      }
    }

    if (type === "user") {
      if (!name || !phone)
        return res
          .status(400)
          .json({ message: "Name and phone are required for user" });
      table = "users";
      fields = ["name", "email", "password", "phone"];
      values = [name, email, password, phone];
      if (profile_image) {
        fields.push("profile_image");
        values.push(profile_image);
      }
    } else if (type === "guide") {
      if (!name || !phone || !bio) {
        return res.status(400).json({
          message: "Name, phone, and bio are required for tour guide",
        });
      }
      table = "tour_guides";
      fields = ["name", "email", "password", "phone", "bio"];
      values = [name, email, password, phone, bio];
      if (profile_image) {
        fields.push("profile_image");
        values.push(profile_image);
      }
    } else if (type === "company") {
      if (!reg_no || !description || !phone) {
        return res.status(400).json({
          message:
            "Registration number, phone and description are required for company",
        });
      }
      table = "companies";
      fields = ["name", "email", "password", "reg_no", "description", "phone"];
      values = [name, email, password, reg_no, description, phone];
      if (profile_image) {
        fields.push("profile_image");
        values.push(profile_image);
      }
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    const hashed = await hashPassword(password);
    const passwordIndex = fields.indexOf("password");
    values[passwordIndex] = hashed;

    placeholders = fields.map(() => "?").join(", ");
    await db(table).insert(
      fields.reduce((obj, field, i) => {
        obj[field] = values[i];
        return obj;
      }, {})
    );

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db(table).where({ email }).update({
      reset_otp: otp,
      otp_expiry: expiry,
    });

    const html = `<p>Your Email Verification OTP is:</p><h3>${otp}</h3><p>It expires in 10 minutes.</p>`;
    await sendEmail(email, "Email Verification OTP", html);

    const captalize_type =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    res.status(201).json({
      message: `${captalize_type} Registered successfully, Otp sent to your registered email, please verify otp to continue`,
    });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ message: "Server error " + err });
    next(err);
  }
};


exports.getAllUsers = async (req, res, next) => {
  try{
   var users=await db('users');
   res
        .status(200)
        .json({ message: "No such user exists", status: false,users:users });
  }
  catch(err){
    next(err);
  }
}

exports.login = async (req, res, next) => {
  const { email, password, type } = req.body;
  if (!email || !password || !type)
    return res.status(400).json({ message: "All fields are required" });

  const table = getTableByType(type);
  if (!table) return res.status(400).json({ message: "Invalid type" });

  try {
    const user = await db(table).where({ email }).first();
    if (!user) {
      return res
        .status(400)
        .json({ message: "No such user exists", status: false });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials", status: false });

    const token = generateToken({ id: user.id, role: type,email: email });

    delete user.password;

    res.status(200).json({
      status: true,
      data: {
        token,
        user,
      },
      message: "User login Succesfull!",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { email, otp, type } = req.body;

  const table = getTableByType(type);
  if (!table) return res.status(400).json({ message: "Invalid type" });

  try {
    const user = await db(table).where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email_verified === 1) {
      return res.status(200).json({ message: "Otp already verified!" });
    }

    if (user.reset_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    await db(table)
      .where({ email })
      .update({ email_verified: 1, reset_otp: null, otp_expiry: null });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.resendOtp = async (req, res, next) => {
  const { email, type } = req.body;

  const table = getTableByType(type);
  if (!table) return res.status(400).json({ message: "Invalid type" });

  try {
    const [userRows] = await db.query(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email]
    );
    if (userRows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = userRows[0];

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `UPDATE ${table} SET reset_otp = ?, otp_expiry = ? WHERE email = ?`,
      [otp, expiry, email]
    );

    const html = `<p>Your Email Verification OTP is:</p><h3>${otp}</h3><p>It expires in 10 minutes.</p>`;
    await sendEmail(email, "Email Verification OTP", html);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const tables = ["users", "companies", "tour_guides"];
  let foundUser = null;
  let foundTable = null;

  try {
    for (const table of tables) {
      const user = await db(table).where({ email }).first();
      if (user) {
        foundUser = user;
        foundTable = table;
        break;
      }
    }

    if (!foundUser) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db(foundTable).where({ email }).update({
      reset_otp: otp,
      otp_expiry: expiry,
    });

    const html = `<p>Your password reset OTP is:</p><h3>${otp}</h3><p>It expires in 10 minutes.</p>`;
    await sendEmail(email, "Password Reset OTP", html);

    res.json({ message: "OTP sent to email!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.resetPasswordWithOTP = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }

  const tables = ["users", "companies", "tour_guides"];
  let foundUser = null;
  let foundTable = null;

  try {
    for (const table of tables) {
      const user = await db(table).where({ email }).first();
      if (user) {
        foundUser = user;
        foundTable = table;
        break;
      }
    }

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    if (foundUser.reset_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(foundUser.otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db(foundTable).where({ email }).update({
      password: hashedPassword,
      reset_otp: null,
      otp_expiry: null,
    });

    res.json({ message: "Password has been reset successfully!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const { email, type } = req.body;

  const table = getTableByType(type);
  if (!table) return res.status(400).json({ message: "Invalid type" });

  try {
    const user = await db(table).where({ email }).first();
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await db(table).where({ email }).delete();

    // Optionally, delete associated data from other tables if required
    // if (type === 'user') {
    //   // Delete comments, bookings, etc. for the user
    //   await db.query(`DELETE FROM comments WHERE user_email = ?`, [email]);
    //   await db.query(`DELETE FROM bookings WHERE user_email = ?`, [email]);
    // } else if (type === 'guide') {
    //   // Delete guides' associated data if required
    //   await db.query(`DELETE FROM reviews WHERE guide_email = ?`, [email]);
    // } else if (type === 'company') {
    //   // Delete company's associated data if required
    //   await db.query(`DELETE FROM products WHERE company_email = ?`, [email]);
    // }

    // Return success response
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// API to fetch user type based on email
exports.getUserType = async (req, res, next) => {
  const { email } = req.body;

  try {
    let userType = null;
    let user = null;

    const tables = [
      { name: "users", type: "user" },
      { name: "tour_guides", type: "guide" },
      { name: "companies", type: "company" },
    ];

    for (let table of tables) {
      user = await db(table.name).where({ email }).first();
      if (user) {
        userType = table.type;
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User type fetched successfully",
      userType,
      user,
    });
  } catch (err) {
    console.error("Error fetching user type:", err);
    next(err);
  }
};
