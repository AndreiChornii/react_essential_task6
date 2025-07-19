import Item from "./Item";

export default function List({tasks}){
    // console.log('tasksInList:',tasks);
    return (
        <ul>
            {tasks.map(item => <Item key={item.id} {...item} />)}
        </ul>
    )
}
