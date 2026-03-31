import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "./supabase.js";

// ─── RATE DATA — Multi-country ────────────────────────────────────────────────
const RATE_DATA_BY_COUNTRY = {
  INR: {
    label:"India", source:"BankBazaar / Paisabazaar · March 2026",
    home:{
      govt:[
        {bank:"SBI",min:8.25,max:9.65,note:"Lowest for women; CIBIL 750+"},
        {bank:"Bank of Baroda",min:8.15,max:10.65,note:"BOB Advantage Home Loan"},
        {bank:"PNB",min:8.25,max:10.25,note:"PNB Pride for govt employees"},
        {bank:"Canara Bank",min:8.30,max:10.90,note:"Canara Home Loan scheme"},
        {bank:"Union Bank",min:8.35,max:10.75,note:"Union Home scheme"},
        {bank:"Bank of India",min:8.30,max:10.85,note:"Star Home Loan"},
        {bank:"Indian Bank",min:8.25,max:10.75,note:"IND Home Loan"},
      ],
      private:[
        {bank:"HDFC Bank",min:7.20,max:13.20,note:"CIBIL 750+ gets 7.20%"},
        {bank:"ICICI Bank",min:7.65,max:9.80,note:"iHome loan; repo-linked"},
        {bank:"Kotak Mahindra",min:7.99,max:12.00,note:"Priority customers 7.99%"},
        {bank:"Axis Bank",min:8.35,max:11.90,note:"Shubh Aarambh scheme"},
        {bank:"Federal Bank",min:8.50,max:11.50,note:"Federal Home Plus"},
        {bank:"IDFC First",min:8.65,max:13.00,note:"Flexible repayment"},
        {bank:"Yes Bank",min:9.40,max:11.00,note:"Yes Griha Loan"},
        {bank:"IndusInd",min:9.40,max:13.25,note:"IndusInd Home Loan"},
      ],
    },
    personal:{
      govt:[
        {bank:"SBI",min:10.55,max:13.05,note:"XPRESS Credit; govt salary holders"},
        {bank:"PNB",min:10.40,max:16.95,note:"PNB Personal Loan"},
        {bank:"Bank of India",min:10.85,max:14.85,note:"Star Personal Loan"},
        {bank:"Bank of Baroda",min:10.90,max:16.85,note:"Baroda Personal Loan"},
        {bank:"Union Bank",min:11.00,max:14.80,note:"Union Personal Loan"},
        {bank:"Canara Bank",min:11.90,max:15.50,note:"Canara Jeevan; salaried"},
      ],
      private:[
        {bank:"HDFC Bank",min:10.75,max:14.50,note:"Preferred for existing customers"},
        {bank:"ICICI Bank",min:10.85,max:16.00,note:"Insta Personal Loan via app"},
        {bank:"Axis Bank",min:10.99,max:22.00,note:"Rate varies by credit profile"},
        {bank:"Kotak Mahindra",min:10.99,max:24.00,note:"Lower for salary account holders"},
        {bank:"Bajaj Finserv",min:13.00,max:35.00,note:"NBFC; fast approval"},
        {bank:"IndusInd",min:14.00,max:26.00,note:"IndusInd Personal Loan"},
        {bank:"Tata Capital",min:14.99,max:30.00,note:"Tata Personal Loan"},
        {bank:"RBL Bank",min:17.50,max:26.00,note:"Quick disbursal"},
        {bank:"Yes Bank",min:19.99,max:40.00,note:"High risk pricing"},
      ],
    },
    car:{
      govt:[
        {bank:"Union Bank",min:8.70,max:10.50,note:"Union Vehicle Loan"},
        {bank:"Canara Bank",min:8.80,max:11.15,note:"Canara Vehicle Loan"},
        {bank:"PNB",min:8.75,max:9.75,note:"PNB Car Loan"},
        {bank:"SBI",min:9.15,max:10.65,note:"SBI Car Loan; concession for women"},
        {bank:"Bank of Baroda",min:9.15,max:10.65,note:"BOB Car Loan"},
        {bank:"Bank of India",min:8.85,max:10.85,note:"Star Vehicle Loan"},
      ],
      private:[
        {bank:"ICICI Bank",min:9.30,max:12.85,note:"Pre-owned car loan available"},
        {bank:"Axis Bank",min:9.25,max:13.30,note:"Axis Car Loan"},
        {bank:"HDFC Bank",min:9.40,max:12.50,note:"Fastest disbursal in India"},
        {bank:"Kotak Mahindra",min:9.50,max:14.00,note:"Easy documentation"},
        {bank:"IndusInd",min:10.00,max:16.00,note:"Quick approval"},
        {bank:"Tata Capital",min:10.99,max:16.00,note:"Tata Capital Auto Loan"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Bank of India",min:7.60,max:11.50,note:"Lowest in India; new and used"},
        {bank:"Canara Bank",min:9.25,max:13.50,note:"Canara Vehicle Loan"},
        {bank:"PNB",min:9.50,max:14.50,note:"PNB Two Wheeler Loan"},
        {bank:"Union Bank",min:9.75,max:13.50,note:"Union Two Wheeler Loan"},
        {bank:"SBI",min:11.70,max:15.70,note:"0.50% off for electric vehicles"},
      ],
      private:[
        {bank:"L&T Finance",min:8.99,max:20.00,note:"Pan-India availability"},
        {bank:"Bajaj Finserv",min:9.00,max:24.00,note:"Wide NBFC network"},
        {bank:"ICICI Bank",min:10.25,max:26.10,note:"Ranges by credit profile"},
        {bank:"Axis Bank",min:10.50,max:20.00,note:"Quick approval online"},
        {bank:"Tata Capital",min:11.49,max:22.50,note:"Tata Two Wheeler Loan"},
        {bank:"HDFC Bank",min:14.50,max:22.00,note:"Up to 100% on-road financing"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"SBI Card",min:18.00,max:42.00,note:"SBI SimplyCLICK, BPCL card"},
        {bank:"Bank of Baroda",min:18.00,max:36.00,note:"BOB Premier Card"},
        {bank:"PNB",min:21.00,max:36.00,note:"PNB Rupay Credit Card"},
        {bank:"Union Bank",min:21.00,max:36.00,note:"Union Credit Card"},
      ],
      private:[
        {bank:"HDFC Bank",min:23.88,max:43.20,note:"Varies by card tier"},
        {bank:"ICICI Bank",min:24.00,max:40.80,note:"ICICI Coral, Sapphiro range"},
        {bank:"IndusInd",min:23.88,max:43.20,note:"IndusInd Platinum Card"},
        {bank:"Kotak Mahindra",min:24.00,max:42.00,note:"Kotak Essentia, League cards"},
        {bank:"Yes Bank",min:24.00,max:48.00,note:"Yes First Exclusive Card"},
        {bank:"Axis Bank",min:25.20,max:52.80,note:"Highest penalty rate"},
        {bank:"RBL Bank",min:30.00,max:44.00,note:"Fun+ and ShopRite cards"},
      ],
    },
  },
  GBP: {
    label:"United Kingdom", source:"MoneySuperMarket / Bank of England · March 2026",
    home:{
      govt:[
        {bank:"Nationwide BS",min:4.29,max:5.99,note:"10% deposit min; fixed 2yr"},
        {bank:"Halifax",min:4.35,max:5.89,note:"Part of Lloyds Banking Group"},
        {bank:"Yorkshire BS",min:4.40,max:5.75,note:"Strong first-time buyer options"},
        {bank:"West Bromwich BS",min:4.55,max:5.95,note:"Regional building society"},
      ],
      private:[
        {bank:"Barclays",min:4.19,max:5.80,note:"Premier rate for 40%+ LTV"},
        {bank:"HSBC UK",min:4.25,max:5.90,note:"Advance mortgage; online deal"},
        {bank:"NatWest",min:4.30,max:5.95,note:"Fixed 2 & 5yr available"},
        {bank:"Lloyds Bank",min:4.35,max:6.00,note:"Club Lloyds discounts apply"},
        {bank:"Santander UK",min:4.39,max:6.10,note:"Edge Current Account discount"},
        {bank:"TSB Bank",min:4.45,max:6.25,note:"Reassuringly straightforward"},
        {bank:"Metro Bank",min:4.60,max:6.40,note:"Longer fixed terms available"},
      ],
    },
    personal:{
      govt:[
        {bank:"Nationwide BS",min:6.90,max:24.90,note:"Member rate; credit score driven"},
        {bank:"Yorkshire BS",min:7.40,max:22.90,note:"For existing mortgage holders"},
      ],
      private:[
        {bank:"HSBC UK",min:6.10,max:21.90,note:"Advance customers get best rate"},
        {bank:"Barclays",min:6.50,max:24.90,note:"Barclayloan; same day decision"},
        {bank:"Lloyds Bank",min:6.70,max:26.90,note:"Club Lloyds rate advantage"},
        {bank:"NatWest",min:6.90,max:29.90,note:"Existing customers preferred"},
        {bank:"Santander UK",min:7.00,max:28.90,note:"1|2|3 account holders benefit"},
        {bank:"Tesco Bank",min:7.30,max:29.90,note:"Clubcard points on repayments"},
        {bank:"M&S Bank",min:7.50,max:24.90,note:"Competitive mid-range rates"},
        {bank:"Virgin Money",min:8.90,max:29.90,note:"Online application only"},
      ],
    },
    car:{
      govt:[
        {bank:"Nationwide BS",min:7.90,max:15.90,note:"Unsecured; for members only"},
      ],
      private:[
        {bank:"Black Horse (Lloyds)",min:5.90,max:19.90,note:"Largest UK motor finance lender"},
        {bank:"Santander Consumer",min:6.40,max:18.90,note:"Wide dealer network"},
        {bank:"HSBC UK",min:6.50,max:16.90,note:"Advance account rate"},
        {bank:"Barclays Partner Finance",min:6.90,max:18.90,note:"Dealer-linked finance"},
        {bank:"NatWest",min:7.10,max:20.90,note:"Fixed-rate hire purchase"},
        {bank:"Close Brothers",min:7.50,max:22.90,note:"Specialist motor finance"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Nationwide BS",min:8.90,max:18.90,note:"Personal loan used for bike"},
      ],
      private:[
        {bank:"Barclays",min:7.90,max:20.90,note:"Personal loan route"},
        {bank:"NatWest",min:8.20,max:21.90,note:"Available for bikes over £1k"},
        {bank:"Moto Finance",min:9.90,max:29.90,note:"Specialist motorcycle lender"},
        {bank:"Hitachi Capital",min:9.90,max:24.90,note:"Two-wheel specialist"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"Nationwide BS",min:15.90,max:24.90,note:"Member Visa card rates"},
        {bank:"Yorkshire BS",min:17.90,max:27.90,note:"Visa credit card"},
      ],
      private:[
        {bank:"Barclaycard",min:21.90,max:34.90,note:"Avios & rewards variants"},
        {bank:"HSBC UK",min:22.90,max:35.90,note:"Advance Visa card"},
        {bank:"NatWest",min:19.90,max:34.90,note:"Reward Black card"},
        {bank:"Lloyds Bank",min:20.90,max:39.90,note:"Avios and Cashback cards"},
        {bank:"Santander UK",min:21.90,max:34.90,note:"All in One card"},
        {bank:"American Express UK",min:24.50,max:31.00,note:"Platinum Cashback Everyday"},
        {bank:"Virgin Money",min:19.90,max:30.90,note:"Virgin Atlantic rewards"},
      ],
    },
  },
  USD: {
    label:"United States", source:"Bankrate / CFPB · March 2026",
    home:{
      govt:[
        {bank:"Navy Federal CU",min:5.75,max:7.25,note:"Military & family only; no PMI"},
        {bank:"Pentagon FCU",min:5.85,max:7.50,note:"Credit union; low fees"},
        {bank:"Alliant CU",min:5.99,max:7.60,note:"Online-first; strong rates"},
        {bank:"First Tech FCU",min:6.10,max:7.75,note:"Tech sector focus"},
      ],
      private:[
        {bank:"Rocket Mortgage",min:6.15,max:7.85,note:"Largest US mortgage lender"},
        {bank:"Chase Bank",min:6.25,max:7.90,note:"Premier client rate advantage"},
        {bank:"Bank of America",min:6.30,max:7.95,note:"Preferred Rewards discount"},
        {bank:"Wells Fargo",min:6.35,max:8.10,note:"Conventional 30yr fixed"},
        {bank:"US Bank",min:6.40,max:8.15,note:"Strong Midwest presence"},
        {bank:"Citibank",min:6.45,max:8.20,note:"Citi Priority rate"},
        {bank:"PNC Bank",min:6.50,max:8.30,note:"Fixed & ARM options"},
        {bank:"Truist",min:6.55,max:8.50,note:"Southeast/Mid-Atlantic lender"},
      ],
    },
    personal:{
      govt:[
        {bank:"Navy Federal CU",min:7.49,max:18.00,note:"Best rates for military members"},
        {bank:"Pentagon FCU",min:7.74,max:17.99,note:"Wide product range"},
        {bank:"Alliant CU",min:7.99,max:27.24,note:"No origination fee"},
        {bank:"First Tech FCU",min:8.49,max:18.00,note:"Up to $50k"},
      ],
      private:[
        {bank:"LightStream (Truist)",min:7.49,max:25.49,note:"Rate beat program; no fees"},
        {bank:"SoFi",min:8.99,max:29.49,note:"No fees; unemployment protection"},
        {bank:"Marcus (Goldman)",min:6.99,max:24.99,note:"No fees; flexible terms"},
        {bank:"Discover",min:7.99,max:24.99,note:"Fixed rates; 3-7yr terms"},
        {bank:"Wells Fargo",min:7.49,max:23.24,note:"Relationship discount available"},
        {bank:"Citibank",min:8.99,max:29.99,note:"Citi Flex Loan option"},
        {bank:"Avant",min:9.95,max:35.99,note:"Fair-credit borrowers welcome"},
        {bank:"Upstart",min:7.80,max:35.99,note:"AI-driven underwriting"},
      ],
    },
    car:{
      govt:[
        {bank:"Navy Federal CU",min:4.54,max:18.00,note:"New & used; military members"},
        {bank:"Pentagon FCU",min:4.74,max:17.99,note:"100% financing available"},
        {bank:"Alliant CU",min:5.24,max:24.99,note:"Fast online decision"},
      ],
      private:[
        {bank:"Chase Auto",min:5.09,max:14.93,note:"Dealer finance network"},
        {bank:"Bank of America",min:5.39,max:19.99,note:"Preferred Rewards rate cut"},
        {bank:"Capital One",min:5.49,max:24.99,note:"Pre-qualify without hard pull"},
        {bank:"Carvana Finance",min:6.15,max:27.90,note:"Online-only dealer"},
        {bank:"Wells Fargo",min:5.75,max:20.99,note:"In-dealer financing"},
        {bank:"Consumers CU",min:5.24,max:17.75,note:"Strong used car rates"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Navy Federal CU",min:7.49,max:18.00,note:"Personal loan for bikes"},
        {bank:"Alliant CU",min:7.99,max:27.24,note:"Used for powersport loans"},
      ],
      private:[
        {bank:"Eaglemark Savings",min:6.99,max:19.99,note:"Harley-Davidson financial arm"},
        {bank:"Sheffield Financial",min:8.99,max:24.99,note:"Powersports specialist"},
        {bank:"LightStream",min:7.49,max:25.49,note:"Best overall bike loan"},
        {bank:"Chase Bank",min:9.50,max:22.00,note:"Personal loan route"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"Navy Federal CU",min:9.65,max:18.00,note:"Lowest rate in US market"},
        {bank:"Pentagon FCU",min:12.99,max:17.99,note:"Low-rate Visa card"},
        {bank:"Alliant CU",min:12.24,max:27.24,note:"Visa Signature cashback"},
      ],
      private:[
        {bank:"Chase Sapphire",min:21.49,max:28.49,note:"Travel rewards flagship"},
        {bank:"American Express",min:19.99,max:29.99,note:"Blue Cash Everyday"},
        {bank:"Citi Double Cash",min:19.24,max:29.24,note:"2% cashback flat"},
        {bank:"Capital One Venture",min:19.99,max:29.99,note:"Travel miles card"},
        {bank:"Discover it",min:17.24,max:28.24,note:"Cashback match year one"},
        {bank:"Wells Fargo Active Cash",min:20.24,max:29.99,note:"2% unlimited cashback"},
        {bank:"Bank of America Premium",min:21.24,max:29.24,note:"Preferred Rewards bonus"},
      ],
    },
  },
  EUR: {
    label:"Europe (EU)", source:"ECB / Statista · March 2026",
    home:{
      govt:[
        {bank:"Credit Agricole (FR)",min:3.50,max:4.90,note:"Pret immobilier; fixed 20yr"},
        {bank:"Caisse d'Epargne (FR)",min:3.55,max:5.00,note:"Popular French mutual bank"},
        {bank:"Sparkasse (DE)",min:3.80,max:5.50,note:"Germany's largest savings bank"},
        {bank:"Volksbank (DE)",min:3.85,max:5.60,note:"Cooperative banking network"},
      ],
      private:[
        {bank:"BNP Paribas",min:3.45,max:5.10,note:"Eurozone leader; online rate"},
        {bank:"Deutsche Bank",min:3.65,max:5.30,note:"Baufinanzierung product"},
        {bank:"Santander ES",min:3.70,max:5.40,note:"Spanish fixed-rate mortgage"},
        {bank:"ING Direct",min:3.60,max:5.20,note:"Online-first; low fees"},
        {bank:"ABN AMRO (NL)",min:3.75,max:5.35,note:"Strong Dutch mortgage market"},
        {bank:"UniCredit (IT)",min:3.90,max:5.60,note:"Italian market leader"},
        {bank:"BBVA (ES)",min:3.80,max:5.50,note:"Spain's 2nd largest bank"},
      ],
    },
    personal:{
      govt:[
        {bank:"Caisse d'Epargne (FR)",min:4.90,max:12.90,note:"Consumer credit; French regulation"},
        {bank:"Sparkasse (DE)",min:5.50,max:11.90,note:"Ratenkredit; German market"},
      ],
      private:[
        {bank:"ING Direct",min:4.50,max:13.90,note:"Online personal loan; quick approval"},
        {bank:"BNP Paribas",min:4.90,max:14.90,note:"Personal Loan; flexible tenure"},
        {bank:"Deutsche Bank",min:5.20,max:12.50,note:"InstantCredit online product"},
        {bank:"Santander ES",min:5.50,max:16.90,note:"Consumer loan; Spain focus"},
        {bank:"N26",min:3.69,max:21.90,note:"Neobank; Germany/Austria best rate"},
        {bank:"Younited Credit",min:5.19,max:19.99,note:"EU fintech lender; fast"},
      ],
    },
    car:{
      govt:[
        {bank:"Sparkasse (DE)",min:4.90,max:9.90,note:"Autokredit; new & used"},
        {bank:"Volksbank (DE)",min:4.99,max:10.50,note:"VW dealer network partner"},
      ],
      private:[
        {bank:"Volkswagen Bank",min:3.99,max:8.99,note:"Manufacturer captive finance"},
        {bank:"BMW Financial Services",min:4.50,max:9.50,note:"Joy of driving finance"},
        {bank:"BNP Paribas Leasing",min:4.90,max:11.90,note:"Fleet & personal auto"},
        {bank:"Santander Consumer",min:5.20,max:12.50,note:"Pan-EU auto lender"},
        {bank:"ING Direct",min:5.50,max:13.90,note:"Personal loan for car"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Sparkasse (DE)",min:5.90,max:12.90,note:"Zweirad loan product"},
      ],
      private:[
        {bank:"BNP Paribas Leasing",min:5.50,max:14.90,note:"Moto finance across EU"},
        {bank:"Santander Consumer",min:6.90,max:17.90,note:"Powersports lending"},
        {bank:"ING Direct",min:6.50,max:16.90,note:"Personal loan for moto"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"Caisse d'Epargne (FR)",min:15.90,max:21.90,note:"Visa Classic rate"},
        {bank:"Sparkasse (DE)",min:16.90,max:22.90,note:"Sparkassen-Card Kredit"},
      ],
      private:[
        {bank:"BNP Paribas",min:15.90,max:23.90,note:"Visa card; revolving credit"},
        {bank:"Deutsche Bank",min:16.90,max:22.90,note:"MasterCard Gold rate"},
        {bank:"N26",min:9.00,max:19.90,note:"Neobank; best EU rate"},
        {bank:"Santander ES",min:18.90,max:26.90,note:"1|2|3 Mastercard"},
        {bank:"ING Direct",min:17.90,max:24.90,note:"Orange credit card"},
        {bank:"Revolut (EUR)",min:16.00,max:25.00,note:"Metal card revolving rate"},
      ],
    },
  },
  AUD: {
    label:"Australia", source:"RBA / Canstar · March 2026",
    home:{
      govt:[
        {bank:"Commonwealth Bank",min:5.89,max:7.44,note:"Owner-occupied; P&I; 80% LVR"},
        {bank:"NAB",min:5.94,max:7.55,note:"Base Variable Rate Loan"},
        {bank:"Westpac",min:6.04,max:7.69,note:"Rocket Repay home loan"},
        {bank:"ANZ",min:6.14,max:7.74,note:"ANZ Plus; digital-only rate"},
      ],
      private:[
        {bank:"Macquarie Bank",min:5.79,max:7.25,note:"Offset account included"},
        {bank:"ING Australia",min:5.84,max:7.34,note:"Orange Advantage; no annual fee"},
        {bank:"Athena Home Loans",min:5.69,max:7.19,note:"Online-only; rate match guarantee"},
        {bank:"Reduce Home Loans",min:5.59,max:6.99,note:"Lowest variable rate online"},
        {bank:"HSBC Australia",min:5.99,max:7.49,note:"Premier rate for $100k+ balance"},
        {bank:"Bank of Queensland",min:6.09,max:7.59,note:"Economy Variable Rate"},
      ],
    },
    personal:{
      govt:[
        {bank:"Commonwealth Bank",min:8.99,max:20.99,note:"NetBank personal loan"},
        {bank:"NAB",min:9.99,max:20.49,note:"Unsecured fixed-rate"},
        {bank:"Westpac",min:10.99,max:23.99,note:"Flexi Loan option"},
        {bank:"ANZ",min:9.99,max:19.99,note:"Fixed; no early repayment fee"},
      ],
      private:[
        {bank:"SocietyOne",min:6.99,max:25.49,note:"P2P lender; credit score driven"},
        {bank:"Wisr",min:7.95,max:25.95,note:"Purpose-based loan products"},
        {bank:"Latitude",min:9.99,max:29.99,note:"Same-day approval common"},
        {bank:"Plenti",min:7.39,max:26.49,note:"Low fees; fast approval"},
        {bank:"MoneyPlace",min:8.49,max:26.99,note:"Online fintech lender"},
      ],
    },
    car:{
      govt:[
        {bank:"Commonwealth Bank",min:7.99,max:14.99,note:"Secured car loan"},
        {bank:"NAB",min:7.69,max:14.49,note:"Online application; 1 day settlement"},
        {bank:"Westpac",min:8.49,max:15.99,note:"Flexible secured auto"},
        {bank:"ANZ",min:7.95,max:14.90,note:"Secured; 1-7yr term"},
      ],
      private:[
        {bank:"Pepper Money",min:6.99,max:18.99,note:"Flexible credit criteria"},
        {bank:"Macquarie Leasing",min:7.49,max:15.49,note:"Business & consumer auto"},
        {bank:"BOQ Finance",min:7.99,max:16.49,note:"Used car specialist"},
        {bank:"Latitude Finance",min:9.99,max:27.99,note:"Quick decision"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Commonwealth Bank",min:8.99,max:18.99,note:"Personal loan for motorcycles"},
        {bank:"NAB",min:9.99,max:20.49,note:"Unsecured personal loan route"},
      ],
      private:[
        {bank:"Pepper Money",min:7.99,max:21.99,note:"Motorcycle & powersport loans"},
        {bank:"Macquarie",min:8.49,max:18.99,note:"Bike finance; quick online"},
        {bank:"Latitude",min:9.99,max:29.99,note:"Personal loan for moto"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"Commonwealth Bank",min:14.99,max:21.99,note:"Low Rate credit card"},
        {bank:"NAB",min:13.99,max:21.74,note:"NAB Low Rate Card — best big-4"},
        {bank:"Westpac",min:13.99,max:21.99,note:"Low Rate Mastercard"},
        {bank:"ANZ",min:13.99,max:22.74,note:"First 0% intro offer available"},
      ],
      private:[
        {bank:"Bankwest Zero Mastercard",min:9.90,max:9.90,note:"Lowest rate card in Australia"},
        {bank:"ING Australia",min:9.99,max:11.99,note:"Orange One low-rate card"},
        {bank:"Coles Mastercard",min:12.99,max:19.99,note:"Low ongoing rate"},
        {bank:"Latitude 28° Global",min:21.99,max:27.99,note:"Travel card; no FX fees"},
        {bank:"American Express AU",min:20.74,max:23.99,note:"Qantas & rewards tiers"},
      ],
    },
  },
  CAD: {
    label:"Canada", source:"Ratehub / FCAC · March 2026",
    home:{
      govt:[
        {bank:"Desjardins",min:4.79,max:6.49,note:"Quebec cooperative; strong rates"},
        {bank:"Meridian CU",min:4.89,max:6.59,note:"Ontario's largest credit union"},
        {bank:"First National",min:4.64,max:6.39,note:"Canada's largest non-bank lender"},
      ],
      private:[
        {bank:"RBC Royal Bank",min:4.95,max:6.65,note:"Homeline Plan; variable option"},
        {bank:"TD Canada Trust",min:4.99,max:6.70,note:"TD Mortgage Prime -0.35%"},
        {bank:"Scotiabank",min:5.04,max:6.75,note:"eHOME digital mortgage"},
        {bank:"BMO",min:5.09,max:6.80,note:"BMO Smart Fixed Mortgage"},
        {bank:"CIBC",min:5.14,max:6.85,note:"CIBC Variable Flex mortgage"},
        {bank:"Tangerine",min:4.79,max:6.44,note:"Online-only; no-frills rates"},
        {bank:"Nesto",min:4.69,max:6.29,note:"Digital broker; best execution"},
      ],
    },
    personal:{
      govt:[
        {bank:"Desjardins",min:8.99,max:19.99,note:"Pret personnel; cooperative rate"},
        {bank:"Meridian CU",min:9.49,max:19.99,note:"Personal loan for members"},
      ],
      private:[
        {bank:"TD Canada Trust",min:8.99,max:22.99,note:"Fixed-rate personal loan"},
        {bank:"RBC",min:9.50,max:22.49,note:"RBC Personal Loan options"},
        {bank:"Scotiabank",min:9.99,max:22.99,note:"Scotia Personal Loan"},
        {bank:"CIBC",min:10.25,max:22.49,note:"CIBC Personal Loan"},
        {bank:"LoanConnect",min:6.99,max:46.96,note:"Fintech marketplace; wide range"},
        {bank:"Fairstone",min:19.99,max:34.99,note:"Near-prime lender"},
      ],
    },
    car:{
      govt:[
        {bank:"Desjardins",min:6.49,max:11.99,note:"Auto financing; new & used"},
        {bank:"Meridian CU",min:6.99,max:12.49,note:"Rate match available"},
      ],
      private:[
        {bank:"TD Auto Finance",min:6.49,max:15.99,note:"Canada's #1 auto lender"},
        {bank:"RBC Auto Loan",min:6.74,max:14.99,note:"Dealer & direct financing"},
        {bank:"Scotiabank Drive",min:6.99,max:16.49,note:"ScotiaLine for Auto"},
        {bank:"CIBC Auto",min:7.25,max:15.99,note:"Fixed & variable rate"},
        {bank:"CarFinance.ca",min:7.99,max:29.99,note:"Marketplace for all credit"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Desjardins",min:8.49,max:14.99,note:"Moto loan; cooperative"},
      ],
      private:[
        {bank:"TD Canada Trust",min:8.99,max:22.99,note:"Personal loan for motorcycles"},
        {bank:"Harley-Davidson Financial CA",min:7.99,max:21.99,note:"Manufacturer captive"},
        {bank:"BMO",min:9.49,max:18.99,note:"Personal loan route"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"Desjardins Visa",min:10.90,max:19.90,note:"Opus card — lowest rate in CA"},
        {bank:"Meridian CU Visa",min:11.99,max:19.99,note:"Low-rate member card"},
      ],
      private:[
        {bank:"RBC Low Rate Visa",min:12.99,max:12.99,note:"Fixed 12.99% — predictable"},
        {bank:"MBNA True Line",min:12.99,max:12.99,note:"0% balance transfer offers"},
        {bank:"BMO Preferred Rate",min:13.99,max:13.99,note:"Best big-bank low-rate card"},
        {bank:"Scotiabank Value Visa",min:13.99,max:13.99,note:"No annual fee option"},
        {bank:"TD Emerald Flex Rate",min:15.97,max:15.97,note:"Prime + 4.5% variable rate"},
      ],
    },
  },
  SGD: {
    label:"Singapore", source:"MAS / SingSaver · March 2026",
    home:{
      govt:[
        {bank:"HDB Concessionary Loan",min:2.60,max:2.60,note:"Pegged at CPF OA rate +0.1%; HDB flats only"},
      ],
      private:[
        {bank:"DBS Bank",min:3.48,max:4.40,note:"DBS HomeLoan; SORA-pegged"},
        {bank:"OCBC Bank",min:3.52,max:4.50,note:"OCBC Home Loan; 2-yr fixed"},
        {bank:"UOB",min:3.55,max:4.55,note:"UOB One Mortgage; offset"},
        {bank:"Standard Chartered",min:3.60,max:4.65,note:"MortgageOne account linked"},
        {bank:"Citibank SG",min:3.70,max:4.75,note:"Citi Mortgage; bundled savings"},
        {bank:"HSBC SG",min:3.75,max:4.80,note:"HSBC SmartMortgage"},
        {bank:"Maybank SG",min:3.65,max:4.60,note:"Fixed rate 3yr packages"},
      ],
    },
    personal:{
      govt:[
        {bank:"POSB",min:3.88,max:6.00,note:"Everyday loan; DBS subsidiary"},
      ],
      private:[
        {bank:"DBS CashLine",min:9.80,max:20.00,note:"Revolving credit line"},
        {bank:"OCBC ExtraCash",min:9.96,max:20.88,note:"Up to 6x monthly salary"},
        {bank:"UOB Personal Loan",min:9.88,max:20.00,note:"Fixed repayment; fast approval"},
        {bank:"Standard Chartered CashOne",min:6.99,max:11.50,note:"Lowest EIR in Singapore"},
        {bank:"Citi Quick Cash",min:8.50,max:14.90,note:"Cardmember exclusive rate"},
        {bank:"HSBC Personal Loan",min:9.00,max:15.00,note:"Flexible tenure"},
        {bank:"Maybank CreditAble",min:9.80,max:20.00,note:"Revolving facility"},
      ],
    },
    car:{
      govt:[
        {bank:"POSB Car Loan",min:2.48,max:3.50,note:"DBS subsidiary; fixed flat rate"},
      ],
      private:[
        {bank:"DBS Car Loan",min:2.48,max:3.50,note:"Up to 70% financing"},
        {bank:"OCBC Car Loan",min:2.50,max:3.60,note:"New & used; 7yr max"},
        {bank:"UOB Car Loan",min:2.58,max:3.68,note:"Package with UOB Mastercard"},
        {bank:"Maybank Car Loan",min:2.68,max:3.80,note:"Hire purchase"},
        {bank:"Hong Leong Finance",min:2.78,max:3.98,note:"Specialist vehicle lender"},
        {bank:"Singapura Finance",min:2.88,max:4.10,note:"Local specialist"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"POSB",min:3.00,max:4.50,note:"Motorcycle loan; DBS group"},
      ],
      private:[
        {bank:"DBS",min:3.00,max:4.50,note:"Motorcycle financing"},
        {bank:"OCBC",min:3.20,max:4.80,note:"Bike loan; up to 70% financing"},
        {bank:"Maybank SG",min:3.30,max:5.00,note:"Hire purchase for bikes"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"POSB Everyday Card",min:25.90,max:27.90,note:"DBS basic card; cashback"},
      ],
      private:[
        {bank:"Standard Chartered Spree",min:24.99,max:26.99,note:"Lowest revolving rate in SG"},
        {bank:"DBS Live Fresh",min:25.90,max:27.90,note:"Best cashback for youth"},
        {bank:"OCBC 365 Card",min:25.92,max:27.90,note:"Best dining & grocery card"},
        {bank:"UOB One Card",min:25.90,max:27.80,note:"Quarterly cashback rebates"},
        {bank:"Citi Rewards Card",min:25.90,max:28.80,note:"Best for Grab & online spend"},
        {bank:"American Express SG",min:25.90,max:29.82,note:"Membership Rewards points"},
        {bank:"HSBC Revolution Card",min:25.90,max:28.50,note:"10x reward points on online"},
      ],
    },
  },
  JPY: {
    label:"Japan", source:"BOJ / Nikkei · March 2026",
    home:{
      govt:[
        {bank:"Japan Housing Finance Agency",min:1.82,max:2.10,note:"Flat 35 — govt-backed fixed"},
        {bank:"Yucho Bank (Post)",min:1.90,max:2.50,note:"Japan Post Bank mortgage"},
      ],
      private:[
        {bank:"SBI Mortgage",min:0.43,max:1.95,note:"Lowest variable rate in Japan"},
        {bank:"Rakuten Bank",min:0.49,max:1.99,note:"Online-only; no branch fees"},
        {bank:"SMBC (Sumitomo Mitsui)",min:0.55,max:2.10,note:"MixMode fixed/variable"},
        {bank:"Mizuho Bank",min:0.59,max:2.20,note:"Mizuho Home Loan"},
        {bank:"MUFG (Bank of Tokyo)",min:0.62,max:2.30,note:"Fixed 10yr option"},
        {bank:"Resona Bank",min:0.55,max:2.15,note:"Flat-rate 35yr option"},
        {bank:"Sony Bank",min:0.47,max:1.97,note:"Online; rate change annual"},
      ],
    },
    personal:{
      govt:[
        {bank:"Japan Finance Corp",min:2.05,max:3.50,note:"Govt SME & consumer loans"},
        {bank:"Yucho Bank",min:3.00,max:7.00,note:"Consumer loan; postal network"},
      ],
      private:[
        {bank:"Acom (MUFG)",min:3.00,max:18.00,note:"Consumer finance; convenience"},
        {bank:"Promise (SMBC)",min:4.50,max:17.80,note:"Quick unsecured loan"},
        {bank:"Aiful",min:3.00,max:18.00,note:"Speed approval app"},
        {bank:"Rakuten Bank",min:1.90,max:14.50,note:"Web-only; lowest rate"},
        {bank:"Sumitomo Mitsui",min:2.80,max:14.50,note:"Card loan product"},
        {bank:"Mizuho",min:2.00,max:14.00,note:"Mizuho Card Loan"},
      ],
    },
    car:{
      govt:[
        {bank:"Japan Finance Corp",min:2.10,max:3.90,note:"For SMEs buying vehicles"},
        {bank:"Yucho Bank",min:3.30,max:6.50,note:"My Car Loan"},
      ],
      private:[
        {bank:"Toyota Financial Services",min:1.90,max:4.90,note:"Captive manufacturer finance"},
        {bank:"Honda Finance",min:2.10,max:5.10,note:"Dream loan product"},
        {bank:"Orico",min:2.90,max:7.90,note:"Used car specialist"},
        {bank:"SBI Finance",min:2.50,max:6.50,note:"Online auto loan"},
        {bank:"JACCS",min:3.00,max:8.00,note:"Dealer network finance"},
      ],
    },
    twowheeler:{
      govt:[
        {bank:"Japan Finance Corp",min:2.50,max:4.50,note:"Motorcycle under 250cc"},
      ],
      private:[
        {bank:"Honda Finance",min:3.00,max:6.90,note:"Honda Dreams bike loan"},
        {bank:"Yamaha Motor Finance",min:3.20,max:7.20,note:"YMF loan program"},
        {bank:"Orico",min:3.90,max:9.90,note:"All brands; used bikes"},
      ],
    },
    creditcard:{
      govt:[
        {bank:"Japan Post Bank",min:14.40,max:18.00,note:"JP Bank Visa"},
      ],
      private:[
        {bank:"Rakuten Card",min:15.00,max:18.00,note:"Japan's most popular card"},
        {bank:"SBI Cards",min:15.00,max:18.00,note:"V Platform Visa"},
        {bank:"Epos Card (Marui)",min:15.00,max:18.00,note:"Shopping mall rewards"},
        {bank:"Orico Card THE POINT",min:15.00,max:18.00,note:"Points-heavy card"},
        {bank:"JCB Gold",min:10.00,max:18.00,note:"Japanese domestic network"},
        {bank:"Mitsui Sumitomo Visa",min:15.00,max:18.00,note:"Big 3 bank credit card"},
        {bank:"MUFG Mastercard",min:15.00,max:18.00,note:"Bank of Tokyo-Mitsubishi"},
      ],
    },
  },
};
// Backward compat alias for any remaining references
const RATE_DATA = RATE_DATA_BY_COUNTRY.INR;

const CURRENCIES=[{code:"INR",symbol:"\u20B9",country:"India",flag:"\uD83C\uDDEE\uD83C\uDDF3"},{code:"USD",symbol:"$",country:"United States",flag:"\uD83C\uDDFA\uD83C\uDDF8"},{code:"GBP",symbol:"\u00A3",country:"UK",flag:"\uD83C\uDDEC\uD83C\uDDE7"},{code:"EUR",symbol:"\u20AC",country:"Europe",flag:"\uD83C\uDDEA\uD83C\uDDFA"},{code:"JPY",symbol:"\u00A5",country:"Japan",flag:"\uD83C\uDDEF\uD83C\uDDF5"},{code:"AUD",symbol:"A$",country:"Australia",flag:"\uD83C\uDDE6\uD83C\uDDFA"},{code:"CAD",symbol:"C$",country:"Canada",flag:"\uD83C\uDDE8\uD83C\uDDE6"},{code:"SGD",symbol:"S$",country:"Singapore",flag:"\uD83C\uDDF8\uD83C\uDDEC"}];
const EXPENSE_CATS=[{id:"rent",label:"Rent / Mortgage"},{id:"emi",label:"Loan EMI"},{id:"grocery",label:"Groceries"},{id:"utilities",label:"Utilities"},{id:"transport",label:"Transport"},{id:"health",label:"Healthcare"},{id:"education",label:"Education"},{id:"entertain",label:"Entertainment"},{id:"dining",label:"Dining"},{id:"savings",label:"Savings"},{id:"insurance",label:"Insurance"},{id:"shopping",label:"Shopping"},{id:"misc",label:"Miscellaneous"},{id:"custom",label:"Custom (type below)"}];
const LOAN_TYPES=["Home Loan","Car Loan","Personal Loan","Business Loan","Education Loan","Two Wheeler Loan"];
const GOAL_LABELS=["Home","Vehicle","Travel","Education","Electronics","Wedding","Business","Emergency Fund","Retirement","Health","Other"];
const INVEST_CATS=[{id:"equity",label:"Equity / Stocks",color:"#3B82F6"},{id:"mf",label:"Mutual Funds",color:"#6366F1"},{id:"sip",label:"SIP",color:"#8B5CF6"},{id:"gold",label:"Gold / Silver",color:"#F59E0B"},{id:"ppf",label:"PPF",color:"#10B981"},{id:"pf",label:"PF / EPF",color:"#34D399"},{id:"largecap",label:"Large Cap",color:"#60A5FA"},{id:"midcap",label:"Mid Cap",color:"#A78BFA"},{id:"smallcap",label:"Small Cap",color:"#F472B6"},{id:"fd",label:"Fixed Deposit",color:"#2DD4BF"},{id:"realestate",label:"Real Estate",color:"#F97316"},{id:"crypto",label:"Crypto",color:"#FB923C"},{id:"bonds",label:"Bonds",color:"#22D3EE"},{id:"other",label:"Other",color:"#94A3B8"}];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_S=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Navigation — Budget, Invest, Loans, Score in main bar; Tools in dropdown
const PRIMARY_TABS=["Budget","Invest","Loans","Score"];
const SECONDARY_TABS=["Tools"];

const calcEMI=(p,r,n)=>{const m=r/12/100;if(m===0)return p/n;return(p*m*Math.pow(1+m,n))/(Math.pow(1+m,n)-1);};
// ─── FORMATTING ───────────────────────────────────────────────────────────────
const LOCALE_MAP={INR:"en-IN",USD:"en-US",GBP:"en-GB",EUR:"de-DE",JPY:"ja-JP",AUD:"en-AU",CAD:"en-CA",SGD:"en-SG"};

// Full exact format — ₹87,500 or ₹87,500.25
const fmt=(n,sym,cur)=>{
  if(n===undefined||n===null||isNaN(n))return sym+"0";
  const a=Math.abs(n),sg=n<0?"-":"";
  const locale=LOCALE_MAP[cur]||"en-US";
  const hasDec=a!==Math.floor(a);
  try{
    const f=new Intl.NumberFormat(locale,{
      minimumFractionDigits:hasDec?2:0,
      maximumFractionDigits:hasDec?2:0,
    });
    return sg+sym+f.format(a);
  }catch{
    return sg+sym+a.toLocaleString(locale,{minimumFractionDigits:hasDec?2:0,maximumFractionDigits:hasDec?2:0});
  }
};

// Compact format — ₹87K, ₹1.2L, ₹1.5Cr (Indian) or $87K, $1.2M (others)
const fmtCompact=(n,sym,cur)=>{
  if(n===undefined||n===null||isNaN(n))return sym+"0";
  const a=Math.abs(n),sg=n<0?"-":"";
  if(cur==="INR"){
    if(a>=10000000)return sg+sym+(a/10000000).toFixed(2)+"Cr";
    if(a>=100000) return sg+sym+(a/100000).toFixed(2)+"L";
    if(a>=1000)   return sg+sym+(a/1000).toFixed(0)+"K";
    return sg+sym+Math.round(a);
  }
  if(a>=1000000000)return sg+sym+(a/1000000000).toFixed(2)+"B";
  if(a>=1000000)   return sg+sym+(a/1000000).toFixed(2)+"M";
  if(a>=1000)      return sg+sym+(a/1000).toFixed(0)+"K";
  return sg+sym+Math.round(a);
};

// Dual display: exact primary + compact secondary shown inline where needed
const TODAY=new Date();

const LIGHT={bg:"#F4F6FB",white:"#FFFFFF",card:"#FFFFFF",input:"#ECEEF5",border:"#DDE1ED",borderMid:"#C4CBDE",ink:"#0E1523",inkMid:"#3D4B6A",inkLo:"#7A87A8",blue:"#3B5BDB",blueSoft:"#EEF2FF",blueMid:"#4C6EF5",green:"#0D7A55",greenSoft:"#E6F9F3",red:"#C0273E",redSoft:"#FEF0F2",amber:"#9E5C00",amberSoft:"#FFF8EC",steel:"#4A5578"};
const DARK={bg:"#070C18",white:"#0C1528",card:"#0C1528",input:"#080F1E",border:"#182035",borderMid:"#263350",ink:"#E8EFFF",inkMid:"#7A8FB8",inkLo:"#3A4F70",blue:"#5C83FF",blueSoft:"#0E1A3F",blueMid:"#7496FF",green:"#0EC47A",greenSoft:"#041E12",red:"#FF6B7A",redSoft:"#220A10",amber:"#F0B429",amberSoft:"#1A1000",steel:"#5C7099"};

const INVEST_TOASTS=["Investment logged. Compound interest starts now.","Added. Time is working for you.","Your future self just got richer.","Invested. Every rupee multiplies silently."];
const GOAL_MSGS=["Closer than you were yesterday.","Progress made. Every rupee counts.","Goal updated. Keep going.","One step closer."];

// ─── PRIVACY & COPYRIGHT TEXT ─────────────────────────────────────────────────
const PRIVACY_TEXT="Privacy Policy\nLast updated: March 2026\n\n1. DATA STORAGE\nAll your financial data is stored securely in Supabase cloud infrastructure. We do not sell, share, or transmit your personal or financial data to any third party, ever.\n\n2. ACCOUNT SECURITY\nPasswords are hashed using industry-standard bcrypt via Supabase Auth. We never store or see your plain-text password. Your credentials never leave the secure Supabase environment.\n\n3. DATA YOU PROVIDE\nYou provide: email address, income figures, expense amounts, loan details, investment data, and savings goals. This data is used solely to display your personal financial clarity within the app.\n\n4. DATA RETENTION\nYour data is retained as long as your account exists. You may permanently delete all data or your entire account at any time from Settings.\n\n5. COOKIES AND TRACKING\nFinlyo does not use advertising cookies, tracking pixels, or analytics that identify you personally.\n\n6. CHILDREN\nFinlyo is not intended for users under the age of 13.\n\n7. CONTACT\nFor any privacy concerns, contact the developer via the GitHub repository.\n\nCopyright Notice\n\nCopyright 2026 Finlyo. All rights reserved.\n\nFinlyo, its name, logo, design, interface, code, and financial content are original works protected under applicable copyright law.\n\nYou may not reproduce, distribute, modify, create derivative works from, or commercially exploit any part of this application without express written permission from the copyright holder.\n\nThis app is built for personal use. Unauthorized copying or redistribution is strictly prohibited.";

const TERMS_TEXT="Terms of Use\nLast updated: March 2026\n\n1. ACCEPTANCE\nBy using Finlyo, you agree to these Terms of Use. If you do not agree, do not use the app.\n\n2. NO FINANCIAL ADVICE\nAll content in Finlyo including interest rate data, calculators, and articles is for educational and informational purposes only. It does not constitute financial, investment, tax, or legal advice. Always consult a registered financial advisor before making decisions.\n\n3. ACCURACY OF DATA\nInterest rates shown are sourced from public data as of March 2026 and may have changed. Always verify rates directly with banks before applying.\n\n4. YOUR RESPONSIBILITY\nYou are responsible for the accuracy of data you enter. Finlyo is not liable for financial decisions made based on data you input or content displayed.\n\n5. SERVICE AVAILABILITY\nFinlyo is provided as-is. We do not guarantee uninterrupted availability and may update or discontinue features at any time.\n\n6. LIMITATION OF LIABILITY\nTo the maximum extent permitted by law, Finlyo and its developer shall not be liable for any indirect, incidental, or consequential damages arising from your use of this app.";

// ─── HEALTH SCORE ─────────────────────────────────────────────────────────────
function calcHealthScore(income,expenses,loans,goals,invests){
  if(!income||income===0)return{score:0,savings:0,spending:0,debt:0,growth:0,savPct:"0.0"};
  const totExp=expenses.reduce((s,e)=>s+e.amount,0);
  const savPct=((income-totExp)/income)*100;
  const totLoan=loans.reduce((s,l)=>s+l.remaining,0);
  const totInv=invests.reduce((s,i)=>s+i.invested,0);
  const goalsProgress=goals.length>0?goals.reduce((s,g)=>s+(g.target>0?g.saved/g.target:0),0)/goals.length*100:50;
  const savScore=Math.min(30,(savPct/30)*30);
  const spendRatio=totExp/income;
  const spendScore=Math.max(0,30-(spendRatio>0.5?(spendRatio-0.5)*60:0));
  const debtRatio=Math.min(1,totLoan/(income*12));
  const debtScore=Math.max(0,20-debtRatio*20);
  const growthScore=Math.min(20,(totInv>0?10:0)+(goals.length>0?5:0)+(goalsProgress>50?5:0));
  return{score:Math.round(savScore+spendScore+debtScore+growthScore),savings:Math.round(savScore),spending:Math.round(spendScore),debt:Math.round(debtScore),growth:Math.round(growthScore),savPct:savPct.toFixed(1)};
}

function scoreLabel(s){
  if(s>=80)return{label:"Excellent",band:"80–100",color:"#059669",msg:"Strong financial habits. You're building real wealth."};
  if(s>=65)return{label:"Good",band:"65–79",color:"#2563EB",msg:"Solid foundation. Push savings above 30% for the next level."};
  if(s>=50)return{label:"Fair",band:"50–64",color:"#D97706",msg:"Making progress. Reduce high-cost categories to improve."};
  if(s>=35)return{label:"Needs Work",band:"35–49",color:"#DC2626",msg:"Low savings rate is pulling your score down. Target 20%+."};
  return{label:"Poor",band:"0–34",color:"#DC2626",msg:"Add your income and reduce spending to unlock your full picture."};
}

function genInsights(income,curExp,prevExp,loans,savPct,goals,invests,sym){
  const ins=[];
  if(!income||income===0) return ins;

  const curTotal=curExp.reduce((s,e)=>s+e.amount,0);
  const prevTotal=prevExp.reduce((s,e)=>s+e.amount,0);
  const sav=parseFloat(savPct);
  const spendRatio=(curTotal/income)*100;

  // Build category map
  const catMap={};
  curExp.forEach(e=>{catMap[e.catLabel]=(catMap[e.catLabel]||0)+e.amount;});
  const sortedCats=Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
  const topCat=sortedCats[0];
  const targetSavings=income*0.20;
  const actualSavings=Math.max(0,income-curTotal);
  const savingsGap=targetSavings-actualSavings;

  // ── INSIGHT 1: Month vs last month (specific numbers) ──
  if(prevTotal>0&&curTotal>0){
    const diff=curTotal-prevTotal;
    const pct=Math.abs((diff/prevTotal)*100).toFixed(0);
    const amt=Math.abs(diff);
    if(diff<0) ins.push({type:"positive",icon:"↓",text:"You spent "+sym+(amt>=1000?(amt/1000).toFixed(1)+"K":Math.round(amt))+" less than last month. Good control."});
    else if(diff>0) ins.push({type:"warning",icon:"↑",text:"Spending is up "+sym+(amt>=1000?(amt/1000).toFixed(1)+"K":Math.round(amt))+" vs last month. Check what changed."});
    else ins.push({type:"neutral",icon:"→",text:"Spending is consistent with last month."});
  }

  // ── INSIGHT 2: Savings rate with specific actionable advice ──
  if(sav>=30){
    ins.push({type:"positive",icon:"★",text:"Excellent — saving "+sav+"% of income. You're well above the 30% target. Keep it up."});
  } else if(sav>=20){
    const pushAmt=Math.round((income*0.30)-(income*sav/100));
    ins.push({type:"positive",icon:"★",text:"Saving "+sav+"% this month. To hit 30%, set aside "+sym+(pushAmt>=1000?(pushAmt/1000).toFixed(1)+"K":pushAmt)+" more."});
  } else if(sav>=0){
    const shortfall=Math.round(savingsGap);
    ins.push({type:"warning",icon:"!",text:"Saving only "+sav+"% of income. Reduce spending by "+sym+(shortfall>=1000?(shortfall/1000).toFixed(1)+"K":shortfall)+" to hit the 20% target."});
  } else {
    const overAmt=Math.round(Math.abs(income-curTotal));
    ins.push({type:"negative",icon:"↓",text:"You're spending "+sym+(overAmt>=1000?(overAmt/1000).toFixed(1)+"K":overAmt)+" more than you earn. Cut non-essentials immediately."});
  }

  // ── INSIGHT 3: Top category with specific cut advice ──
  if(topCat){
    const topPct=((topCat[1]/income)*100).toFixed(0);
    const topAmt=topCat[1];
    if(topPct>25){
      const cutAmt=Math.round(topAmt*0.20);
      ins.push({type:"warning",icon:"◎",text:topCat[0]+" is eating "+topPct+"% of your income. Cutting it by "+sym+(cutAmt>=1000?(cutAmt/1000).toFixed(1)+"K":cutAmt)+" would meaningfully improve your savings."});
    } else {
      ins.push({type:"neutral",icon:"◎",text:topCat[0]+" is your highest expense at "+sym+(topAmt>=1000?(topAmt/1000).toFixed(1)+"K":Math.round(topAmt))+" ("+topPct+"% of income)."});
    }
  }

  // ── INSIGHT 4: Goal-specific advice ──
  if(goals&&goals.length>0){
    const activeGoals=goals.filter(g=>g.saved<g.target);
    if(activeGoals.length>0){
      const closest=activeGoals.sort((a,b)=>(b.saved/b.target)-(a.saved/a.target))[0];
      const remaining=closest.target-closest.saved;
      const monthsLeft=Math.ceil(remaining/(actualSavings||1));
      if(actualSavings>0&&monthsLeft<24){
        ins.push({type:"positive",icon:"◈",text:"At your current savings rate, you'll reach your "+closest.name+" goal in "+monthsLeft+" month"+(monthsLeft===1?"":"s")+"."});
      } else if(actualSavings<=0){
        ins.push({type:"warning",icon:"◈",text:"Your "+closest.name+" goal needs "+sym+(remaining>=1000?(remaining/1000).toFixed(1)+"K":Math.round(remaining))+" more. Start saving to make progress."});
      }
    } else {
      ins.push({type:"positive",icon:"◈",text:"All your goals are on track. Consider setting a new one to keep momentum."});
    }
  } else if(invests&&invests.length>0){
    const totInv=invests.reduce((s,i)=>s+i.invested,0);
    const totCur=invests.reduce((s,i)=>s+i.current_value,0);
    const pnl=totCur-totInv;
    if(pnl>0) ins.push({type:"positive",icon:"◈",text:"Your investments are up "+sym+(pnl>=1000?(pnl/1000).toFixed(1)+"K":Math.round(pnl))+". Compound interest is working."});
  }

  return ins.slice(0,4);
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function FullTextModal({title,text,onClose,C}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:"1px solid "+C.border,borderRadius:"18px",padding:"22px 20px",width:"100%",maxWidth:"480px",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <div style={{fontSize:"15px",fontWeight:"800",color:C.ink}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"1px solid "+C.border,borderRadius:"8px",padding:"5px 10px",cursor:"pointer",color:C.inkMid,fontSize:"13px"}}>Close</button>
        </div>
        <div style={{overflowY:"auto",fontSize:"12px",color:C.inkMid,lineHeight:1.75,whiteSpace:"pre-wrap",flex:1}}>{text}</div>
        <button onClick={onClose} style={{marginTop:"14px",padding:"11px",borderRadius:"10px",border:"none",background:"#1B5FD4",color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"11px",letterSpacing:"2px"}}>GOT IT</button>
      </div>
    </div>
  );
}

function MonthPicker({onSelect,onClose,selectedMo,selectedYr,C}){
  const[pYr,setPYr]=useState(selectedYr);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:"1px solid "+C.border,borderRadius:"18px",padding:"20px",width:"100%",maxWidth:"310px",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <button onClick={()=>setPYr(y=>y-1)} style={{background:"none",border:"1px solid "+C.border,borderRadius:"8px",padding:"5px 12px",cursor:"pointer",color:C.inkMid,fontFamily:"inherit",fontSize:"15px"}}>&#8249;</button>
          <span style={{fontWeight:"700",color:C.ink,fontSize:"15px"}}>{pYr}</span>
          <button onClick={()=>setPYr(y=>y+1)} style={{background:"none",border:"1px solid "+C.border,borderRadius:"8px",padding:"5px 12px",cursor:"pointer",color:C.inkMid,fontFamily:"inherit",fontSize:"15px"}}>&#8250;</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"6px"}}>
          {MONTHS_S.map((m,i)=>{const sel=i===selectedMo&&pYr===selectedYr;return<button key={m} onClick={()=>{onSelect(i,pYr);onClose();}} style={{padding:"9px",borderRadius:"9px",border:"1px solid "+(sel?C.blue:C.border),background:sel?C.blueSoft:"transparent",color:sel?C.blue:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"12px",fontWeight:sel?"700":"400"}}>{m}</button>;})}
        </div>
      </div>
    </div>
  );
}


// ─── STORY GENERATOR ─────────────────────────────────────────────────────────
function genStory(income,expenses,prevExpenses,loans,goals,invests,savPct,budgets,mo,yr,S,curCode){
  if(!income||income===0)return null;
  const totExp=expenses.reduce((s,e)=>s+e.amount,0);
  const prevTot=prevExpenses.reduce((s,e)=>s+e.amount,0);
  const sav=parseFloat(savPct);
  const totInv=invests.reduce((s,i)=>s+i.invested,0);
  const totCur=invests.reduce((s,i)=>s+i.current_value,0);
  const pnl=totCur-totInv;
  const monthName=["January","February","March","April","May","June","July","August","September","October","November","December"][mo];
  let savStreak=0;
  for(let i=0;i<6;i++){
    const d=new Date(yr,mo-i,1);
    const k=d.getFullYear()+"-"+String(d.getMonth()).padStart(2,"0");
    const b=budgets[k];
    if(!b||!b.income)break;
    const bExp=(b.expenses||[]).reduce((s,e)=>s+e.amount,0);
    const bSav=((b.income-bExp)/b.income)*100;
    if(bSav>=20)savStreak++;else break;
  }
  const parts=[];
  if(sav>=30)parts.push(monthName+" was an excellent month financially.");
  else if(sav>=20)parts.push(monthName+" was a solid month.");
  else if(sav>=0)parts.push(monthName+" was a mixed month.");
  else parts.push(monthName+" was a tough month financially.");
  if(prevTot>0){
    const diff=totExp-prevTot;
    const pct=Math.abs((diff/prevTot)*100).toFixed(0);
    if(diff<0)parts.push("You spent "+pct+"% less than last month.");
    else if(diff>0&&parseFloat(pct)>5)parts.push("Spending was up "+pct+"% from last month.");
  }
  if(sav>=30)parts.push("Saving "+sav+"% of income puts you well above the 30% target.");
  else if(sav>=20)parts.push("You hit the 20% savings target this month.");
  else if(sav>0)parts.push("Savings came in at "+sav+"% — the target is 20%.");
  if(savStreak>=3)parts.push("You have hit your savings target "+savStreak+" months in a row.");
  if(totInv>0){
    if(pnl>0)parts.push("Investments are up "+((pnl/totInv)*100).toFixed(1)+"% overall.");
    else if(pnl<0)parts.push("Portfolio is down slightly — stay the course.");
  }
  const activeGoals=goals.filter(g=>g.saved<g.target);
  if(activeGoals.length>0){
    const closest=activeGoals.sort((a,b)=>(b.saved/b.target)-(a.saved/a.target))[0];
    const pct2=((closest.saved/closest.target)*100).toFixed(0);
    parts.push("Your "+closest.name+" goal is "+pct2+"% there.");
  }
  if(sav>=30&&savStreak>=2)parts.push("Keep this up.");
  else if(sav>=20)parts.push("One more consistent month and this becomes a pattern.");
  else parts.push("Small adjustments now compound into big results.");
  return parts.join(" ");
}

function genTrendInsights(budgets,mo,yr){
  const ins=[];
  const months=[];
  for(let i=0;i<4;i++){
    const d=new Date(yr,mo-i,1);
    const k=d.getFullYear()+"-"+String(d.getMonth()).padStart(2,"0");
    const b=budgets[k];
    if(b&&b.income>0){
      const exp=(b.expenses||[]).reduce((s,e)=>s+e.amount,0);
      const sav=((b.income-exp)/b.income)*100;
      months.push({k,income:b.income,exp,sav});
    }
  }
  if(months.length<2)return ins;
  const streak=months.filter(m=>m.sav>=20).length;
  if(streak===months.length&&months.length>=3)ins.push({type:"positive",icon:"★",text:"You have saved 20%+ for "+months.length+" months running. Consistency is your strongest asset."});
  else if(streak>=2)ins.push({type:"positive",icon:"★",text:"Saved above 20% for "+streak+" of the last "+months.length+" months."});
  if(months.length>=3){
    const trend=((months[0].exp-months[months.length-1].exp)/months[months.length-1].exp*100).toFixed(0);
    if(parseFloat(trend)<-10)ins.push({type:"positive",icon:"↓",text:"Spending has dropped "+Math.abs(trend)+"% over "+months.length+" months. Strong trend."});
    else if(parseFloat(trend)>15)ins.push({type:"warning",icon:"↑",text:"Spending has grown "+trend+"% over "+months.length+" months. Worth watching."});
  }
  if(months.length>=2&&months[0].income>months[1].income){
    const growPct=(((months[0].income-months[1].income)/months[1].income)*100).toFixed(0);
    if(parseFloat(growPct)>0)ins.push({type:"positive",icon:"◈",text:"Income is up "+growPct+"% vs last month."});
  }
  return ins.slice(0,2);
}

function HealthScore({score,breakdown,C}){
  const{label,color,msg}=scoreLabel(score);
  const r=54,cx=70,cy=70,circ=2*Math.PI*r,offset=circ-(score/100)*circ;
  const cats=[{label:"Savings",val:breakdown.savings,max:30,color:"#2563EB"},{label:"Spending",val:breakdown.spending,max:30,color:"#059669"},{label:"Debt",val:breakdown.debt,max:20,color:"#C47A0A"},{label:"Growth",val:breakdown.growth,max:20,color:"#7C3AED"}];
  return(
    <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"16px",padding:"18px",marginBottom:"10px"}}>
      <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"14px"}}>OVERALL FINANCIAL HEALTH</div>
      <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"12px"}}>
        <div style={{flexShrink:0}}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg} strokeWidth="10"/>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease",transformOrigin:"center",transform:"rotate(-90deg)"}}/>
            <text x={cx} y={cy-8} textAnchor="middle" fill={color} fontSize="26" fontWeight="800" fontFamily="'DM Mono',monospace">{score}</text>
            <text x={cx} y={cy+10} textAnchor="middle" fill={C.inkLo} fontSize="10" fontFamily="'DM Mono',monospace">/100</text>
            <text x={cx} y={cy+26} textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="sans-serif">{label}</text>
          </svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          {cats.map(c=>(
            <div key={c.label} style={{marginBottom:"9px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                <span style={{fontSize:"10px",color:C.inkMid,fontFamily:"'DM Mono',monospace"}}>{c.label}</span>
                <span style={{fontSize:"10px",color:c.color,fontFamily:"'DM Mono',monospace",fontWeight:"600"}}>{c.val}/{c.max}</span>
              </div>
              <div style={{background:C.bg,borderRadius:"100px",height:"5px",overflow:"hidden"}}>
                <div style={{height:"100%",background:c.color,borderRadius:"100px",width:(c.val/c.max*100)+"%",transition:"width .8s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightCard({insight,C}){
  const isPos=insight.type==="positive";
  const isNeg=insight.type==="negative";
  const isWarn=insight.type==="warning";
  const configs={
    positive:{bg:C.greenSoft,border:C.green+"44",bar:C.green,icon:C.green,emoji:"✅"},
    warning: {bg:C.amberSoft,border:C.amber+"44",bar:C.amber,icon:C.amber,emoji:"⚠️"},
    negative:{bg:C.redSoft,  border:C.red+"44",  bar:C.red,  icon:C.red,  emoji:"📉"},
    neutral: {bg:C.blueSoft, border:C.blue+"33", bar:C.blue, icon:C.blue, emoji:"💡"},
  };
  const cfg=configs[insight.type]||configs.neutral;
  return(
    <div style={{background:cfg.bg,border:"1px solid "+cfg.border,borderRadius:"12px",padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",marginBottom:"8px",borderLeft:"3px solid "+cfg.bar}}>
      <span style={{fontSize:"16px",flexShrink:0,marginTop:"0px"}}>{insight.icon==="★"||insight.icon==="◈"?"💡":insight.icon==="↓"?"✅":insight.icon==="↑"?"⚠️":insight.icon==="!"?"⚠️":insight.icon==="✓"?"✅":"💡"}</span>
      <span style={{fontSize:"13px",color:C.inkMid,lineHeight:1.55,flex:1}}>{insight.text}</span>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function Auth({darkMode,onToggleTheme,onLogin}){
  const C=darkMode?DARK:LIGHT;
  const[screen,setScreen]=useState("login");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[confirm,setConfirm]=useState("");
  const[agreed,setAgreed]=useState(false);
  const[err,setErr]=useState("");
  const[msg,setMsg]=useState("");
  const[showPass,setShowPass]=useState(false);
  const[loading,setLoading]=useState(false);
  const[modal,setModal]=useState(null);
  const valid=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const doRegister=async()=>{setErr("");setMsg("");if(!valid(email))return setErr("Please enter a valid email address.");if(pass.length<8)return setErr("Password must be at least 8 characters.");if(pass!==confirm)return setErr("Passwords do not match.");if(!agreed)return setErr("Please accept the Terms to continue.");setLoading(true);const{error}=await supabase.auth.signUp({email,password:pass});setLoading(false);if(error)return setErr(error.message);setMsg("Account created! You can now sign in.");setScreen("login");};
  const doLogin=async()=>{setErr("");setMsg("");if(!valid(email))return setErr("Please enter a valid email address.");if(!pass)return setErr("Please enter your password.");setLoading(true);const{data,error}=await supabase.auth.signInWithPassword({email,password:pass});setLoading(false);if(error)return setErr(error.message);onLogin(data.user);};
  const doForgot=async()=>{setErr("");setMsg("");if(!valid(email))return setErr("Please enter a valid email.");setLoading(true);const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});setLoading(false);if(error)return setErr(error.message);setMsg("Reset link sent to your email.");};

  const inp={width:"100%",background:C.input,border:"1px solid "+C.border,borderRadius:"10px",padding:"11px 13px",color:C.ink,fontFamily:"inherit",fontSize:"14px",outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"5px",display:"block"};

  return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",color:C.ink}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:"+C.bg+";} input{color-scheme:"+(darkMode?"dark":"light")+";} input:focus{outline:none!important;border-color:#1B5FD4!important;box-shadow:0 0 0 3px "+C.blueSoft+"!important;}"}</style>
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"28px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"13px",background:"linear-gradient(135deg,#1B5FD4,#4A80E0)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}><div style={{width:"14px",height:"14px",borderRadius:"50%",background:"rgba(255,255,255,0.9)"}}/></div>
          <div style={{fontSize:"22px",fontWeight:"800",color:C.ink,letterSpacing:"-.5px"}}>Finlyo</div>
          <div style={{fontSize:"10px",color:C.inkLo,letterSpacing:"3px",fontFamily:"'DM Mono',monospace",marginTop:"2px"}}>MONEY CLARITY SYSTEM</div>
        </div>
        <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:"18px",padding:"24px 20px",boxShadow:"0 4px 32px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:"18px",fontWeight:"800",color:C.ink,marginBottom:"3px",letterSpacing:"-.3px"}}>{screen==="login"?"Welcome back":screen==="register"?"Create account":"Reset password"}</div>
          <div style={{fontSize:"13px",color:C.inkLo,marginBottom:"18px"}}>{screen==="login"?"Your money clarity awaits.":screen==="register"?"Start understanding your money.":"We will send a reset link to your email."}</div>
          {err&&<div style={{background:C.redSoft,border:"1px solid "+C.red+"44",borderRadius:"9px",padding:"9px 12px",fontSize:"12px",color:C.red,marginBottom:"12px",lineHeight:1.4}}>{err}</div>}
          {msg&&<div style={{background:C.greenSoft,border:"1px solid "+C.green+"44",borderRadius:"9px",padding:"9px 12px",fontSize:"12px",color:C.green,marginBottom:"12px"}}>{msg}</div>}
          <div style={{marginBottom:"11px"}}><label style={lbl}>EMAIL ADDRESS</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={inp} autoComplete="email"/></div>
          {screen!=="forgot"&&<div style={{marginBottom:"11px"}}><label style={lbl}>PASSWORD</label><div style={{position:"relative"}}><input type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(screen==="login"?doLogin():doRegister())} placeholder={screen==="login"?"Your password":"Minimum 8 characters"} style={{...inp,paddingRight:"52px"}}/><button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>{showPass?"HIDE":"SHOW"}</button></div></div>}
          {screen==="register"&&<div style={{marginBottom:"11px"}}><label style={lbl}>CONFIRM PASSWORD</label><input type={showPass?"text":"password"} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat your password" style={inp}/></div>}
          {screen==="register"&&(
            <div style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"11px 12px",background:C.input,borderRadius:"10px",border:"1px solid "+C.border,marginBottom:"4px"}}>
              <button onClick={()=>setAgreed(a=>!a)} style={{width:"18px",height:"18px",borderRadius:"5px",border:"2px solid "+(agreed?"#1B5FD4":C.border),background:agreed?"#1B5FD4":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:"1px"}}>{agreed&&<div style={{width:"8px",height:"8px",borderRadius:"2px",background:"#fff"}}/>}</button>
              <div style={{fontSize:"12px",color:C.inkMid,lineHeight:1.5}}>I agree to the <button onClick={()=>setModal("terms")} style={{background:"none",border:"none",color:"#1B5FD4",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:"600",textDecoration:"underline"}}>Terms of Use</button> and <button onClick={()=>setModal("privacy")} style={{background:"none",border:"none",color:"#1B5FD4",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:"600",textDecoration:"underline"}}>Privacy Policy</button></div>
            </div>
          )}
          <button onClick={screen==="login"?doLogin:screen==="register"?doRegister:doForgot} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:"11px",border:"none",background:loading?"#8AB4F8":"linear-gradient(135deg,#1B5FD4,#4A80E0)",color:"#fff",cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px",marginTop:"12px"}}>{loading?"PLEASE WAIT...":screen==="login"?"SIGN IN":screen==="register"?"CREATE ACCOUNT":"SEND RESET LINK"}</button>
          <div style={{marginTop:"12px",textAlign:"center",fontSize:"12px",color:C.inkMid,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px"}}>
            {screen==="login"&&<><button onClick={()=>{setErr("");setMsg("");setScreen("forgot");}} style={{background:"none",border:"none",color:"#1B5FD4",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:"600"}}>Forgot password?</button><span style={{color:C.border}}>|</span><button onClick={()=>{setErr("");setMsg("");setScreen("register");}} style={{background:"none",border:"none",color:"#1B5FD4",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:"600"}}>Create account</button></>}
            {screen==="register"&&<button onClick={()=>{setErr("");setMsg("");setScreen("login");}} style={{background:"none",border:"none",color:"#1B5FD4",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:"600"}}>Already have an account? Sign in</button>}
            {screen==="forgot"&&<button onClick={()=>{setErr("");setMsg("");setScreen("login");}} style={{background:"none",border:"none",color:"#1B5FD4",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:"600"}}>Back to sign in</button>}
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"14px"}}><button onClick={onToggleTheme} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>{darkMode?"LIGHT MODE":"DARK MODE"}</button></div>
      </div>
      {modal==="terms"&&<FullTextModal title="Terms of Use" text={TERMS_TEXT} onClose={()=>setModal(null)} C={C}/>}
      {modal==="privacy"&&<FullTextModal title="Privacy Policy" text={PRIVACY_TEXT} onClose={()=>setModal(null)} C={C}/>}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({user,darkMode,onToggleTheme,onBack,onSignOut}){
  const C=darkMode?DARK:LIGHT;
  const[confirm,setConfirm]=useState("");
  const[err,setErr]=useState("");
  const[msg,setMsg]=useState("");
  const[modal,setModal]=useState(null);
  const inp={width:"100%",background:C.input,border:"1px solid "+C.border,borderRadius:"10px",padding:"10px 13px",color:C.ink,fontFamily:"inherit",fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"8px"};
  const doDeleteData=async()=>{if(confirm.toLowerCase()!=="delete my data")return setErr("Type exactly: delete my data");const uid=user.id;await Promise.all(["budgets","goals","loans","investments"].map(t=>supabase.from(t).delete().eq("user_id",uid)));setConfirm("");setErr("");setMsg("All financial data permanently deleted.");setTimeout(()=>setMsg(""),3000);};
  const doDeleteAccount=async()=>{if(confirm.toLowerCase()!=="delete my account")return setErr("Type exactly: delete my account");const uid=user.id;await Promise.all(["budgets","goals","loans","investments"].map(t=>supabase.from(t).delete().eq("user_id",uid)));await supabase.auth.signOut();onSignOut();};

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",color:C.ink}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:"+C.bg+";} input{color-scheme:"+(darkMode?"dark":"light")+"!important;}"}</style>
      <header style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"13px 16px",display:"flex",alignItems:"center",gap:"12px",position:"sticky",top:0,zIndex:90,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
        <button onClick={onBack} style={{background:"none",border:"1px solid "+C.border,borderRadius:"9px",padding:"6px 12px",cursor:"pointer",color:C.inkMid,fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px"}}>&#8592; BACK</button>
        <div style={{fontSize:"15px",fontWeight:"800",color:C.ink}}>Settings</div>
      </header>
      <div style={{padding:"20px 16px",maxWidth:"480px",margin:"0 auto"}}>
        {err&&<div style={{background:C.redSoft,border:"1px solid "+C.red+"33",borderRadius:"10px",padding:"10px 13px",fontSize:"13px",color:C.red,marginBottom:"14px"}}>{err}</div>}
        {msg&&<div style={{background:C.greenSoft,border:"1px solid "+C.green+"33",borderRadius:"10px",padding:"10px 13px",fontSize:"13px",color:C.green,marginBottom:"14px"}}>{msg}</div>}

        {/* Account */}
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"16px",marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"10px"}}>ACCOUNT</div>
          <div style={{fontSize:"14px",fontWeight:"600",color:C.ink}}>{user?.email}</div>
          <div style={{fontSize:"11px",color:C.inkLo,fontFamily:"'DM Mono',monospace",marginTop:"3px"}}>Finlyo · Money Clarity System</div>
        </div>

        {/* Appearance */}
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"16px",marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"12px"}}>APPEARANCE</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:"14px",fontWeight:"600",color:C.ink}}>{darkMode?"Dark Mode":"Light Mode"}</div><div style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Switch between light and dark</div></div>
            <button onClick={onToggleTheme} style={{width:"52px",height:"28px",borderRadius:"100px",border:"none",background:darkMode?C.blue:"#CBD5E1",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}>
              <div style={{position:"absolute",top:"3px",left:darkMode?"27px":"3px",width:"22px",height:"22px",borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
            </button>
          </div>
        </div>

        {/* Session */}
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"16px",marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"10px"}}>SESSION</div>
          <button onClick={async()=>{await supabase.auth.signOut();onSignOut();}} style={{width:"100%",padding:"11px",borderRadius:"10px",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"11px",letterSpacing:"2px"}}>SIGN OUT</button>
        </div>

        {/* Legal */}
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"16px",marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"12px"}}>LEGAL</div>
          {[{label:"Privacy Policy",key:"privacy"},{label:"Terms of Use",key:"terms"},{label:"Copyright Notice",key:"copyright"}].map(item=>(
            <button key={item.key} onClick={()=>setModal(item.key)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"11px 0",border:"none",borderBottom:"1px solid "+C.border,background:"transparent",color:C.ink,cursor:"pointer",fontFamily:"inherit",fontSize:"13px",textAlign:"left"}}>
              <span>{item.label}</span>
              <span style={{color:C.inkLo,fontSize:"12px"}}>&#8250;</span>
            </button>
          ))}
        </div>

        {/* Danger zone */}
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"16px",marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"12px"}}>DANGER ZONE</div>
          <div style={{marginBottom:"16px"}}>
            <div style={{fontSize:"13px",fontWeight:"600",color:C.ink,marginBottom:"4px"}}>Delete all financial data</div>
            <div style={{fontSize:"12px",color:C.inkMid,marginBottom:"10px",lineHeight:1.5}}>Removes all budgets, goals, loans, and investments. Your account stays.</div>
            <input value={confirm} onChange={e=>{setConfirm(e.target.value);setErr("");}} placeholder='Type "delete my data" to confirm' style={inp}/>
            <button onClick={doDeleteData} style={{width:"100%",padding:"11px",borderRadius:"10px",border:"none",background:"transparent",color:C.red,border:"1px solid "+C.red+"55",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"11px",letterSpacing:"2px"}}>DELETE ALL DATA</button>
          </div>
          <div style={{borderTop:"1px solid "+C.border,paddingTop:"16px"}}>
            <div style={{fontSize:"13px",fontWeight:"600",color:C.ink,marginBottom:"4px"}}>Delete account</div>
            <div style={{fontSize:"12px",color:C.inkMid,marginBottom:"10px",lineHeight:1.5}}>Deletes all data and signs you out permanently.</div>
            <input value={confirm} onChange={e=>{setConfirm(e.target.value);setErr("");}} placeholder='Type "delete my account" to confirm' style={inp}/>
            <button onClick={doDeleteAccount} style={{width:"100%",padding:"11px",borderRadius:"10px",border:"none",background:"transparent",color:C.red,border:"1px solid "+C.red+"55",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"11px",letterSpacing:"2px"}}>DELETE ACCOUNT</button>
          </div>
        </div>

        <div style={{textAlign:"center",padding:"10px 0",fontSize:"11px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px"}}>
          FINLYO · 2026 · ALL RIGHTS RESERVED
        </div>
      </div>

      {modal==="privacy"&&<FullTextModal title="Privacy Policy" text={PRIVACY_TEXT} onClose={()=>setModal(null)} C={C}/>}
      {modal==="terms"&&<FullTextModal title="Terms of Use" text={TERMS_TEXT} onClose={()=>setModal(null)} C={C}/>}
      {modal==="copyright"&&<FullTextModal title="Copyright Notice" text={"Copyright 2026 Finlyo. All rights reserved.\n\nFinlyo, its name, logo, design, interface, code, and financial content are original works protected under applicable copyright law.\n\nYou may not reproduce, distribute, modify, create derivative works from, or commercially exploit any part of this application without express written permission from the copyright holder.\n\nThis app is built for personal financial clarity. Unauthorized copying or redistribution is strictly prohibited.\n\nFor licensing inquiries, contact the developer via the GitHub repository at github.com/sathishbuilds/finlyo"} onClose={()=>setModal(null)} C={C}/>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function Finlyo({user,darkMode,onOpenSettings}){
  const C=darkMode?DARK:LIGHT;
  const uid=user?.id;
  const[cur,setCur]=useState(CURRENCIES[0]);
  const[tab,setTab]=useState("Budget");
  const[showMore,setShowMore]=useState(false);
  const[mo,setMo]=useState(TODAY.getMonth());
  const[yr,setYr]=useState(TODAY.getFullYear());
  const[budgets,setBudgets]=useState({});
  const[goals,setGoals]=useState([]);
  const[loans,setLoans]=useState([]);
  const[invests,setInvests]=useState([]);
  const[loading,setLoading]=useState(true);
  const[showCur,setShowCur]=useState(false);
  const[modal,setModal]=useState(null);
  const[toast,setToast]=useState(null);
  const[rain,setRain]=useState(false);
  const[showMoPicker,setShowMoPicker]=useState(false);
  const[loanPicker,setLoanPicker]=useState(null);
  const[rateFilter,setRateFilter]=useState({bankType:"private",loanType:"home"});
  const[loanMoMap,setLoanMoMap]=useState({});
  const[incEdit,setIncEdit]=useState(false);
  const[incVal,setIncVal]=useState("");
  const[expForm,setExpForm]=useState({cat:"rent",amount:"",note:"",customLabel:""});
  const[goalForm,setGoalForm]=useState({name:"",target:"",saved:"",label:"Home",deadline:""});
  const[loanForm,setLoanForm]=useState({name:"",type:"Home Loan",principal:"",rate:"",tenure:"",paidCount:""});
  const[invForm,setInvForm]=useState({catId:"equity",customLabel:"",invested:"",current:"",date:""});
  const[calcForm,setCalcForm]=useState({amount:"",type:"Home Loan",tenure:240,rate:""});
  const[calcRes,setCalcRes]=useState(null);
  const[simRate,setSimRate]=useState(10);
  const[showSim,setShowSim]=useState(false);
  const[showAllInsights,setShowAllInsights]=useState(false);
  const toastRef=useRef(null);
  const rainRef=useRef(null);

  const S=cur.symbol;
  const mk=yr+"-"+String(mo).padStart(2,"0");
  const md=budgets[mk]||{income:0,expenses:[]};
  const prevMk=(()=>{const d=new Date(yr,mo-1,1);return d.getFullYear()+"-"+String(d.getMonth()).padStart(2,"0");})();
  const prevMd=budgets[prevMk]||{income:0,expenses:[]};
  const totExp=(md.expenses||[]).reduce((s,e)=>s+e.amount,0);
  const bal=(md.income||0)-totExp;
  const savPct=md.income>0?((bal/md.income)*100).toFixed(1):"0.0";
  const totInv=invests.reduce((s,i)=>s+i.invested,0);
  const totCur=invests.reduce((s,i)=>s+i.current_value,0);
  const totPnL=totCur-totInv;
  const totPct=totInv>0?(totPnL/totInv*100).toFixed(1):"0.0";
  const pieData=INVEST_CATS.map(c=>({id:c.id,name:c.label,color:c.color,value:invests.filter(i=>i.cat_id===c.id).reduce((s,i)=>s+i.current_value,0)})).filter(x=>x.value>0);
  const health=calcHealthScore(md.income,md.expenses||[],loans,goals,invests);
  const insights=genInsights(md.income,md.expenses||[],prevMd.expenses||[],loans,savPct,goals,invests,S);
  const catTotals={};(md.expenses||[]).forEach(e=>{catTotals[e.catId]=(catTotals[e.catId]||0)+e.amount;});
  const trendInsights=genTrendInsights(budgets,mo,yr);
  const story=genStory(md.income,md.expenses||[],prevMd.expenses||[],loans,goals,invests,savPct,budgets,mo,yr,S,cur.code);
  // Confetti pieces for investment celebration
  const CONFETTI_COLORS=["#1B5FD4","#10B981","#F59E0B","#EC4899","#7C3AED","#0891B2","#059669","#F97316"];
  const confettiPieces=Array.from({length:24},(_,i)=>({
    left:(2+i*4.1)+"%",
    color:CONFETTI_COLORS[i%CONFETTI_COLORS.length],
    delay:(i*0.08).toFixed(2)+"s",
    dur:(0.9+Math.random()*0.7).toFixed(2)+"s",
    size:i%3===0?"10px":i%3===1?"7px":"5px",
    shape:i%4===0?"50%":i%4===1?"2px":"0",
    swayDur:(1.2+Math.random()*0.8).toFixed(2)+"s",
  }));

  useEffect(()=>{
    if(!uid)return;
    (async()=>{
      setLoading(true);
      const[b,g,l,iv]=await Promise.all([supabase.from("budgets").select("*").eq("user_id",uid),supabase.from("goals").select("*").eq("user_id",uid),supabase.from("loans").select("*").eq("user_id",uid),supabase.from("investments").select("*").eq("user_id",uid)]);
      const bMap={};(b.data||[]).forEach(row=>{bMap[row.month_key]={id:row.id,income:row.income,expenses:row.expenses||[]};});
      setBudgets(bMap);setGoals(g.data||[]);
      setLoans((l.data||[]).map(loan=>({...loan,paidKeys:loan.paid_keys||[],remMonths:loan.rem_months,prePaid:loan.pre_paid||0})));
      setInvests(iv.data||[]);setLoading(false);
    })();
  },[uid]);

  const showToast=(m,isInvest=false)=>{setToast(m);if(isInvest){setRain(true);clearTimeout(rainRef.current);rainRef.current=setTimeout(()=>setRain(false),3000);}clearTimeout(toastRef.current);toastRef.current=setTimeout(()=>setToast(null),2800);};
  const switchTab=(t)=>{setTab(t);setShowMore(false);};
  const prevMo=()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);};
  const nextMo=()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);};

  const setIncome=async()=>{const v=parseFloat(incVal);if(isNaN(v))return;const ex=budgets[mk];if(ex?.id){await supabase.from("budgets").update({income:v}).eq("id",ex.id);}else{const{data}=await supabase.from("budgets").insert({user_id:uid,month_key:mk,income:v,expenses:[]}).select().single();setBudgets(p=>({...p,[mk]:{id:data.id,income:v,expenses:[]}}))}setBudgets(p=>({...p,[mk]:{...p[mk],income:v}}));setIncEdit(false);setIncVal("");};
  const addExpense=async()=>{if(!expForm.amount||isNaN(expForm.amount))return;const cat=EXPENSE_CATS.find(c=>c.id===expForm.cat);const resolvedLabel=expForm.cat==="custom"?(expForm.customLabel.trim()||"Custom"):cat.label;const newExp={id:Date.now(),catId:expForm.cat==="custom"?"custom_"+Date.now():cat.id,catLabel:resolvedLabel,amount:parseFloat(expForm.amount),note:expForm.note};const expenses=[...(md.expenses||[]),newExp];const ex=budgets[mk];if(ex?.id){await supabase.from("budgets").update({expenses}).eq("id",ex.id);}else{const{data}=await supabase.from("budgets").insert({user_id:uid,month_key:mk,income:0,expenses}).select().single();setBudgets(p=>({...p,[mk]:{id:data.id,income:0,expenses}}))}setBudgets(p=>({...p,[mk]:{...p[mk],expenses}}));setExpForm({cat:"rent",amount:"",note:"",customLabel:""});setModal(null);showToast("Expense recorded.");};
  const delExp=async(id)=>{const expenses=(md.expenses||[]).filter(e=>e.id!==id);await supabase.from("budgets").update({expenses}).eq("id",budgets[mk].id);setBudgets(p=>({...p,[mk]:{...p[mk],expenses}}));};
  const addGoal=async()=>{if(!goalForm.target)return;const{data}=await supabase.from("goals").insert({user_id:uid,name:goalForm.name||goalForm.label,label:goalForm.label,target:parseFloat(goalForm.target),saved:parseFloat(goalForm.saved||0),deadline:goalForm.deadline}).select().single();setGoals(p=>[...p,data]);setGoalForm({name:"",target:"",saved:"",label:"Home",deadline:""});setModal(null);};
  const updGoal=async(id,v)=>{const saved=Math.max(0,parseFloat(v)||0);await supabase.from("goals").update({saved}).eq("id",id);setGoals(p=>p.map(g=>g.id===id?{...g,saved}:g));showToast(GOAL_MSGS[Math.floor(Math.random()*GOAL_MSGS.length)]);};
  const delGoal=async(id)=>{await supabase.from("goals").delete().eq("id",id);setGoals(p=>p.filter(g=>g.id!==id));};
  const addLoan=async()=>{if(!loanForm.principal||!loanForm.tenure||!loanForm.rate)return;const p=parseFloat(loanForm.principal),n=parseInt(loanForm.tenure),r=parseFloat(loanForm.rate),emi=calcEMI(p,r,n);const paid=loanForm.paidCount?Math.min(parseInt(loanForm.paidCount)||0,n):0;let rem=p;for(let i=0;i<paid;i++){const m=r/12/100;rem=Math.max(0,rem-(emi-rem*m));}const{data}=await supabase.from("loans").insert({user_id:uid,name:loanForm.name||loanForm.type,type:loanForm.type,principal:p,rate:r,tenure:n,emi,paid_keys:[],remaining:rem,rem_months:n-paid,pre_paid:paid}).select().single();setLoans(prev=>[...prev,{...data,paidKeys:[],remMonths:data.rem_months,prePaid:data.pre_paid||0}]);setLoanForm({name:"",type:"Home Loan",principal:"",rate:"",tenure:"",paidCount:""});setModal(null);};
  const getLoanMo=(id)=>loanMoMap[id]||{mo,yr};
  const setLoanMo=(id,m,y)=>setLoanMoMap(p=>({...p,[id]:{mo:m,yr:y}}));
  const markPaid=async(lid,key)=>{const loan=loans.find(l=>l.id===lid);if(!loan||loan.paidKeys.includes(key))return;const m=loan.rate/12/100,int=loan.remaining*m,prin=loan.emi-int;const paidKeys=[...loan.paidKeys,key],remaining=Math.max(0,loan.remaining-prin),remMonths=Math.max(0,loan.remMonths-1);await supabase.from("loans").update({paid_keys:paidKeys,remaining,rem_months:remMonths}).eq("id",lid);setLoans(p=>p.map(l=>l.id===lid?{...l,paidKeys,remaining,remMonths}:l));showToast("EMI marked. One fewer month to go.");};
  const undoPaid=async(lid,key)=>{const loan=loans.find(l=>l.id===lid);if(!loan||!loan.paidKeys.includes(key))return;const m=loan.rate/12/100,rec=loan.emi/(1+m);const paidKeys=loan.paidKeys.filter(k=>k!==key),remaining=Math.min(loan.principal,loan.remaining+rec),remMonths=Math.min(loan.tenure,loan.remMonths+1);await supabase.from("loans").update({paid_keys:paidKeys,remaining,rem_months:remMonths}).eq("id",lid);setLoans(p=>p.map(l=>l.id===lid?{...l,paidKeys,remaining,remMonths}:l));showToast("EMI payment undone.");};
  const delLoan=async(id)=>{await supabase.from("loans").delete().eq("id",id);setLoans(p=>p.filter(l=>l.id!==id));};
  const addInvest=async()=>{if(!invForm.invested||isNaN(invForm.invested))return;const cat=INVEST_CATS.find(c=>c.id===invForm.catId);const label=invForm.catId==="other"&&invForm.customLabel?invForm.customLabel:cat.label;const{data}=await supabase.from("investments").insert({user_id:uid,cat_id:invForm.catId,label,color:cat.color,invested:parseFloat(invForm.invested),current_value:parseFloat(invForm.current||invForm.invested),invest_date:invForm.date||TODAY.toISOString().split("T")[0]}).select().single();setInvests(p=>[...p,data]);setInvForm({catId:"equity",customLabel:"",invested:"",current:"",date:""});setModal(null);showToast(INVEST_TOASTS[Math.floor(Math.random()*INVEST_TOASTS.length)],true);};
  const delInvest=async(id)=>{await supabase.from("investments").delete().eq("id",id);setInvests(p=>p.filter(i=>i.id!==id));};
  const updInvCurrent=async(id,v)=>{const current_value=parseFloat(v)||0;await supabase.from("investments").update({current_value}).eq("id",id);setInvests(p=>p.map(i=>i.id===id?{...i,current_value}:i));};
  const runCalc=()=>{const a=parseFloat(calcForm.amount),r=parseFloat(calcForm.rate),n=parseInt(calcForm.tenure);if(!a||!r||!n)return;const emi=calcEMI(a,r,n);setCalcRes({emi,total:emi*n,interest:emi*n-a,r,n,a});};

  const inp={width:"100%",background:C.input,border:"1px solid "+C.border,borderRadius:"10px",padding:"10px 13px",color:C.ink,fontFamily:"inherit",fontSize:"14px",outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"5px",display:"block",textTransform:"uppercase"};
  const css="@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');"
    +"*{box-sizing:border-box;margin:0;padding:0;font-feature-settings:'zero' 0,'cv05' 0,'ss01' 0;} body{background:"+C.bg+";} .num{font-family:'Plus Jakarta Sans',sans-serif;font-feature-settings:'tnum' 1,'zero' 0;font-variant-numeric:tabular-nums;}"
    +"'DM Mono'{font-feature-settings:'zero' 0;}"
    +"::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:"+C.borderMid+";border-radius:3px;}"
    +"@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}"
    +"@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1;}80%{opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}"
    +"@keyframes confettiSway{0%,100%{transform:translateX(0);}33%{transform:translateX(15px);}66%{transform:translateX(-15px);}}"
    +"@keyframes burstStar{0%{transform:scale(0) rotate(0);opacity:1;}50%{transform:scale(1.8) rotate(180deg);opacity:1;}100%{transform:scale(0) rotate(360deg);opacity:0;}}"
    +"@keyframes slideDown{from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}"
    +"@keyframes scaleIn{from{opacity:0;transform:scale(.93);}to{opacity:1;transform:scale(1);}}"
    +"@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}"
    +".fade{animation:fadeUp .35s ease forwards;} .scaleIn{animation:scaleIn .3s ease forwards;}"
    +".hc{transition:box-shadow .2s,transform .15s;} .hc:hover{box-shadow:0 4px 20px rgba(0,0,0,.1);transform:translateY(-1px);}"
    +".hr:hover{background:"+C.input+"!important;} button:active{transform:scale(.97);}"
    +"input[type=range]{accent-color:"+C.blue+";width:100%;} input,select{color-scheme:"+(darkMode?"dark":"light")+";}"
    +".tabbar::-webkit-scrollbar{display:none;}"
    +".confetti{position:fixed;top:-20px;z-index:999;pointer-events:none;}"
    +".burst{position:fixed;z-index:999;pointer-events:none;animation:burstStar ease-out forwards;}"
    +"@font-face{font-family:'DM Mono';font-feature-settings:'zero' 0;}"
    +".mono{font-feature-settings:'zero' 0 !important;}"
    ;

  if(loading)return<div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Mono',monospace",color:C.blue,fontSize:"13px",letterSpacing:"4px"}}>LOADING…</div>;

  const MonthNav=()=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
      <button onClick={prevMo} style={{width:"30px",height:"30px",borderRadius:"50%",border:"1px solid "+C.border,background:C.white,color:C.inkMid,cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center"}}>&#8249;</button>
      <button onClick={()=>setShowMoPicker(true)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:"16px",fontWeight:"700",color:C.ink,letterSpacing:"-.3px"}}>{MONTHS[mo]}</div><div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"2px"}}>{yr} &#9660;</div></button>
      <button onClick={nextMo} style={{width:"30px",height:"30px",borderRadius:"50%",border:"1px solid "+C.border,background:C.white,color:C.inkMid,cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center"}}>&#8250;</button>
    </div>
  );

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",color:C.ink,overflowX:"hidden",maxWidth:"100vw"}}>
      <style>{css}</style>
      {rain&&<div className="rain">
        {confettiPieces.map((p,i)=>(
          <div key={i} className="confetti" style={{
            left:p.left,
            width:p.size,height:p.size,
            borderRadius:p.shape,
            background:p.color,
            animation:"confettiFall "+p.dur+" "+p.delay+" linear forwards, confettiSway "+p.swayDur+" "+p.delay+" ease-in-out infinite",
            boxShadow:"0 0 4px "+p.color+"88",
          }}/>
        ))}
        {/* Central burst stars */}
        {[...Array(6)].map((_,i)=>(
          <div key={"b"+i} className="burst" style={{
            left:(30+i*8)+"%",top:"40%",
            width:"16px",height:"16px",
            background:CONFETTI_COLORS[i],
            clipPath:"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
            animationDuration:"0.8s",
            animationDelay:(i*0.1)+"s",
          }}/>
        ))}
      </div>}
      {toast&&<div style={{position:"fixed",top:"14px",left:"50%",transform:"translateX(-50%)",zIndex:1000,background:C.ink,color:darkMode?"#0D1520":"#fff",borderRadius:"12px",padding:"10px 18px",fontSize:"13px",fontWeight:"500",whiteSpace:"nowrap",maxWidth:"90vw",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",animation:"slideDown .3s ease"}}>{toast}</div>}

      {/* HEADER */}
      <header style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:90,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
          <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#1B5FD4,#4A80E0)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:"8px",height:"8px",borderRadius:"50%",background:"rgba(255,255,255,0.9)"}}/></div>
          <div><div style={{fontSize:"14px",fontWeight:"800",color:C.ink,lineHeight:1,letterSpacing:"-.3px"}}>Finlyo</div><div style={{fontSize:"8px",color:C.inkLo,letterSpacing:"2px",fontFamily:"'DM Mono',monospace",lineHeight:1.3}}>MONEY CLARITY SYSTEM</div></div>
        </div>
        <div style={{display:"flex",gap:"7px",alignItems:"center"}}>
          <button onClick={onOpenSettings} style={{padding:"5px 10px",borderRadius:"20px",border:"1px solid "+C.border,background:C.bg,color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>Settings</button>
          <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowCur(!showCur)} style={{display:"flex",alignItems:"center",gap:"5px",padding:"6px 10px",borderRadius:"20px",border:"1px solid "+C.border,background:C.bg,color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px"}}><span>{cur.flag}</span><span>{cur.code}</span><span style={{fontSize:"8px"}}>&#9660;</span></button>
            {showCur&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:0,top:"36px",background:C.white,border:"1px solid "+C.border,borderRadius:"14px",overflow:"hidden",zIndex:300,width:"190px",maxHeight:"260px",overflowY:"auto",boxShadow:"0 8px 40px rgba(0,0,0,0.12)"}}>{CURRENCIES.map(c=><button key={c.code} onClick={()=>{setCur(c);setShowCur(false);}} style={{display:"flex",alignItems:"center",gap:"8px",width:"100%",padding:"9px 12px",border:"none",background:cur.code===c.code?C.blueSoft:"transparent",color:C.ink,cursor:"pointer",fontFamily:"inherit",fontSize:"12px",textAlign:"left",borderBottom:"1px solid "+C.border}}><span style={{fontSize:"13px"}}>{c.flag}</span><span style={{flex:1}}>{c.country}</span><span style={{color:C.blue,fontFamily:"'DM Mono',monospace",fontSize:"11px"}}>{c.symbol}</span></button>)}</div>}
          </div>
        </div>
      </header>

      {/* TAB BAR — Budget · Invest · Loans · Score | Tools ▾ */}
      <nav className="tabbar" style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"0 10px",display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
        {PRIMARY_TABS.map(t=>(
          <button key={t} onClick={()=>switchTab(t)} style={{flexShrink:0,padding:"10px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:tab===t?"700":"400",color:tab===t?C.blue:C.inkLo,borderBottom:tab===t?"2px solid "+C.blue:"2px solid transparent",whiteSpace:"nowrap",transition:"color .15s"}}>{t}</button>
        ))}
        <div style={{position:"relative",marginLeft:"auto",flexShrink:0}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setShowMore(s=>!s)} style={{padding:"10px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:tab==="Tools"?"700":"400",color:tab==="Tools"?C.blue:C.inkLo,borderBottom:tab==="Tools"?"2px solid "+C.blue:"2px solid transparent",whiteSpace:"nowrap"}}>
            Tools &#9660;
          </button>
          {showMore&&(
            <div style={{position:"fixed",right:"10px",top:"96px",background:C.white,border:"1px solid "+C.border,borderRadius:"12px",overflow:"hidden",zIndex:500,minWidth:"150px",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
              {["Rates","EMI Calc","Goals"].map(t=>(
                <button key={t} onClick={()=>{switchTab(t==="EMI Calc"?"Tools":t);}} style={{display:"block",width:"100%",padding:"13px 18px",border:"none",background:(tab===t||(t==="EMI Calc"&&tab==="Tools"))?C.blueSoft:"transparent",color:(tab===t||(t==="EMI Calc"&&tab==="Tools"))?C.blue:C.ink,cursor:"pointer",fontFamily:"inherit",fontSize:"13px",textAlign:"left",borderBottom:"1px solid "+C.border,fontWeight:(tab===t||(t==="EMI Calc"&&tab==="Tools"))?"700":"400"}}>{t}</button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main style={{padding:"14px 13px 56px",maxWidth:"640px",margin:"0 auto"}} onClick={()=>{showCur&&setShowCur(false);showMore&&setShowMore(false);}}>

        {/* ═══ BUDGET ═══ */}
        {tab==="Budget"&&<div className="fade">
          <MonthNav/>
          {/* Monthly Insight Card with positive reinforcement */}
          {md.income>0&&(()=>{
            const curTotal=(md.expenses||[]).reduce((s,e)=>s+e.amount,0);
            const prevTotal=(prevMd.expenses||[]).reduce((s,e)=>s+e.amount,0);
            const improved=prevTotal>0&&curTotal<prevTotal;
            const improvePct=improved?Math.round(((prevTotal-curTotal)/prevTotal)*100):0;
            const improveAmt=improved?Math.round(prevTotal-curTotal):0;
            if(improved&&improvePct>=5){
              return(
                <div style={{background:"linear-gradient(135deg,"+C.green+",#1AAA6A)",borderRadius:"13px",padding:"13px 15px",marginBottom:"10px",display:"flex",alignItems:"center",gap:"11px",boxShadow:"0 4px 16px "+C.green+"33"}}>
                  <div style={{fontSize:"22px",flexShrink:0}}>{"\uD83C\uDF89"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"11px",color:"rgba(255,255,255,0.75)",fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>IMPROVEMENT</div>
                    <div style={{fontSize:"13px",fontWeight:"700",color:"#fff",lineHeight:1.4}}>{"You improved by "+improvePct+"% from last month — "+S+(improveAmt>=1000?(improveAmt/1000).toFixed(1)+"K":improveAmt)+" less spent. Keep it going."}</div>
                  </div>
                </div>
              );
            }
            if(insights.length===0)return null;
            const ins=insights[0];
            const bg=ins.type==="positive"?C.greenSoft:ins.type==="warning"?C.amberSoft:ins.type==="negative"?C.redSoft:C.blueSoft;
            const iconColor=ins.type==="positive"?C.green:ins.type==="warning"?C.amber:ins.type==="negative"?C.red:C.blue;
            return(
              <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"13px",padding:"13px 15px",marginBottom:"10px",display:"flex",alignItems:"flex-start",gap:"10px"}}>
                <div style={{width:"32px",height:"32px",borderRadius:"10px",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:"14px",color:iconColor,fontWeight:"700",fontFamily:"'DM Mono',monospace"}}>{ins.icon}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"3px"}}>THIS MONTH</div>
                  <div style={{fontSize:"13px",fontWeight:"600",color:C.ink,lineHeight:1.4}}>{ins.text}</div>
                </div>
              </div>
            );
          })()}
          <div className="hc" style={{background:darkMode?"linear-gradient(135deg,#1A3A6A,#2A5090)":"linear-gradient(135deg,#2B6CB0,#3A7FCC)",borderRadius:"16px",padding:"18px 16px",marginBottom:"10px",color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-20px",right:"-20px",width:"90px",height:"90px",borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
            <div style={{fontSize:"9px",letterSpacing:"2px",opacity:.7,fontFamily:"'DM Mono',monospace",marginBottom:"3px"}}>NET BALANCE</div>
            <div style={{marginBottom:"12px"}}><div style={{fontSize:"28px",fontWeight:"800",letterSpacing:"-1px",fontFamily:"'DM Mono',monospace"}}>{fmt(bal,S,cur.code)}</div>{Math.abs(bal)>=10000&&<div style={{fontSize:"10px",opacity:.65,fontFamily:"'DM Mono',monospace",marginTop:"2px"}}>~{fmtCompact(bal,S,cur.code)}</div>}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px"}}>
              {[{l:"Income",v:fmt(md.income||0,S,cur.code)},{l:"Spent",v:fmt(totExp,S,cur.code)},{l:"Saved",v:savPct+"%"}].map(x=>(
                <div key={x.l} style={{background:"rgba(255,255,255,0.12)",borderRadius:"9px",padding:"7px 8px"}}>
                  <div style={{fontSize:"8px",opacity:.65,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l.toUpperCase()}</div>
                  <div style={{fontSize:"12px",fontWeight:"700",fontFamily:"'DM Mono',monospace"}}>{x.v}</div>
                </div>
              ))}
            </div>
            {md.income>0&&<><div style={{marginTop:"10px",background:"rgba(255,255,255,0.2)",borderRadius:"100px",height:"3px",overflow:"hidden"}}><div style={{height:"100%",background:"rgba(255,255,255,0.8)",width:Math.min(100,(totExp/(md.income||1))*100)+"%",borderRadius:"100px",transition:"width .5s ease"}}/></div></>}
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"13px",marginBottom:"9px"}}>
            <div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace",marginBottom:"8px"}}>MONTHLY INCOME</div>
            {incEdit?(<div style={{display:"flex",gap:"7px",alignItems:"center"}}><input autoFocus type="number" step="any" value={incVal} onChange={e=>setIncVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setIncome()} placeholder="Enter income" style={{...inp,flex:1,minWidth:0}}/><button onClick={setIncome} style={{padding:"10px 13px",borderRadius:"9px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",flexShrink:0}}>SET</button><button onClick={()=>{setIncEdit(false);setIncVal("");}} style={{padding:"10px",borderRadius:"9px",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontSize:"12px",flexShrink:0}}>✕</button></div>
            ):(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:"20px",fontWeight:"700",color:md.income?C.green:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"-.5px"}}>{md.income?fmt(md.income,S,cur.code):"--"}</div><button onClick={()=>{setIncEdit(true);setIncVal(md.income?String(md.income):"");}} style={{padding:"5px 12px",borderRadius:"20px",border:"1px solid "+C.border,background:C.bg,color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>{md.income?"EDIT":"SET"}</button></div>)}
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"13px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"11px"}}>
              <div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace"}}>EXPENSES</div>
              <button onClick={()=>setModal("expense")} style={{padding:"5px 12px",borderRadius:"20px",border:"1px solid "+C.blue,background:C.blueSoft,color:C.blue,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",fontWeight:"600"}}>+ ADD</button>
            </div>
            {Object.keys(catTotals).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid "+C.border}}>{Object.entries(catTotals).map(([cid,amt])=>{const c=EXPENSE_CATS.find(x=>x.id===cid);return c?<div key={cid} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:"20px",padding:"3px 8px",fontSize:"10px",color:C.inkMid,fontFamily:"'DM Mono',monospace"}}>{c.label.split(" ")[0]} {fmt(amt,S,cur.code)}</div>:null;})}</div>}
            {(()=>{
              const exps=md.expenses||[];
              if(exps.length===0)return<div style={{textAlign:"center",padding:"20px 0",color:C.inkLo,fontSize:"12px"}}>No expenses yet this month.</div>;
              // Group by category
              const grouped={};
              exps.forEach(e=>{if(!grouped[e.catId])grouped[e.catId]={catLabel:e.catLabel,total:0,items:[]};grouped[e.catId].total+=e.amount;grouped[e.catId].items.push(e);});
              const groups=Object.values(grouped).sort((a,b)=>b.total-a.total);
              return<>
                {groups.map(g=>(
                  <div key={g.catLabel} style={{marginBottom:"4px"}}>
                    {/* Category row */}
                    <div style={{display:"flex",alignItems:"center",padding:"8px 6px",borderRadius:"8px",background:C.bg,marginBottom:"2px"}}>
                      <div style={{flex:1,minWidth:0}}><span style={{fontSize:"12px",fontWeight:"600",color:C.ink}}>{g.catLabel}</span><span style={{fontSize:"10px",color:C.inkLo,marginLeft:"6px",fontFamily:"'DM Mono',monospace"}}>{g.items.length} item{g.items.length>1?"s":""}</span></div>
                      <span style={{fontSize:"12px",fontWeight:"700",color:C.red,fontFamily:"'DM Mono',monospace"}}>-{fmt(g.total,S,cur.code)}</span>
                    </div>
                    {/* Individual items */}
                    {g.items.map(e=>(
                      <div key={e.id} className="hr" style={{display:"flex",alignItems:"center",gap:"9px",padding:"6px 6px 6px 18px",borderRadius:"6px",marginBottom:"1px"}}>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:"12px",color:C.inkMid,wordBreak:"break-word",whiteSpace:"normal",lineHeight:"1.4"}}>{e.note||e.catLabel}</div></div>
                        <div style={{fontSize:"11px",color:C.inkMid,fontFamily:"'DM Mono',monospace",flexShrink:0}}>-{fmt(e.amount,S,cur.code)}</div>
                        <button onClick={()=>delExp(e.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",padding:"2px 3px",flexShrink:0}}>✕</button>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{marginTop:"9px",paddingTop:"8px",borderTop:"1px solid "+C.border}}>{[{l:"Total Expenses",v:fmt(totExp,S,cur.code),c:C.red},{l:"Net Balance",v:fmt(bal,S,cur.code),c:bal>=0?C.green:C.red,bold:true}].map(x=>(<div key={x.l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:x.bold?"13px":"11px",color:x.bold?C.ink:C.inkMid,fontWeight:x.bold?"600":"400"}}>{x.l}</span><span style={{fontSize:x.bold?"15px":"12px",fontWeight:"700",color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.v}</span></div>))}</div>
              </>;
            })()}
          </div>
        </div>}

        {/* ═══ INVEST ═══ */}
        {tab==="Invest"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
            <div><h2 style={{fontSize:"18px",fontWeight:"800",color:C.ink,letterSpacing:"-.4px"}}>Investments</h2><p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Wealth that works while you sleep.</p></div>
            <button onClick={()=>setModal("invest")} style={{padding:"7px 13px",borderRadius:"20px",border:"1px solid "+C.blue,background:C.blueSoft,color:C.blue,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",fontWeight:"600"}}>+ ADD</button>
          </div>
          <div className="hc" style={{background:"linear-gradient(135deg,#0F172A,#1E3A5F)",borderRadius:"16px",padding:"16px",marginBottom:"9px",color:"#fff",position:"relative",overflow:"hidden"}}>
            
            <div style={{fontSize:"9px",letterSpacing:"2px",opacity:.5,fontFamily:"'DM Mono',monospace",marginBottom:"3px"}}>PORTFOLIO</div>
            <div style={{marginBottom:"3px"}}><div style={{fontSize:"26px",fontWeight:"800",letterSpacing:"-1px",fontFamily:"'DM Mono',monospace"}}>{fmt(totCur,S,cur.code)}</div>{totCur>=10000&&<div style={{fontSize:"10px",opacity:.5,fontFamily:"'DM Mono',monospace",marginTop:"1px"}}>~{fmtCompact(totCur,S,cur.code)}</div>}</div>
            <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"12px"}}><span style={{fontSize:"10px",color:"rgba(255,255,255,0.45)",fontFamily:"'DM Mono',monospace"}}>Invested: {fmt(totInv,S,cur.code)}</span><span style={{fontSize:"11px",fontWeight:"700",color:totPnL>=0?"#34D399":"#F87171",background:"rgba(255,255,255,0.08)",padding:"2px 7px",borderRadius:"20px",fontFamily:"'DM Mono',monospace"}}>{totPnL>=0?"+":" "}{fmt(totPnL,S,cur.code)} ({totPct}%)</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px"}}>{[{l:"Invested",v:fmt(totInv,S,cur.code)},{l:"Current",v:fmt(totCur,S,cur.code)},{l:"P & L",v:(totPnL>=0?"+":"")+totPct+"%",c:totPnL>=0?"#34D399":"#F87171"}].map(x=>(<div key={x.l} style={{background:"rgba(255,255,255,0.07)",borderRadius:"9px",padding:"7px 8px"}}><div style={{fontSize:"8px",opacity:.5,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l}</div><div style={{fontSize:"12px",fontWeight:"700",fontFamily:"'DM Mono',monospace",color:x.c||"#fff"}}>{x.v}</div></div>))}</div>
          </div>
          {pieData.length>0&&<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px",marginBottom:"9px"}}>
            <div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace",marginBottom:"14px"}}>ALLOCATION</div>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <div style={{width:"170px",height:"170px",flexShrink:0,position:"relative"}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} dataKey="value" paddingAngle={3}
                      label={({cx,cy,midAngle,innerRadius,outerRadius,percent})=>{
                        if(percent<0.08)return null;
                        const RADIAN=Math.PI/180;
                        const radius=innerRadius+(outerRadius-innerRadius)*0.55;
                        const x=cx+radius*Math.cos(-midAngle*RADIAN);
                        const y=cy+radius*Math.sin(-midAngle*RADIAN);
                        return<text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700">{(percent*100).toFixed(0)}%</text>;
                      }}
                      labelLine={false}>
                      {pieData.map((e,i)=><Cell key={i} fill={e.color} stroke="none"/>)}
                    </Pie>
                    <Tooltip formatter={(v,name)=>[fmt(v,S,cur.code)+" ("+fmtCompact(v,S,cur.code)+")",name]} contentStyle={{background:C.white,border:"1px solid "+C.border,borderRadius:"8px",fontSize:"11px",fontFamily:"'Plus Jakarta Sans',sans-serif"}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{flex:1,minWidth:0}}>
                {pieData.map(d=>{
                  const p2=totCur>0?(d.value/totCur*100).toFixed(1):0;
                  return(
                    <div key={d.id} style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"8px"}}>
                      <div style={{width:"10px",height:"10px",borderRadius:"3px",background:d.color,flexShrink:0,boxShadow:"0 0 6px "+d.color+"66"}}/>
                      <span style={{fontSize:"11px",color:C.inkMid,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</span>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:"12px",fontWeight:"700",color:d.color}}>{p2}%</div>
                        <div style={{fontSize:"9px",color:C.inkLo,fontVariantNumeric:"tabular-nums"}}>{fmtCompact(d.value,S,cur.code)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>}
          {invests.length===0?<div style={{background:C.white,border:"1px dashed "+C.borderMid,borderRadius:"14px",padding:"40px 16px",textAlign:"center",color:C.inkLo}}><div style={{fontSize:"11px",letterSpacing:"1px",fontFamily:"'DM Mono',monospace"}}>NO INVESTMENTS YET</div><div style={{fontSize:"12px",marginTop:"5px"}}>Add your first investment above.</div></div>
          :<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"13px"}}><div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace",marginBottom:"11px"}}>HOLDINGS</div>{invests.map(inv=>{const pl=inv.current_value-inv.invested,plPct=inv.invested>0?(pl/inv.invested*100).toFixed(1):0;return<div key={inv.id} style={{padding:"9px 0",borderBottom:"1px solid "+C.border}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}><div><div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"1px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:inv.color,flexShrink:0}}/><span style={{fontSize:"13px",fontWeight:"600",color:C.ink}}>{inv.label}</span></div><div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}>Since {inv.invest_date}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:"13px",fontWeight:"700",color:C.ink,fontVariantNumeric:"tabular-nums"}}>{fmt(inv.current_value,S,cur.code)}</div><div style={{fontSize:"10px",fontWeight:"600",color:pl>=0?C.green:C.red,fontVariantNumeric:"tabular-nums"}}>{pl>=0?"+":""}{fmt(pl,S,cur.code)} ({plPct}%)</div></div></div><div style={{display:"flex",gap:"7px",alignItems:"center"}}><span style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}>Invested: {fmt(inv.invested,S,cur.code)}</span><span style={{fontSize:"10px",color:C.inkLo,marginLeft:"auto"}}>Current:</span><input type="number" step="any" value={inv.current_value||""} onChange={e=>updInvCurrent(inv.id,e.target.value)} style={{width:"95px",background:C.bg,border:"1px solid "+C.border,borderRadius:"7px",padding:"4px 7px",color:C.ink,fontFamily:"'DM Mono',monospace",fontSize:"11px",outline:"none",textAlign:"right"}} placeholder="Update"/><button onClick={()=>delInvest(inv.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",padding:"2px"}}>Remove</button></div></div>;})} </div>}
        </div>}

        {/* ═══ LOANS ═══ */}
        {tab==="Loans"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
            <div><h2 style={{fontSize:"18px",fontWeight:"800",color:C.ink,letterSpacing:"-.4px"}}>Loans</h2><p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Track every EMI. Stay ahead.</p></div>
            <button onClick={()=>setModal("loan")} style={{padding:"7px 13px",borderRadius:"20px",border:"1px solid "+C.blue,background:C.blueSoft,color:C.blue,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",fontWeight:"600"}}>+ ADD</button>
          </div>
          {loans.length===0?<div style={{background:C.white,border:"1px dashed "+C.borderMid,borderRadius:"14px",padding:"40px 16px",textAlign:"center",color:C.inkLo}}><div style={{fontSize:"11px",letterSpacing:"1px",fontFamily:"'DM Mono',monospace"}}>NO LOANS TRACKED</div></div>
          :loans.map(loan=>{const lm=getLoanMo(loan.id),key=lm.yr+"-"+String(lm.mo).padStart(2,"0"),paid=loan.paidKeys.includes(key),pct=Math.min(100,(loan.paidKeys.length/loan.tenure)*100);return<div key={loan.id} className="hc" style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px",marginBottom:"9px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"9px"}}><div style={{minWidth:0}}><div style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{loan.type.toUpperCase()}</div><div style={{fontSize:"14px",fontWeight:"700",color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{loan.name}</div><div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",marginTop:"2px"}}>{loan.rate}% p.a. · {loan.tenure} months</div></div><button onClick={()=>delLoan(loan.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",flexShrink:0}}>Remove</button></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"9px"}}>{[{l:"Monthly EMI",v:fmt(loan.emi,S,cur.code),c:C.blue},{l:"Outstanding",v:fmt(loan.remaining,S,cur.code),c:C.red},{l:"Months Left",v:String(loan.remMonths),c:C.green},{l:"Paid",v:((loan.paidKeys.length+(loan.prePaid||0)))+" / "+loan.tenure,c:C.steel}].map(d=>(<div key={d.l} style={{background:C.bg,borderRadius:"8px",padding:"8px 9px"}}><div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{d.l}</div><div style={{fontSize:"13px",fontWeight:"700",color:d.c,fontFamily:"'DM Mono',monospace"}}>{d.v}</div></div>))}</div>
            <div style={{background:C.bg,borderRadius:"100px",height:"3px",marginBottom:"9px",overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,"+C.blue+","+C.green+")",width:pct+"%",transition:"width .5s"}}/></div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"8px",background:C.bg,borderRadius:"9px",padding:"7px 10px"}}><span style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",flex:1}}>MONTH</span><button onClick={()=>setLoanMo(loan.id,lm.mo===0?11:lm.mo-1,lm.mo===0?lm.yr-1:lm.yr)} style={{width:"22px",height:"22px",borderRadius:"50%",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontSize:"11px",display:"flex",alignItems:"center",justifyContent:"center"}}>&#8249;</button><button onClick={()=>setLoanPicker(loan.id)} style={{background:"none",border:"1px solid "+C.border,borderRadius:"6px",padding:"3px 10px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",color:C.ink,fontWeight:"600"}}>{MONTHS_S[lm.mo]} {lm.yr} &#9660;</button><button onClick={()=>setLoanMo(loan.id,lm.mo===11?0:lm.mo+1,lm.mo===11?lm.yr+1:lm.yr)} style={{width:"22px",height:"22px",borderRadius:"50%",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontSize:"11px",display:"flex",alignItems:"center",justifyContent:"center"}}>&#8250;</button></div>
            <div style={{display:"flex",gap:"7px"}}><button onClick={()=>!paid&&markPaid(loan.id,key)} style={{flex:1,padding:"10px",borderRadius:"9px",border:"1px solid "+(paid?C.green+"44":C.blue+"44"),background:paid?C.greenSoft:C.blueSoft,color:paid?C.green:C.blue,cursor:paid?"default":"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"700",fontSize:"10px",letterSpacing:"1px"}}>{paid?"✓ "+MONTHS_S[lm.mo].toUpperCase()+" "+lm.yr+" PAID":"MARK "+MONTHS_S[lm.mo].toUpperCase()+" "+lm.yr+" PAID · "+fmt(loan.emi,S,cur.code)}</button>{paid&&<button onClick={()=>undoPaid(loan.id,key)} style={{padding:"10px 12px",borderRadius:"9px",border:"1px solid "+C.borderMid,background:C.bg,color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>UNDO</button>}</div>
          </div>;})}
        </div>}

        {/* ═══ GOALS ═══ */}
        {tab==="Goals"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div><h2 style={{fontSize:"18px",fontWeight:"800",color:C.ink,letterSpacing:"-.4px"}}>Goals</h2><p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Every rupee you save is a vote for your future.</p></div>
            <button onClick={()=>setModal("goal")} style={{padding:"7px 13px",borderRadius:"20px",border:"1px solid "+C.blue,background:C.blueSoft,color:C.blue,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",fontWeight:"600"}}>+ NEW</button>
          </div>
          {goals.length===0?<div style={{background:C.white,border:"1px dashed "+C.borderMid,borderRadius:"14px",padding:"40px 16px",textAlign:"center",color:C.inkLo}}><div style={{fontSize:"11px",letterSpacing:"1px",fontFamily:"'DM Mono',monospace",marginBottom:"6px"}}>NO GOALS YET</div><div style={{fontSize:"12px"}}>What are you saving for?</div></div>
          :goals.map(g=>{const p=Math.min(100,g.target>0?(g.saved/g.target)*100:0);return<div key={g.id} className="hc" style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"15px",marginBottom:"9px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}><div><div style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{g.label.toUpperCase()}</div><div style={{fontSize:"15px",fontWeight:"700",color:C.ink}}>{g.name}</div>{g.deadline&&<div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",marginTop:"1px"}}>Target: {g.deadline}</div>}
                {(()=>{
                  const rem=g.target-g.saved;
                  if(rem<=0||g.saved<=0)return null;
                  const monthsOfData=1;
                  const monthlyRate=g.saved/monthsOfData;
                  const monthsNeeded=Math.ceil(rem/monthlyRate);
                  const d=new Date();d.setMonth(d.getMonth()+monthsNeeded);
                  const proj=d.toLocaleDateString("en-IN",{month:"short",year:"numeric"});
                  return<div style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace",marginTop:"1px"}}>At this rate → {proj}</div>;
                })()}</div><div style={{textAlign:"right"}}><div style={{fontSize:"15px",fontWeight:"700",color:C.ink,fontFamily:"'DM Mono',monospace"}}>{fmt(g.target,S,cur.code)}</div>{g.target>=10000&&<div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}>~{fmtCompact(g.target,S,cur.code)}</div>}<button onClick={()=>delGoal(g.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",marginTop:"3px"}}>Remove</button></div></div>
            <div style={{background:C.bg,borderRadius:"100px",height:"6px",marginBottom:"8px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"100px",background:p>=100?"linear-gradient(90deg,"+C.green+",#1AAA6A)":"linear-gradient(90deg,"+C.blue+","+C.blueMid+")",width:p+"%",transition:"width .5s ease"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",marginBottom:"12px"}}>{[{l:"SAVED",v:fmt(g.saved,S,cur.code),c:p>=100?C.green:C.blue,a:"left"},{l:"PROGRESS",v:p.toFixed(1)+"%",c:C.ink,a:"center"},{l:"REMAINING",v:g.saved<g.target?fmt(g.target-g.saved,S,cur.code):"Done!",c:g.saved<g.target?C.red:C.green,a:"right"}].map(x=>(<div key={x.l} style={{textAlign:x.a}}><div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l}</div><div style={{fontSize:"16px",fontWeight:"700",color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.v}</div></div>))}</div>
            <div style={{background:C.blueSoft,borderRadius:"10px",padding:"11px 12px"}}><div style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"6px"}}>UPDATE YOUR PROGRESS</div><input type="number" step="any" value={g.saved||""} placeholder="Enter amount saved so far" onChange={e=>updGoal(g.id,e.target.value)} style={{...inp,background:C.white,fontSize:"13px"}}/>{p>=100&&<div style={{marginTop:"8px",fontSize:"12px",color:C.green,fontWeight:"600",textAlign:"center",animation:"pulse 2s infinite"}}>Goal achieved. Well done.</div>}</div>
          </div>;})}
        </div>}

        {/* ═══ SCORE (was Overview) ═══ */}
        {tab==="Score"&&<div className="fade">
          <MonthNav/>

          {/* ── STORY CARD ── */}
          {story&&(()=>{
            const sentences=story.split(". ").filter(Boolean);
            const short=sentences.slice(0,3).join(". ")+(sentences.length>3?".":"");
            const storyBg=darkMode
              ?"linear-gradient(135deg,#0F2240,#1A3A6A)"
              :"linear-gradient(135deg,#EFF6FF,#DBEAFE)";
            const storyLabel=darkMode?"rgba(147,197,253,0.7)":"#3B82F6";
            const storyText=darkMode?"rgba(226,239,255,0.92)":"#1E3A5F";
            const storyBorder=darkMode?"rgba(59,130,246,0.2)":"rgba(59,130,246,0.15)";
            return<div style={{background:storyBg,border:"1px solid "+storyBorder,borderRadius:"14px",padding:"14px 16px",marginBottom:"10px"}}>
              <div style={{fontSize:"9px",color:storyLabel,fontFamily:"'DM Mono',monospace",letterSpacing:"2px",marginBottom:"8px"}}>{MONTHS[mo].toUpperCase()} IN REVIEW</div>
              <div style={{fontSize:"13px",color:storyText,lineHeight:1.7,fontStyle:"italic"}}>{short}</div>
            </div>;
          })()}

          {/* ── THIS MONTH PROGRESS ── */}
          {md.income>0&&<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px 16px",marginBottom:"10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
              <div style={{fontSize:"12px",fontWeight:"600",color:C.ink}}>{parseFloat(savPct)>=20?"This month — on track.":parseFloat(savPct)>=0?"This month — spending is high.":"This month — overspending."}</div>
              <div style={{fontSize:"11px",color:parseFloat(savPct)>=20?C.green:parseFloat(savPct)>=0?C.amber:C.red,fontFamily:"'DM Mono',monospace",fontWeight:"700"}}>{savPct}% saved</div>
            </div>
            <div style={{background:C.bg,borderRadius:"100px",height:"7px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"100px",background:parseFloat(savPct)>=20?"linear-gradient(90deg,"+C.green+",#1AAA6A)":parseFloat(savPct)>=0?"linear-gradient(90deg,"+C.amber+",#E8A020)":"linear-gradient(90deg,"+C.red+",#E05050)",width:Math.min(100,Math.max(0,(1-(totExp/(md.income||1)))*100))+"%",transition:"width .6s ease"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px",fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}><span>Spent: {fmt(totExp,S,cur.code)}</span><span>Saved: {fmt(Math.max(0,bal),S,cur.code)}</span></div>
          </div>}

          {/* ── HEALTH SCORE ── */}
          <HealthScore score={health.score} breakdown={health} C={C}/>

          {/* ── TREND INSIGHTS (multi-month) ── */}
          {trendInsights.length>0&&<div style={{marginBottom:"10px"}}>
            <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"9px"}}>TRENDS</div>
            {trendInsights.map((ins,i)=><InsightCard key={i} insight={ins} C={C}/>)}
          </div>}

          {/* ── THIS MONTH INSIGHTS ── */}
          {insights.length>0&&<div style={{marginBottom:"10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"9px"}}>
              <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px"}}>INSIGHTS</div>
              {insights.length>2&&<button onClick={()=>setShowAllInsights(s=>!s)} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>{showAllInsights?"LESS ↑":"MORE ↓"}</button>}
            </div>
            {(showAllInsights?insights:insights.slice(0,2)).map((ins,i)=><InsightCard key={i} insight={ins} C={C}/>)}
          </div>}

          {/* ── SAVINGS SIMULATOR ── */}
          {md.income>0&&<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"15px",marginBottom:"10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div>
                <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"2px"}}>SAVINGS SIMULATOR</div>
                <div style={{fontSize:"12px",color:C.inkMid}}>What if I save {simRate}% more each month?</div>
              </div>
              <button onClick={()=>setShowSim(s=>!s)} style={{background:C.blueSoft,border:"1px solid "+C.blue+"33",borderRadius:"20px",padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",color:C.blue,letterSpacing:"1px"}}>{showSim?"HIDE":"SIMULATE"}</button>
            </div>
            {showSim&&(()=>{
              const extraPerMonth = (md.income * simRate / 100);
              const annualRate = 0.10; // 10% assumed return
              const results = [1,3,5].map(yrs => {
                const months = yrs * 12;
                const r = annualRate / 12;
                const fv = extraPerMonth * ((Math.pow(1+r, months) - 1) / r);
                return { yrs, fv: Math.round(fv) };
              });
              return<div>
                <div style={{marginBottom:"12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                    <span style={{fontSize:"11px",color:C.inkMid}}>Extra savings per month</span>
                    <span style={{fontSize:"12px",fontWeight:"700",color:C.blue,fontFamily:"'DM Mono',monospace"}}>{fmt(extraPerMonth,S,cur.code)}</span>
                  </div>
                  <input type="range" min="5" max="30" step="5" value={simRate} onChange={e=>setSimRate(Number(e.target.value))} style={{width:"100%",accentColor:C.blue}}/>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",marginTop:"3px"}}>
                    <span>5%</span><span>10%</span><span>15%</span><span>20%</span><span>25%</span><span>30%</span>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px"}}>
                  {results.map(r=>(
                    <div key={r.yrs} style={{background:C.bg,borderRadius:"10px",padding:"10px 8px",textAlign:"center"}}>
                      <div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"4px"}}>{r.yrs} YEAR{r.yrs>1?"S":""}</div>
                      <div style={{fontSize:"13px",fontWeight:"700",color:C.green,fontFamily:"'DM Mono',monospace"}}>{fmt(r.fv,S,cur.code)}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:"9px",fontSize:"10px",color:C.inkLo,fontStyle:"italic",textAlign:"center"}}>Assumes 10% annual return, monthly compounding.</div>
              </div>;
            })()}
          </div>}

          {/* ── QUICK STATS GRID ── */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"10px"}}>
            {[{label:"Income",val:fmt(md.income||0,S,cur.code),c:C.green,sub:MONTHS_S[mo],tab:"Budget"},{label:"Invested",val:fmt(totCur,S,cur.code),c:totPnL>=0?C.green:C.red,sub:(totPnL>=0?"+":"")+totPct+"%",tab:"Invest"},{label:"Loans",val:loans.length+" active",c:C.red,sub:fmt(loans.reduce((s,l)=>s+l.remaining,0),S,cur.code)+" owed",tab:"Loans"},{label:"Goals",val:goals.length+" set",c:C.blue,sub:fmt(goals.reduce((s,g)=>s+g.saved,0),S,cur.code)+" saved",tab:"Score"}].map(x=>(
              <div key={x.label} className="hc" onClick={()=>switchTab(x.tab)} style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"12px 13px",cursor:"pointer"}}>
                <div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"4px"}}>{x.label.toUpperCase()}</div>
                <div style={{fontSize:"15px",fontWeight:"700",color:x.c,fontFamily:"'DM Mono',monospace",marginBottom:"2px"}}>{x.val}</div>
                <div style={{fontSize:"10px",color:C.inkLo}}>{x.sub}</div>
              </div>
            ))}
          </div>

          {!md.income&&<div style={{background:C.blueSoft,border:"1px solid "+C.blue+"33",borderRadius:"12px",padding:"13px 14px",textAlign:"center"}}><div style={{fontSize:"13px",color:C.blue,fontWeight:"600",marginBottom:"4px"}}>Start with your income</div><div style={{fontSize:"12px",color:C.inkMid,marginBottom:"10px"}}>Add this month's income to unlock your full picture.</div><button onClick={()=>switchTab("Budget")} style={{padding:"8px 18px",borderRadius:"20px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px",fontWeight:"600"}}>ADD INCOME</button></div>}
        </div>}

        {/* ═══ RATES (in Tools dropdown) ═══ */}
        {tab==="Rates"&&<div className="fade">
          {(()=>{
            const countryRates=RATE_DATA_BY_COUNTRY[cur.code]||RATE_DATA_BY_COUNTRY.INR;
            const hasGovt=(countryRates[rateFilter.loanType]?.govt||[]).length>0;
            const bankTypes=hasGovt?[{k:"govt",l:"Government"},{k:"private",l:"Private"}]:[{k:"private",l:"Private"}];
            const activeType=(!hasGovt&&rateFilter.bankType==="govt")?"private":rateFilter.bankType;
            const rows=(countryRates[rateFilter.loanType]?.[activeType]||[]).sort((a,b)=>a.min-b.min);
            const loanLabels=cur.code==="SGD"
              ?[{k:"home",l:"Home"},{k:"personal",l:"Personal"},{k:"car",l:"Car"}]
              :[{k:"home",l:"Home"},{k:"personal",l:"Personal"},{k:"car",l:"Car"},{k:"twowheeler",l:"Two Wheeler"},{k:"creditcard",l:"Credit Card"}];
            return <>
              <div style={{marginBottom:"14px"}}>
                <h2 style={{fontSize:"18px",fontWeight:"700",color:C.ink,letterSpacing:"-.4px"}}>Interest Rates</h2>
                <p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>{cur.flag} {countryRates.label} · {countryRates.source}</p>
              </div>
              <div style={{display:"flex",gap:"7px",marginBottom:"10px"}}>
                {bankTypes.map(x=><button key={x.k} onClick={()=>setRateFilter(f=>({...f,bankType:x.k}))} style={{flex:1,padding:"9px",borderRadius:"10px",border:"1px solid "+(activeType===x.k?C.blue:C.border),background:activeType===x.k?C.blueSoft:C.white,color:activeType===x.k?C.blue:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",fontWeight:activeType===x.k?"700":"400"}}>{x.l} Banks</button>)}
              </div>
              <div style={{display:"flex",gap:"5px",marginBottom:"12px",overflowX:"auto",paddingBottom:"2px"}}>
                {loanLabels.map(x=><button key={x.k} onClick={()=>setRateFilter(f=>({...f,loanType:x.k}))} style={{flexShrink:0,padding:"7px 11px",borderRadius:"20px",border:"1px solid "+(rateFilter.loanType===x.k?C.blue:C.border),background:rateFilter.loanType===x.k?C.blue:C.white,color:rateFilter.loanType===x.k?"#fff":C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",fontWeight:rateFilter.loanType===x.k?"700":"400",whiteSpace:"nowrap"}}>{x.l}</button>)}
              </div>
              <div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"8px"}}>Source: {countryRates.source}</div>
              {rows.length===0
                ?<div style={{background:C.white,border:"1px dashed "+C.borderMid,borderRadius:"12px",padding:"30px 16px",textAlign:"center",color:C.inkLo,fontSize:"12px"}}>No rate data for this category yet.</div>
                :rows.map((b,i)=>(
                  <div key={b.bank} className="hc" style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"13px",marginBottom:"7px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"7px"}}>
                      {i===0&&<div style={{fontSize:"9px",background:C.greenSoft,color:C.green,padding:"2px 7px",borderRadius:"6px",fontFamily:"'DM Mono',monospace",fontWeight:"600",flexShrink:0}}>Lowest</div>}
                      {i===1&&<div style={{fontSize:"9px",background:C.blueSoft,color:C.blue,padding:"2px 7px",borderRadius:"6px",fontFamily:"'DM Mono',monospace",fontWeight:"600",flexShrink:0}}>2nd</div>}
                      <span style={{fontSize:"13px",fontWeight:"700",color:C.ink,flex:1}}>{b.bank}</span>
                      <div><span style={{fontSize:"14px",fontWeight:"800",color:i===0?C.green:C.blue,fontFamily:"'DM Mono',monospace"}}>{b.min}%</span><span style={{fontSize:"10px",color:C.inkLo}}> – {b.max}%</span></div>
                    </div>
                    <div style={{background:C.bg,borderRadius:"100px",height:"5px",marginBottom:"6px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"100px",background:"linear-gradient(90deg,"+C.green+","+C.blue+")",width:Math.min(100,(b.min/50)*100)+"%"}}/></div>
                    <div style={{fontSize:"10px",color:C.inkLo,fontStyle:"italic"}}>{b.note}</div>
                  </div>
                ))
              }
              <div style={{background:C.amberSoft,border:"1px solid "+C.amber+"22",borderRadius:"10px",padding:"10px 12px",marginTop:"8px"}}>
                <div style={{fontSize:"10px",color:C.amber,fontFamily:"'DM Mono',monospace",fontWeight:"600",marginBottom:"3px"}}>Disclaimer</div>
                <div style={{fontSize:"11px",color:C.inkMid,lineHeight:1.5}}>Rates are indicative as of March 2026. Always verify directly with the bank before applying. Switch currency above to see rates for other countries.</div>
              </div>
            </>;
          })()}
        </div>}

        {/* ═══ CALCULATOR (in More) ═══ */}
        {tab==="Tools"&&<div className="fade">
          <div style={{marginBottom:"14px"}}><h2 style={{fontSize:"18px",fontWeight:"700",color:C.ink,letterSpacing:"-.4px"}}>EMI Calculator</h2><p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Calculate monthly payments and total cost.</p></div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px",marginBottom:"10px"}}>
            <div style={{marginBottom:"10px"}}><label style={lbl}>LOAN TYPE</label><select value={calcForm.type} onChange={e=>setCalcForm(f=>({...f,type:e.target.value}))} style={inp}>{LOAN_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{marginBottom:"10px"}}><label style={lbl}>LOAN AMOUNT ({S})</label><input type="number" step="any" value={calcForm.amount} onChange={e=>setCalcForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 5000000" style={inp}/></div>
            <div style={{marginBottom:"10px"}}><label style={lbl}>INTEREST RATE (% P.A.)</label><input type="number" step="0.1" value={calcForm.rate} onChange={e=>setCalcForm(f=>({...f,rate:e.target.value}))} placeholder="e.g. 8.5 — check Rates tab" style={inp}/></div>
            <div style={{marginBottom:"12px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{...lbl,margin:0}}>TENURE</span><span style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace"}}>{calcForm.tenure}mo · {(calcForm.tenure/12).toFixed(1)}yr</span></div><input type="range" min="12" max="360" step="12" value={calcForm.tenure} onChange={e=>setCalcForm(f=>({...f,tenure:parseInt(e.target.value)}))}/></div>
            <button onClick={runCalc} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>CALCULATE</button>
          </div>
          {calcRes&&<div className="scaleIn"><div style={{background:C.blueSoft,border:"1px solid "+C.blue+"33",borderRadius:"14px",padding:"15px",textAlign:"center"}}><div style={{fontSize:"9px",color:C.blue,letterSpacing:"2px",fontFamily:"'DM Mono',monospace",marginBottom:"4px"}}>MONTHLY EMI</div><div style={{fontSize:"32px",fontWeight:"800",color:C.blue,fontFamily:"'DM Mono',monospace",letterSpacing:"-1px",marginBottom:"13px"}}>{fmt(calcRes.emi,S,cur.code)}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",textAlign:"left"}}>{[{l:"Principal",v:fmt(calcRes.a,S,cur.code)},{l:"Total Interest",v:fmt(calcRes.interest,S,cur.code),c:C.red},{l:"Total Payable",v:fmt(calcRes.total,S,cur.code),c:C.green},{l:"Rate Used",v:calcRes.r+"% p.a."}].map(x=>(<div key={x.l} style={{background:"rgba(255,255,255,0.65)",borderRadius:"9px",padding:"8px 9px"}}><div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l.toUpperCase()}</div><div style={{fontSize:"12px",fontWeight:"700",color:x.c||C.ink,fontFamily:"'DM Mono',monospace"}}>{x.v}</div></div>))}</div></div></div>}
        </div>}

      </main>

      {showMoPicker&&<MonthPicker onSelect={(m,y)=>{setMo(m);setYr(y);}} onClose={()=>setShowMoPicker(false)} selectedMo={mo} selectedYr={yr} C={C}/>}
      {loanPicker&&(()=>{const lm=getLoanMo(loanPicker);return<MonthPicker onSelect={(m,y)=>setLoanMo(loanPicker,m,y)} onClose={()=>setLoanPicker(null)} selectedMo={lm.mo} selectedYr={lm.yr} C={C}/>;})()}

      {modal&&<div onClick={()=>setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.38)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:"20px 20px 0 0",padding:"16px 15px 40px",width:"100%",maxWidth:"640px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 -6px 40px rgba(0,0,0,0.12)"}}>
          <div style={{width:"30px",height:"3px",background:C.borderMid,borderRadius:"2px",margin:"0 auto 16px"}}/>
          {modal==="expense"&&<><div style={{fontSize:"15px",fontWeight:"700",color:C.ink,marginBottom:"13px"}}>Add Expense</div><div style={{marginBottom:"11px"}}><label style={lbl}>Category</label><select value={expForm.cat} onChange={e=>setExpForm(f=>({...f,cat:e.target.value}))} style={inp}>{EXPENSE_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>{expForm.cat==="custom"&&<div style={{marginBottom:"11px"}}><label style={lbl}>Your Expense Name</label><input type="text" value={expForm.customLabel} onChange={e=>setExpForm(f=>({...f,customLabel:e.target.value}))} placeholder="e.g. Auto fare, Outing, Tour..." style={inp} autoFocus/></div>}<div style={{marginBottom:"11px"}}><label style={lbl}>Amount ({S})</label><input type="number" step="any" value={expForm.amount} onChange={e=>setExpForm(f=>({...f,amount:e.target.value}))} placeholder="0.00" style={inp}/></div><div style={{marginBottom:"16px"}}><label style={lbl}>Note (optional)</label><textarea value={expForm.note} onChange={e=>setExpForm(f=>({...f,note:e.target.value}))} placeholder="e.g. Monthly rent, paid to landlord..." style={{...inp,minHeight:"72px",resize:"vertical",lineHeight:"1.5",overflowY:"auto",wordBreak:"break-word",whiteSpace:"pre-wrap"}}/></div><button onClick={addExpense} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>Add Expense</button></>}
          {modal==="goal"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>New Goal</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>NAME (OPTIONAL)</label><input type="text" value={goalForm.name} onChange={e=>setGoalForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dream Home" style={inp}/></div><div><label style={lbl}>CATEGORY</label><select value={goalForm.label} onChange={e=>setGoalForm(f=>({...f,label:e.target.value}))} style={inp}>{GOAL_LABELS.map(l=><option key={l}>{l}</option>)}</select></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>TARGET ({S})</label><input type="number" step="any" value={goalForm.target} onChange={e=>setGoalForm(f=>({...f,target:e.target.value}))} placeholder="500000" style={inp}/></div><div><label style={lbl}>SAVED SO FAR ({S})</label><input type="number" step="any" value={goalForm.saved} onChange={e=>setGoalForm(f=>({...f,saved:e.target.value}))} placeholder="0.00" style={inp}/></div></div><div style={{marginBottom:"16px"}}><label style={lbl}>DEADLINE (OPTIONAL)</label><input type="month" value={goalForm.deadline} onChange={e=>setGoalForm(f=>({...f,deadline:e.target.value}))} style={inp}/></div><button onClick={addGoal} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>CREATE GOAL</button></>}
          {modal==="loan"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>Add Loan</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>NAME (OPTIONAL)</label><input type="text" value={loanForm.name} onChange={e=>setLoanForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Home Loan" style={inp}/></div><div><label style={lbl}>TYPE</label><select value={loanForm.type} onChange={e=>setLoanForm(f=>({...f,type:e.target.value}))} style={inp}>{LOAN_TYPES.map(t=><option key={t}>{t}</option>)}</select></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>PRINCIPAL ({S})</label><input type="number" step="any" value={loanForm.principal} onChange={e=>setLoanForm(f=>({...f,principal:e.target.value}))} placeholder="5000000" style={inp}/></div><div><label style={lbl}>TENURE (MONTHS)</label><input type="number" value={loanForm.tenure} onChange={e=>setLoanForm(f=>({...f,tenure:e.target.value}))} placeholder="240" style={inp}/></div></div><div style={{marginBottom:"11px"}}><label style={lbl}>INTEREST RATE (% P.A.)</label><input type="number" step="0.1" value={loanForm.rate} onChange={e=>setLoanForm(f=>({...f,rate:e.target.value}))} placeholder="e.g. 8.5" style={inp}/></div><div style={{marginBottom:"16px"}}><label style={lbl}>EMIs ALREADY PAID (existing loan only)</label><input type="number" value={loanForm.paidCount} onChange={e=>setLoanForm(f=>({...f,paidCount:e.target.value}))} placeholder="Leave blank if new loan" style={inp}/><div style={{fontSize:"10px",color:C.inkLo,marginTop:"3px",fontFamily:"'DM Mono',monospace"}}>Auto-recalculates outstanding balance.</div></div><button onClick={addLoan} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>ADD LOAN</button></>}
          {modal==="invest"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>Add Investment</div><div style={{marginBottom:"11px"}}><label style={lbl}>TYPE</label><select value={invForm.catId} onChange={e=>setInvForm(f=>({...f,catId:e.target.value}))} style={inp}>{INVEST_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>{invForm.catId==="other"&&<div style={{marginBottom:"11px"}}><label style={lbl}>CUSTOM NAME</label><input type="text" value={invForm.customLabel} onChange={e=>setInvForm(f=>({...f,customLabel:e.target.value}))} placeholder="e.g. NPS, REITs" style={inp}/></div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>INVESTED ({S})</label><input type="number" step="any" value={invForm.invested} onChange={e=>setInvForm(f=>({...f,invested:e.target.value}))} placeholder="0.00" style={inp}/></div><div><label style={lbl}>CURRENT VALUE ({S})</label><input type="number" step="any" value={invForm.current} onChange={e=>setInvForm(f=>({...f,current:e.target.value}))} placeholder="Same as invested" style={inp}/></div></div><div style={{marginBottom:"16px"}}><label style={lbl}>DATE</label><input type="date" value={invForm.date} onChange={e=>setInvForm(f=>({...f,date:e.target.value}))} style={inp}/></div><button onClick={addInvest} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>ADD INVESTMENT</button></>}
        </div>
      </div>}
    </div>
  );
}

// ROOT
export default function App() {
  const[darkMode,setDarkMode]=useState(false);
  const[user,setUser]=useState(null);
  const[screen,setScreen]=useState("loading");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);setScreen("app");}
      else setScreen("auth");
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(session?.user){setUser(session.user);setScreen("app");}
      else{setUser(null);setScreen("auth");}
    });
    const saved=localStorage.getItem("fk_theme");
    if(saved==="dark")setDarkMode(true);
    return()=>subscription.unsubscribe();
  },[]);

  const toggleTheme=()=>setDarkMode(d=>{const next=!d;localStorage.setItem("fk_theme",next?"dark":"light");return next;});
  const handleSignOut=async()=>{await supabase.auth.signOut();setUser(null);setScreen("auth");};

  if(screen==="loading")return<div style={{background:"#F5F7FA",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Mono',monospace",color:"#1B5FD4",fontSize:"13px",letterSpacing:"4px"}}>FINLYO</div>;
  if(screen==="auth")return<Auth darkMode={darkMode} onToggleTheme={toggleTheme} onLogin={(u)=>{setUser(u);setScreen("app");}}/>;
  if(screen==="settings")return<Settings user={user} darkMode={darkMode} onToggleTheme={toggleTheme} onBack={()=>setScreen("app")} onSignOut={handleSignOut}/>;
  return<Finlyo user={user} darkMode={darkMode} onOpenSettings={()=>setScreen("settings")}/>;
}
