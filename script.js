const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

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

  //   Add li to the DOM
  itemList.appendChild(li);

  checkUI();

  //   This Clears the Input after Clicking
  itemInput.value = '';
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

// Using Event Delegation, we tranversed the DOM from the i
// to the button and from there to the list item, we also
// used ".classList.contains" to check if the item we are
// has that className and if the condition is true then delete
const removeItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      e.target.parentElement.parentElement.remove();

      checkUI();
    }
  }
};

// To clear the Whole list
const clearItems = (e) => {
  //   //   There are 2 methods, First method
  //   itemList.innerHTML = '';

  //   Second and more efficient method
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

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
  const items = itemList.querySelectorAll('li');
  //   console.log(items); to check the precesnce of the nodeList

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
};

// Event Listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);

checkUI();
