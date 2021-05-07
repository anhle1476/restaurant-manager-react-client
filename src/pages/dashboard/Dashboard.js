import React from "react";
import { Row, Col } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./Dashboard.module.scss";
import ApexChart from "react-apexcharts";

import billApi from "../../api/billApi";
import { toastError } from "../../utils/toastUtils";
import { CHART_SCHEMA, parseChartData } from "./chartService";

class Dashboard extends React.Component {
  state = {
    splineArea: { ...CHART_SCHEMA },
  };

  componentDidMount() {
    const fetchReport = async () => {
      try {
        const res = await billApi.monthReport();
        console.log(res.data);
        const newChartData = parseChartData(res.data.incomeByDate);
        this.setState({ splineArea: newChartData });
      } catch (ex) {
        toastError("Lấy báo cáo tháng thất bại");
        console.log(ex);
      }
    };
    fetchReport();
  }

  render() {
    return (
      <div className={s.root}>
        <Row>
          <Col xl="12">
            <Widget
              title={
                <Row>
                  <Col xs={12} sm={5}>
                    <p style={{ fontWeight: 700 }}>Doanh số theo ngày</p>
                  </Col>
                  <Col xs={12} sm={7}>
                    <div className="chart-legend" />
                  </Col>
                </Row>
              }
              customDropDown
            >
              <Row className={s.dailyLineChart}>
                <Col sm={12}>
                  <ApexChart
                    className="sparkline-chart"
                    series={this.state.splineArea.series}
                    options={this.state.splineArea.options}
                    type={"area"}
                    height={"350px"}
                  />
                </Col>
              </Row>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
