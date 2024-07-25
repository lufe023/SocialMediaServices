const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const { googleClientID, googleClientSecret, jwtSecret } = require("../config");
const User = require("../models/users.models");
const uuid = require("uuid");

passport.use(
    new GoogleStrategy(
        {
            clientID: googleClientID,
            clientSecret: googleClientSecret,
            callbackURL: "http://localhost:9000/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    where: { googleId: profile.id },
                });
                if (!user) {
                    user = await User.create({
                        id: uuid.v4(),
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        firstName: profile.name.givenName || "",
                        lastName: profile.name.familyName || "",
                    });
                }

                const payload = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                };
                const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

                return done(null, { user, token });
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((data, done) => {
    done(null, data);
});

passport.deserializeUser((data, done) => {
    done(null, data);
});

module.exports = passport;
/**/
