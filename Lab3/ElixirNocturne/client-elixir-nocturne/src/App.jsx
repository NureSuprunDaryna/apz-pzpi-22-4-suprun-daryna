import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import ElixirsList from './pages/Elixirs/List';
import ElixirCreate from './pages/Elixirs/Create';
import ElixirEdit from './pages/Elixirs/Edit';
import ElixirDetail from './pages/Elixirs/Detail';
import ElixirDelete from './pages/Elixirs/Delete';
import FavoritesList from './pages/Favorites/List';
import Profile from './pages/Profile/Index';
import EditProfile from './pages/Profile/EditProfile';

function App() {
    return (
        <>
            <Navbar /> 
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/elixirs" element={<ElixirsList />} />
                <Route path="/elixirs/create" element={<ElixirCreate />} />
                <Route path="/elixirs/:id/edit" element={<ElixirEdit />} />
                <Route path="/elixirs/:id" element={<ElixirDetail />} />
                <Route path="/elixirs/:id/delete" element={<ElixirDelete />} />
                <Route path="/favorites" element={<FavoritesList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />

            </Routes>
        </>
    );
}

export default App;
