var express = require('express');
var router = express.Router();

const { User } = require('../model');

/* GET User listing. */
router.get('/', async function (req, res, next) {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'phoneNumber']
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'name', 'email', 'phoneNumber']
  });
  res.json(user);
})

router.post('/', async function (req, res) {
  const { name, email, password, phoneNumber, role } = req.body;
  const user = await User.create({
    name,
    email,
    phoneNumber,
    role,
    password: await hashPassword(password)
  });

  res.status(201).json({
    message: "User berhasil ditambahkan",
    data: user
  });
})

router.put('/:id', async (req, res) => {
  const User = await User.findByPk(req.params.id);
  if (User) {

    const newUserData = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: await hashPassword(password)
    });

    const updatedUser = await User.update(newUserData, {
      where: { id: req.params.id }
    });
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const User = await User.findByPk(req.params.id);
  if (User) {
    User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User berhasil dihapus" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
