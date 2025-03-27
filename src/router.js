import Home from '@/views/Home';
import Login from '@/views/Login';
import Register from '@/views/Register'
import ToBeConfirmed from '@/views/ToBeConfirmed'
import Confirmed from '@/views/Confirmed'
import Individual from "@/views/Individual";

export default [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path:'/home',
        component: Home
    },
    {
        path:'/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/toBeConfirmed',
        component: ToBeConfirmed
    },
    {
        path: '/confirmed',
        component: Confirmed
    },
    {
        path: '/individual',
        component: Individual
    }
]