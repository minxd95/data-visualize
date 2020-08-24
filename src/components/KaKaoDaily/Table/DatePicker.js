import React, { useState } from "react";

function DatePicker(props) {
  const [date, setDate] = useState({
    from: "",
    to: "",
  });
  function handleChange(e) {
    setDate({
      ...date,
      [e.target.name]: e.target.value,
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.dateChanged(date);
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        From :<br />
        <input type="date" name="from" onChange={handleChange}></input>
        <br />
        To :<br />
        <input type="date" name="to" onChange={handleChange}></input>
        <br />
        <button type="submit">반영</button>
      </form>
      <button onClick={() => props.onReset()}>초기화</button>
    </div>
  );
}

export default DatePicker;
