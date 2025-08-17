import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { BACK_BUTTON, FULL_BUTTON, INPUT_WRAPPER, Inputwrapper, personalFields, SECTION_WRAPPER } from '../assets/dummyData';
import { ChevronLeft, Save, Shield, UserCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000'

const Profile = ({ setCurrentUser, onLogout, user }) => {

    const [profile, setProfile] = useState({ name: '', email: '' });

    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token) return
        axios.get(`${API_URL}/api/user/me`, {
            headers:{Authorization:`Bearer ${token}`}
        })
        .then(({data})=>{
            if(data.success){
                setProfile({name:data.user.name, email:data.user.email})
            }else{
                toast.error(data.message)
            }
        }).catch((error)=>{
            toast.error(error.message)
        })
    },[])

    const saveProfile=async(e)=>{
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            const{data} = await axios.put(`${API_URL}/api/user/profile`,{name:profile.name, email:profile.email},{
                headers:{
                    Authorization : `Bearer ${token}`
                }
            })
            if(data.success){
                setCurrentUser((prev)=>({
                    ...prev,
                    name:profile.name,
                    email:profile.email
                }))
                toast.success('profile update successfully');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <ToastContainer position='top-center' autoClose={3000} />
            <div className='max-w-4xl mx-20 p-6 '>
                <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
                    <ChevronLeft className='w-5 h-5 mr-1' />
                    Back To Dashboard
                </button>
                <div className='flex items-center gap-4 mb-8'>
                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md '>
                        {profile.name ? profile.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 className='text-3xl font-bold text-gray-800 '>Account Settings</h2>
                        <p className='text-gray-500 text-sm'>Manage Your Profile and Secure settings.</p>
                    </div>
                </div>
                <div className='grid md:grid-cols-2 gap-8 '>
                    <section className={SECTION_WRAPPER}>
                        <div className='flex items-center gap-2 mb-6 '>
                            <UserCircle className='text-purple-500 w-5 h-5 ' />
                            <h2 className='text-sm font-semibold text-gray-800 '>Personal Information</h2>
                        </div>
                        {/* personal information */}
                        <form onSubmit={saveProfile} className='space-y-4'>
                            {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                                <div key={name} className={INPUT_WRAPPER}>
                                    <Icon className='text-purple-500 w-5 h-5 mr-2 ' />
                                    <input type={type} placeholder={placeholder} value={profile[name]}
                                        onChange={(e) => setProfile({ ...profile, [name]: e.target.value })}
                                        className='w-full focus:outline-none text-sm' required
                                    />
                                </div>
                            ))}
                            <button className={FULL_BUTTON}>
                                <Save className='w-4 h-4' />Save Changes
                            </button>
                        </form>
                    </section>
                    <section className={SECTION_WRAPPER}>
                        <div className='flex items-center gap-2 mb-6 '>
                            <Shield className='text-purple-500 w-5 h-5 ' />
                            <h2 className='text-sm font-semibold text-gray-800 '>Security</h2>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Profile