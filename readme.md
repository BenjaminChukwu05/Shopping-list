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
