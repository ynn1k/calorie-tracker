/*
 * try keeping the logs up-to-date when making changes
 */

//Storage Controlle
const StorageCtrl = (() => {
    return {
        storeItem: (item) => {
            console.log("Push a new item to localstorage...", item);
            let items = [];
            //Check if any items in localstorage
            if(localStorage.getItem('items') !== null) {
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(item);
            //Set to localstorage
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage: () => {
            let items = [];
            if(localStorage.getItem('items') !== null) {
                items = JSON.parse(localStorage.getItem('items'));
            }
            console.log("Getting item data from localstorage...", items);
            return items;
        },
        updateItemStorage: (updatedItem) => {
            console.log("Updating saved data...", updatedItem);
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: (id) => {
            console.log("Remove item from localstorage...", id);
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: () => {
            console.log("Remove all items from localstorage...");
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
const ItemCtrl = (() => {
    // Item Constructor
    const Item = function(id, name, calories){
        console.log("Item constructor called...");
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    };

    //Public methods
    return {
        getItems: () => {
            console.log("Returning all the items!...");
            return data.items;
        },
        addItem: (name, calories) => {
            console.log("Adding a new Item...", name, calories);
            //Create ID
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);
            //Create new item
            newItem = new Item(ID, name, calories);
            //Add to items Array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: (id) => {
            console.log("Looking for an item...", id);
            let found = null;
            //Loop through items
            data.items.forEach((item) => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: (name, calories) => {
            console.log("Updating current item...", name, calories);
            //calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach((item) => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: (id) => {
            console.log("Remove item data...", id);
            //Get ids
            const ids = data.items.map((item) => { return item.id });
            //Get index
            const index = ids.indexOf(id);
            //Remove item
            data.items.splice(index, 1)
        },
        clearAllItems: () => {
            console.log("Clear all item data...");
            data.items = [];
        },
        setCurrentItem: (item) => {
            console.log("Set new item as current item...", item);
            data.currentItem = item;
        },
        getCurrentItem: () => {
            console.log("Getting current item...");
            return data.currentItem;
        },
        getTotalCalories: () => {
            let total = 0;
            //Loop all items and add calories
            data.items.forEach((item) => {
                total += item.calories;
            });
            //Set total calories in data
            data.totalCalories = total;

            console.log("Calculating total calories...", total);
            return data.totalCalories
        },
        logData: () => {
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (() => {
    const UISelectors = {
        itemList:           document.querySelector('#item-list'),
        listItems:          document.querySelectorAll('#item-list li'), //not working because the li's get generated afterwards...
        listItems:          '#item-list li', //...so we will use this
        addBtn:             document.querySelector('#add-btn'),
        updateBtn:          document.querySelector('#update-btn'),
        deleteBtn:          document.querySelector('#delete-btn'),
        backBtn:            document.querySelector('#back-btn'),
        clearBtn:           document.querySelector('.clear-btn'),
        itemNameInput:      document.querySelector('#item-name'),
        itemCaloriesInput:  document.querySelector('#item-calories'),
        totalCalories:      document.querySelector('.total-calories'),
        progressbar:        document.querySelector('.progress-bar')
    };

    const listItemTemplate = (item) => {
        console.log("Generating li template from data...", item);
        return `
            <li class="list-group-item d-flex justify-content-between list-group-item-light" id="item-${item.id}">
                <strong>${item.name}</strong> <em>${item.calories} calories</em>
                <a href="#" title="Edit entry">
                    <i class="fa fa-pencil edit-item"></i>
                </a>
            </li>
        `
    };

    //Public methods
    return {
        populateItemList: (items) => {
            console.log("Populating items...", items);
            let listItemHtml = '';
            items.forEach((item) => {
                listItemHtml += listItemTemplate(item);
            });

            //Insert list items
            UISelectors.itemList.innerHTML = listItemHtml;
        },
        getItemInput: () => {
            console.log("Returning item name & calories", UISelectors.itemNameInput.value, UISelectors.itemCaloriesInput.value);
            return {
                name: UISelectors.itemNameInput.value,
                calories: UISelectors.itemCaloriesInput.value
            }
        },
        addListItem: (item) => {
            //Create li element
            const li = listItemTemplate(item);
            //Insert item
            UISelectors.itemList.insertAdjacentHTML('beforeend',li);
            console.log("Add item to list...", item, li);
        },
        updateListItem: (item) => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`) {
                    //Select element that will be replaced
                    let outdatedItem = document.querySelector(`#${itemID}`);
                    //Create a new ul wrapper
                    let updatedItem = document.createElement('ul');
                    //Generate the actual replacer item
                    updatedItem.innerHTML = listItemTemplate(item);
                    updatedItem = updatedItem.childNodes[1];
                    //Replace outdated with the firs child of updatedItem
                    outdatedItem.parentNode.replaceChild(updatedItem, outdatedItem);
                    console.log("Updating list item...", updatedItem, outdatedItem);
                }
            });
        },
        deleteListItem: (id) => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
            console.log("Removing item from list...", item);
        },
        clearInput: () => {
            console.log("Clearing inputs...");
            UISelectors.itemNameInput.value = '';
            UISelectors.itemCaloriesInput.value = '';
        },
        addItemToForm: () => {
            console.log("Pass item data to edit form...", ItemCtrl.getCurrentItem());
            UISelectors.itemNameInput.value = ItemCtrl.getCurrentItem().name;
            UISelectors.itemCaloriesInput.value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeAllItems: () => {
            console.log("Removing alle items...");
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach((item) => {
                console.log("Removing: ", item);
                item.remove();
            });
        },
        showTotalCalories: (totalCalories) => {
            console.log("Updating progressbar...", totalCalories);
            UISelectors.totalCalories.textContent = totalCalories;

            const maxCalories = 2500; //roughly based on a 25y 180cm male
            const progress = (totalCalories / maxCalories) * 100; //Total percentage of daily calories

            if(progress >= 90) {
                UISelectors.progressbar.classList.add('bg-danger');
                UISelectors.progressbar.classList.remove('bg-warning');
                console.log("You'll get fat...");
            } else if(progress >= 66) {
                UISelectors.progressbar.classList.remove('bg-danger');
                UISelectors.progressbar.classList.add('bg-warning');
            } else {
                UISelectors.progressbar.classList.remove('bg-danger');
                UISelectors.progressbar.classList.remove('bg-warning');
            }
            UISelectors.progressbar.style.width = progress+"%";
        },
        clearEditState: () => {
            console.log("Hide edit state...");
            UICtrl.clearInput();
            UISelectors.updateBtn.style.display = 'none';
            UISelectors.deleteBtn.style.display = 'none';
            UISelectors.backBtn.style.display = 'none';
            UISelectors.addBtn.style.display = 'inline';
        },
        showEditState: () => {
            console.log("Show edit state...");
            UISelectors.updateBtn.style.display = 'inline';
            UISelectors.deleteBtn.style.display = 'inline';
            UISelectors.backBtn.style.display = 'inline';
            UISelectors.addBtn.style.display = 'none';
        },
        getSelectors: () => {
            return UISelectors
        }
    }
})();

//App Controller
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {
    //Load event listeners
    const loadEventListeners = () => {
        console.log("Applying event listeners...");
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        UISelectors.addBtn.addEventListener('click', itemAddSubmit);
        
        //Disable submit on enter
        document.addEventListener('keypress',(e) => {
            if(e.code === "Enter") {
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        UISelectors.itemList.addEventListener('click', itemEditClick);

        //Update item event
        UISelectors.updateBtn.addEventListener('click', itemUpdateSubmit);

        //Delete item event
        UISelectors.deleteBtn.addEventListener('click', itemDeleteSubmit);

        //Back button event
        UISelectors.backBtn.addEventListener('click', UICtrl.clearEditState);

        //Clear items event
        UISelectors.clearBtn.addEventListener('click', clearAllItems);
    };

    //Add item submit
    const itemAddSubmit = (e) => {
        console.log("Trying to add an item...");
        //Get form input from UI Controller
        const input = UICtrl.getItemInput();
        //check input
        if(input.name !== '' && input.calories !== '') {
            console.log("Adding item...", input);
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI
            UICtrl.addListItem(newItem);
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Update total calories count in UI
            UICtrl.showTotalCalories(totalCalories);
            //Store item in localstorage
            StorageCtrl.storeItem(newItem);
            //Clear input
            UICtrl.clearInput();
        }

        e.preventDefault();
    };
    
    //CLick edit item
    const itemEditClick = (e) => {
        if(e.target.classList.contains('edit-item')) {
            //Get list item id
            const listItemId = e.target.parentNode.parentNode.id;
            //Break into an array
            const listItemIdArr = listItemId.split('-');
            //Get the actual id
            const id = parseInt(listItemIdArr[1]);
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            console.log("Start editing item...", itemToEdit);
            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();  
    };
    
    //Update item submit
    const itemUpdateSubmit = (e) => {
        console.log("Submit edits...");
        //Get item input
        const input = UICtrl.getItemInput();
        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        //Update UI
        UICtrl.updateListItem(updatedItem);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Update total calories count in UI
        UICtrl.showTotalCalories(totalCalories);
        //Update localstorage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    };
    
    //Delete button event
    const itemDeleteSubmit = (e) => {
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        console.log("Deleting item...", currentItem);
        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Update total calories count in UI
        UICtrl.showTotalCalories(totalCalories);
        //Delete from localstorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    //Clear items event
    const clearAllItems = () => {
        console.log("Waiting for confirmation to delete all items...");
        if(confirm("You want to remove all entries?")) {
            //Delete all items from data structure
            ItemCtrl.clearAllItems();
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Update total calories count in UI
            UICtrl.showTotalCalories(totalCalories);
            //Remove from UI
            UICtrl.removeAllItems();
            //Clear from localstorage
            StorageCtrl.clearItemsFromStorage();
        }
    };

    return {
        init: () => {
            console.log("InitApp...");
            //Set initial edit state
            UICtrl.clearEditState();
            //Get items from data src
            const items = ItemCtrl.getItems();
            //Populate list
            UICtrl.populateItemList(items);
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Update total calories count in UI
            UICtrl.showTotalCalories(totalCalories);
            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//Init App
App.init();