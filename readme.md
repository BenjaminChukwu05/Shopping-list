# Project Summary

**Note:** `'*'` indicates a completed feature.

1. Add items to list via forms \*
2. Remove items from the list by clicking the 'X' button \*
3. Clear all items with the 'Clear All' button \*
4. Clear UI state (remove the filter UI when there are no items)

---

**Note:**

The first thing we do is retrieve the list items, but we do this inside the function scope of `checkUI`. Why?

## Code Example

Let's see what happens if we don’t:

```javascript
// JavaScript example
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const items = itemList.querySelectorAll('li');

const checkUI = () => {
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  }
};

checkUI();
```

**Note:** When I run this, it doesn’t work as expected. Yes, the 'Clear All' button and the 'Filter UI' disappear when I remove or comment out all list items, but they don't reappear when I add something back. Why?

This is because `checkUI` only runs once when the page loads, so it doesn’t detect changes made later.

**To fix this:**

```javascript
// Using Else statement
const checkUI = () => {
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
};
```

**Note:** This partially fixes the issue, but the UI still doesn’t update as expected when we add a new item. This is because `checkUI` is only running in the global scope (meaning it only runs when the page loads).

To fix this, we need to define `items` inside the function scope rather than in the global scope. If there are no list items, there’s nothing to select in the first place. So, a better approach is to select them inside the function rather than globally.

**!!! Very Important:** I had to call `checkUI()` right after appending a new list item to the DOM.

5. We want to add a prompt that asks if we are sure before deleting one or all items.

## Code Example

```javascript
// Using the Window 'confirm' method
const removeItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      e.target.parentElement.parentElement.remove();
    }
  }
};
```

**Note:** This triggers a pop-up like the `alert` function, asking if you’re sure about deleting the item. I also call `checkUI` here so that when the last item is deleted, the filter UI goes away. The same logic applies in the `clearItems` function.

6. Filter items by typing in the filter field

Note:

- We are going to turn to strings into lower case so as to avoid problems with comparing, we did this for both `text` and `itemName`

- Next we set a condition whereby if the text typed in and the substrings of the string of each items in the list are not null (-1) or match then `display = flex` else `display = none`

  ```javascript
  ///Filter Function
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
  ```

7. Add localStorage to persist items

Note:

- I wanted to be able to add items not= just to the DOM but also the the local storage and also the remove them, I also need to load the items when the page loads, we want to fatch them from local storage

- We can only add strings to the localStorage so what we are going to do it add an array of the items and then stringify them with `json.stringify` method, then when we take it out we use the `json.parse` method and that will turn it back into an array

  ```javascript
  // Adding to Local Storage
  const addItemToStorage = (item) => {
    let itemsFromStorage;

    if (localStorage.getItem('item') === null) {
      itemsFromStorage = [];
    } else {
      itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    //   Add new Item to array
    itemsFromStorage.push(item);

    //   Convert to JSON string and set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  };
  ```

Note:

- Because we wanted to both do `Input Validation`, `Create the Item DOM`, `Add to local Storage`, and `Check UI` all at once I created or rather re-made a seperate function to so all these at once and the created individual functions for each of these tasks and called them in this multi-purpose function

  ```javascript
  //Multi-purpose Funtion
  const onAddItemSubmit = (e) => {
    e.preventDefault();

    const newItem = itemInput.value;

    //   Input Validation (Basic)
    if (newItem === '') {
      alert('Please input an item');
      return;
    }

    //   Create item DOM element
    addItemToDOM(newItem);

    //   Add item to localStorage
    addItemToStorage(newItem);

    checkUI();

    //   This Clears the Input after Clicking
    itemInput.value = '';
  };
  ```

8. Now to make sure that even when I reload the page the items are still displayed

Note:

- I did a couple things here, but to break things down created an eventListener for when the page loads `DOMContentLoaded` and passed in function `displayItems`.

- Then we run `getItemsFromStorage` in a variable `itemsFromStorage`, basically making the variable and array, then we loop through with `forEach()` (for every item in `itemsFromStorage` we add them to the DOM using `addItemToDOM`), we also have to `checkUI` again after all these unless the filter and clear all button won't show when we reload

  ```javascript
  //It's goo practise to put this at the top of the page
  const displayItems = () => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    checkUI();
  };
  ```

