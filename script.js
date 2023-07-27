let data = [
  { name: "foo1", value: "bar1" },
  { name: "foo2", value: "bar2" },
  { name: "foo3", value: "bar3" },
  { name: "foo4", value: "bar4" },
  { name: "foo5", value: "bar5" },
  { name: "foo6", value: "bar6" },
  { name: "foo7", value: "bar7" },
  { name: "foo8", value: "bar8" },
  { name: "foo9", value: "bar9" },
  { name: "foo10", value: "bar10" },
  { name: "foo11", value: "bar11" },
  { name: "foo12", value: "bar12" },
  { name: "foo13", value: "bar13" },
  { name: "foo14", value: "bar14" },
  { name: "foo15", value: "bar15" },
  { name: "foo16", value: "bar16" },
  { name: "foo17", value: "bar17" },
  { name: "foo18", value: "bar18" },
  { name: "foo19", value: "bar19" },
  { name: "foo20", value: "bar20" }
];

let selectedItemId = null;
let nameSortOrder = 0; // 0: no sort, 1: A-Z, -1: Z-A
let valueSortOrder = 0; // 0: no sort, 1: A-Z, -1: Z-A

window.onload = function() {
  populateItemList();
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
  document.getElementById('listViewButton').addEventListener('click', switchToListView);
  document.getElementById('gridViewButton').addEventListener('click', switchToGridView);

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
  if (event.target.classList.contains('list-group-item')) {
    const clickedItemId = Number(event.target.value);
    selectedItemId = clickedItemId;
    document.getElementById('nameDisplay').value = data[selectedItemId].name;
    document.getElementById('valueInput').value = data[selectedItemId].value;
    document.getElementById('editForm').style.display = 'block'; 
  }
}


function editItem(event) {
  event.preventDefault();
  const messageElement = document.getElementById('errorMessage');
  if (selectedItemId === null) {
    messageElement.textContent = 'Please select an item to edit.';
    messageElement.className = 'alert alert-danger mt-3';
    messageElement.style.display = 'block';
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
    return;
  }
  const newValue = document.getElementById('valueInput').value;
  data[selectedItemId].value = newValue;
  populateItemList();
  messageElement.textContent = 'Item updated successfully.';
  messageElement.className = 'alert alert-success mt-3';
  messageElement.style.display = 'block';
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
}

function sortItems(type) {
  if (type === 'name') {
    nameSortOrder = nameSortOrder === 0 ? 1 : -nameSortOrder;
    data.sort((a, b) => nameSortOrder * a.name.localeCompare(b.name));
    document.getElementById('sortByName').textContent = `Sort by Name ${nameSortOrder === 1 ? '▲' : '▼'}`;
    valueSortOrder = 0;
    document.getElementById('sortByValue').textContent = 'Sort by Value';
  } else if (type === 'value') {
    valueSortOrder = valueSortOrder === 0 ? 1 : -valueSortOrder;
    data.sort((a, b) => valueSortOrder * a.value.localeCompare(b.value));
    document.getElementById('sortByValue').textContent = `Sort by Value ${valueSortOrder === 1 ? '▲' : '▼'}`;
    nameSortOrder = 0;
    document.getElementById('sortByName').textContent = 'Sort by Name';
  }
  populateItemList();
}

function filterItems() {
  const filterValue = document.getElementById('filter').value.toLowerCase();
  const filteredData = data.filter(item => item.name.toLowerCase().includes(filterValue) || item.value.toLowerCase().includes(filterValue));
  populateItemList(filteredData);
}

function clearFilter() {
  document.getElementById('filter').value = '';
  populateItemList();
}

function closeEditForm(event) {
  event.preventDefault();
  document.getElementById('editForm').style.display = 'none';
}

function switchToListView() {
  const itemList = document.getElementById('itemList');
  itemList.classList.remove('row');
  itemList.classList.add('list-group'); 
  populateItemList(); 
}

function switchToGridView() {
  const itemList = document.getElementById('itemList');
  itemList.classList.add('row'); 
  itemList.classList.remove('list-group'); 
  populateItemList(); 
}
