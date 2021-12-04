const usersDOM = document.querySelector('.users')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.user-form')
const userInputDOM = document.querySelector('.user-input')
const formAlertDOM = document.querySelector('.form-alert')

const showUsers = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { users },
    } = await axios.get('/api/user')

    console.log('client users length ',users.length)


    if (users.length < 1) {
      usersDOM.innerHTML = '<h5 class="empty-list">No Users in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }

    const allUsers = users
      .map((user) => {
        const { missioncompleted, _id: userID, name } = user
        return `<div class="single-user ${missioncompleted && 'task-completed'}">
                  <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
                  <div class="task-links">



                  <!-- edit link -->
                  <a href="user.html?id=${userID}"  class="edit-link">
                  <i class="fas fa-edit"></i>
                  </a>
                  <!-- delete btn -->
                  <button type="button" class="delete-btn" data-id="${userID}">
                  <i class="fas fa-trash"></i>
                  </button>
                  </div>
                  </div>`
      })
      .join('')
    usersDOM.innerHTML = allUsers
  } catch (error) {
    usersDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showUsers()

// delete

usersDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/user/${id}`)
      showUsers()
    } catch (error) {
      console.log(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = userInputDOM.value

  try {
    await axios.post('/api/user', { name })
    showUsers()
    userInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, user added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
