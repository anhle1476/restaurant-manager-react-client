import { formatMoney, formatVnd } from "../../utils/moneyUtils";

export const CHART_SCHEMA = {
  series: [
    {
      name: "Doanh số",
      data: [],
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "area",
    },
    fill: {
      colors: ["rgba(255, 205, 101, .2)"],
      type: "solid",
    },
    colors: ["#fd5f00"],
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatMoney(val);
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [],
      labels: {
        format: "dd/MM",
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return formatVnd(val);
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy",
      },
    },
  },
};

export const parseChartData = (incomeMap) => {
  const dataArr = [];
  const dateArr = [];

  Object.keys(incomeMap).forEach((dateStr) => {
    dataArr.push(incomeMap[dateStr]);
    dateArr.push(new Date(dateStr).toISOString());
  });

  return {
    ...CHART_SCHEMA,
    series: [
      {
        name: "Doanh số",
        data: dataArr,
      },
    ],
    options: {
      ...CHART_SCHEMA.options,
      xaxis: {
        ...CHART_SCHEMA.options.xaxis,
        categories: dateArr,
      },
    },
  };
};
