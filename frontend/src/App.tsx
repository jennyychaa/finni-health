import { Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import EditPatientForm from './pages/EditPatientForm';
import Error from './pages/Error';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/patient/add' element={<AddPatient />} />
      <Route path='/patient/:patientId' element={<EditPatient />} />
      <Route path='/patient/form' element={<EditPatientForm />} />
      <Route path='*' element={<Error />} />
    </Routes>
  );
}

export default App;
