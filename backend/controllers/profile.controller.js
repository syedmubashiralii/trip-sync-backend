const { getTableByType } = require("../utils/helper_functions");
const db = require("../utils/knex");
const { comparePassword, hashPassword } = require("../utils/hash");

exports.getProfile = async (req, res) => {
  const { role, email } = req.user;

  try {
    let profile = null;
    let userType = role;
    let table = getTableByType(userType);

    profile = await db(table).where({ email }).first();

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    delete profile.password;
    delete profile.reset_otp;
    delete profile.otp_expiry;
    res.status(200).json({
      message: "Profile fetched successfully",
      userType,
      profile,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { email, role } = req.user;
  const { name, phone, bio, reg_no, description } = req.body || {};
  const profile_image = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const table = getTableByType(role);

    const existingUser = await db(table).where({ email }).first();

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (profile_image) updates.profile_image = profile_image;

    if (role === "guide" && bio) updates.bio = bio;
    if (role === "company") {
      if (reg_no) updates.reg_no = reg_no;
      if (description) updates.description = description;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await db(table).where({ email }).update(updates);

    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.updatePassword = async (req, res) => {
  const { email, role } = req.user;
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required" });
  }

  try {
    const table = getTableByType(role);
    const user = await db(table).where({ email }).first();

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await db(table).where({ email }).update({ password: hashedNewPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
};