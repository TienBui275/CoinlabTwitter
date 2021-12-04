const UserModel = require('../models/users-model')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')


const getAllUser = asyncWrapper(async (req, res) => {
  
    const users = await UserModel.find({})
    console.log('server user length ', users.length)
    res.status(200).json({ users })
})

const createUser = asyncWrapper(async (req, res) => {
    const user = await UserModel.create(req.body)
    res.status(201).json({ user })
})

const getUser = asyncWrapper(async (req, res, next) => {
    const { id: userID } = req.params
    const user = await UserModel.findOne({ _id: userID })
    if (!user) {
      return next(createCustomError(`No user with id : ${userID}`, 404))
    }
    console.log('server getUser  ', user)

    res.status(200).json({ user })  
  
})
const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id: userID } = req.params
    const user = await UserModel.findOneAndDelete({ _id: userID })
    if (!user) {
      return next(createCustomError(`No task with id : ${userID}`, 404))
    }
    res.status(200).json({ user })
  

})
const updateUser = asyncWrapper(async (req, res, next) => {
    const { id: userID } = req.params

    const user = await UserModel.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
      runValidators: true,
    })
  
    if (!user) {
      return next(createCustomError(`No task with id : ${userID}`, 404))
    }
  
    res.status(200).json({  user })
 
})

module.exports = {
  getAllUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
}