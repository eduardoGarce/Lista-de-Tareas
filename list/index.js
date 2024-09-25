const input = document.querySelector("#input");
const btnAdd = document.querySelector("#btn-add");
const form = document.querySelector("#input-container");
const tasksList = document.querySelector("#list");
const list = document.querySelector('#list');

//validacion que permite activar el btn para agregar la tarea
const checkValidations = () => {
    if (input.value != "") {
        btnAdd.disabled = false;
    } else {
        btnAdd.disabled = true;
    }
}


//creo un evento que se ejecuta cada vez que se detectan cambios en el input
input.addEventListener('input', e => {
    //llamo a la funcion encargada de validar si el input esta vacio
    checkValidations();
})

//esta es una funcion que se encarga de administrar las acciones referentes a las tareas
const manager = () => {
    let tasks = [];
    const publicAPI = {
        getTask: () => {
            return tasks;
        },
        
        addTask: (newTask) => {
            tasks = tasks.concat(newTask);
            console.log('Guardada la tarea');
        },
        
        saveInBrowser: () => {
            localStorage.setItem('taskList', JSON.stringify(tasks));
        },

        replaceTasks: (localTasks) => {
            tasks = localTasks;
        },
        
        renderTasks: ()=> {
            //borrar el contenido de la lista
            tasksList.innerHTML = '';
            // console.log(contacts)+
            
            //1.crear un bucle
            tasks.forEach(tasks => {
                //2.acceder a cada contacto
                // console.log(tasks);
                
                //3 crear un li para cada contacto
                const ListItem = document.createElement('li');
                ListItem.classList.add('list-element');
                ListItem.id = tasks.id;
                
                let btnStatus = '';
                if (tasks.status === 'chequeada') {
                    btnStatus = 'check-btn-status';
                    console.log('si esta chequeada');
                } else {
                    btnStatus = '';
                }
                
                //4 crear la estructurra para cada li
                ListItem.innerHTML = `<button class="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                </button>
                <p class="input-list ${tasks.status}">${tasks.task}</p>
                <button class="check-btn ${btnStatus}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                </button>`;
                
                //5 agregar el li a la ul (como un hijo)
                tasksList.append(ListItem);
            })
        },
        deleteTasks: (id) => {
            tasks = tasks.filter(task => {
                if (id !== task.id) {
                    return task;
                }
            });
        },
        editTask: (editedTask) => {
            tasks = tasks.map(tasks => {
                if (editedTask.id === tasks.id) {
                    return editedTask;
                } else {
                    return tasks;
                }
            })
        },
        //esta funcion se encarga de hacer el conteo y clasificacion de las tareas y ademas se encarga de cambiar el valor de los contadores
        contadorTask: () => {
            let contadorTotal = 0;
            let contadorCheck = 0;
            let contadorNoCheck = 0;
            tasks.forEach(tareas => {
        
                if (tareas.status === 'chequeada') {
                    contadorCheck ++;
                    contadorTotal ++;
                } else {
                    contadorNoCheck ++;
                    contadorTotal ++;
                }
            })
        
            const inputTotal = document.querySelector('#total');
            const inputCheck = document.querySelector('#completed');
            const inputNocheck = document.querySelector('#incompleted');
        
            inputTotal.value = `Total: ${contadorTotal}`;
            inputCheck.value = `Completadas: ${contadorCheck}`;
            inputNocheck.value = `Incompletas: ${contadorNoCheck}`;
        }
    }
    return publicAPI;
}

// ? hago esto sabra Dios por que
const taskManager = manager();

//esta funcion comprueba si la lista esta vacia, childElementCount comprueba la cantidad de hijos que tiene la ul y devuelve un numero 
const displayList = () => {
    if (list.childElementCount === 0) {
        list.style.display = 'none';
    } else {
        list.style.display = 'block';
    }
}

