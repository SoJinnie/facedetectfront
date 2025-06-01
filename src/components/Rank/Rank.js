import React from 'react';

const Rank = ({username, userentries}) => {
    return (
       <div className=''>
            <div className='white f3'>
                {`${username}, your current entry count...`}
            </div>
            <div className='white f1'>
                {userentries}
            </div>
       </div>
    );
}

export default Rank;