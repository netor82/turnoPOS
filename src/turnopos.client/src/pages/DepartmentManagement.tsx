import React, { useContext, useState } from 'react';
import EditDepartment from '../components/department/Edit';
import departmentService from '../services/DepartmentService';
import DepartmentsContext from '../contexts/DepartmentsContext';

type DepartmentManagementProps = {
    onChange: () => void;
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ onChange }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [newDepartmentName, setNewDepartmentName] = useState<string>('');
    const [adding, setAdding] = useState<boolean>(false);
    const departments = useContext(DepartmentsContext);

    async function handleOnChange() {
        setLoading(true);
        onChange();
        setLoading(false);
    }

    async function addDepartment() {
        if (!newDepartmentName.trim()) return;
        setAdding(true);
        departmentService.create({ name: newDepartmentName })
            .then(async () => {
                onChange();
                setNewDepartmentName('');
            })
            .catch(e => console.error(e));
        setAdding(false);
    }

    const addForm = <div style={{ marginBottom: '1rem' }}>
        <input
            type="text"
            placeholder="Nuevo departamento"
            value={newDepartmentName}
            onChange={e => setNewDepartmentName(e.target.value)}
            disabled={adding}
        />
        <button onClick={addDepartment} disabled={adding || !newDepartmentName.trim()}>
            {adding ? 'Agregando...' : 'Agregar'}
        </button>
    </div>;

    const listOfItems = loading ? (
        <p>Cargando...</p>
    ) : (
        <ul>
            {departments.map((dept) => (
                <li key={dept.id}><EditDepartment entity={dept} onChanged={handleOnChange} /></li>
            ))}
        </ul>
    )

    return (
        <div>
            <h1>Departamentos de Distribución</h1>
            {addForm}
            {listOfItems}
        </div>
    );
};

export default DepartmentManagement;