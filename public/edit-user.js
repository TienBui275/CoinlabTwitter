const userIDDOM = document.querySelector('.user-edit-id')
const userNameDOM = document.querySelector('.user-edit-name')
const taskCompletedDOM = document.querySelector('.user-edit-completed')
const editFormDOM = document.querySelector('.single-user-form')
const editBtnDOM = document.querySelector('.user-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

const showUser = async () => {
  try {
    const {
      data: { user },
    } = await axios.get(`/api/user/${id}`)
    const { _id: userID, missioncompleted, name } = user

    userIDDOM.textContent = userID
    userNameDOM.value = name
    tempName = name
    if (missioncompleted) {
      taskCompletedDOM.checked = true
    }
  } catch (error) {
    console.log(error)
  }
}

showUser()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const userName = userNameDOM.value
    const missionCompleted = taskCompletedDOM.checked

    const {
      data: { user },
    } = await axios.patch(`/api/user/${id}`, {
      name: userName,
      missioncompleted: missionCompleted,
    })

    console.log('zzzz client update ueser', user)

    const { _id: userID, missioncompleted, name } = user

    userIDDOM.textContent = userID
    userNameDOM.value = name
    tempName = name
    if (missioncompleted) {
      taskCompletedDOM.checked = true
    }
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited user`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    userNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
