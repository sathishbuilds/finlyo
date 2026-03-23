import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "./supabase.js";

// ─── RATE DATA ────────────────────────────────────────────────────────────────
const RATE_DATA = {
  home: {
    govt: [
      { bank:"SBI", min:8.25, max:9.65, note:"Lowest for women; CIBIL 750+" },
      { bank:"Bank of Baroda", min:8.15, max:10.65, note:"BOB Advantage Home Loan" },
      { bank:"PNB", min:8.25, max:10.25, note:"PNB Pride for govt employees" },
      { bank:"Canara Bank", min:8.30, max:10.90, note:"Canara Home Loan scheme" },
      { bank:"Union Bank", min:8.35, max:10.75, note:"Union Home scheme" },
      { bank:"Bank of India", min:8.30, max:10.85, note:"Star Home Loan" },
      { bank:"Indian Bank", min:8.25, max:10.75, note:"IND Home Loan" },
    ],
    private: [
      { bank:"HDFC Bank", min:7.20, max:13.20, note:"CIBIL 750+ gets 7.20%" },
      { bank:"ICICI Bank", min:7.65, max:9.80, note:"iHome loan; repo-linked" },
      { bank:"Kotak Mahindra", min:7.99, max:12.00, note:"Priority customers 7.99%" },
      { bank:"Axis Bank", min:8.35, max:11.90, note:"Shubh Aarambh scheme" },
      { bank:"Federal Bank", min:8.50, max:11.50, note:"Federal Home Plus" },
      { bank:"IDFC First", min:8.65, max:13.00, note:"Flexible repayment" },
      { bank:"Yes Bank", min:9.40, max:11.00, note:"Yes Griha Loan" },
      { bank:"IndusInd", min:9.40, max:13.25, note:"IndusInd Home Loan" },
    ],
  },
  personal: {
    govt: [
      { bank:"SBI", min:10.55, max:13.05, note:"XPRESS Credit; govt salary holders" },
      { bank:"PNB", min:10.40, max:16.95, note:"PNB Personal Loan" },
      { bank:"Bank of India", min:10.85, max:14.85, note:"Star Personal Loan" },
      { bank:"Bank of Baroda", min:10.90, max:16.85, note:"Baroda Personal Loan" },
      { bank:"Union Bank", min:11.00, max:14.80, note:"Union Personal Loan" },
      { bank:"Canara Bank", min:11.90, max:15.50, note:"Canara Jeevan; salaried" },
    ],
    private: [
      { bank:"HDFC Bank", min:10.75, max:14.50, note:"Preferred for existing customers" },
      { bank:"ICICI Bank", min:10.85, max:16.00, note:"Insta Personal Loan via app" },
      { bank:"Axis Bank", min:10.99, max:22.00, note:"Rate varies by credit profile" },
      { bank:"Kotak Mahindra", min:10.99, max:24.00, note:"Lower for salary account holders" },
      { bank:"Bajaj Finserv", min:13.00, max:35.00, note:"NBFC; fast approval" },
      { bank:"IndusInd", min:14.00, max:26.00, note:"IndusInd Personal Loan" },
      { bank:"Tata Capital", min:14.99, max:30.00, note:"Tata Personal Loan" },
      { bank:"RBL Bank", min:17.50, max:26.00, note:"Quick disbursal" },
      { bank:"Yes Bank", min:19.99, max:40.00, note:"High risk pricing" },
    ],
  },
  car: {
    govt: [
      { bank:"Union Bank", min:8.70, max:10.50, note:"Union Vehicle Loan" },
      { bank:"Canara Bank", min:8.80, max:11.15, note:"Canara Vehicle Loan" },
      { bank:"PNB", min:8.75, max:9.75, note:"PNB Car Loan" },
      { bank:"SBI", min:9.15, max:10.65, note:"SBI Car Loan; concession for women" },
      { bank:"Bank of Baroda", min:9.15, max:10.65, note:"BOB Car Loan" },
      { bank:"Bank of India", min:8.85, max:10.85, note:"Star Vehicle Loan" },
    ],
    private: [
      { bank:"ICICI Bank", min:9.30, max:12.85, note:"Pre-owned car loan available" },
      { bank:"Axis Bank", min:9.25, max:13.30, note:"Axis Car Loan" },
      { bank:"HDFC Bank", min:9.40, max:12.50, note:"Fastest disbursal in India" },
      { bank:"Kotak Mahindra", min:9.50, max:14.00, note:"Easy documentation" },
      { bank:"IndusInd", min:10.00, max:16.00, note:"Quick approval" },
      { bank:"Tata Capital", min:10.99, max:16.00, note:"Tata Capital Auto Loan" },
    ],
  },
  twowheeler: {
    govt: [
      { bank:"Bank of India", min:7.60, max:11.50, note:"Lowest in India; new and used" },
      { bank:"Canara Bank", min:9.25, max:13.50, note:"Canara Vehicle Loan" },
      { bank:"PNB", min:9.50, max:14.50, note:"PNB Two Wheeler Loan" },
      { bank:"Union Bank", min:9.75, max:13.50, note:"Union Two Wheeler Loan" },
      { bank:"SBI", min:11.70, max:15.70, note:"0.50% off for electric vehicles" },
    ],
    private: [
      { bank:"L&T Finance", min:8.99, max:20.00, note:"Pan-India availability" },
      { bank:"Bajaj Finserv", min:9.00, max:24.00, note:"Wide NBFC network" },
      { bank:"ICICI Bank", min:10.25, max:26.10, note:"Ranges by credit profile" },
      { bank:"Axis Bank", min:10.50, max:20.00, note:"Quick approval online" },
      { bank:"Tata Capital", min:11.49, max:22.50, note:"Tata Two Wheeler Loan" },
      { bank:"HDFC Bank", min:14.50, max:22.00, note:"Up to 100% on-road financing" },
    ],
  },
  creditcard: {
    govt: [
      { bank:"SBI Card", min:18.00, max:42.00, note:"SBI SimplyCLICK, BPCL card" },
      { bank:"Bank of Baroda", min:18.00, max:36.00, note:"BOB Premier Card" },
      { bank:"PNB", min:21.00, max:36.00, note:"PNB Rupay Credit Card" },
      { bank:"Union Bank", min:21.00, max:36.00, note:"Union Credit Card" },
    ],
    private: [
      { bank:"HDFC Bank", min:23.88, max:43.20, note:"Varies by card tier" },
      { bank:"ICICI Bank", min:24.00, max:40.80, note:"ICICI Coral, Sapphiro range" },
      { bank:"IndusInd", min:23.88, max:43.20, note:"IndusInd Platinum Card" },
      { bank:"Kotak Mahindra", min:24.00, max:42.00, note:"Kotak Essentia, League cards" },
      { bank:"Yes Bank", min:24.00, max:48.00, note:"Yes First Exclusive Card" },
      { bank:"Axis Bank", min:25.20, max:52.80, note:"Highest penalty rate" },
      { bank:"RBL Bank", min:30.00, max:44.00, note:"Fun+ and ShopRite cards" },
    ],
  },
};

