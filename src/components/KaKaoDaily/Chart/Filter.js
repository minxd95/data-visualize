import React from "react";
import { makeFilterList } from "../../../library/dataParsing";
import "./style.css";
function Filter({ data, filter, onFilterChange }) {
  const { trackName, trackCode, albumName, albumCode, artist } = makeFilterList(
    data
  );
  const trackNameFilter = trackName.map((e) => (
    <option value={e} key={trackName.indexOf(e)}>
      {e}
    </option>
  ));
  const trackCodeFilter = trackCode.map((e) => (
    <option value={e} key={trackCode.indexOf(e)}>
      {e}
    </option>
  ));
  return (
    <div>
      <div className="filter">
        <span>트랙이름으로 필터링 : </span>
        <select
          name="trackName"
          value={filter.trackName}
          onChange={onFilterChange}
        >
          <option value=""></option>
          <option value="전체">전체</option>
          {trackNameFilter}
        </select>
      </div>
      <div className="filter">
        <span>트랙코드로 필터링 : </span>
        <select
          name="trackCode"
          value={filter.trackCode}
          onChange={onFilterChange}
        >
          <option value=""></option>
          <option value="전체">전체</option>
          {trackCodeFilter}
        </select>
      </div>
    </div>
  );
}

export default Filter;
