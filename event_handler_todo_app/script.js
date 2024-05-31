//aggiungere al todo delle coordinate in modo che quando visualizzo todo ho anche un lugo.
//quando visualizzo todo vedo nome end ecc poi vedo immagine e nome di un luogo. e appare come un link.
//se clicco su link mi si apre pagina o in basso nella pagina sezione e vedo mappa con marker sul luogo

document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoEndTime = document.getElementById("todo-endtime");
  const todoArea = document.getElementsByName("todo-area"); //array di radio buttonss
  const todoLat = document.getElementById("lat");
  const todoLng = document.getElementById("lng");
  const todoMap = document.getElementById("map");

  let map;
  let marker;
  
  const initializeMap = (lat, lng) => {
    if (!map) {
        map = L.map(todoMap).setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        marker = L.marker([lat, lng]).addTo(map);
    } else {
        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]);
    }
    todoMap.style.display = 'block';
    map.invalidateSize();
};

  const addTodo = (task, date, area, lat, lng, creationDate) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const taskText = document.createElement("span");
    taskText.textContent = task;

    const taskTextDate = document.createElement("span");
    taskTextDate.textContent = `Due date: ${new Date(
      date
    ).toLocaleDateString()}`;

    const taskCreationDate = document.createElement("span");

    if (!creationDate) {
      taskCreationDate.textContent = `Start date: ${new Date().toLocaleDateString()}`;
    } else {
      taskCreationDate.textContent = `Start date: ${new Date(
        creationDate
      ).toLocaleDateString()}`;
    }

    const taskImg = document.createElement("img");
    taskImg.src = `../images/${area}_icon.png`;

    const mapImg = document.createElement("img");
    mapImg.src = `../images/map_icon.png`;
    mapImg.alt = "Map icon";
    mapImg.addEventListener("click", () => initializeMap(lat, lng));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      todoList.removeChild(li);
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      const editTextInput = document.createElement("input");
      editTextInput.type = "text";
      editTextInput.value = taskText.textContent;
      todoMap.style.display = 'none';

      const editDateInput = document.createElement("input");
      editDateInput.type = "date";
      editDateInput.value = date.split("T")[0];

      const editAreaInputs = document.createElement("span");
      editAreaInputs.innerHTML = `
            <input type="radio" id = "eOffice" name = "edit-todo-area" value = "office">
            <label for="office">Work</label>
            <input type="radio" id = "eMental" name = "edit-todo-area" value = "mental">
            <label for="mental">Mental wellness</label>
            <input type="radio" id = "eFitness" name = "edit-todo-area" value = "fitness">
            <label for="fitness">Fitness</label>
            `;

       const editCoordinatesInputs = document.createElement("span");
       editCoordinatesInputs.innerHTML = `
        <input type="number" id="eLat" step="any" placeholder="latitudine" required>
        <input type="number" id="eLng" step="any" placeholder="longitudine" required>
       `

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", () => {
        if (editTextInput.value.trim()) {
          taskText.textContent = editTextInput.value.trim();
          taskTextDate.textContent = `Due date: ${new Date(
            editDateInput.value
          ).toLocaleDateString()}`;
        }
        const editTodoArea = document.getElementsByName("edit-todo-area");
        let checkedButton = null;
        for (const area of editTodoArea) {
          if (area.checked) {
            checkedButton = area;
          }
        }
        if (checkedButton) {
          taskImg.src = `../images/${checkedButton.value}_icon.png`;
        } else {
          console.error("Nessun radio button selezionato");
        }
        const editLat = document.getElementById("eLat");
        const editLng = document.getElementById("eLng");

        const lat = editLat.value;
        const lng = editLng.value;
        if(lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180){
            initializeMap(lat, lng);
        } else {
            alert("Inserisci delle coordinate valide");
            return;
        }
        li.replaceChild(taskText, editTextInput);
        li.replaceChild(taskTextDate, editDateInput);
        li.replaceChild(taskImg, editAreaInputs);
        li.replaceChild(mapImg, editCoordinatesInputs);
        li.replaceChild(editButton, saveButton);
      });
      li.replaceChild(editTextInput, taskText);
      li.replaceChild(editDateInput, taskTextDate);
      li.replaceChild(editAreaInputs, taskImg);
      li.replaceChild(editCoordinatesInputs, mapImg);
      li.replaceChild(saveButton, editButton);
    });

    li.appendChild(taskText);
    li.appendChild(taskCreationDate);
    li.appendChild(taskTextDate);
    li.append(taskImg);
    li.append(mapImg);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  };

  doAjaxGetRequest("data.json");


  function doAjaxGetRequest(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = () => {
      let todos = JSON.parse(xhr.responseText);
      todos.forEach((todo) => {
        addTodo(
            todo.taskText,
            todo.taskTextDate,
            todo.taskArea,
            todo.lat,
            todo.lng,
            todo.taskCreationDate
          );
      });
    };
    xhr.send();
  }

  /*Mettere di fianco alla data della scadenza la specifica (data della scadenza) e mettere una seconda data(data di creazione) con 
    l'equivalente specifica*/

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newTask = todoInput.value.trim();
    const newEndDate = todoEndTime.value;
    let checkedButton = null;
    for (const area of todoArea) {
      if (area.checked) {
        checkedButton = area;
      }
    }
    const lat = todoLat.value;
    const lng = todoLng.value;
    if (newTask && new Date(newEndDate) >= new Date() && checkedButton && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        addTodo(newTask, newEndDate, checkedButton.value, lat, lng);
        todoInput.value = "";
        todoEndTime.value = "";
        checkedButton.checked = false;
        todoLat.value = "";
        todoLng.value = "";
      } else {
        alert("Metti i valori dei campi correttamente!!");
      }
  });
});
