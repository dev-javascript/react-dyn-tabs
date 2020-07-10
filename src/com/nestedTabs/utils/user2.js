import React from 'react';
function User2(props) {
    let id = props.userId || 'unknow id';
    return (
        <>
            <p style={{color:'red'}}>firstName : ali</p>
            <p  style={{color:'red'}}>lastName : azari</p>
            <p  style={{color:'red'}}>userId : {id}</p>
        </>
    );
}
export default User2;