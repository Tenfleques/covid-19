import React from 'react';
import Contacts from "../../Configs/contacts.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp, faTelegram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

const icons = {
    "whatsapp" : {
        icon : faWhatsapp,
        color : "text-success"
    },
    "twitter" : {
        icon : faTwitter,
        color : "text-primary"
    },
    "facebook" : {
        icon : faFacebook,
        color : "text-primary"
    }
}
let formatContacts = () => {
    const obj_keys = Object.keys(Contacts);
    const contacts = []
    for (let i = 0; i < obj_keys.length; ++i ){
        const k = obj_keys[i]
        if (icons[k]){
            contacts.push(<a key={k} 
                href={Contacts[k]} 
                className="h5 col-12 py-0" >
                    <FontAwesomeIcon 
                    icon={icons[obj_keys[i]].icon} 
                    className={icons[obj_keys[i]].color}/>
            </a>);
        }
    }
    return contacts
}

const ContactsCard = (props) => {
    return (
        <div className={props.className} >
            <div className="row">
                <div className="col-12"> 
                    {formatContacts()}
                </div>
            </div>
        </div>
    );
}

export default ContactsCard;