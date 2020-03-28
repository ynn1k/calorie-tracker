//Storage Controlle

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
        items: [],
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
        addBtn: document.querySelector('#add-btn'),
        updateBtn: document.querySelector('#update-btn'),
        deleteBtn: document.querySelector('#delete-btn'),
        backBtn: document.querySelector('#back-btn'),
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
            UISelectors.itemList.insertAdjacentHTML('beforeend',li)
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
const App = ((ItemCtrl, UICtrl) => {
    //Load event listeners
    const loadEventListeners = () => {
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        UISelectors.addBtn.addEventListener('click', itemAddSubmit);

        //Edit icon click event
        UISelectors.itemList.addEventListener('click', itemUpdateSubmit)
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
            //Clear input
            UICtrl.clearInput();
        }

        e.preventDefault();
    };
    
    //Update item submit
    const itemUpdateSubmit = (e) => {
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
})(ItemCtrl, UICtrl);

//Init App
App.init();