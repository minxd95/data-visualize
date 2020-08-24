import React from "react";
import { Route } from "react-router-dom";
import { KaKaoDailyTableRouter, KaKaoDailyChartRouter } from "../pages";
import Menu from "../components/Menu";

function App() {
  return (
    <div>
      <Menu />
      <Route exact path="/kakaodaily/Table" component={KaKaoDailyTableRouter} />
      <Route path="/kakaodaily/chart" component={KaKaoDailyChartRouter} />
    </div>
  );
}

export default App;
