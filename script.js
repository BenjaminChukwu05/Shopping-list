const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Putting it here is good practise, since we run once
// the page loads
const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
};

// ---------Used an Arrow function instead----------
const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //   Input Validation (Basic)
  if (newItem === '') {
    alert('Please input an item');
    return;
  }

  //   Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('This item already exists');
      return;
    }
  }

  //   Create item DOM element
  addItemToDOM(newItem);

  //   Add item to localStorage
  addItemToStorage(newItem);

  checkUI();

  //   This Clears the Input after Clicking
  itemInput.value = '';
};

const addItemToDOM = (item) => {
  //   Create List item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  //   Add li to the DOM
  itemList.appendChild(li);
};

// Reusable Button
const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

// Reusable Icon
const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

const addItemToStorage = (item) => {
  //We don't want to repeat ourselves, instead of doing thing from
  //   'getItemFromStorage', why not just call it
  const itemsFromStorage = getItemsFromStorage();

  //   Add new Item to array
  itemsFromStorage.push(item);

  //   Convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  // We called this in other functions, it wouldn't work unless
  // we returned it and every thing we did in this function
  return itemsFromStorage;
};

// This takes in to functions, to both edit and delete the items
const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
};

// Here we add a confirmation and then simply remove it
const removeItem = (item) => {
  if (confirm('Are you sure')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
};

const removeItemFromStorage = (item) => {
  // We want to get the item from storage
  let itemsFromStorage = getItemsFromStorage();

  //Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

// To clear the Whole list
const clearItems = (e) => {
  //   Second and more efficient method
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //   Clear from localStorage
  localStorage.removeItem('items');

  checkUI();
};

// To Filter items by typing
const filterItems = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    // Gettign the First childNode, which is a text
    // Instead of looping through it with the quotation marks showing, we loop through the text instead using (.textContent)
    const itemName = item.firstChild.textContent.toLowerCase();

    // if it mathces an item it will be true, if it doesn;t it will display '-1'
    if (itemName.indexOf(text) != -1) {
      // the items in the have the display 'flex'
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

// To change UI state according to presence of items
const checkUI = () => {
  // Clear the Input when UI is reset
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  //   console.log(items); to check the precesnce of the nodeList

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
};

// Initailize App
const init = () => {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  // To display items even when page is loaded
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
