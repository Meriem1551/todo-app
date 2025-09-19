import './index.css';
import { ColorModeButton } from "./components/ui/color-mode"
import { Flex, Spacer, Box, Input, Grid, Heading, Separator, Checkbox, Button, Text} from "@chakra-ui/react"
import { useState, useEffect } from 'react';

type Task = {
  id: number,
  title:string,
  done:boolean
}


function App() {
const [query, setQuery] = useState("")
const [tasks, setTasks] = useState<Task[]>([])
const [items, setItems] = useState(0);
const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value)
}

useEffect(() => {
  const storedTasks:string | null = localStorage.getItem("tasks");
  if(storedTasks){
    const tasks: Task[] = JSON.parse(storedTasks)
    if(filter === "all"){
       setTasks(tasks)
    }
    else if (filter === "active") {
      setTasks(tasks.filter(task => !task.done))
    }
    else {
      setTasks(tasks.filter(task => task.done))
    }
  }
},[filter])


useEffect(() => {
  setItems(tasks.filter(task =>!task.done).length)
}, [tasks])

const handleChecked = (id: number) => {
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks)); 
  };
const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
       const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
      const newTask:Task = {id:newId, title:query, done:false};
      const newTasks = [...tasks, newTask]
      setTasks(newTasks)
      setQuery("")
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    }
}

const handleClear = () => {
  const activeTasks:Task[] = tasks.filter(task => !task.done)
  setTasks(activeTasks)
  localStorage.setItem("tasks", JSON.stringify(activeTasks));
  setFilter("all")
}

return (
    <Box h="dvh" bgRepeat="no-repeat" bgImage={{base:"url(/images/bg-desktop-dark.jpg)", _dark:"url(/images/bg-desktop-light.jpg)"}} bgColor={{ base: "gray.700", _dark: "white" }} p="50px" display="flex"
  justifyContent="center"
  alignItems="flex-start">
      <Grid w={{ base: "90%", md: "600px" }} gap="20px">
          <Flex>
            <Heading size="3xl" color="white">TODO</Heading>
            <Spacer/>
            <ColorModeButton />
          </Flex>
          <Input 
          placeholder='Create a new todo...' 
          color={{base:"white", _dark:"gray.500"}} 
          bgColor={{base:"gray.700", _dark:"white"}} 
          border="none" 
          fontWeight="semiBold" 
          p="20px" value={query} 
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          />
          {tasks.length > 0 ?
          <Grid bgColor={{base: "gray.700", _dark:"white"}} borderRadius="md"  boxShadow="md">
            <Box as="ul">
              {tasks.map((task) => {
                return (
                  <>
                    <Checkbox.Root key={task.id} size="sm" p="20px" checked={task.done} onChange={() => handleChecked(task.id)} borderRadius="full" colorPalette="purple">
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize="16px" color={task.done ? "gray.400" : {base: "white", _dark:"gray.700"}} textDecoration={task.done ? "line-through" : "none"}>{task.title}</Checkbox.Label>
                    </Checkbox.Root>
                  <Separator borderColor="gray.200" size="sm"/>
                  </>
                )
              })}
            </Box>
            <Flex p="10px" alignItems={{base:"start", md:"center"}} direction={{base: "column", md:"row"}}>
              <Text fontSize={{base:"12px", md:"14px"}} color={{base: "white", _dark:"gray.500"}}>{items} items left</Text>
              <Spacer/>
              <Button fontSize={{base:"12px", md:"14px"}} color={filter==="all"? "blue.emphasized" : {base: "white", _dark:"gray.500"}} bgColor="transparent"  _hover={{color:"blue.emphasized"}} onClick={() => setFilter("all")}>All</Button>
              <Button fontSize={{base:"12px", md:"14px"}} color={filter==="active"? "blue.emphasized" : {base: "white", _dark:"gray.500"}} bgColor="transparent"  _hover={{color:"blue.emphasized"}} onClick={() => setFilter("active")}>Active</Button>
              <Button fontSize={{base:"12px", md:"14px"}} color={filter==="completed"? "blue.emphasized" : {base: "white", _dark:"gray.500"}} bgColor="transparent"  _hover={{color:"blue.emphasized"}} onClick={() => setFilter("completed")}>Completed</Button>
              <Spacer/>
              <Button fontSize={{base:"12px", md:"14px"}} color={{base: "white", _dark:"gray.500"}} bgColor="transparent"  _hover={{color:"blue.emphasized"}} onClick={handleClear}>Clear Completed</Button>
            </Flex>
          </Grid> : <p>No tasks for no, yay!!!</p>}
      </Grid>
    </Box>
  )
}

export default App
