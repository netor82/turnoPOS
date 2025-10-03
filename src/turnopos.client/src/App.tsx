import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import DepartmentManagement from './pages/DepartmentManagement'
import InventoryManagement from './pages/InventoryManagement'
import NewOrder from './pages/NewOrder';
import { useEffect, useState } from 'react';
import type Department from './models/Department';
import departmentService from './services/DepartmentService';
import DepartmentsContext from './contexts/DepartmentsContext';

function App() {
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        fetchDepartments();
    }, [])

    const fetchDepartments = async () => {
        await departmentService.getAll()
            .then(data => {
                setDepartments(data);
            })
            .catch(e => console.error(e));
    };

    return (
        <div>
            <Router>
                <Menu />
                <DepartmentsContext value={departments}>
                    <Routes>
                        <Route path="/departments" element={<DepartmentManagement onChange={fetchDepartments} />} />
                        <Route path="/inventory" element={<InventoryManagement />} />
                        <Route path="/" element={<NewOrder />} />
                    </Routes>
                </DepartmentsContext>
            </Router>
        </div>
    );
}

export default App;