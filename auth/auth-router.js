const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets')
const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);
        // const payload = {
        //   subject: "hello",
        //   userid: user.id,
        //   user: user.username,
        //   favsuperhero: "Spiderman"
        // }
      
        // const secret = "2infinityandbeyond"
      
        // const options = {
        //   expiresIn: "8h"
        // }
      
        // const token = jwt.sign(payload, secret, options);
      
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token: token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


function genToken(user) {
  const payload = {
    subject: "hello",
    userid: user.id,
    user: user.username,
    favsuperhero: "Spiderman",
    roles: ['Admin']
  }

  const options = {
    expiresIn: "8h"
  }

  const token = jwt.sign(payload, secrets.jwtSecret, options);

  
  return token;
}
module.exports = router;
