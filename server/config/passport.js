import passport from "passport";
import Google from 'passport-google-oauth20'
const GoogleStrategy = Google.Strategy;
import vendorDATA from '../models/vendorModel.js';
import dotenv from 'dotenv'
dotenv.config()
 
passport.use( 
  new GoogleStrategy(
    {      
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let vendor = await vendorDATA.findOne({ googleId: profile.id });

      if (!vendor) {
        vendor = await vendorDATA.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          role: "user",
        });
      } 

      return done(null, vendor);
    }
  )
);  