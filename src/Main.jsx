import { useState, useEffect } from "react";
import List from "./components/List";
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from './useLocalStorage'; 

function Main(){

    const [tasks, setTasks] = useState(() => {
        const storedTodos = localStorage.getItem('tasks');
        if(!storedTodos){
            return [];
        } else {
            return JSON.parse(storedTodos);
        }
    });

    // const [tasks, setTasks] = useLocalStorage('tasks', () => {
    //         const storedTodos = localStorage.getItem('tasks');
    //         if(!storedTodos){
    //             return [];
    //         } else {
    //             return JSON.parse(storedTodos);
    //         }
    //     });

    const [tasksTitle, setTasksTitle] = useState('');

    // const [tasks, setData] = useLocalStorage('tasks', tasks);

    const [amountOfUnfixedTasks, handleUnfixedTasksChange] = useState([]);


    // console.log(tasks);


    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify([]));
    }, []);
    

    
    useEffect(() => {
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }, [tasks]);

    // useEffect(() => {
    //     window.addEventListener('storage', handleCustomStorageChange);
    // });
    

    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    const tasksTime = hours + ':' + minutes + ':' + seconds ;



    // const handleCustomStorageChange = (event) => {
    //     console.log('handleCustomStorageChange', event);
    // }

    useEffect(()=> {
        let amountOfUnfixedTasks = JSON.parse(localStorage.getItem('tasks')).filter(task => {
            if(!task.status) {
                return true;
            }
            else return false;
        });
        handleUnfixedTasksChange(amountOfUnfixedTasks);

    }, [tasks]);
    

    

    // console.log('tasks', tasks);
    // console.log('amountOfUnfixedTasks', amountOfUnfixedTasks)
    const addTask = (e) => {
        const storedTodos = JSON.parse(localStorage.getItem('tasks'));
        if(e.key === 'Enter' && e.target.value !== '') {
            setTasks([
                ...storedTodos, {
                    id: uuidv4(), 
                    title: tasksTitle, 
                    status: false,
                    time: tasksTime
                }
            ]);
            setTasksTitle('');
        }
    }

    return(
        <div className="container">
            <h1>Note your tasks</h1>
            <span>{month + ' ' + day + ', ' + year}</span>
            <span> | unfixed tasks: {amountOfUnfixedTasks.length}</span>
            <div className="input-field">
                <input type="text" 
                value={tasksTitle}
                onChange={event => setTasksTitle(event.target.value)}
                onKeyDown={addTask}
                />
                <label>Task name</label>
            </div>
            <List tasks={tasks}></List>
        </div>       
    );

    
}

export default Main;