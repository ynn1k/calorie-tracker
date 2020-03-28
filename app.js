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
        showTotalCalories: (totalCalories) => {
            UISelectors.totalCalories.textContent = totalCalories;
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

    return {
        init: () => {
            console.log("InitApp...");
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