const state = {};
state.username = "123";

class Tasks{
	
	constructor(num = 0){
		
		this.tasks = [];
		this.num = num;
	}

	addTask(taskText, strike = false, date = new Date()){
		
		this.num += 1;
		const newTask = {
			id: this.num,
			text: taskText,
			striked: strike,
			date: date
		};

		this.tasks.push(newTask);
		return newTask;
	}

	deleteTask(id){
		const del_index = this.tasks.findIndex((el) => {
			if((el.id) === id) return true;
		});
		if(del_index > -1) this.tasks.splice(del_index, 1);
		else alert(`id doesn't exist`);
	}

	toggle_strike(id){

		this.tasks.forEach((ele) => {
			if(ele.id === id){
				ele.striked = !ele.striked;
			}
		});
	}
}




const extractTask = () => {
	const taskText = document.querySelector('.input__task').value;
	return taskText;
};

const clearInput = () => {
	document.querySelector('.input__task').value = '';
};

const renderTask = (newTask) => {
	let test = `<strike>${newTask.text}</strike>`;
	const markup_task = `
			<li class="todo__item" data-id="${newTask.id}">
                    <p class="todo__description">${newTask.striked ? test : newTask.text}</p>
      				<button type="button" class="todo__comp ${newTask.striked ? ' todo__comp--clicked"':'"'}>${newTask.striked ? 'Undo': 'Complete'}</button>
                    <button type="button" class="todo__delete btn-tiny" >
              		X
                    </button>
            </li>
	`;
	document.querySelector('.todo__list').insertAdjacentHTML('beforeend', markup_task);
}


if(localStorage.getItem(state.username)){
		
		const values =  JSON.parse(localStorage.getItem(state.username)).tasks;
		state.tasks = new Tasks();
		values.forEach((el, i) => {
		state.tasks.addTask(values[i].text, values[i].striked, values[i].date);
		});
		clearInput();
		state.tasks.tasks.forEach((ele) => {
			renderTask(ele);
		});

}else {
		state.tasks = new Tasks();
}

const controlTasks = () => {
	
	// 1. Extract the task from UI
	const taskText = extractTask();

	// 2. Add task to tasks DS
	const newTask = state.tasks.addTask(taskText);

	// 3. Prepare the UI
	clearInput();

	//4. Add task to UI
	renderTask(newTask);

};

document.querySelector('.task__btn--add').addEventListener('click', (e) => {
	
			controlTasks();
			e.preventDefault();
			e.stopPropagation();
	});

	document.querySelector('.todo__list').addEventListener('click', (e) => {
		if(e.target.matches('.todo__delete'))
		{
			const id_to_del = parseInt(e.target.parentElement.dataset.id);
		
			// 1. delete from tasks  DS
			state.tasks.deleteTask(id_to_del);

			// 2. delete from UI
			const task_to_dele = document.querySelector(`[data-id="${id_to_del}"]`);
			task_to_dele.parentElement.removeChild(task_to_dele); 
			
		}

		if(e.target.matches('.todo__comp')){
			const id_toggle = parseInt(e.target.parentElement.dataset.id);
			if(e.target.innerHTML == 'Complete'){
				
				const task_ele = e.target.parentElement.childNodes[1];
				task_ele.innerHTML = `<strike>${task_ele.innerHTML}</strike>`;
				e.target.classList.add('todo__comp--clicked');
				e.target.innerHTML = 'Undo';
				state.tasks.toggle_strike(id_toggle);
			}
			else {
				const task_ele = e.target.parentElement.childNodes[1];
				const start_index = task_ele.innerHTML.indexOf('>');
				const end_index = task_ele.innerHTML.indexOf('</strike>');
				task_ele.innerHTML = task_ele.innerHTML.slice(start_index + 1, end_index);
				e.target.classList.remove('todo__comp--clicked');
				e.target.innerHTML = 'Complete';
				state.tasks.toggle_strike(id_toggle);
				
			}
		}
	});

window.addEventListener('unload', (e) => {
	if(state.tasks.tasks.length) localStorage.setItem(state.username, JSON.stringify(state.tasks));
	else if(localStorage.getItem("123"))	localStorage.removeItem("123");
});

document.querySelector('.task__btn--clear').addEventListener('click', (e) => {
	if(state.tasks.tasks.length) 
	{
		state.tasks.tasks = [];
		document.querySelector('.todo__list').innerHTML = '';
	}
});

document.querySelector('.task__btn--alphSort').addEventListener('click', (e) => {
	const newOrder = state.tasks.tasks.map((ele) => ele.text).sort();
	const newTaskArr = []; 
	state.tasks.tasks.forEach((ele) => {
		newTaskArr[newOrder.indexOf(ele.text)] = ele;
	});
	
	state.tasks.tasks = newTaskArr;

	document.querySelector('.todo__list').innerHTML = '';
	state.tasks.tasks.forEach((ele) => {
		renderTask(ele);
	});
});

document.querySelector('.task__btn--timeSort').addEventListener('click', (e) => {
	let newOrder = state.tasks.tasks.map((ele) => {return (new Date(ele.date)).getTime()}).sort((a,b) => {return (a - b)});
	const newTaskArr = [];

	state.tasks.tasks.forEach((ele) => {
		newTaskArr[newOrder.indexOf(new Date(ele.date).getTime())] = ele;
		//console.log();
		//console.log(new Date(ele.date));
	});

	//console.log(newTaskArr);
	
	state.tasks.tasks = newTaskArr;

	document.querySelector('.todo__list').innerHTML = '';
	state.tasks.tasks.forEach((ele) => {
		renderTask(ele);
	});
});

	


