'use strict'

const express = require('express')
const knex = require('../knex')
const bcrypt = require('bcrypt-as-promised')
const router = express.Router()

// ===== ADD A USER =====
router.post('/users', (req, res, next) => {
  let pw = req.body.password
  bcrypt.hash(pw, 12)
  .then((hashed_password) => {
    return knex('users')
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      hashed_password: hashed_password
    }, '*')
  })
  .then((users) => {
    const user = users[0]
    delete user.hashed_password
    req.session.userId = user.id
    res.json(user)
  })
  .catch((err) => {
    next(err)
  })
})

module.exports = router