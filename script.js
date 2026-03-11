let totalSlots=20;

let leftArea=document.getElementById("leftSlots");
let rightArea=document.getElementById("rightSlots");

let count=document.getElementById("count");
let bookedCount=document.getElementById("booked");

let historyTable=document.getElementById("historyTable");

let earningsText=document.getElementById("earnings");

let parkingData=JSON.parse(localStorage.getItem("parkingData"))||{};
let earnings=localStorage.getItem("earnings")||0;

earningsText.innerText=earnings;

let available=totalSlots-Object.keys(parkingData).length;

count.innerText=available;
bookedCount.innerText=totalSlots-available;

for(let i=1;i<=totalSlots;i++){

let slot=document.createElement("div");
slot.classList.add("slot");

if(parkingData[i]){

slot.classList.add("booked");
slot.innerText=parkingData[i].number;

}
else{

if(i<=10){
slot.innerText="Car Slot "+i;
}
else{
slot.innerText="Bike Slot "+i;
}

}

slot.onclick=function(){

if(!slot.classList.contains("booked")){

let vehicle=prompt("Enter Vehicle Type (car/bike)");
let number=prompt("Enter Vehicle Number");

if(number){

let entryTime=new Date();

parkingData[i]={
vehicle:vehicle,
number:number,
entry:entryTime
};

localStorage.setItem("parkingData",JSON.stringify(parkingData));

slot.classList.add("booked");
slot.innerText=number;

available--;

updateDashboard();

}

}

else{

let exitTime=new Date();

let data=parkingData[i];

let entry=new Date(data.entry);

let hours=Math.ceil((exitTime-entry)/(1000*60*60));

let fee=hours*20;

earnings=parseInt(earnings)+fee;

localStorage.setItem("earnings",earnings);

earningsText.innerText=earnings;

let row=historyTable.insertRow();

row.insertCell(0).innerText=i;
row.insertCell(1).innerText=data.number+" ("+data.vehicle+")";
row.insertCell(2).innerText=entry.toLocaleTimeString();
row.insertCell(3).innerText=exitTime.toLocaleTimeString();
row.insertCell(4).innerText="₹"+fee;

delete parkingData[i];

localStorage.setItem("parkingData",JSON.stringify(parkingData));

slot.classList.remove("booked");

if(i<=10){
slot.innerText="Car Slot "+i;
}
else{
slot.innerText="Bike Slot "+i;
}

available++;

updateDashboard();

}

};

if(i<=10){
leftArea.appendChild(slot);
}
else{
rightArea.appendChild(slot);
}

}

function updateDashboard(){

count.innerText=available;
bookedCount.innerText=totalSlots-available;

updateChart();

}

function searchCar(){

let car=document.getElementById("searchCar").value;
let result=document.getElementById("result");

for(let slot in parkingData){

if(parkingData[slot].number===car){

result.innerText="Vehicle parked in Slot "+slot;
return;

}

}

result.innerText="Vehicle not found";

}

function suggestSlot(){

let suggest=document.getElementById("suggest");

for(let i=1;i<=totalSlots;i++){

if(!parkingData[i]){
suggest.innerText="Best Available Slot: "+i;
return;
}

}

suggest.innerText="Parking Full";

}

function resetParking(){

localStorage.removeItem("parkingData");
localStorage.removeItem("earnings");

location.reload();

}

function toggleDark(){

document.body.classList.toggle("dark");

}

let chart;

function updateChart(){

let booked=totalSlots-available;
let free=available;

if(chart){
chart.destroy();
}

let ctx=document.getElementById("parkingChart");

chart=new Chart(ctx,{
type:"pie",
data:{
labels:["Booked","Available"],
datasets:[{data:[booked,free]}]
}
});

}

updateChart();