const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Console } = require("console");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend

// Calculation endpoint
app.post("/api/calc", (req, res) => {
  let { regDate, co2, nox, weight, engine, fuel, taxi, expDate } = req.body;

  const regYear = new Date(regDate).getFullYear();
  const expYear = new Date(expDate).getFullYear();
  const regMonth = new Date(regDate).getMonth();
  const expMonth = new Date(expDate).getMonth();
  const usedMonths = (expYear - regYear) * 12 - regMonth + expMonth;
  let usage;

  //<-- create check for input data

  // <-- create alert message
  const vrakpant = 2400;
  let weightTax;
  let engineTax;
  let noxTax;
  let co2Tax;
  let basicTax;
  let payedTax;
  let result;


  if (usedMonths >= 1 && usedMonths < 2) usage = 0.02;
  else if (usedMonths >= 2 && usedMonths < 3) usage = 0.04;
  else if (usedMonths >= 3 && usedMonths < 4) usage = 0.06;
  else if (usedMonths >= 4 && usedMonths < 5) usage = 0.08;
  else if (usedMonths >= 5 && usedMonths < 6) usage = 0.1;
  else if (usedMonths >= 6 && usedMonths < 7) usage = 0.12;
  else if (usedMonths >= 7 && usedMonths < 8) usage = 0.14;
  else if (usedMonths >= 8 && usedMonths < 9) usage = 0.15;
  else if (usedMonths >= 9 && usedMonths < 10) usage = 0.16;
  else if (usedMonths >= 10 && usedMonths < 11) usage = 0.17;
  else if (usedMonths >= 11 && usedMonths < 12) usage = 0.18;
  else if (usedMonths >= 12 && usedMonths < 14) usage = 0.19;
  else if (usedMonths >= 14 && usedMonths < 16) usage = 0.2;
  else if (usedMonths >= 16 && usedMonths < 18) usage = 0.21;
  else if (usedMonths >= 18 && usedMonths < 20) usage = 0.22;
  else if (usedMonths >= 20 && usedMonths < 22) usage = 0.23;
  else if (usedMonths >= 22 && usedMonths < 24) usage = 0.24;
  else if (usedMonths >= 24 && usedMonths < 30) usage = 0.26;
  else if (usedMonths >= 30 && usedMonths < 36) usage = 0.3;
  else if (usedMonths >= 36 && usedMonths < 42) usage = 0.33;
  else if (usedMonths >= 42 && usedMonths < 48) usage = 0.37;
  else if (usedMonths >= 48 && usedMonths < 54) usage = 0.4;
  else if (usedMonths >= 54 && usedMonths < 60) usage = 0.44;
  else if (usedMonths >= 60 && usedMonths < 66) usage = 0.5;
  else if (usedMonths >= 66 && usedMonths < 72) usage = 0.54;
  else if (usedMonths >= 72 && usedMonths < 78) usage = 0.58;
  else if (usedMonths >= 78 && usedMonths < 84) usage = 0.62;
  else if (usedMonths >= 84 && usedMonths < 90) usage = 0.66;
  else if (usedMonths >= 90 && usedMonths < 96) usage = 0.7;
  else if (usedMonths >= 96 && usedMonths < 102) usage = 0.74;
  else if (usedMonths >= 102 && usedMonths < 108) usage = 0.78;
  else if (usedMonths >= 108 && usedMonths < 120) usage = 0.82;
  else usage = 0;

  //Check data
  console.log("Total maneder: " + usedMonths);
  console.log("Bruksfradarag i måneder: " + usage);

  //Calculate tax for yeach year
  switch (regYear) {
    case 2015:
      console.log("Case 2015");
      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }

      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1151) {
          weightTax = weight * 39.1;
        } else if (weight > 1150 && weight < 1401) {
          weightTax = 1150 * 39.1 + (weight - 1150) * 85.25;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 1150 * 39.1 + 250 * 85.25 + (weight - 1400) * 170.52;
        } else
          weightTax =
            1150 * 39.1 + 250 * 85.25 + 100 * 170.52 + (weight - 1500) * 198.31;

        //Calculate engine tax
        if (engine < 71) {
          engineTax = 0;
        } else if (engine > 70 && engine < 101) {
          engineTax = (engine - 70) * 245.04;
        } else if (engine > 100 && engine < 141) {
          engineTax = 30 * 245.04 + (engine - 100) * 709.6;
        } else {
          engineTax = 30 * 245.04 + 40 * 709.6 + (engine - 140) * 1756.12;
        }

        //Calculate NOX tax
        noxTax = nox * 47.11;

        //Calculate CO2 tax
        // check if CO2 is lower than 105
        if (co2 < 106) {
          if (co2 > 49) {
            co2Tax = (co2 - 105) * 829;
          } else {
            co2Tax = (co2 - 50) * 984 - 55 * 829;
          }
        } else if (co2 > 105 && co2 < 121) {
          co2Tax = (co2 - 105) * 795.36;
        } else {
          //calculate CO2 for taxi
          if (taxi == true) {
            co2Tax = 15 * 795.36 + (co2 - 120) * 801.49;
            //calculate co2 for non taxi
          } else {
            if (co2 > 120 && co2 < 161) {
              co2Tax = 15 * 795.36 + (co2 - 120) * 801.49;
            } else if (co2 > 160 && co2 < 231) {
              co2Tax = 15 * 795.36 + 40 * 801.49 + (co2 - 160) * 1868.43;
            } else {
              co2Tax =
                15 * 795.36 + 40 * 801.49 + 70 * 1868.43 + (co2 - 230) * 2999.7;
            }
          }
        }
        //check if car is hybrid, calculate 10% off egenvekt
        if (engine == "hybrid") {
          weightTax = weightTax * 0.9;
        }

        //calculate payed tax for taxi (40% off from egenvekt and 40% off from engine power)
        if (taxi == true)
          payedTax =
            vrakpant + weightTax * 0.4 + engineTax * 0.4 + noxTax + co2Tax;
        //calculate payed tax for non taxi
        else payedTax = vrakpant + weightTax + engineTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

    case 2016:
      console.log("Case 2016");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }

      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1151) {
          weightTax = (weight - 150) * 38.08;
        } else if (weight > 1150 && weight < 1401) {
          weightTax = 1000 * 39.1 + (weight - 1150) * 83.01;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 1000 * 39.1 + 250 * 83.01 + (weight - 1400) * 166.04;
        } else
          weightTax =
            1000 * 39.1 + 250 * 83.01 + 100 * 166.04 + (weight - 1500) * 193.11;

        //Calculate engine tax
        if (engine < 71) {
          engineTax = 0;
        } else if (engine > 70 && engine < 101) {
          engineTax = (engine - 70) * 125.59;
        } else if (engine > 100 && engine < 141) {
          engineTax = 30 * 125.59 + (engine - 100) * 363.67;
        } else {
          engineTax = 30 * 125.59 + 40 * 363.67 + (engine - 140) * 900.01;
        }

        //Calculate NOX tax
        noxTax = nox * 57.95;

        //Calculate CO2 tax
        // check if CO2 is lower than 95
        if (co2 < 96) {
          co2Tax = 0;
        } else if (co2 > 95 && co2 < 111) {
          co2Tax = (co2 - 95) * 896.76;
        } else {
          //calculate CO2 for taxi
          if (taxi == true) {
            co2Tax = 15 * 896.76 + (co2 - 110) * 903.68;
            //calculate co2 for non taxi
          } else {
            if (co2 > 110 && co2 < 141) {
              co2Tax = 15 * 896.76 + (co2 - 110) * 903.68;
            } else if (co2 > 140 && co2 < 211) {
              co2Tax = 15 * 896.76 + 30 * 903.68;
              +(co2 - 140) * 2106.65;
            } else {
              co2Tax =
                15 * 896.76 +
                30 * 903.68 +
                70 * 2106.65 +
                (co2 - 210) * 3382.16;
            }
          }
        }
        //check if car is hybrid, calculate 10% off egenvekt
        if (engine == "hybrid") {
          weightTax = weightTax * 0.9;
        }

        //calculate payed tax for taxi (40% off from egenvekt and 40% off from engine power)
        if (taxi == true)
          payedTax =
            vrakpant + weightTax * 0.4 + engineTax * 0.4 + noxTax + co2Tax;
        //calculate payed tax for non taxi
        else payedTax = vrakpant + weightTax + engineTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

    case 2017:
      console.log("Case 2017");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 350) * 26.51;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 850 * 26.51 + (weight - 1200) * 66.05;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 850 * 26.51 + 200 * 66.05 + (weight - 1400) * 206.41;
        } else
          weightTax =
            850 * 26.51 + 200 * 66.05 + 100 * 206.41 + (weight - 1500) * 240.06;

        //Calculate NOX tax
        noxTax = nox * 70.93;

        //Calculate CO2 tax
        // check if CO2 is lower than 75
        if (co2 < 76) {
          co2Tax = 0;
        } else if (co2 > 75 && co2 < 101) {
          co2Tax = (co2 - 75) * 914.7;
        } else {
          //calculate CO2 for taxi
          if (taxi == true) {
            co2Tax = 25 * 914.7 + (co2 - 100) * 995.49;
            //calculate co2 for non taxi
          } else {
            if (co2 > 100 && co2 < 131) {
              co2Tax = 25 * 914.7 + (co2 - 100) * 995.49;
            } else if (co2 > 130 && co2 < 201) {
              co2Tax = 25 * 914.7 + 30 * 995.49 + +(co2 - 130) * 2685.98;
            } else {
              co2Tax =
                25 * 914.7 + 30 * 995.49 + 70 * 2685.98 + (co2 - 200) * 3449.8;
            }
          }
        }
        //check if car is hybrid, calculate 10% off egenvekt
        if (engine == "hybrid") {
          weightTax = weightTax * 0.95;
        }

        //calculate payed tax for taxi (40% off from egenvekt and 40% off from engine power)
        if (taxi == true)
          payedTax = vrakpant + weightTax * 0.4 + noxTax + co2Tax;
        //calculate payed tax for non taxi
        else payedTax = vrakpant + weightTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

    case 2018:
      console.log("Case 2018");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 25.04;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 25.04 + (weight - 1200) * 62.41;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 25.04 + 200 * 62.41 + (weight - 1400) * 195.03;
        } else
          weightTax =
            700 * 25.04 + 200 * 62.41 + 100 * 195.03 + (weight - 1500) * 226.83;

        //Calculate NOX tax
        noxTax = nox * 72.06;

        //Calculate CO2 tax
        // check if CO2 is lower than 70
        if (co2 < 70) {
          co2Tax = 0;
        } else if (co2 > 70 && co2 < 96) {
          co2Tax = (co2 - 70) * 929.34;
        } else {
          //calculate CO2 for taxi
          if (taxi == true) {
            co2Tax = 25 * 929.34 + (co2 - 95) * 1041.42;
            //calculate co2 for non taxi
          } else {
            if (co2 > 95 && co2 < 126) {
              co2Tax = 25 * 929.34 + (co2 - 95) * 1041.42;
            } else if (co2 > 125 && co2 < 196) {
              co2Tax = 25 * 929.34 + 30 * 1041.42 + +(co2 - 125) * 2728.96;
            } else {
              co2Tax =
                25 * 929.34 + 30 * 1041.42 + 70 * 2728.96 + (co2 - 195) * 3505;
            }
          }
        }
        //calculate payed tax for taxi (40% off from egenvekt)
        if (taxi == true)
          payedTax = vrakpant + weightTax * 0.4 + noxTax + co2Tax;
        //calculate payed tax for non taxi
        else payedTax = vrakpant + weightTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

    case 2019:
      console.log("Case 2019");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 25.42;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 25.42 + (weight - 1200) * 63.35;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 25.42 + 200 * 63.35 + (weight - 1400) * 197.96;
        } else
          weightTax =
            700 * 25.42 + 200 * 63.35 + 100 * 197.96 + (weight - 1500) * 230.23;

        //Calculate NOX tax
        noxTax = nox * 73.14;

        //Calculate CO2 tax
        // check if CO2 is lower than 70
        if (co2 < 70) {
          co2Tax = 0;
        } else if (co2 > 70 && co2 < 96) {
          co2Tax = (co2 - 70) * 943.28;
        } else if (co2 > 95 && co2 < 126) {
          co2Tax = 25 * 943.28 + (co2 - 95) * 1057.04;
        } else if (co2 > 125 && co2 < 196) {
          co2Tax = 25 * 943.28 + 30 * 1057.04 + +(co2 - 125) * 2769.89;
        } else {
          co2Tax =
            25 * 943.28 + 30 * 1057.04 + 70 * 2769.89 + (co2 - 195) * 3557.58;
        }

        payedTax = vrakpant + weightTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

      case 2020:
      console.log("Case 2020");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 25.9;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 25.9 + (weight - 1200) * 64.55;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 25.9 + 200 * 64.55 + (weight - 1400) * 201.72;
        } else
          weightTax =
            700 * 25.9 + 200 * 64.55 + 100 * 201.72 + (weight - 1500) * 234.6;

        //Calculate NOX tax
        noxTax = nox * 74.53;

        //Calculate CO2 tax
        // check if CO2 is lower than 70
        if (co2 < 88) {
          co2Tax = 0;
        } else if (co2 > 87 && co2 < 119) {
          co2Tax = (co2 - 87) * 773.91;
        } else if (co2 > 118 && co2 < 156) {
          co2Tax = 31 * 773.91 + (co2 - 118) * 867.25;
        } else if (co2 > 155 && co2 < 226) {
          co2Tax = 31 * 773.91 + 37 * 867.25 + (co2 - 155) * 2271.56;
        } else {
          co2Tax =
           31 * 773.91 + 37 * 867.25 + 70 * 2271.56 + (co2 - 225) * 3625.17;
        }

        payedTax = vrakpant + weightTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

      case 2021:
      console.log("Case 2021");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 26.81;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 26.81 + (weight - 1200) * 66.81;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 26.81 + 200 * 66.81 + (weight - 1400) * 208.78;
        } else
          weightTax =
            700 * 26.81 + 200 * 66.81 + 100 * 208.78 + (weight - 1500) * 242.81;

        //Calculate NOX tax
        noxTax = nox * 77.14;

        //Calculate CO2 tax
        // check if CO2 is lower than 87
        if (co2 < 88) {
          co2Tax = 0;
        } else if (co2 > 87 && co2 < 119) {
          co2Tax = (co2 - 87) * 801;
        } else if (co2 > 118 && co2 < 156) {
          co2Tax = 31 * 801 + (co2 - 118) * 897.6;
        } else if (co2 > 155 && co2 < 226) {
          co2Tax = 31 * 801 + 37 * 897.6 + (co2 - 155) * 2352.1;
        } else {
          co2Tax =
           31 * 801 + 37 * 897.6 + 70 * 2352.1 + (co2 - 225) * 3752.05;
        }

        payedTax = vrakpant + weightTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }
      case 2022:
      console.log("Case 2022");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = 2400;
        result = 0;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 27.15;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 27.15 + (weight - 1200) * 67.68;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 27.15 + 200 * 67.68 + (weight - 1400) * 211.49;
        } else
          weightTax =
            700 * 27.15 + 200 * 67.68 + 100 * 211.49 + (weight - 1500) * 245.97;

        //Calculate NOX tax
        noxTax = nox * 78.14;

        //Calculate CO2 tax
        // check if CO2 is lower than 87
        if (co2 < 88) {
          co2Tax = 0;
        } else if (co2 > 87 && co2 < 119) {
          co2Tax = (co2 - 87) * 1095.4;
        } else if (co2 > 118 && co2 < 156) {
          co2Tax = 31 * 1095.4 + (co2 - 118) * 1227.52;
        } else if (co2 > 155 && co2 < 226) {
          co2Tax = 31 * 1095.4 + 37 * 1227.52 + (co2 - 155) * 2382.68;
        } else {
          co2Tax =
           31 * 1095.4 + 37 * 1227.52 + 70 * 2382.68 + (co2 - 225) * 3800.83;
        }

        payedTax = vrakpant + weightTax + noxTax + co2Tax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

      case 2023:
      console.log("Case 2023");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      basicTax = (weight - 500) * 12.5;
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = vrakpant + basicTax;
        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 27.92;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 27.92 + (weight - 1200) * 69.57;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 27.92 + 200 * 69.57 + (weight - 1400) * 217.42;
        } else
          weightTax =
            700 * 27.92 + 200 * 69.57 + 100 * 217.42 + (weight - 1500) * 252.85;

        //Calculate NOX tax
        noxTax = nox * 80.33;

        //Calculate CO2 tax
        // check if CO2 is lower than 87
        if (co2 < 83) {
          co2Tax = 0;
        } else if (co2 > 82 && co2 < 119) {
          co2Tax = (co2 - 82) * 1351.29;
        } else if (co2 > 118 && co2 < 156) {
          co2Tax = 36 * 1351.29 + (co2 - 118) * 1514.27;
        } else if (co2 > 155 && co2 < 226) {
          co2Tax = 36 * 1351.29 + 37 * 1514.27 + (co2 - 155) * 2939.27;
        } else {
          co2Tax =
           36 * 1351.29 + 37 * 1514.27 + 70 * 2939.27 + (co2 - 225) * 4688.7;
        }

        payedTax = vrakpant + weightTax + noxTax + co2Tax + basicTax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

      case 2024:
      console.log("Case 2024");

      if (usage == 0) {
        result =
          "Bilen er eldre enn 10 år. Det refunderes ikke engangsavgiften ved eksport.";
        res.json({ result });
        break;
      }
      basicTax = (weight - 500) * 12.98;
      // -> Check plug in
      if (fuel == "electric" || fuel == "plugin") {
        payedTax = vrakpant + basicTax;
        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        res.json({ payedTax, result });
        break;
      } else {
        //Calculate weight tax
        if (weight < 1201) {
          weightTax = (weight - 500) * 28.98;
        } else if (weight > 1200 && weight < 1401) {
          weightTax = 700 * 28.98 + (weight - 1200) * 72.22;
        } else if (weight > 1400 && weight < 1501) {
          weightTax = 700 * 28.98 + 200 * 72.22 + (weight - 1400) * 225.68;
        } else
          weightTax =
            700 * 28.98 + 200 * 72.22 + 100 * 225.68 + (weight - 1500) * 262.46;

        //Calculate NOX tax
        noxTax = nox * 82.38;

        //Calculate CO2 tax
        // check if CO2 is lower than 87
        if (co2 < 70) {
          co2Tax = 0;
        } else if (co2 > 69 && co2 < 119) {
          co2Tax = (co2 - 70) * 1402.64;
        } else if (co2 > 118 && co2 < 156) {
          co2Tax = 48 * 1402.64 + (co2 - 118) * 1571.81;
        } else if (co2 > 155 && co2 < 226) {
          co2Tax = 48 * 1402.64 + 37 * 1571.81 + (co2 - 155) * 3050.96;
        } else {
          co2Tax =
           48 * 1402.64 + 37 * 1571.81 + 70 * 3050.96 + (co2 - 225) * 4866.87;
        }

        payedTax = vrakpant + weightTax + noxTax + co2Tax + basicTax;
        //chech result
        console.log("Betalt engangsavgift: " + payedTax);

        result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
        console.log("Refusjon av engangsavgift: " + result);

        res.json({ payedTax, result });
        break;
      }

    default:
      result =
        "Bilen kvalifiseres ikke for refusjon av engangsavgift ved eksport.";
      res.json({ result });
    // Code to execute if no case matches
  }

});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
