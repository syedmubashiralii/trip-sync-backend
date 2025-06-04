// controllers/google.controller.js
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('../../knex');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { idToken, type } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing idToken' });
  }

  if (!type) {
    return res.status(400).json({ message: 'Missing User Type' });
  }

  try {
    // 1. Verify ID token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not found in token' });
    }

    // 2. Check if user exists in your users table
    let user = await db('users').where({ email }).first();

    if (!user) {
      const [newUser] = await db('users')
        .insert({
          name,
          email,
          profile_image: picture,
          email_verified: true,
          password: null,
          phone: null,
        })
        .returning('*');

      user = newUser;
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(401).json({ message: 'Invalid Google token', error: err });
  }
};