const CURRENCIES=[{code:"INR",symbol:"\u20B9",country:"India",flag:"\uD83C\uDDEE\uD83C\uDDF3"},{code:"USD",symbol:"$",country:"United States",flag:"\uD83C\uDDFA\uD83C\uDDF8"},{code:"GBP",symbol:"\u00A3",country:"UK",flag:"\uD83C\uDDEC\uD83C\uDDE7"},{code:"EUR",symbol:"\u20AC",country:"Europe",flag:"\uD83C\uDDEA\uD83C\uDDFA"},{code:"JPY",symbol:"\u00A5",country:"Japan",flag:"\uD83C\uDDEF\uD83C\uDDF5"},{code:"AUD",symbol:"A$",country:"Australia",flag:"\uD83C\uDDE6\uD83C\uDDFA"},{code:"CAD",symbol:"C$",country:"Canada",flag:"\uD83C\uDDE8\uD83C\uDDE6"},{code:"SGD",symbol:"S$",country:"Singapore",flag:"\uD83C\uDDF8\uD83C\uDDEC"}];
const EXPENSE_CATS=[{id:"rent",label:"Rent / Mortgage"},{id:"emi",label:"Loan EMI"},{id:"grocery",label:"Groceries"},{id:"utilities",label:"Utilities"},{id:"transport",label:"Transport"},{id:"health",label:"Healthcare"},{id:"education",label:"Education"},{id:"entertain",label:"Entertainment"},{id:"dining",label:"Dining"},{id:"savings",label:"Savings"},{id:"insurance",label:"Insurance"},{id:"shopping",label:"Shopping"},{id:"misc",label:"Miscellaneous"},{id:"other",label:"Other"}];
const LOAN_TYPES=["Home Loan","Car Loan","Personal Loan","Business Loan","Education Loan","Two Wheeler Loan"];
const GOAL_LABELS=["Home","Vehicle","Travel","Education","Electronics","Wedding","Business","Emergency Fund","Retirement","Health","Other"];
const INVEST_CATS=[{id:"equity",label:"Equity / Stocks",color:"#2563EB"},{id:"mf",label:"Mutual Funds",color:"#7C3AED"},{id:"sip",label:"SIP",color:"#0891B2"},{id:"gold",label:"Gold / Silver",color:"#D97706"},{id:"ppf",label:"PPF",color:"#059669"},{id:"pf",label:"PF / EPF",color:"#10B981"},{id:"largecap",label:"Large Cap",color:"#3B82F6"},{id:"midcap",label:"Mid Cap",color:"#8B5CF6"},{id:"smallcap",label:"Small Cap",color:"#EC4899"},{id:"fd",label:"Fixed Deposit",color:"#6366F1"},{id:"realestate",label:"Real Estate",color:"#F59E0B"},{id:"crypto",label:"Crypto",color:"#F97316"},{id:"bonds",label:"Bonds",color:"#14B8A6"},{id:"other",label:"Other",color:"#94A3B8"}];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_S=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Navigation — Budget first, Invest second, Loans third, Goals fourth
const PRIMARY_TABS=["Budget","Invest","Loans","Goals"];
const SECONDARY_TABS=["Overview","Rates","Calculator"];

const calcEMI=(p,r,n)=>{const m=r/12/100;if(m===0)return p/n;return(p*m*Math.pow(1+m,n))/(Math.pow(1+m,n)-1);};
const fmt=(n,sym)=>{if(n===undefined||n===null||isNaN(n))return sym+"0";const a=Math.abs(n),sg=n<0?"-":"";if(a>=10000000)return sg+sym+(a/10000000).toFixed(2)+"Cr";if(a>=1000000)return sg+sym+(a/100000).toFixed(1)+"L";if(a>=1000)return sg+sym+(a/1000).toFixed(0)+"K";return sg+sym+Math.round(a).toLocaleString();};
const TODAY=new Date();

const LIGHT={bg:"#F5F7FA",white:"#FFFFFF",card:"#FFFFFF",input:"#F5F7FA",border:"#E4E9F0",borderMid:"#C9D3DF",ink:"#0D1520",inkMid:"#4A5568",inkLo:"#8FA0B5",blue:"#1B5FD4",blueSoft:"#EDF3FF",blueMid:"#4A80E0",green:"#0B7A4E",greenSoft:"#E8F7F0",red:"#C0312B",redSoft:"#FEF0EF",amber:"#C47A0A",amberSoft:"#FEF6E6",steel:"#5A6B80"};
const DARK={bg:"#0D1520",white:"#1A2535",card:"#1A2535",input:"#111C2D",border:"#2A3A50",borderMid:"#3A5070",ink:"#EDF2F7",inkMid:"#94A3B8",inkLo:"#5A7090",blue:"#3B7FE0",blueSoft:"#1B3A6A",blueMid:"#5A9AF0",green:"#10B981",greenSoft:"#0B2A1E",red:"#F87171",redSoft:"#3A1515",amber:"#FBBF24",amberSoft:"#2A1A00",steel:"#7A8FA0"};

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
  if(s>=80)return{label:"Excellent",color:"#059669",msg:"You're in strong financial shape."};
  if(s>=65)return{label:"Good",color:"#2563EB",msg:"Solid habits. A few tweaks and you'll excel."};
  if(s>=50)return{label:"Fair",color:"#C47A0A",msg:"Making progress. Focus on savings."};
  if(s>=35)return{label:"Needs Work",color:"#C0312B",msg:"Time to review your spending."};
  return{label:"Needs Attention",color:"#C0312B",msg:"Start by adding your income. Your full picture is one step away."};
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

