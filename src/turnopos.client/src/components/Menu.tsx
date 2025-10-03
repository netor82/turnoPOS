import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">🏠</Link>
                </li>
                <li><Link to="/departments">Departamentos</Link></li>
                <li><Link to="/inventory">Inventario</Link></li>
            </ul>
        </nav>
    );
};

export default Menu;