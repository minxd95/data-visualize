import React from "react";
import { NavLink } from "react-router-dom";

const Menu = () => {
  const activeStyle = {
    color: "green",
    fontSize: "1rem",
    fontWeight: "bold",
  };
  return (
    <div>
      <ul>
        <li>
          <NavLink exact to="/kakaodaily/table" activeStyle={activeStyle}>
            KaKao Daily
          </NavLink>
        </li>
        <li>
          <NavLink to="/kakaodaily/chart" activeStyle={activeStyle}>
            KaKao Daily Chart
          </NavLink>
        </li>
        <li>
          <NavLink to="/kakaogeniemonthly" activeStyle={activeStyle}>
            KaKao & Genie Monthly
          </NavLink>
        </li>
      </ul>
      <hr />
    </div>
  );
};

export default Menu;
