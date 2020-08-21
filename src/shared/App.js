import React from "react";
import { Route } from "react-router-dom";
import { KaKaoDailyRouter, KaKaoDailyChartRouter } from "../pages";
import Menu from "../components/Menu";

function App() {
  return (
    <div>
      <Menu />
      <Route exact path="/kakaodaily" component={KaKaoDailyRouter} />
      <Route path="/kakaodaily/chart" component={KaKaoDailyChartRouter} />
    </div>
  );
}

export default App;
