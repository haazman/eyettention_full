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

import React, { useEffect, useState } from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Grid,
  Link,
  Icon,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/marketplace/components/Banner";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import TableTopCreators from "views/admin/marketplace/components/TableTopCreators";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import NFT from "components/card/NFT";
import Card from "components/card/Card.js";
import ApexCharts from "apexcharts";

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";
import tableDataTopCreators from "views/admin/marketplace/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/marketplace/variables/tableColumnsTopCreators";
import { initialize,AppgetDatabase, ref, onValue } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAIMiCIl--HjP77RuRpSkO7y3nuOzIKYLE",
  authDomain: "iotgas-cd9a3.firebaseapp.com",
  databaseURL: "https://iotgas-cd9a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iotgas-cd9a3",
  storageBucket: "iotgas-cd9a3.appspot.com",
  messagingSenderId: "525858272607",
  appId: "1:525858272607:web:0f2cab401cb2fb43ecb2ea",
  measurementId: "G-2VT17NDGDS"
};

export default function Marketplace() {

  const [sentiments, setSentiments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenLoading, onOpenLoading, onCloseLoading } = useDisclosure();
  const [percentage, setPercentage] = useState(0);
  const [total, setTotal] = useState(0);
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  function fetchSentiment() {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch("http://localhost:5000/analyze_tweets?query=Kacang%Garuda&count=20")
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          setSentiments(data.tweets);
          setPercentage(data.positive_percentage);
          setTotal(data.total);
          var options = {
            series: [data.positive_counnt, data.negative_count, data.total - data.positive_counnt - data.negative_count],
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Positive', 'Negative', "Neutral"],
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

          var chart = new ApexCharts(document.querySelector("#chartSentiment"), options);
          chart.render();
          onOpen();
        })
        .catch(error => console.error("Error fetching users :", error))
    }
    fetchData();

  }

  useEffect(() =)
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Flex
        flexDirection='column'
        gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
        <Banner onClick={fetchSentiment} />
        <Card mt="20px" id="chartSentiment" h="300px">

        </Card>
        <Flex direction='column'>
          <Flex
            mt='45px'
            mb='20px'
            justifyContent='space-between'
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "center" }}>
            <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
              Post's Sentiment
            </Text>
          </Flex>
          <Flex direction='column' gap='20px'>
            {
              isLoading == false ?
                sentiments.map(sentimen => (
                  <NFT
                    tweet={sentimen.tweet}
                    sentiment={sentimen.sentiment}
                  />
                )) : <h1>Loading</h1>
            }
          </Flex>
        </Flex>
      </Flex>
      {/* Delete Product */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Sentiment analyzed Succesfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="row" paddingLeft="50px">
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                gap='20px'
                mb='20px'>
                <MiniStatistics
                  startContent={
                    <IconBox
                      w='56px'
                      h='56px'
                      bg={boxBg}
                      icon={
                        <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
                      }
                    />
                  }
                  name='Positive Percentage'
                  value={parseInt(percentage) + "%"}
                />
              </SimpleGrid>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                gap='20px'
                mb='20px'>
                <MiniStatistics
                  startContent={
                    <IconBox
                      w='56px'
                      h='56px'
                      bg={boxBg}
                      icon={
                        <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
                      }
                    />
                  }
                  name='Total'
                  value={total}
                />
              </SimpleGrid>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box w="100%" h="100%"pos="fixed" top="0" left="0" display={isLoading?"flex":"none"} justifyContent="center" alignItems="center">
         <img src={require("assets/spinner.gif")} alt="" width="100px"/>
      </Box>
    </Box>
  );
}
