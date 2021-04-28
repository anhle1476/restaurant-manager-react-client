import React from "react";

import { Row, Col } from "reactstrap";

import Widget from "../../components/Widget";
import ApexChart from "react-apexcharts";

import s from "./Charts.module.scss";

import { chartData } from "./mock";

class Charts extends React.Component {
  state = {
    cd: chartData,
  };
  render() {
    const { cd } = this.state;
    return (
      <div className={s.root}>
        <div>
          <Row>
            <Col lg={7} xs={12}>
              <Widget
                title={<p style={{ fontWeight: 700 }}>Apex</p>}
                customDropDown
              >
                <ApexChart
                  className="sparkline-chart"
                  height={350}
                  series={cd.apex.column.series}
                  options={cd.apex.column.options}
                  type={"bar"}
                />
              </Widget>
            </Col>
            <Col lg={12} xs={12}>
              <Row>
                <Col lg={6} xs={12}>
                  <Widget
                    title={
                      <p style={{ fontWeight: 700 }}>
                        Apex{" "}
                        <span className="fw-semi-bold">Monochrome Pie</span>
                      </p>
                    }
                    customDropDown
                  >
                    <ApexChart
                      className="sparkline-chart"
                      type={"pie"}
                      height={200}
                      series={cd.apex.pie.series}
                      options={cd.apex.pie.options}
                    />
                  </Widget>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Charts;
