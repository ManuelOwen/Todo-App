// Mock data for demonstratio
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(
      "https://64b6b8aadf0839c97e16081a.mockapi.io/todos"
    );
    const tasks = await response.json();
  
    const taskContainer = document.getElementById("taskContainer");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const filterTasks = document.getElementById("filterTasks");
    const newTaskInput = document.getElementById("newTaskInput");
  
    // Function to display tasks
    function displayTasks(filter = "all") {
      taskContainer.innerHTML = "";
      const filteredTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      });
  
      filteredTasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = `task ${task.completed ? "completed" : ""}`;
        taskElement.innerHTML = `
                  <div>
                      <input type="checkbox" ${
                        task.completed ? "checked" : ""
                      } data-id="${task.id}">
                      <span>${task.title}</span>
                      <small>${task.time}</small>
                  </div>
                  <div class="task-controls">
                      <button data-id="${task.id}" class="edit">✎</button>
                      <button data-id="${task.id}" class="delete">✗</button>
                  </div>
              `;
        taskContainer.appendChild(taskElement);
      });
    }
  
    // Initial display of tasks
    await displayTasks();
  
    // Add task button event
    addTaskBtn.addEventListener("click", () => {
      const newTaskTitle = newTaskInput.value.trim();
      if (newTaskTitle) {
        const newTask = {
          id: tasks.length + 1,
          title: newTaskTitle,
          time: new Date().toLocaleString(),
          completed: false,
        };
        tasks.push(newTask);
        newTaskInput.value = ""; // Clear input field
  
        // add data to api
        fetch("https://64b6b8aadf0839c97e16081a.mockapi.io/todos", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(newTask),
        }).then((res, err) => {
          if (err) {
            console.log(err);
          }
          console.log(newTask);
          console.log("Item created successfully");
        });
  
        console.log(newTask);
        displayTasks(filterTasks.value);
      }
    });
  
    // Filter tasks event
    filterTasks.addEventListener("change", (e) => {
      displayTasks(e.target.value);
    });
  
    // Event delegation for task actions
    taskContainer.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.className === "edit") {
        const newTitle = prompt("Edit task:");
        if (newTitle) {
          e.target.parentElement.previousElementSibling.children[1].textContent =
            newTitle;
          const response = await fetch(
            `https://64b6b8aadf0839c97e16081a.mockapi.io/todos/${id}`,
            {
              method: "PUT",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ title: newTitle }),
            }
          );
        }
      } else if (e.target.className === "delete") {
        const taskIndex = tasks.findIndex((task) => task.id === id);
        tasks.splice(taskIndex, 1);
        displayTasks(filterTasks.value);
  
        fetch(`https://64b6b8aadf0839c97e16081a.mockapi.io/todos/${id}`, {
          method: "DELETE",
        }).then((res, err) => {
          if (err) {
            console.log(err);
          }
          console.log("Item deleted succesfully");
        });
      } else if (e.target.type === "checkbox") {
        fetch(`https://64b6b8aadf0839c97e16081a.mockapi.io/todos/${id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ completed: e.target.checked }),
        }).then((res) => {
          res.json().then((update) => {
            e.target.checked = update.completed;
            if (e.target.checked) {
              e.target.parentElement.style.color = " #ccc";
              e.target.parentElement.style.textDecoration = "line-through";
            } else {
              e.target.parentElement.style.color = "black";
              e.target.parentElement.style.textDecoration = "none";
            }
          });
        });
      }
    });
  });
  