//creo un evento que se ejecuta cada vez que se interacciona con el btn añadir
form.addEventListener('submit', e => {
    //Elimino la funcionalidad por defecto del formulario
    e.preventDefault();

    //creo la nueva tarea
    const newTask = {
        id: crypto.randomUUID(),
        task: input.value,
        status: 'noChequeada'
    }

    //Añado la tarea al array
    taskManager.addTask(newTask);
    
    //Guardo las tareas en el navegador
    taskManager.saveInBrowser();

    //mostrar en el html
    taskManager.renderTasks();

    //llamo a la funcion encargada de comprobar si la ul esta vacia para que la muestre al añadir una tarea
    displayList();
    //llamo a la funcion encargada de hacer el conteo de las tareas y su clasificacion
    taskManager.contadorTask();
})

//funcion para guardar el contacto cuando es chequeado
const chequear = (identification, value, statusCheck) => {
    //Creo la tarea chequeada usando la informacion del html
    const taskEdited = {
        id: identification,
        task: value,
        status: statusCheck
        }
        //Se crea un array con la nueva tarea editada
        taskManager.editTask(taskEdited);
        //Se guarda el array actualizado en el navegador
        taskManager.saveInBrowser();
}

//Este evento se ejecuta cada vez que se detecta un click en la lista de tareas
tasksList.addEventListener('click', e => {
    //Selecciono el boton de eliminar
    //Target es para seleccionar el elemento o div que se esta clickeando
    //Closest es para que al seleccionar cualquier elemento hijo de delete-btn se seleccione directamente delete-btn
    const deleteBtn = e.target.closest('.delete-btn');
    //Lo mismo que lo anterior pero con una clase diferente
    const checkBtn = e.target.closest('.check-btn');

    //Si se cliquea el boton de eliminar se empieza el proceso de eliminar
    if (deleteBtn) {
        //selecciono el li del boton clickeado
        const li = deleteBtn.parentElement;
        //obtengo el id del li seleccionado
        const id = li.id;
        //Se elimina la tarea del array de tareas
        taskManager.deleteTasks(id);
        //Se guarda el array actualizado en el navegador
        taskManager.saveInBrowser();
        //Se renderiza el array sin la tarea eliminada
        taskManager.renderTasks();
        //se llama a la funcion que se encarga de comprobar si la lista esta vacia
        displayList();
        //llamo a la funcion encargada de hacer el conteo de las tareas y su clasificacion
        taskManager.contadorTask();
    }
    if (checkBtn) {
        //Selecciono el li
        const li = checkBtn.parentElement;
        //Selecciono el input
        const taskInput = li.children[1];
        //selecciono el texto que tiene añadido p ya que al no ser un elemento para que el usuario interactue no tiene valor si no contenido
        const valorP = taskInput.textContent;
        
        if (taskInput.classList.contains('chequeada')) {
            taskInput.classList.remove('chequeada');
            checkBtn.classList.remove('check-btn-status');
            //llamo a la funcion encargada de 
            chequear(li.id, valorP,'noChequeada');
            //llamo a la funcion encargada de hacer el conteo de las tareas y su clasificacion
            taskManager.contadorTask();
            
        }else {
            taskInput.classList.add('chequeada');
            checkBtn.classList.add('check-btn-status');
            chequear(li.id, valorP,'chequeada');
            //llamo a la funcion encargada de hacer el conteo de las tareas y su clasificacion
            taskManager.contadorTask();
        }
    }
})

//esta funcion se ejecutara cada vez que se cargue la pagina
window.onload = () => {
    //obtengo las tareas de local storage
    const getTasksLocal = localStorage.getItem("taskList");

    //paso las tareas de json a js
    const  tasksLocal = JSON.parse(getTasksLocal);

    if (!tasksLocal) {
        //Reemplazo las tareas con un array vacio
        taskManager.replaceTasks([]);
    }else {
        //reemplazo el array de tareas guardados en el navegador
        taskManager.replaceTasks(tasksLocal);
    }

    //muestro las tareas en el html
    taskManager.renderTasks();

    //llamo a la funcion encargada de comprobar si la ul esta vacia
    displayList();

    //llamo a la funcion encargada de hacer el conteo de las tareas y su clasificacion
    taskManager.contadorTask();
}