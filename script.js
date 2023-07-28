let data = [];
let selectedItemId = null;
let nameSortOrder = 0; 
let valueSortOrder = 0; 
let messageTimeoutId = null;

window.onload = function() {
  data = getDataFromLocalStorage();

  if (!data) {
    fetch('data.json')
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData;
        populateItemList();
      })
      .catch(error => console.error('Error:', error));
  } else {
    populateItemList();
  }

  document.getElementById('filter').addEventListener('input', filterItems);
  document.getElementById('clearFilter').addEventListener('click', clearFilter);
  document.getElementById('sortByName').addEventListener('click', () => sortItems('name'));
  document.getElementById('sortByValue').addEventListener('click', () => sortItems('value'));
  document.getElementById('editForm').addEventListener('submit', editItem);
  document.getElementById('itemList').addEventListener('click', selectItem);
  document.getElementById('closeEditForm').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('editForm').style.display = 'none'; 
  });
  document.getElementById('listViewButton').addEventListener('click', () => switchView('list'));
  document.getElementById('gridViewButton').addEventListener('click', () => switchView('grid'));
}

function getDataFromLocalStorage() {
  const storedData = localStorage.getItem('myData');
  return storedData ? JSON.parse(storedData) : null;
}

function saveDataToLocalStorage() {
  localStorage.setItem('myData', JSON.stringify(data));
}

function createListItem(item, index) {
  const listItem = document.createElement('button');
  listItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
  listItem.value = index; 

  const nameElement = document.createElement('span');
  nameElement.textContent = item.name;
  listItem.appendChild(nameElement);

  const valueElement = document.createElement('span');
  valueElement.textContent = item.value;
  listItem.appendChild(valueElement);

  return listItem;
}

function createGridItem(item, index) {
  const gridItem = document.createElement('div');
  gridItem.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'col-12', 'item');

  const listItem = createListItem(item, index); 
  gridItem.appendChild(listItem); 

  return gridItem;
}

function populateItemList(dataToDisplay = data) {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = '';
  const isGridView = itemList.classList.contains('row'); 
  dataToDisplay.forEach((item, index) => {
    const itemElement = isGridView ? createGridItem(item, index) : createListItem(item, index);
    itemList.appendChild(itemElement);
  });
  document.getElementById('itemCount').textContent = `Showing ${dataToDisplay.length} items`;
}

function selectItem(event) {
  const clickedItemId = Number(event.target.value);
  selectedItemId = clickedItemId;
  document.getElementById('nameDisplay').value = data[selectedItemId].name;
  document.getElementById('valueInput').value = data[selectedItemId].value;
  document.getElementById('editForm').style.display = 'block'; 
  clearMessage();
}

function editItem(event) {
  event.preventDefault();
  if (selectedItemId === null) {
    displayMessage('Please select an item to edit.', 'danger');
    return;
  }
  const newValue = document.getElementById('valueInput').value;
  updateItemValue(newValue);
  displayMessage('Item updated successfully.', 'success');
  saveDataToLocalStorage();
}

messageTimeoutId = setTimeout(() => {
  messageElement.style.display = 'none';
}, 5000);

function clearMessage() {
  const messageElement = document.getElementById('errorMessage');
  messageElement.style.display = 'none';
}

function displayMessage(message, type) {
  const messageElement = document.getElementById('errorMessage');
  messageElement.textContent = message;
  messageElement.className = `alert alert-${type} mt-3`;
  messageElement.style.display = 'block';
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
  }
  messageTimeoutId = setTimeout(() => {
    clearMessage();
  }, 3000);
}


function updateItemValue(newValue) {
  data[selectedItemId].value = newValue;
  populateItemList();
}

function updateSortOrderAndButton(sortOrder, buttonId, text) {
  sortOrder = sortOrder === 0 ? 1 : -sortOrder;
  document.getElementById(buttonId).textContent = `${text} ${sortOrder === 1 ? '▲' : '▼'}`;
  return sortOrder;
}

function sortItems(type) {
  if (type === 'name') {
    nameSortOrder = updateSortOrderAndButton(nameSortOrder, 'sortByName', 'Sort by Name');
    valueSortOrder = 0;
    document.getElementById('sortByValue').textContent = 'Sort by Value';
  } else if (type === 'value') {
    valueSortOrder = updateSortOrderAndButton(valueSortOrder, 'sortByValue', 'Sort by Value');
    nameSortOrder = 0;
    document.getElementById('sortByName').textContent = 'Sort by Name';
  }
  data.sort((a, b) => (type === 'name' ? nameSortOrder : valueSortOrder) * a[type].localeCompare(b[type]));
  populateItemList();
}

function filterItems() {
  const filterValue = document.getElementById('filter').value.toLowerCase();
  const filteredData = data.filter(item => (item.name + item.value).toLowerCase().includes(filterValue));
  populateItemList(filteredData);
}

function clearFilter() {
  document.getElementById('filter').value = '';
  populateItemList();
}

function closeEditForm(event) {
  event.preventDefault();
  document.getElementById('editForm').style.display = 'none';
  clearMessage(); 
}

function switchView(view) {
  const itemList = document.getElementById('itemList');
  if (view === 'list') {
    itemList.classList.remove('row');
    itemList.classList.add('list-group'); 
  } else if (view === 'grid') {
    itemList.classList.add('row'); 
    itemList.classList.remove('list-group'); 
  }
  populateItemList(); 
}

