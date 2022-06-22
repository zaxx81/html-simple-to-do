/* DOM Variables */
const form = document.getElementById('addForm')
const draggableList = document.getElementById('draggable-list')
const filter = document.getElementById('filter')
const clear = document.getElementById('clear-filter')
const itemTextField = document.getElementById('item')

let toDoItems = []
let listItems = [];
let dragStartIndex;
initToDoItems()

/* Event Listeners */
form.addEventListener('submit', addItem)
draggableList.addEventListener('click', completeItem)
draggableList.addEventListener('click', removeItem)
filter.addEventListener('keyup', filterItems)
clear.addEventListener('click', clearFilter)

/* Functions */

// Initializes toDoItems from localstorage
function initToDoItems() {
  const tempList = localStorage.getItem('saveditems')
  if (tempList) {
    const tempList = JSON.parse(localStorage.getItem('saveditems'))

    for (let item of tempList) {
      const newListItem = document.createElement('li')
      newListItem.className = item.classes.join(' ')
      newListItem.setAttribute('data-index', item.dataIndex)
      newListItem.innerHTML = `
        <div class="draggable" draggable="true">
          <i class="bi-grip-vertical"></i>
          <span class="item-description">${item.description}</span>
          <i class="bi-trash float-end"></i>
          <i class="bi-check-square-fill float-end pe-1"></i>
        </div>
        `
      listItems.push(newListItem)
      draggableList.appendChild(newListItem)
    }

  } else {
    toDoItems = ['Eat', 'Sleep', 'Code']
    createList()
  }
}

// Update local Storage Function
function updateLocalStorage() {
  const tempList = [...draggableList.querySelectorAll('li')]
  const listObjects = []
  
  for (let item of tempList) {
    classes = item.classList
    dataIndex = item.getAttribute('data-index')
    description = item.getElementsByClassName('item-description')[0].textContent

    listObjects.push({
      classes: [...classes],
      dataIndex: dataIndex,
      description: description,
    })
  }
  localStorage.setItem('saveditems', JSON.stringify(listObjects))
}

// Add Item Function
function addItem(e) {
  e.preventDefault()
  let item = itemTextField.value
  let index = toDoItems.length
  toDoItems.push(item)
  
  const listItem = document.createElement('li')
  listItem.className = 'list-group-item'
  listItem.setAttribute('data-index', index)
  listItem.innerHTML = `
    <div class="draggable" draggable="true">
      <i class="bi-grip-vertical"></i>  
      <spand class="item-description">${item}</spand>
      <i class="bi-trash float-end"></i>
      <i class="bi-check-square-fill float-end pe-1"></i>
    </div>
  `
  listItems.push(listItem)
  draggableList.appendChild(listItem)
  document.getElementById('item').value = ""
  // Update localStorage
  updateLocalStorage()
}

// Complete Item Function
function completeItem(e) {
  if (e.target.classList.contains('bi-check-square-fill')) {
    if (e.target.previousElementSibling.previousElementSibling.textContent.toLowerCase() == 'code') {
      alert("Coding is never finished!")
    } else {
      if (e.target.parentElement.classList.contains('text-decoration-line-through')) {
        e.target.parentElement.classList.remove('text-decoration-line-through')
      }
      else {
        e.target.parentElement.classList.add('text-decoration-line-through')
      }
      updateLocalStorage()
    }
  }
}

// Remove Item Function
function removeItem(e) {
  if (e.target.classList.contains('bi-trash')) {
    if (e.target.previousElementSibling.textContent.toLowerCase() == 'code') {
      alert("Coding is never finished!")
    } else {
      if (confirm('Are you sure?')) {
        let listItem = e.target.parentElement.parentElement
        draggableList.removeChild(listItem)

        // Update localStorage
        updateLocalStorage()
      }
    }
  }
}

// Filter Function
function filterItems(e) {
  // Adds a clear filter button
  clear.style.display = 'block'
  // Convert filter text to lowercase
  let text = e.target.value
  let items = draggableList.getElementsByTagName('li')
  // Convert Items from HTML Collection to an Array
  Array.from(items).forEach( (item) => {
    
    let itemName = item
      .getElementsByClassName('item-description')[0]
      .textContent
    let re = new RegExp(text, 'gi')
    if (re.test(itemName)) {
      item.style.display = 'block'
    } else {
      item.style.display = 'none'
    }
  })
}

// Clear Filter Function
function clearFilter(e) {
  if (e.target.classList.contains('bi-x-lg')) {
    filter.value = ""
    clear.style.display = 'none'
    
    let items = draggableList.getElementsByTagName('li')
    Array.from(items).forEach( (item) => {
      item.style.display = 'block'
    })
  }
}

function createList() {
  [...toDoItems].forEach( (item, index) => {
    const listItem = document.createElement('li')
    listItem.className = 'list-group-item'
    listItem.setAttribute('data-index', index)
    listItem.innerHTML = `
      <div class="draggable" draggable="true">
        <i class="bi-grip-vertical"></i>
        <span class="item-description">${item}</span>
        <i class="bi-trash float-end"></i>
        <i class="bi-check-square-fill float-end pe-1"></i>
      </div>
    `
    listItems.push(listItem)
    draggableList.appendChild(listItem)
  })
  updateLocalStorage()
  addEventListeners()
}

function dragStart() {
  dragStartIndex = +this.closest('li').getAttribute('data-index')
}

function dragEnter() {
  this.parentElement.classList.add('over')
}

function dragLeave() {
  this.parentElement.classList.remove('over')
}

function dragOver(e) {
  e.preventDefault()
}

function dragDrop() {
  const dragEndIndex = +this.getAttribute('data-index')
  moveItems(dragStartIndex, dragEndIndex)
  
  this.classList.remove('over')
}

function moveItems(fromIndex, toIndex) {
  listItems = [...draggableList.querySelectorAll('li')]
  const item = listItems[fromIndex]
  
  draggableList.removeChild(item)
  draggableList.insertBefore(item, draggableList.children[toIndex])
  
  for (let i = 0; i < draggableList.children.length; i++) {
    draggableList.children[i].setAttribute('data-index', i)
  }
  
  listItems = [...draggableList.querySelectorAll('li')]
  console.log(listItems)
  console.log(draggableList)

  updateLocalStorage()
}

function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable')
  const dragListItems = document.querySelectorAll('.draggable-list li')

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart)
  })
  
  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver)
    item.addEventListener('drop', dragDrop)
    item.addEventListener('dragenter', dragEnter)
    item.addEventListener('dragleave', dragLeave)
  })
}