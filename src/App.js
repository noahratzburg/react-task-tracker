import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header.js'
import Tasks from './components/Tasks.js'
import AddTask from './components/AddTask.js'
import Footer from './components/Footer.js'
import About from './components/About.js'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([
    
  ])

/* Method is used when webpage first loads. Fetches the tasks from server and sets state of front end. */
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

/* Fetches all tasks from server and converts to json object */
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    
    return data
  }
/* Fetches task of given id from server and converts to json object */ 
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    
    return data
  }
/* Deletes task of given id from server */
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { 
      method:'DELETE' 
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

/* Toggles the reminder of a task with given id */
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
  }

/* Adds a task to the server. */
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])
  }

  return (
    <Router>
      <div className="container">
        <Header 
          onAdd={() => setShowAddTask(!showAddTask)} 
          showAddTask={showAddTask} 
        />
        <Routes>
          <Route path='/' 
                element={
                  <>
                  { showAddTask && (<AddTask onAdd={ addTask }/>)}
                  { tasks.length > 0 ? 
                    (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />)
                  : 
                    ('No Tasks To Show')
                  }
                </>
                }
                />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
