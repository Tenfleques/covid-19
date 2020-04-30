import React from 'react';

const Headline = (props) => {
    return (
        <div className={props.className || " card square" } >
            {
                props.image && <img src={props.image} />
            }
            <div className={props.titleClass || "card-title h4 py-3"}>
                {props.title}
            </div>
            <div className="row py-3">
                <div className="col-12"> 
                    {props.short}
                </div>
            </div>            
        </div>
    );
}

export default Headline;