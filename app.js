const express = require("express");
const User = require('./usermodel');
/*
    require passport
    require passport-facebook
*/
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;
require('dotenv').config();
const app = express();


app.get('/', (req, res) => res.json(
    {msg: "Welcome, Nerd!"}
));
/* 
  Configure Passport authenticated session persistence.
*/
passport.serializeUser(function(user, cb) {    
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {   
cb(null, obj);
});


/*
    Configure PassportJS-Facebook Strategy

    passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
*/

// Configure the Facebook strategy for use by Passport.
passport.use( new Strategy({ //This is class constructor argument telling Passport to create a new Facebook Auth Strategy
    clientID: process.env['FACEBOOK_APP_ID'],//The App ID generated when app was created on https://developers.facebook.com/
    clientSecret: process.env['FACEBOOK_APP_SECRET'],//The App Secret generated when app was created on https://developers.facebook.com/
    callbackURL: 'http://localhost:3000/return',
    enableProof: true,
    profile: ['id', 'displayName'] // You have the option to specify the profile objects you want returned
  },
  function(accessToken, refreshToken, profile, done) {
    //Check the DB to find a User with the profile.id
    User.findOne({ facebook_id: profile.id }, function(err, user) {//See if a User already exists with the Facebook ID
      if(err) {
        console.log(err);
        return done(err);
          // handle errors!
      }
      
      if (user) {
        done(null, user); //If User already exists login as stated on line 10 return User
      } else { //else create a new User
        user = new User({
          facebook_id: profile.id, //pass in the id and displayName params from Facebook
          name: profile.displayName
        });
        user.save(function(err) { //Save User if there are no errors else redirect to login route
          if(err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));
/*
    Initialize passport session
*/
app.use(passport.initialize())
app.use(passport.session());

/*
    Define Routes to be used

*/

//This is so you know if a Login attempt failed
app.get('/login', (req, res) => {
    res.json({msg: "login failed"});
});

//This endpoint connects the User to Facebook
app.get('/login/facebook', passport.authenticate('facebook'));
//This endpoint is the Facebook Callback URL and on success or failure returns a //response to the app
app.get('/return', 
        passport.authenticate('facebook', {failureRedirect:  '/login' }), 
        function (req, res) {
                res.redirect('/home');
});



// app.get('/home', async(req, res) => {
//     const user = await User.find()
//     const response = await user.map(user => {
//         return {
//             facebook_id: user.id, 
//             name: profile.displayName
//         }
//     })
//     res.status(200).json(response)
// });


//User gets here upon successful login
app.get('/home', async(req, res) => {
    //res.json({ msg: "login successful" });

    const user = await User.find()
    //res.status(200).json(user)
    const response = await user.map(user => {
        return {
            _id: user._id,
            email: user.email
        }
    })
    res.status(200).json(response)
    console.log(user)
});

//Database Configuration
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/enterpair-api";

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect( url , {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
      console.log("Successfully connected to the database");
  }).catch(err => {
      console.log('Could not connect to the database. Exiting now...');
      console.log(err)
      process.exit();
  });


const port = 3000;
app.set(port)

app.listen(port, () => { console.log(`App running on ${port}!`) })

module.exports = app