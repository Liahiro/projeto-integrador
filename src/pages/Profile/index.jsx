import { useEffect, useState } from 'react';

import {Link} from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {users} from '../../axios/config'
import functions from '../../functions';

function Profile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [dataUser, setDataUser] = useState([])

    const isLogged = useSelector(state => state.isLogged)

    const getDataUser = async (idUser) => {
    const url = `/users/${idUser}`
        await users.get(url)
            .then(resp => setDataUser(resp.data))
            .catch(err => console.log(err))


    }

    useEffect(() =>{
        if(!isLogged){
            navigate('/login')
        }
        
        const idUser = JSON.parse(localStorage.getItem("idUser"))
        getDataUser(idUser)
    },[])


    return (
        <>
           <div>
                <h2>{dataUser.name}</h2>
                
           </div>

            <button onClick={() =>{
                dispatch({type: 'LOGOUT'})
                navigate('/login')
            }}>Sair</button>
        </>
    );
}

export default Profile;