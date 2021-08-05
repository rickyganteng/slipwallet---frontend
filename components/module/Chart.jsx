import moment from "moment";
import React from "react";
import { Bar } from "react-chartjs-2";

function ChartHome(props) {
  // console.log(props);
  const listDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dataListDay = props.databy.map((item) => {
    return {
      day: moment(item.date).format("llll").split(",")[0],
      total: item.total,
    };
  });

  const totalData = [];
  for (const i of listDay) {
    let res = 0;
    for (const j of dataListDay) {
      if (i === j.day) {
        res += 1;
        totalData.push(j);
      }
    }
    if (res === 0) {
      totalData.push({ day: i, total: 0 });
    }
  }

  const dataPerDay = totalData.map((i) => {
    // console.log(i);
    return i.total;
  });

  const data = {
    labels: listDay,
    datasets: [
      {
        label: "This Weeek",
        data: dataPerDay,
        // backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        // borderColor: [
        //   "rgba(255, 99, 132, 1)",
        //   "rgba(54, 162, 235, 1)",
        //   "rgba(255, 206, 86, 1)",
        //   "rgba(75, 192, 192, 1)",
        //   "rgba(153, 102, 255, 1)",
        //   "rgba(255, 159, 64, 1)",
        // ],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };
  return (
    <>
      <div>
        <Bar
          data={data}
          width={500}
          height={390}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
    </>
  );
}

export default ChartHome;
