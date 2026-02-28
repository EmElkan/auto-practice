import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SimpleForm from './pages/SimpleForm'
import CheckboxesRadios from './pages/CheckboxesRadios'
import Login from './pages/Login'
import LoadingStates from './pages/LoadingStates'
import ProtectedPage from './pages/ProtectedPage'
import DragDrop from './pages/DragDrop'
import DataTables from './pages/DataTables'
import Modals from './pages/Modals'
import NetworkMocking from './pages/NetworkMocking'
import VisualTesting from './pages/VisualTesting'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="challenges/simple-form" element={<SimpleForm />} />
        <Route path="challenges/checkboxes-radios" element={<CheckboxesRadios />} />
        <Route path="challenges/login" element={<Login />} />
        <Route path="challenges/loading-states" element={<LoadingStates />} />
        <Route path="challenges/protected" element={<ProtectedPage />} />
        <Route path="challenges/drag-drop" element={<DragDrop />} />
        <Route path="challenges/data-tables" element={<DataTables />} />
        <Route path="challenges/modals" element={<Modals />} />
        <Route path="challenges/network-mocking" element={<NetworkMocking />} />
        <Route path="challenges/visual-testing" element={<VisualTesting />} />
      </Route>
    </Routes>
  )
}

export default App
