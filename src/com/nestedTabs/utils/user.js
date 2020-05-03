import React from 'react';
function User(props) {
    let id = props.userId || 'aaa';
    return (
        <>
            <p>firstName : ali</p>
            <p>lastName : azari</p>
            <p>userId : {id}</p>
        </>
    );
}
export default User;