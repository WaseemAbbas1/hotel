import './App.scss';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"
// components
import Routes from "./pages/Routes"
import Loader from "./components/Loader"
// context
import { useAuthContext } from './context/AuthContext';
function App() {
  const {isAppLoading}=useAuthContext()
  return (
    <>
      {isAppLoading?<Loader/>
      :<Routes/>
      }
    </>
  );
}

export default App;
