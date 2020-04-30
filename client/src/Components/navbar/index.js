import React from 'react';
import Utils from "../../utilities"
import Contacts from "../../Components/card/contacts"

const NavBar = (props) => {
  return (
    <div>
      <nav className={"navbar navbar-white border-bottom border-primary " + props.className} >
        <Contacts />
        <div className="">
            <img className="img-fluid" width="40px" src="images/logo.png" alt="logo"/>
            {Utils.TextUtils.getLocalCaption("_org")}
        </div>
        <div className="text-center nav-item">
          {Utils.DateUtils.getLocalDate()}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;