function HealthScore({score,breakdown,C}){
  const{label,color,msg}=scoreLabel(score);
  const r=54,cx=70,cy=70,circ=2*Math.PI*r,offset=circ-(score/100)*circ;
  const cats=[{label:"Savings",val:breakdown.savings,max:30,color:"#2563EB"},{label:"Spending",val:breakdown.spending,max:30,color:"#059669"},{label:"Debt",val:breakdown.debt,max:20,color:"#C47A0A"},{label:"Growth",val:breakdown.growth,max:20,color:"#7C3AED"}];
  return(
    <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"16px",padding:"18px",marginBottom:"10px"}}>
      <div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"14px"}}>FINANCIAL HEALTH SCORE</div>
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
  const cols={positive:{bg:C.greenSoft,border:C.green+"33",icon:C.green},warning:{bg:C.amberSoft,border:C.amber+"33",icon:C.amber},negative:{bg:C.redSoft,border:C.red+"33",icon:C.red},neutral:{bg:C.blueSoft,border:C.blue+"33",icon:C.blue}};
  const col=cols[insight.type]||cols.neutral;
  return(
    <div style={{background:col.bg,border:"1px solid "+col.border,borderRadius:"11px",padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:"9px",marginBottom:"7px"}}>
      <span style={{fontSize:"14px",color:col.icon,fontWeight:"700",flexShrink:0,marginTop:"1px",fontFamily:"'DM Mono',monospace"}}>{insight.icon}</span>
      <span style={{fontSize:"13px",color:C.inkMid,lineHeight:1.5}}>{insight.text}</span>
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
  const[expForm,setExpForm]=useState({cat:"rent",amount:"",note:""});
  const[goalForm,setGoalForm]=useState({name:"",target:"",saved:"",label:"Home",deadline:""});
  const[loanForm,setLoanForm]=useState({name:"",type:"Home Loan",principal:"",rate:"",tenure:"",paidCount:""});
  const[invForm,setInvForm]=useState({catId:"equity",customLabel:"",invested:"",current:"",date:""});
  const[calcForm,setCalcForm]=useState({amount:"",type:"Home Loan",tenure:240,rate:""});
  const[calcRes,setCalcRes]=useState(null);
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
  const addExpense=async()=>{if(!expForm.amount||isNaN(expForm.amount))return;const cat=EXPENSE_CATS.find(c=>c.id===expForm.cat);const newExp={id:Date.now(),catId:cat.id,catLabel:cat.label,amount:parseFloat(expForm.amount),note:expForm.note};const expenses=[...(md.expenses||[]),newExp];const ex=budgets[mk];if(ex?.id){await supabase.from("budgets").update({expenses}).eq("id",ex.id);}else{const{data}=await supabase.from("budgets").insert({user_id:uid,month_key:mk,income:0,expenses}).select().single();setBudgets(p=>({...p,[mk]:{id:data.id,income:0,expenses}}))}setBudgets(p=>({...p,[mk]:{...p[mk],expenses}}));setExpForm({cat:"rent",amount:"",note:""});setModal(null);showToast("Expense recorded.");};
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
    +"*{box-sizing:border-box;margin:0;padding:0;} body{background:"+C.bg+";}"
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

      {/* TAB BAR — Budget · Invest · Loans · Goals | More ▾ */}
      <nav className="tabbar" style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"0 10px",display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
        {PRIMARY_TABS.map(t=>(
          <button key={t} onClick={()=>switchTab(t)} style={{flexShrink:0,padding:"10px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:tab===t?"700":"400",color:tab===t?C.blue:C.inkLo,borderBottom:tab===t?"2px solid "+C.blue:"2px solid transparent",whiteSpace:"nowrap",transition:"color .15s"}}>{t}</button>
        ))}
        <div style={{position:"relative",marginLeft:"auto",flexShrink:0}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setShowMore(s=>!s)} style={{padding:"10px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",fontWeight:SECONDARY_TABS.includes(tab)?"700":"400",color:SECONDARY_TABS.includes(tab)?C.blue:C.inkLo,borderBottom:SECONDARY_TABS.includes(tab)?"2px solid "+C.blue:"2px solid transparent",whiteSpace:"nowrap"}}>
            {SECONDARY_TABS.includes(tab)?tab:"More"} &#9660;
          </button>
          {showMore&&(
            <div style={{position:"fixed",right:"10px",top:"96px",background:C.white,border:"1px solid "+C.border,borderRadius:"12px",overflow:"hidden",zIndex:500,minWidth:"150px",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
              {SECONDARY_TABS.map(t=>(
                <button key={t} onClick={()=>switchTab(t)} style={{display:"block",width:"100%",padding:"13px 18px",border:"none",background:tab===t?C.blueSoft:"transparent",color:tab===t?C.blue:C.ink,cursor:"pointer",fontFamily:"inherit",fontSize:"13px",textAlign:"left",borderBottom:"1px solid "+C.border,fontWeight:tab===t?"700":"400"}}>{t}</button>
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
            <div style={{fontSize:"28px",fontWeight:"800",letterSpacing:"-1px",marginBottom:"12px",fontFamily:"'DM Mono',monospace"}}>{fmt(bal,S)}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px"}}>
              {[{l:"Income",v:fmt(md.income||0,S)},{l:"Spent",v:fmt(totExp,S)},{l:"Saved",v:savPct+"%"}].map(x=>(
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
            {incEdit?(<div style={{display:"flex",gap:"7px",alignItems:"center"}}><input autoFocus type="number" value={incVal} onChange={e=>setIncVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setIncome()} placeholder="Enter income" style={{...inp,flex:1,minWidth:0}}/><button onClick={setIncome} style={{padding:"10px 13px",borderRadius:"9px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",flexShrink:0}}>SET</button><button onClick={()=>{setIncEdit(false);setIncVal("");}} style={{padding:"10px",borderRadius:"9px",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontSize:"12px",flexShrink:0}}>✕</button></div>
            ):(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:"20px",fontWeight:"700",color:md.income?C.green:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"-.5px"}}>{md.income?fmt(md.income,S):"--"}</div><button onClick={()=>{setIncEdit(true);setIncVal(md.income?String(md.income):"");}} style={{padding:"5px 12px",borderRadius:"20px",border:"1px solid "+C.border,background:C.bg,color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>{md.income?"EDIT":"SET"}</button></div>)}
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"13px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"11px"}}>
              <div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace"}}>EXPENSES</div>
              <button onClick={()=>setModal("expense")} style={{padding:"5px 12px",borderRadius:"20px",border:"1px solid "+C.blue,background:C.blueSoft,color:C.blue,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px",fontWeight:"600"}}>+ ADD</button>
            </div>
            {Object.keys(catTotals).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid "+C.border}}>{Object.entries(catTotals).map(([cid,amt])=>{const c=EXPENSE_CATS.find(x=>x.id===cid);return c?<div key={cid} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:"20px",padding:"3px 8px",fontSize:"10px",color:C.inkMid,fontFamily:"'DM Mono',monospace"}}>{c.label.split(" ")[0]} {fmt(amt,S)}</div>:null;})}</div>}
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
                      <span style={{fontSize:"12px",fontWeight:"700",color:C.red,fontFamily:"'DM Mono',monospace"}}>-{fmt(g.total,S)}</span>
                    </div>
                    {/* Individual items */}
                    {g.items.map(e=>(
                      <div key={e.id} className="hr" style={{display:"flex",alignItems:"center",gap:"9px",padding:"6px 6px 6px 18px",borderRadius:"6px",marginBottom:"1px"}}>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:"12px",color:C.inkMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.note||e.catLabel}</div></div>
                        <div style={{fontSize:"11px",color:C.inkMid,fontFamily:"'DM Mono',monospace",flexShrink:0}}>-{fmt(e.amount,S)}</div>
                        <button onClick={()=>delExp(e.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",padding:"2px 3px",flexShrink:0}}>✕</button>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{marginTop:"9px",paddingTop:"8px",borderTop:"1px solid "+C.border}}>{[{l:"Total Expenses",v:fmt(totExp,S),c:C.red},{l:"Net Balance",v:fmt(bal,S),c:bal>=0?C.green:C.red,bold:true}].map(x=>(<div key={x.l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:x.bold?"13px":"11px",color:x.bold?C.ink:C.inkMid,fontWeight:x.bold?"600":"400"}}>{x.l}</span><span style={{fontSize:x.bold?"15px":"12px",fontWeight:"700",color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.v}</span></div>))}</div>
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
          <div className="hc" style={{background:darkMode?"linear-gradient(135deg,#1A2535,#0D1520)":"linear-gradient(135deg,#0D1520,#1E293B)",borderRadius:"16px",padding:"16px",marginBottom:"9px",color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-18px",right:"-18px",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
            <div style={{fontSize:"9px",letterSpacing:"2px",opacity:.5,fontFamily:"'DM Mono',monospace",marginBottom:"3px"}}>PORTFOLIO</div>
            <div style={{fontSize:"26px",fontWeight:"800",letterSpacing:"-1px",fontFamily:"'DM Mono',monospace",marginBottom:"3px"}}>{fmt(totCur,S)}</div>
            <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"12px"}}><span style={{fontSize:"10px",color:"rgba(255,255,255,0.45)",fontFamily:"'DM Mono',monospace"}}>Invested: {fmt(totInv,S)}</span><span style={{fontSize:"11px",fontWeight:"700",color:totPnL>=0?"#34D399":"#F87171",background:"rgba(255,255,255,0.08)",padding:"2px 7px",borderRadius:"20px",fontFamily:"'DM Mono',monospace"}}>{totPnL>=0?"+":" "}{fmt(totPnL,S)} ({totPct}%)</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px"}}>{[{l:"Invested",v:fmt(totInv,S)},{l:"Current",v:fmt(totCur,S)},{l:"P & L",v:(totPnL>=0?"+":"")+totPct+"%",c:totPnL>=0?"#34D399":"#F87171"}].map(x=>(<div key={x.l} style={{background:"rgba(255,255,255,0.07)",borderRadius:"9px",padding:"7px 8px"}}><div style={{fontSize:"8px",opacity:.5,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l}</div><div style={{fontSize:"12px",fontWeight:"700",fontFamily:"'DM Mono',monospace",color:x.c||"#fff"}}>{x.v}</div></div>))}</div>
          </div>
          {pieData.length>0&&<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px",marginBottom:"9px"}}><div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace",marginBottom:"11px"}}>ALLOCATION</div><div style={{display:"flex",alignItems:"center",gap:"10px"}}><div style={{width:"120px",height:"120px",flexShrink:0}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={34} outerRadius={56} dataKey="value" paddingAngle={2}>{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={v=>fmt(v,S)} contentStyle={{background:C.white,border:"1px solid "+C.border,borderRadius:"8px",fontSize:"11px"}}/></PieChart></ResponsiveContainer></div><div style={{flex:1,minWidth:0}}>{pieData.map(d=>{const p2=totCur>0?(d.value/totCur*100).toFixed(1):0;return<div key={d.id} style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"5px"}}><div style={{width:"7px",height:"7px",borderRadius:"2px",background:d.color,flexShrink:0}}/><span style={{fontSize:"11px",color:C.inkMid,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</span><span style={{fontSize:"11px",fontWeight:"700",color:C.ink,fontFamily:"'DM Mono',monospace"}}>{p2}%</span></div>;})}</div></div></div>}
          {invests.length===0?<div style={{background:C.white,border:"1px dashed "+C.borderMid,borderRadius:"14px",padding:"40px 16px",textAlign:"center",color:C.inkLo}}><div style={{fontSize:"11px",letterSpacing:"1px",fontFamily:"'DM Mono',monospace"}}>NO INVESTMENTS YET</div><div style={{fontSize:"12px",marginTop:"5px"}}>Add your first investment above.</div></div>
          :<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"13px"}}><div style={{fontSize:"9px",color:C.inkLo,letterSpacing:"1.5px",fontFamily:"'DM Mono',monospace",marginBottom:"11px"}}>HOLDINGS</div>{invests.map(inv=>{const pl=inv.current_value-inv.invested,plPct=inv.invested>0?(pl/inv.invested*100).toFixed(1):0;return<div key={inv.id} style={{padding:"9px 0",borderBottom:"1px solid "+C.border}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}><div><div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"1px"}}><div style={{width:"6px",height:"6px",borderRadius:"50%",background:inv.color,flexShrink:0}}/><span style={{fontSize:"13px",fontWeight:"600",color:C.ink}}>{inv.label}</span></div><div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}>Since {inv.invest_date}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:"13px",fontWeight:"700",color:C.ink,fontFamily:"'DM Mono',monospace"}}>{fmt(inv.current_value,S)}</div><div style={{fontSize:"10px",fontWeight:"600",color:pl>=0?C.green:C.red,fontFamily:"'DM Mono',monospace"}}>{pl>=0?"+":""}{fmt(pl,S)} ({plPct}%)</div></div></div><div style={{display:"flex",gap:"7px",alignItems:"center"}}><span style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}>Invested: {fmt(inv.invested,S)}</span><span style={{fontSize:"10px",color:C.inkLo,marginLeft:"auto"}}>Current:</span><input type="number" value={inv.current_value||""} onChange={e=>updInvCurrent(inv.id,e.target.value)} style={{width:"95px",background:C.bg,border:"1px solid "+C.border,borderRadius:"7px",padding:"4px 7px",color:C.ink,fontFamily:"'DM Mono',monospace",fontSize:"11px",outline:"none",textAlign:"right"}} placeholder="Update"/><button onClick={()=>delInvest(inv.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",padding:"2px"}}>Remove</button></div></div>;})} </div>}
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
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"9px"}}>{[{l:"Monthly EMI",v:fmt(loan.emi,S),c:C.blue},{l:"Outstanding",v:fmt(loan.remaining,S),c:C.red},{l:"Months Left",v:String(loan.remMonths),c:C.green},{l:"Paid",v:((loan.paidKeys.length+(loan.prePaid||0)))+" / "+loan.tenure,c:C.steel}].map(d=>(<div key={d.l} style={{background:C.bg,borderRadius:"8px",padding:"8px 9px"}}><div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{d.l}</div><div style={{fontSize:"13px",fontWeight:"700",color:d.c,fontFamily:"'DM Mono',monospace"}}>{d.v}</div></div>))}</div>
            <div style={{background:C.bg,borderRadius:"100px",height:"3px",marginBottom:"9px",overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,"+C.blue+","+C.green+")",width:pct+"%",transition:"width .5s"}}/></div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"8px",background:C.bg,borderRadius:"9px",padding:"7px 10px"}}><span style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",flex:1}}>MONTH</span><button onClick={()=>setLoanMo(loan.id,lm.mo===0?11:lm.mo-1,lm.mo===0?lm.yr-1:lm.yr)} style={{width:"22px",height:"22px",borderRadius:"50%",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontSize:"11px",display:"flex",alignItems:"center",justifyContent:"center"}}>&#8249;</button><button onClick={()=>setLoanPicker(loan.id)} style={{background:"none",border:"1px solid "+C.border,borderRadius:"6px",padding:"3px 10px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",color:C.ink,fontWeight:"600"}}>{MONTHS_S[lm.mo]} {lm.yr} &#9660;</button><button onClick={()=>setLoanMo(loan.id,lm.mo===11?0:lm.mo+1,lm.mo===11?lm.yr+1:lm.yr)} style={{width:"22px",height:"22px",borderRadius:"50%",border:"1px solid "+C.border,background:"transparent",color:C.inkMid,cursor:"pointer",fontSize:"11px",display:"flex",alignItems:"center",justifyContent:"center"}}>&#8250;</button></div>
            <div style={{display:"flex",gap:"7px"}}><button onClick={()=>!paid&&markPaid(loan.id,key)} style={{flex:1,padding:"10px",borderRadius:"9px",border:"1px solid "+(paid?C.green+"44":C.blue+"44"),background:paid?C.greenSoft:C.blueSoft,color:paid?C.green:C.blue,cursor:paid?"default":"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"700",fontSize:"10px",letterSpacing:"1px"}}>{paid?"✓ "+MONTHS_S[lm.mo].toUpperCase()+" "+lm.yr+" PAID":"MARK "+MONTHS_S[lm.mo].toUpperCase()+" "+lm.yr+" PAID · "+fmt(loan.emi,S)}</button>{paid&&<button onClick={()=>undoPaid(loan.id,key)} style={{padding:"10px 12px",borderRadius:"9px",border:"1px solid "+C.borderMid,background:C.bg,color:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"1px"}}>UNDO</button>}</div>
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
                })()}</div><div style={{textAlign:"right"}}><div style={{fontSize:"15px",fontWeight:"700",color:C.ink,fontFamily:"'DM Mono',monospace"}}>{fmt(g.target,S)}</div><button onClick={()=>delGoal(g.id)} style={{background:"none",border:"none",color:C.inkLo,cursor:"pointer",fontSize:"11px",marginTop:"3px"}}>Remove</button></div></div>
            <div style={{background:C.bg,borderRadius:"100px",height:"6px",marginBottom:"8px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"100px",background:p>=100?"linear-gradient(90deg,"+C.green+",#1AAA6A)":"linear-gradient(90deg,"+C.blue+","+C.blueMid+")",width:p+"%",transition:"width .5s ease"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",marginBottom:"12px"}}>{[{l:"SAVED",v:fmt(g.saved,S),c:p>=100?C.green:C.blue,a:"left"},{l:"PROGRESS",v:p.toFixed(1)+"%",c:C.ink,a:"center"},{l:"REMAINING",v:g.saved<g.target?fmt(g.target-g.saved,S):"Done!",c:g.saved<g.target?C.red:C.green,a:"right"}].map(x=>(<div key={x.l} style={{textAlign:x.a}}><div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l}</div><div style={{fontSize:"16px",fontWeight:"700",color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.v}</div></div>))}</div>
            <div style={{background:C.blueSoft,borderRadius:"10px",padding:"11px 12px"}}><div style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"6px"}}>UPDATE YOUR PROGRESS</div><input type="number" value={g.saved||""} placeholder="Enter amount saved so far" onChange={e=>updGoal(g.id,e.target.value)} style={{...inp,background:C.white,fontSize:"13px"}}/>{p>=100&&<div style={{marginTop:"8px",fontSize:"12px",color:C.green,fontWeight:"600",textAlign:"center",animation:"pulse 2s infinite"}}>Goal achieved. Well done.</div>}</div>
          </div>;})}
        </div>}

        {/* ═══ OVERVIEW (in More) ═══ */}
        {tab==="Overview"&&<div className="fade">
          <MonthNav/>
          {md.income>0&&<div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px 16px",marginBottom:"10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}><div style={{fontSize:"12px",fontWeight:"600",color:C.ink}}>{parseFloat(savPct)>=20?"You're on track this month.":parseFloat(savPct)>=0?"Spending is getting high.":"You're overspending this month."}</div><div style={{fontSize:"11px",color:parseFloat(savPct)>=20?C.green:parseFloat(savPct)>=0?C.amber:C.red,fontFamily:"'DM Mono',monospace",fontWeight:"700"}}>{savPct}% saved</div></div>
            <div style={{background:C.bg,borderRadius:"100px",height:"7px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"100px",background:parseFloat(savPct)>=20?"linear-gradient(90deg,"+C.green+",#1AAA6A)":parseFloat(savPct)>=0?"linear-gradient(90deg,"+C.amber+",#E8A020)":"linear-gradient(90deg,"+C.red+",#E05050)",width:Math.min(100,Math.max(0,(1-(totExp/(md.income||1)))*100))+"%",transition:"width .6s ease"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px",fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace"}}><span>Spent: {fmt(totExp,S)}</span><span>Saved: {fmt(Math.max(0,bal),S)}</span></div>
          </div>}
          <HealthScore score={health.score} breakdown={health} C={C}/>
          {insights.length>0&&<div style={{marginBottom:"10px"}}><div style={{fontSize:"10px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",marginBottom:"9px"}}>INSIGHTS</div>{insights.map((ins,i)=><InsightCard key={i} insight={ins} C={C}/>)}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px"}}>
            {[{label:"Income",val:fmt(md.income||0,S),c:C.green,sub:MONTHS_S[mo],tab:"Budget"},{label:"Invested",val:fmt(totCur,S),c:totPnL>=0?C.green:C.red,sub:(totPnL>=0?"+":"")+totPct+"%",tab:"Invest"},{label:"Loans",val:loans.length+" active",c:C.red,sub:fmt(loans.reduce((s,l)=>s+l.remaining,0),S)+" owed",tab:"Loans"},{label:"Goals",val:goals.length+" set",c:C.blue,sub:fmt(goals.reduce((s,g)=>s+g.saved,0),S)+" saved",tab:"Goals"}].map(x=>(
              <div key={x.label} className="hc" onClick={()=>switchTab(x.tab)} style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"12px 13px",cursor:"pointer"}}>
                <div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"4px"}}>{x.label.toUpperCase()}</div>
                <div style={{fontSize:"15px",fontWeight:"700",color:x.c,fontFamily:"'DM Mono',monospace",marginBottom:"2px"}}>{x.val}</div>
                <div style={{fontSize:"10px",color:C.inkLo}}>{x.sub}</div>
              </div>
            ))}
          </div>
          {!md.income&&<div style={{background:C.blueSoft,border:"1px solid "+C.blue+"33",borderRadius:"12px",padding:"13px 14px",textAlign:"center",marginTop:"10px"}}><div style={{fontSize:"13px",color:C.blue,fontWeight:"600",marginBottom:"4px"}}>Start with your income</div><div style={{fontSize:"12px",color:C.inkMid,marginBottom:"10px"}}>Add this month's income to unlock your full picture.</div><button onClick={()=>switchTab("Budget")} style={{padding:"8px 18px",borderRadius:"20px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"1px",fontWeight:"600"}}>ADD INCOME</button></div>}
        </div>}

        {/* ═══ RATES (in More) ═══ */}
        {tab==="Rates"&&<div className="fade">
          <div style={{marginBottom:"14px"}}><h2 style={{fontSize:"18px",fontWeight:"800",color:C.ink,letterSpacing:"-.4px"}}>Interest Rates</h2><p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Real rates from Indian banks — March 2026.</p></div>
          <div style={{display:"flex",gap:"7px",marginBottom:"10px"}}>{[{k:"govt",l:"Government"},{k:"private",l:"Private"}].map(x=><button key={x.k} onClick={()=>setRateFilter(f=>({...f,bankType:x.k}))} style={{flex:1,padding:"9px",borderRadius:"10px",border:"1px solid "+(rateFilter.bankType===x.k?C.blue:C.border),background:rateFilter.bankType===x.k?C.blueSoft:C.white,color:rateFilter.bankType===x.k?C.blue:C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",fontWeight:rateFilter.bankType===x.k?"700":"400"}}>{x.l} Banks</button>)}</div>
          <div style={{display:"flex",gap:"5px",marginBottom:"12px",overflowX:"auto",paddingBottom:"2px"}}>{[{k:"home",l:"Home"},{k:"personal",l:"Personal"},{k:"car",l:"Car"},{k:"twowheeler",l:"Two Wheeler"},{k:"creditcard",l:"Credit Card"}].map(x=><button key={x.k} onClick={()=>setRateFilter(f=>({...f,loanType:x.k}))} style={{flexShrink:0,padding:"7px 11px",borderRadius:"20px",border:"1px solid "+(rateFilter.loanType===x.k?C.blue:C.border),background:rateFilter.loanType===x.k?C.blue:C.white,color:rateFilter.loanType===x.k?"#fff":C.inkMid,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",fontWeight:rateFilter.loanType===x.k?"700":"400",whiteSpace:"nowrap"}}>{x.l}</button>)}</div>
          <div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"8px"}}>Source: BankBazaar, Paisabazaar · March 2026</div>
          {(RATE_DATA[rateFilter.loanType]?.[rateFilter.bankType]||[]).sort((a,b)=>a.min-b.min).map((b,i)=>(<div key={b.bank} className="hc" style={{background:C.white,border:"1px solid "+C.border,borderRadius:"12px",padding:"13px",marginBottom:"7px"}}><div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"7px"}}>{i===0&&<div style={{fontSize:"9px",background:C.greenSoft,color:C.green,padding:"2px 7px",borderRadius:"6px",fontFamily:"'DM Mono',monospace",fontWeight:"600",flexShrink:0}}>LOWEST</div>}{i===1&&<div style={{fontSize:"9px",background:C.blueSoft,color:C.blue,padding:"2px 7px",borderRadius:"6px",fontFamily:"'DM Mono',monospace",fontWeight:"600",flexShrink:0}}>2ND</div>}<span style={{fontSize:"13px",fontWeight:"700",color:C.ink,flex:1}}>{b.bank}</span><div><span style={{fontSize:"14px",fontWeight:"800",color:i===0?C.green:C.blue,fontFamily:"'DM Mono',monospace"}}>{b.min}%</span><span style={{fontSize:"10px",color:C.inkLo}}> – {b.max}%</span></div></div><div style={{background:C.bg,borderRadius:"100px",height:"5px",marginBottom:"6px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"100px",background:"linear-gradient(90deg,"+C.green+","+C.blue+")",width:Math.min(100,(b.min/50)*100)+"%"}}/></div><div style={{fontSize:"10px",color:C.inkLo,fontStyle:"italic"}}>{b.note}</div></div>))}
          <div style={{background:C.amberSoft,border:"1px solid "+C.amber+"22",borderRadius:"10px",padding:"10px 12px",marginTop:"8px"}}><div style={{fontSize:"10px",color:C.amber,fontFamily:"'DM Mono',monospace",fontWeight:"600",marginBottom:"3px"}}>DISCLAIMER</div><div style={{fontSize:"11px",color:C.inkMid,lineHeight:1.5}}>Rates are indicative as of March 2026. Always verify directly with the bank before applying.</div></div>
        </div>}

        {/* ═══ CALCULATOR (in More) ═══ */}
        {tab==="Calculator"&&<div className="fade">
          <div style={{marginBottom:"14px"}}><h2 style={{fontSize:"18px",fontWeight:"800",color:C.ink,letterSpacing:"-.4px"}}>EMI Calculator</h2><p style={{fontSize:"11px",color:C.inkLo,marginTop:"2px"}}>Know the full cost before you borrow.</p></div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"14px",padding:"14px",marginBottom:"10px"}}>
            <div style={{marginBottom:"10px"}}><label style={lbl}>LOAN TYPE</label><select value={calcForm.type} onChange={e=>setCalcForm(f=>({...f,type:e.target.value}))} style={inp}>{LOAN_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{marginBottom:"10px"}}><label style={lbl}>LOAN AMOUNT ({S})</label><input type="number" value={calcForm.amount} onChange={e=>setCalcForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 5000000" style={inp}/></div>
            <div style={{marginBottom:"10px"}}><label style={lbl}>INTEREST RATE (% P.A.)</label><input type="number" step="0.1" value={calcForm.rate} onChange={e=>setCalcForm(f=>({...f,rate:e.target.value}))} placeholder="e.g. 8.5 — check Rates tab" style={inp}/></div>
            <div style={{marginBottom:"12px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{...lbl,margin:0}}>TENURE</span><span style={{fontSize:"10px",color:C.blue,fontFamily:"'DM Mono',monospace"}}>{calcForm.tenure}mo · {(calcForm.tenure/12).toFixed(1)}yr</span></div><input type="range" min="12" max="360" step="12" value={calcForm.tenure} onChange={e=>setCalcForm(f=>({...f,tenure:parseInt(e.target.value)}))}/></div>
            <button onClick={runCalc} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>CALCULATE</button>
          </div>
          {calcRes&&<div className="scaleIn"><div style={{background:C.blueSoft,border:"1px solid "+C.blue+"33",borderRadius:"14px",padding:"15px",textAlign:"center"}}><div style={{fontSize:"9px",color:C.blue,letterSpacing:"2px",fontFamily:"'DM Mono',monospace",marginBottom:"4px"}}>MONTHLY EMI</div><div style={{fontSize:"32px",fontWeight:"800",color:C.blue,fontFamily:"'DM Mono',monospace",letterSpacing:"-1px",marginBottom:"13px"}}>{fmt(calcRes.emi,S)}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",textAlign:"left"}}>{[{l:"Principal",v:fmt(calcRes.a,S)},{l:"Total Interest",v:fmt(calcRes.interest,S),c:C.red},{l:"Total Payable",v:fmt(calcRes.total,S),c:C.green},{l:"Rate Used",v:calcRes.r+"% p.a."}].map(x=>(<div key={x.l} style={{background:"rgba(255,255,255,0.65)",borderRadius:"9px",padding:"8px 9px"}}><div style={{fontSize:"9px",color:C.inkLo,fontFamily:"'DM Mono',monospace",letterSpacing:"1px",marginBottom:"2px"}}>{x.l.toUpperCase()}</div><div style={{fontSize:"12px",fontWeight:"700",color:x.c||C.ink,fontFamily:"'DM Mono',monospace"}}>{x.v}</div></div>))}</div></div></div>}
        </div>}

      </main>

      {showMoPicker&&<MonthPicker onSelect={(m,y)=>{setMo(m);setYr(y);}} onClose={()=>setShowMoPicker(false)} selectedMo={mo} selectedYr={yr} C={C}/>}
      {loanPicker&&(()=>{const lm=getLoanMo(loanPicker);return<MonthPicker onSelect={(m,y)=>setLoanMo(loanPicker,m,y)} onClose={()=>setLoanPicker(null)} selectedMo={lm.mo} selectedYr={lm.yr} C={C}/>;})()}

      {modal&&<div onClick={()=>setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.38)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:"20px 20px 0 0",padding:"16px 15px 40px",width:"100%",maxWidth:"640px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 -6px 40px rgba(0,0,0,0.12)"}}>
          <div style={{width:"30px",height:"3px",background:C.borderMid,borderRadius:"2px",margin:"0 auto 16px"}}/>
          {modal==="expense"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>Add Expense</div><div style={{marginBottom:"11px"}}><label style={lbl}>CATEGORY</label><select value={expForm.cat} onChange={e=>setExpForm(f=>({...f,cat:e.target.value}))} style={inp}>{EXPENSE_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div><div style={{marginBottom:"11px"}}><label style={lbl}>AMOUNT ({S})</label><input type="number" value={expForm.amount} onChange={e=>setExpForm(f=>({...f,amount:e.target.value}))} placeholder="0" style={inp}/></div><div style={{marginBottom:"16px"}}><label style={lbl}>NOTE (OPTIONAL)</label><input type="text" value={expForm.note} onChange={e=>setExpForm(f=>({...f,note:e.target.value}))} placeholder="e.g. Monthly rent" style={inp}/></div><button onClick={addExpense} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>ADD EXPENSE</button></>}
          {modal==="goal"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>New Goal</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>NAME (OPTIONAL)</label><input type="text" value={goalForm.name} onChange={e=>setGoalForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dream Home" style={inp}/></div><div><label style={lbl}>CATEGORY</label><select value={goalForm.label} onChange={e=>setGoalForm(f=>({...f,label:e.target.value}))} style={inp}>{GOAL_LABELS.map(l=><option key={l}>{l}</option>)}</select></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>TARGET ({S})</label><input type="number" value={goalForm.target} onChange={e=>setGoalForm(f=>({...f,target:e.target.value}))} placeholder="500000" style={inp}/></div><div><label style={lbl}>SAVED SO FAR ({S})</label><input type="number" value={goalForm.saved} onChange={e=>setGoalForm(f=>({...f,saved:e.target.value}))} placeholder="0" style={inp}/></div></div><div style={{marginBottom:"16px"}}><label style={lbl}>DEADLINE (OPTIONAL)</label><input type="month" value={goalForm.deadline} onChange={e=>setGoalForm(f=>({...f,deadline:e.target.value}))} style={inp}/></div><button onClick={addGoal} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>CREATE GOAL</button></>}
          {modal==="loan"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>Add Loan</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>NAME (OPTIONAL)</label><input type="text" value={loanForm.name} onChange={e=>setLoanForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Home Loan" style={inp}/></div><div><label style={lbl}>TYPE</label><select value={loanForm.type} onChange={e=>setLoanForm(f=>({...f,type:e.target.value}))} style={inp}>{LOAN_TYPES.map(t=><option key={t}>{t}</option>)}</select></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>PRINCIPAL ({S})</label><input type="number" value={loanForm.principal} onChange={e=>setLoanForm(f=>({...f,principal:e.target.value}))} placeholder="5000000" style={inp}/></div><div><label style={lbl}>TENURE (MONTHS)</label><input type="number" value={loanForm.tenure} onChange={e=>setLoanForm(f=>({...f,tenure:e.target.value}))} placeholder="240" style={inp}/></div></div><div style={{marginBottom:"11px"}}><label style={lbl}>INTEREST RATE (% P.A.)</label><input type="number" step="0.1" value={loanForm.rate} onChange={e=>setLoanForm(f=>({...f,rate:e.target.value}))} placeholder="e.g. 8.5" style={inp}/></div><div style={{marginBottom:"16px"}}><label style={lbl}>EMIs ALREADY PAID (existing loan only)</label><input type="number" value={loanForm.paidCount} onChange={e=>setLoanForm(f=>({...f,paidCount:e.target.value}))} placeholder="Leave blank if new loan" style={inp}/><div style={{fontSize:"10px",color:C.inkLo,marginTop:"3px",fontFamily:"'DM Mono',monospace"}}>Auto-recalculates outstanding balance.</div></div><button onClick={addLoan} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>ADD LOAN</button></>}
          {modal==="invest"&&<><div style={{fontSize:"15px",fontWeight:"800",color:C.ink,marginBottom:"13px"}}>Add Investment</div><div style={{marginBottom:"11px"}}><label style={lbl}>TYPE</label><select value={invForm.catId} onChange={e=>setInvForm(f=>({...f,catId:e.target.value}))} style={inp}>{INVEST_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>{invForm.catId==="other"&&<div style={{marginBottom:"11px"}}><label style={lbl}>CUSTOM NAME</label><input type="text" value={invForm.customLabel} onChange={e=>setInvForm(f=>({...f,customLabel:e.target.value}))} placeholder="e.g. NPS, REITs" style={inp}/></div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"11px"}}><div><label style={lbl}>INVESTED ({S})</label><input type="number" value={invForm.invested} onChange={e=>setInvForm(f=>({...f,invested:e.target.value}))} placeholder="0" style={inp}/></div><div><label style={lbl}>CURRENT VALUE ({S})</label><input type="number" value={invForm.current} onChange={e=>setInvForm(f=>({...f,current:e.target.value}))} placeholder="Same as invested" style={inp}/></div></div><div style={{marginBottom:"16px"}}><label style={lbl}>DATE</label><input type="date" value={invForm.date} onChange={e=>setInvForm(f=>({...f,date:e.target.value}))} style={inp}/></div><button onClick={addInvest} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:C.blue,color:"#fff",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:"600",fontSize:"12px",letterSpacing:"2px"}}>ADD INVESTMENT</button></>}
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