Note:

- Instead of leaving all the `eventListeners` in the Global Scope, we create a function `init()` and then we put everything inside and call the function outside at the end

  ```javascript
  // Initailize App
  const init = () => {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', removeItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    // To display items even when page is loaded
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
  };

  init();
  ```

9. Now we want to be able to remove items from localStorage and not just the DOM

Note:

- After this we want to be able to click a part of the item to edit it and also on the icon to remove it

- We are changing `removeItem` in the Event listener to `onClickItem` and then we would call the former function inside it

  ```javascript
  itemList.addEventListener('click', onClickItem);
  ```

- Then in the `onClickItem`, I set a condition saying that if the button in the element is clicked then run `removeItem` with the target passed into it

  ```javascript
  const onClickItem = (e) => {
    if (e.target.parentElement.classList.contains('remove-item')) {
      removeItem(e.target.parentElement.parentElement);
    }
  };
  ```

- Then in `removeItem` I set a windows property `confirm` to confirm if i really want to delete the item and if i do, then delete, and of course at the end of it run `checkUI`

  ```javascript
  const removeItem = (item) => {
    if (confirm('Are you sure')) {
      item.remove();

      checkUI();
    }
  };
  ```

- I only removed the item from the DOM, if i reloaded the page it would appear again as it is stored in localStorage, we will remove it inside the same function, calling in another function `removeItemFromStorage`

  ```javascript
  const removeItem = (item) => {
    if (confirm('Are you sure')) {
      // Remove item from DOM
      item.remove();

      // Remove item from storage
      removeItemFromStorage(item.textContent);

      checkUI();
    }
  };
  ```

- Basically in this new function, what we're doing is, calling all the items from localStorage and then filtering them to clear out the ones we do not want to delete and them using `JSON.stringify` to turn them back to string to keep back in localStorage, since `getItemsFromStorage` turned them to an array

  ```javascript
  const removeItemFromStorage = (item) => {
    // We want to get the item from storage
    let itemsFromStorage = getItemsFromStorage();

    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Re-set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  };
  ```

- Be sure to use `let` for `itemFromStorage` since we will be changing it, and we'll also do this for the `clear all` button

10. Click on an item to put into `edit mode` and add to form

Note:

- I first set a glocalVariable `isEditMode` and set it to false by default (Why though?, I'll get to that)

- In `onClickItem` underneath the if statement, where we check if we specifically clicked the button, we set an else for when we click anywhere else on that element and call a function `setItemToEdit` where we pass in the element `e.target`

  ```javascript
  const onClickItem = (e) => {
    if (e.target.parentElement.classList.contains('remove-item')) {
      removeItem(e.target.parentElement.parentElement);
    } else {
      setItemToEdit(e.target);
    }
  };
  ```

- We create the function we called and here we set `isEditMode` to true and if it is, we want to change the collor of the text to make it lighter and we did this by creating a new css class called `edit-mode`

  ```javascript
  const setItemToEdit = (item) => {
    isEditMode = true;
    item.classList.add('edit-mode');
  };
  ```

- Then we want to select the button in the global scope (using `querySelector` to go into itemForm and select the button), we want to change the `innerHTML` of it, (the icon and the text)

  ```javascript
  const setItemToEdit = (item) => {
    isEditMode = true;
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  };
  ```

- We also want to add the item text content into the form so we can edit it

  ```javascript
  itemInput.value = item.textContent;
  ```

- Also when we click another item the last item remians how it is and we don't want that, to change this we loop through the itemList and remove the css element `edit-mode`

  ```javascript
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  ```

11. Update and Rest State

Note:

- When we submit we want to check if we are in `Edit mode` and then after we edit, we remove the old one and put in the new one

- We set an `if` condition, wehreby if the the item is in `Edit-mode` the code inside will run

  ```javascript
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }
  ```

  Note: This code selects the item carrying the class of `edit-mode` and removes item's text `string` from localStorage and then removes the class from the item in the DOM, then removes the item from the DOM itslef and then sets `isEditMode` flase, shoing that the item is no longer in edit mode

- Then I go to the `checkUI` function and then change the innerHTML of the `button` and it's style

  ```javascript
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  ```

- I then cleared the input after each UI checking

  `itemInput.value = '';`

  
