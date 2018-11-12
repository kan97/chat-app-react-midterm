import React from 'react'
import {Switch, Route} from 'react-router-dom'
import SignIn from '../components/auth/SignIn'
import SignUp from '../components/auth/SignUp'
import Dashboard from '../containers/dashboard/Dashboard'

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <Dashboard />
    },
    {
        path: '/signin',
        exact: false,
        main: () => <SignIn />
    },
    {
        path: '/signup',
        exact: false,
        main: () => <SignUp />
    },
    {
        path: '/message/:cfid',
        exact: false,
        main: () => <Dashboard />
    }
]

export const showContentMenus = () => {
    var result = null
    if (routes.length > 0) {
        result = routes.map((route, index) => {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main} 
                />
            )
        })
    }
    return <Switch>{result}</Switch>
}