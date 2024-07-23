/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Text,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Button,

} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import ApexCharts from "apexcharts";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

export default function UserReports() {

  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [monthlyChart, setMonthlyChart] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  function fetchLook() {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch("http://localhost:3500/daily")
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          console.log(data)
          setDaily(data)
          var options = {
            series: [data.total_users, data.looking_users],
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Total Users', 'Looking People'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          };

          var chart = new ApexCharts(document.querySelector("#pieChart"), options);
          chart.render();

        })
        .catch(error => console.error("Error fetching users :", error))

      await fetch("http://localhost:3500/weekly")
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          setWeekly(data)
        })
        .catch(error => console.error("Error fetching users :", error))

      await fetch("http://localhost:3500/monthly")
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          setMonthly(data)
        })
        .catch(error => console.error("Error fetching users :", error))
      await fetch("http://localhost:3500/monthly_chart")
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          var options = {
            chart: {
              type: 'bar',
              stacked: true,
            },
            series: [{
              name: 'Looking users',
              data: [data.data[0].looking_users, data.data[1].looking_users, data.data[2].looking_users, data.data[3].looking_users]
            }, {
              name: 'Total',
              data: [data.data[0].total_users, data.data[1].total_users, data.data[2].total_users, data.data[3].total_users]
            },]
          }
          if (document.querySelector("#monthly_chart")) {
            var chart = new ApexCharts(document.querySelector("#monthly_chart"), options);
          }
          chart.render();
        })
        .catch(error => console.error("Error fetching users :", error))
    }
    fetchData();
  }
  useEffect(() => {
    fetchLook();
    const interval = setInterval(() => {
      fetchLook();
    }, 5 * 1000);
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid height="400px" mb='20px'>
        <TotalSpent />
      </SimpleGrid>
      <Flex mb="20px" flexDirection="row" justifyContent="space-between" >
        <Button maxWidth="500px" onClick={fetchLook}>Refresh</Button>
        <Select onChange={val => {
          console.log(val.eventPhase)
        }} maxWidth="600px">
          <option value="persen">Percentage</option>
          <option value="tes">Tes</option>
        </Select>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <Card w = "full">
          <Text>
            Daily Report
          </Text>
          <Flex id="pieChart"/>
        </Card>
      </SimpleGrid>
      <Text fontSize="4xl" fontWeight="bold">
        Monthly Report
      </Text>
      <Card id="monthly_chart">

      </Card>
    </Box>
  );
}
