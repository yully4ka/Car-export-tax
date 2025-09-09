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
  let payedTax;
  let result;
  
  if (usedMonths >= 1 && usedMonths < 2)
      usage = 0.02;
    else if(usedMonths >= 2 && usedMonths < 3)
     usage = 0.04;
    else if (usedMonths >= 3 && usedMonths < 4)
     usage = 0.06;
 else if (usedMonths >= 4 && usedMonths < 5)
      usage = 0.08;
       else if (usedMonths >= 5 && usedMonths < 6)
     usage = 0.1;
       else if (usedMonths >= 6 && usedMonths < 7)
     usage = 0.12;
 else if (usedMonths >= 7 && usedMonths < 8)
      usage = 0.14;
 else if (usedMonths >= 8 && usedMonths < 9)
     usage = 0.15;
 else if (usedMonths >= 9 && usedMonths < 10)
     usage = 0.16;
 else if (usedMonths >= 10 && usedMonths < 11)
      usage = 0.17;
 else if (usedMonths >= 11 && usedMonths < 12)
     usage = 0.18;
 else if (usedMonths >= 12 && usedMonths < 14)
     usage = 0.19;
  else if (usedMonths >= 14 && usedMonths < 16)
      usage = 0.2;
 else if (usedMonths >= 16 && usedMonths < 18)
     usage = 0.21;
   else if (usedMonths >= 18 && usedMonths < 20)
     usage = 0.22;
   else if (usedMonths >= 20 && usedMonths < 22)
    usage = 0.23;
else if (usedMonths >= 22 && usedMonths < 24)
    usage = 0.24;
  else if (usedMonths >= 24 && usedMonths < 30)
    usage = 0.26;
  else if (usedMonths >= 30 && usedMonths < 36)
    usage = 0.3;
  else if (usedMonths >=36 && usedMonths < 42)
    usage = 0.33;
  else if (usedMonths >= 42 && usedMonths < 48)
    usage = 0.37;
else if (usedMonths >= 48 && usedMonths < 54)
    usage = 0.4;
else if (usedMonths >= 54 && usedMonths < 60)
    usage = 0.44;
  else if (usedMonths >= 60 && usedMonths < 66)
    usage = 0.5;
else if (usedMonths >= 66 && usedMonths < 72)
    usage = 0.54;
  else if (usedMonths >= 72 && usedMonths < 78)
    usage = 0.58;
else if (usedMonths >= 78 && usedMonths < 84)
    usage = 0.62;
  else if (usedMonths >= 84 && usedMonths < 90)
    usage = 0.66;  
  else if (usedMonths >= 90 && usedMonths < 96)
    usage = 0.7;
else if (usedMonths >= 96 && usedMonths < 102)
    usage = 0.74;
  else if (usedMonths >= 102 && usedMonths < 108)
    usage = 0.78;
  else if (usedMonths >= 108 && usedMonths < 120)
    usage = 0.82;
  else 
    usage = 0.9;


  //Check data
  console.log("Total maneder: " + usedMonths);
  console.log ("Bruksfradarag i måneder: " + usage);


  //Calculate tax for yeach year
  switch (regYear) {
    case 2015:
      console.log("Case 2015");

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
      if (co2 < 106) {
        co2Tax = 0;
      } else if (co2 > 105 && co2 < 121) {
        co2Tax = (co2 - 105) * 795.36;
      } else if (co2 > 120 && co2 < 161) {
        co2Tax = 15 * 795.36 + (co2 - 120) * 801.49;
      } else if (co2 > 160 && co2 < 231) {
        co2Tax = 15 * 795.36 + 40 * 801.49 + (co2 - 160) * 1868.43;
      } else {
        co2Tax = 15 * 795.36 + 40 * 801.49 + 70 * 1868.43 + (co2 - 230) * 2999.7;
      }

     //calculate payed tax
      payedTax = vrakpant + weightTax + engineTax + noxTax + co2Tax;
      console.log("Betalt engangsavgift: " + payedTax);

      result = (payedTax - vrakpant) * (1 - usage) + vrakpant;
      console.log ("Refusjon av engangsavgift: " + result);


      res.json({ payedTax, result });
      break;

    case 2016:
      // Code to execute if expression === value2
      console.log("Case 2016");
      result = 2016;
      res.json({ result });
      break;

    case 2025:
      // Code to execute if expression === value2
      console.log("Case 2025");
      result = 2025;
      res.json({ result });
      break;
    default:
      result =
        "Bilen kvalifiseres ikke for refusjon av engangsavgift ved eksport.";
      res.json({ result });
    // Code to execute if no case matches
  }

  //const result = co2 + nox; // <-- replace with your formula
  //check result

  // console.log("The result is: " + result);
  //  res.json({ result });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
