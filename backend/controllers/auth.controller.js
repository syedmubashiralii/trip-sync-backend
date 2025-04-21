const db = require('../utils/db'); 
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// table: 'users', 'companies', or 'tour_guides'
exports.register = async (req, res) => {
  const { name, email, password, type } = req.body;

  let table;
  if (type === 'user') table = 'users';
  else if (type === 'company') table = 'companies';
  else if (type === 'guide') table = 'tour_guides';
  else return res.status(400).json({ message: 'Invalid type' });

  try {
    const [existing] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await hashPassword(password);
    await db.query(
      `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashed]
    );

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password, type } = req.body;
  if (!email || !password || !type)
    return res.status(400).json({ message: "All fields are required" });

  let table;
  if (type === 'user') table = 'users';
  else if (type === 'company') table = 'companies';
  else if (type === 'guide') table = 'tour_guides';
  else return res.status(400).json({ message: 'Invalid type' });

  try {
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'No such user exsist', status: false });

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials', status: false });

    const token = generateToken({ id: user.id, role: type });

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: type }, status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
