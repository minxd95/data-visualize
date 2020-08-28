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
    <div className="filter">
      <form onSubmit={handleSubmit}>
        From :<br />
        <input
          type="date"
          name="from"
          onChange={handleChange}
          value={date.from}
        ></input>
        <br />
        To :<br />
        <input
          type="date"
          name="to"
          onChange={handleChange}
          value={date.to}
        ></input>
        <br />
        <button type="submit">반영</button>
      </form>
      <button
        onClick={() => {
          props.onReset();
          setDate({
            from: "",
            to: "",
          });
        }}
      >
        초기화
      </button>
    </div>
  );
}

export default DatePicker;
