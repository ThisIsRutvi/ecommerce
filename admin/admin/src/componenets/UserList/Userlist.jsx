import React,{useEffect,useState} from 'react'
import './Userlist.css'

const Userlist = () => {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/userlist', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const contentType = response.headers.get('content-type');

            if (response.ok) {
                if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setUsers(data.users);
            } else {
                console.error('Unexpected content-type:', contentType);
                setError('Unexpected content-type from server.');
            }
            
            } else {
                const errorText = await response.text(); 
            console.error('Error Response:', errorText);
            setError(`Failed to fetch users. Server responded with: ${errorText}`);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data: ' + error.message);
        }
    };

    return (
        <div className='userli'>
            
            <h1>User List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table className='utb' border="1">
                <thead className='thed'>
                    <tr className='uth' >
                        <th >Name</th>
                        <th >Email</th>
                        <th >Password</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr className='uthd'  key={user.email}>
                                <td >{user.name}</td>
                                <td >{user.email}</td>
                                <td >{user.password}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}

export default Userlist
