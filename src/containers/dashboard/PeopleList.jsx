import React, { Fragment } from 'react'
import { connect } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import moment from 'moment'
import '../../stylesheets/PeopleList.css'
import Chat from './Chat'

const PeopleList = props => {
  
  const { auth, users, status } = props
  if (!auth.uid) return <Redirect to="/signin" />;
  
  return (
    <div className="container clearfix">
      <div className="people-list" id="people-list">
        <div className="search">
          <input type="text" placeholder="search" />
        </div>
        <ul className="list">
          { users && users.map((user, index) => {
              if (auth.uid === user.id) {
                return null
              }

              let time, state
              if (status) {
                if (status[index]) {
                  if (status[index].last_changed) {
                    const timestamp = new Date(status[index].last_changed.seconds * 1000)
                    time = moment(timestamp.toGMTString()).fromNow()
                  }

                  state = status[index].state
                }
              }

              return (
                <li className="clearfix" key={index}>
                <NavLink to={`/message/${user.id}`} >
                  <div className='btn btn-floating pink lighten-1'>
                    { user.picture 
                      ? <img
                          src={user.picture}
                          alt={user.initials}
                          width='40px'
                          height='40px'
                        />
                      : user.initials
                    }
                  </div>
                  <div className="about">
                    <div className="name">{user.firstName} {user.lastName}</div>                   
                      <div className="status">
                        { state === 'online' 
                          ? <Fragment><i className="fa fa-circle online"></i> online</Fragment>
                          : <Fragment><i className="fa fa-circle offline"></i> left { time }</Fragment>
                        }                      
                      </div>                
                  </div>
                  </NavLink>
                </li>
              )
            })
          }
        </ul>
      </div>
      <Chat cfid={props.match.params.cfid} uid={auth.uid}/>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    users: state.firestore.ordered.users,
    status: state.firestore.ordered.status
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'users' },
    { collection: 'status' }
  ])
)(PeopleList);
