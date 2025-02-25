import { Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import login from "./pages/login"
import register from "./pages/register"


function App() {

  return (
    <>
      <div>
        {/* <Routes>
          <Route path="/" element ={ <Home />} />
          <Route path="/login" element ={ <login />} />
          <Route path="/register" element ={ <register />} />

        </Routes> */}
      <h1>
          Get to work!   
      </h1>
      <Home />
      
      
      </div>
      
    </>
  )
}

export default App
