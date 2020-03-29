//Storage Controlle
const StorageCtrl = (() => {
    return {
        storeItem: (item) => {
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
            return items;
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: (id) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
const ItemCtrl = (() => {
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    };

    //Public methods
    return {
        getItems: () => {
            return data.items;
        },
        addItem: (name, calories) => {
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
            let found = null;
            //Loop through items
            data.items.forEach((item) => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updaItem: (name, calories) => {
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
            //Get ids
            const ids = data.items.map((item) => { return item.id });
            //Get index
            const index = ids.indexOf(id);
            //Remove item
            data.items.splice(index, 1)
        },
        clearAllItems: () => {
            data.items = [];
        },
        setCurrentItem: (item) => {
            data.currentItem = item;
        },
        getCurrentItem: () => {
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
        itemList: document.querySelector('#item-list'),
        listItems: document.querySelectorAll('#item-list li'), //not working because the li's get generated afterwards...
        listItems: '#item-list li', //...so we will use this
        addBtn: document.querySelector('#add-btn'),
        updateBtn: document.querySelector('#update-btn'),
        deleteBtn: document.querySelector('#delete-btn'),
        backBtn: document.querySelector('#back-btn'),
        clearBtn: document.querySelector('.clear-btn'),
        itemNameInput: document.querySelector('#item-name'),
        itemCaloriesInput: document.querySelector('#item-calories'),
        totalCalories: document.querySelector('.total-calories'),
    };

    const listItemTemplate = (item) => {
        return `
            <li class="list-group-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} calories</em>
                <a href="#">
                    <i class="fa fa-pencil edit-item"></i>
                </a>
            </li>
        `
    };

    //Public methods
    return {
        populateItemList: (items) => {
            let listItemHtml = '';
            items.forEach((item) => {
                listItemHtml += listItemTemplate(item);
            });

            //Insert list items
            UISelectors.itemList.innerHTML = listItemHtml;
        },
        getItemInput: () => {
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
                }
            });
        },
        deleteListItem: (id) => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: () => {
            UISelectors.itemNameInput.value = '';
            UISelectors.itemCaloriesInput.value = '';
        },
        addItemToForm: () => {
            UISelectors.itemNameInput.value = ItemCtrl.getCurrentItem().name;
            UISelectors.itemCaloriesInput.value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeAllItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach((item) => {
                item.remove();
            });
        },
        showTotalCalories: (totalCalories) => {
            UISelectors.totalCalories.textContent = totalCalories;
        },
        clearEditState: () => {
            UICtrl.clearInput();
            UISelectors.updateBtn.style.display = 'none';
            UISelectors.deleteBtn.style.display = 'none';
            UISelectors.backBtn.style.display = 'none';
            UISelectors.addBtn.style.display = 'inline';
        },
        showEditState: () => {
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
        //Get form input from UI Controller
        const input = UICtrl.getItemInput();
        //check input
        if(input.name !== '' && input.calories !== '') {
            console.log("Add item");
            console.log(input);
            console.log(input.name, input.calories);
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
            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();  
    };
    
    //Update item submit
    const itemUpdateSubmit = (e) => {
        //Get item input
        const input = UICtrl.getItemInput();
        //Update item
        const updatedItem = ItemCtrl.updaItem(input.name, input.calories);
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