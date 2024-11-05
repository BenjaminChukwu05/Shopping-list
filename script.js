const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

// -------The Function Method--------
// function addItem(e) {
//   e.preventDefault();

//   // Input Validation
//   if (itemInput.value === '') {
//     alert('Please input an item');
//     return;
//   }

//   console.log('Success');
// }

// ---------Used an Arrow function instead----------
const addItem = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //   Input Validation (Basic)
  if (newItem === '') {
    alert('Please input an item');
    return;
  }

  //   Create List item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);

  //   This Clears the Input after Clicking
  itemInput.value = '';
};

// Reusable Button
const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-mark');
  button.appendChild(icon);
  return button;
};

// Reusable Icon
const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

// Event Listeners
itemForm.addEventListener('submit', addItem);
