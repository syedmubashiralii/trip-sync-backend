// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const jwt = require('jsonwebtoken');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // This is where you'd normally find or create the user in your DB
//       const user = {
//         id: profile.id,
//         name: profile.displayName,
//         email: profile.emails?.[0]?.value,
//         provider: profile.provider,
//       };

//       // Generate JWT
//       const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

//       // Attach token to user object
//       user.token = token;

//       done(null, user);
//     }
//   )
// );
