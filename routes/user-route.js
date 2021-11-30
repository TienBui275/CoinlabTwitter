const express = require('express')
const router = express.Router()

const {
  getAllUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  editUser,
} = require('../controllers/user-controller')

router.route('/').get(getAllUser).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router