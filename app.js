const PROFILE_KEY = "fitlockProfileV3";
const DATA_KEY = "fitlockDataV3";

const exercises = [
  {name:"Bodyweight Squat", sets:3, reps:"8–12", level:"Beginner", video:"bodyweight squat beginner form"},
  {name:"Wall Push-up", sets:3, reps:"8–12", level:"Beginner", video:"wall push up beginner form"},
  {name:"Glute Bridge", sets:3, reps:"10–15", level:"Beginner", video:"glute bridge beginner form"},
  {name:"Bird Dog", sets:3, reps:"8 each side", level:"Beginner", video:"bird dog exercise beginner form"},
  {name:"Plank", sets:2, reps:"15–30 sec", level:"Beginner", video:"beginner plank proper form"},
  {name:"March in Place", sets:3, reps:"30–60 sec", level:"Beginner", video:"march in place beginner exercise"},
  {name:"Reverse Lunge", sets:2, reps:"6–10 each side", level:"Beginner", video:"reverse lunge beginner form"}
];

let profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
let data = JSON.parse(localStorage.getItem(DATA_KEY) || "null") || {
  workout: [],
  waterDone: 0,
  bottle: null,
  points: 0,
  streak: 0,
  lastDay: null
};

let currentStep = 0;
const totalSteps = 8;

const $ = id => document.getElementById(id);
const saveData = () => localStorage.setItem(DATA_KEY, JSON.stringify(data));
const saveProfile = () => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

function selected(name){
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function updateProgress(){
  $("progressText").textContent = `Step ${currentStep+1} of ${totalSteps}`;
  $("progressBar").style.width = `${((currentStep+1)/totalSteps)*100}%`;
  document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active", i<=currentStep));
  document.querySelectorAll(".slide").forEach((s,i)=>s.classList.toggle("active", i===currentStep));
  $("backBtn").style.visibility = currentStep === 0 ? "hidden" : "visible";
  $("nextBtn").classList.toggle("hidden", currentStep === totalSteps-1);
  $("generateBtn").classList.toggle("hidden", currentStep !== totalSteps-1);
}

function validateStep(){
  if(currentStep===0 && !$("name").value.trim()){ alert("Please enter your name."); return false; }
  if(currentStep===1){
    const age = Number($("age").value);
    if(!age || age<13 || age>100){ alert("Please enter an age from 13 to 100."); return false; }
  }
  if(currentStep===2){
    const w = Number($("weight").value);
    if(!w || w<25 || w>300){ alert("Please enter a valid weight."); return false; }
  }
  if(currentStep===3){
    const h = Number($("height").value);
    if(!h || h<100 || h>230){ alert("Please enter a valid height."); return false; }
  }
  return true;
}

function setupDots(){
  $("progressDots").innerHTML = "";
  for(let i=0;i<totalSteps;i++){
    const d=document.createElement("span");
    d.className="dot";
    $("progressDots").appendChild(d);
  }
  updateProgress();
}

$("nextBtn").addEventListener("click",()=>{
  if(!validateStep()) return;
  if(currentStep<totalSteps-1){ currentStep++; updateProgress(); }
});
$("backBtn").addEventListener("click",()=>{
  if(currentStep>0){ currentStep--; updateProgress(); }
});

$("onboardingForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  if(!validateStep()) return;
  profile = {
    name:$("name").value.trim(),
    age:Number($("age").value),
    weight:Number($("weight").value),
    height:Number($("height").value),
    goal:selected("goal"),
    dietType:selected("dietType"),
    activity:Number(selected("activity")),
    budget:Number($("budget").value)||0
  };
  saveProfile();
  if(!data.workout.length) data.workout = defaultWorkout();
  touchDay();
  saveData();
  render();
  document.querySelector("#dashboard").scrollIntoView({behavior:"smooth"});
});

function defaultWorkout(){
  const goal = profile?.goal || "General fitness";
  if(goal==="Improve endurance") return [
    {...exercises[5], sets:3, reps:"30–60 sec"},
    {...exercises[3], sets:2, reps:"8 each side"},
    {...exercises[4], sets:2, reps:"15–30 sec"}
  ];
  if(goal==="Build strength") return [
    {...exercises[0], sets:3, reps:"8–12"},
    {...exercises[1], sets:3, reps:"8–12"},
    {...exercises[2], sets:3, reps:"10–15"}
  ];
  return [
    {...exercises[0], sets:3, reps:"8–12"},
    {...exercises[1], sets:3, reps:"8–12"},
    {...exercises[2], sets:3, reps:"10–15"}
  ];
}

function calc(){
  if(!profile) return {water:2000, activity:150, expense:3000};
  // Keep the prototype's numbers conservative and informational.
  const water = Math.max(1500, Math.round(profile.weight*30));
  const activity = Math.max(100, Math.round(profile.weight*2.5));
  const expense = Math.max(1000, Math.min(profile.budget || 3000, Math.round((profile.budget || 3000)*0.65)));
  return {water, activity, expense};
}

function pointsAdd(amount, reason){
  data.points += amount;
  saveData();
  renderPoints();
  if(reason) showToast(`+${amount} FitPoints — ${reason}`);
}

function touchDay(){
  const today = new Date().toISOString().slice(0,10);
  if(data.lastDay !== today){
    if(data.lastDay){
      const old = new Date(data.lastDay);
      const now = new Date(today);
      const diff = Math.round((now-old)/86400000);
      data.streak = diff===1 ? data.streak+1 : 1;
    }else data.streak=1;
    data.lastDay=today;
  }
}

function render(){
  if(!profile) return;
  $("userName").textContent = profile.name;
  const c=calc();
  $("waterTarget").textContent = `${c.water} ml`;
  $("activityTarget").textContent = `${c.activity} kcal`;
  $("budgetView").textContent = `₹${profile.budget.toLocaleString("en-IN")}`;
  renderWorkout();
  renderGuides();
  renderDiet();
  renderWater();
  renderPoints();
}

function renderPoints(){
  $("points").textContent = data.points.toLocaleString("en-IN");
  $("streak").textContent = data.streak;
  $("streakTitle").textContent = data.streak ? `${data.streak}-day consistency` : "Start your first day";
}

function renderWorkout(){
  const box=$("workoutList");
  box.innerHTML="";
  data.workout.forEach((ex,i)=>{
    const div=document.createElement("div");
    div.className="workout-item";
    div.innerHTML=`<div><h3>${ex.name}</h3><p>${ex.sets} sets • ${ex.reps}</p></div><span class="tag">${ex.level||"Beginner"}</span><button class="small-btn" data-remove="${i}">Remove today</button>`;
    box.appendChild(div);
  });
  box.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.onclick=()=>{
      const i=Number(btn.dataset.remove);
      data.workout.splice(i,1);
      saveData(); renderWorkout();
      showToast("Exercise removed for today.");
    };
  });
}

function renderGuides(){
  const box=$("guideGrid"); box.innerHTML="";
  data.workout.forEach(ex=>{
    const card=document.createElement("div");
    card.className="guide-card";
    const url="https://www.youtube.com/results?search_query="+encodeURIComponent(ex.video || ex.name+" beginner form");
    card.innerHTML=`<h3>${ex.name}</h3><p>${ex.sets} sets • ${ex.reps}</p><a href="${url}" target="_blank" rel="noopener">▶ Find a video guide</a>`;
    box.appendChild(card);
  });
}

function renderDiet(){
  const type=profile?.dietType || "Vegetarian";
  const options={
    Vegetarian:[
      ["Breakfast","Oats + milk/curd + fruit","Simple breakfast with carbohydrate, protein and fruit."],
      ["Lunch","Rice/roti + dal + vegetables + curd","Balanced everyday meal."],
      ["Snack","Fruit + roasted chana or peanuts","Easy snack option."],
      ["Dinner","Roti + paneer/tofu + vegetables","Simple dinner with a protein source."]
    ],
    "Non-vegetarian":[
      ["Breakfast","Oats + milk + fruit + eggs","Simple breakfast option."],
      ["Lunch","Rice/roti + dal + chicken/egg + vegetables","Balanced everyday meal."],
      ["Snack","Fruit + curd or roasted chana","Easy snack option."],
      ["Dinner","Roti + egg/chicken + vegetables","Simple dinner with a protein source."]
    ],
    Vegan:[
      ["Breakfast","Oats + fortified soy milk + fruit","Plant-based breakfast option."],
      ["Lunch","Rice/roti + dal + vegetables + tofu","Balanced everyday meal."],
      ["Snack","Fruit + roasted chana/peanuts","Easy snack option."],
      ["Dinner","Roti + tofu/beans + vegetables","Simple plant-based dinner."]
    ],
    Flexible:[
      ["Breakfast","Oats + milk/soy milk + fruit","Flexible breakfast."],
      ["Lunch","Rice/roti + dal + vegetables + your preferred protein","Balanced everyday meal."],
      ["Snack","Fruit + curd/chana/nuts","Easy snack."],
      ["Dinner","Roti + vegetables + a protein source","Keep it simple and balanced."]
    ]
  };
  $("dietGrid").innerHTML=options[type].map(m=>`<div class="meal-card"><p class="eyebrow">${m[0]}</p><h3>${m[1]}</h3><p>${m[2]}</p></div>`).join("");
  const c=calc();
  $("expense").textContent=`₹${c.expense.toLocaleString("en-IN")} / month`;
  const ratio=Math.min(100,Math.round((c.expense/(profile.budget||1))*100));
  $("budgetMeter").style.width=ratio+"%";
}

$("addExercise").addEventListener("click",()=>{
  const available=exercises.filter(x=>!data.workout.some(y=>y.name===x.name));
  if(!available.length){showToast("All beginner exercises are already in your plan.");return;}
  const ex=available[0];
  data.workout.push({...ex});
  saveData(); renderWorkout(); renderGuides();
  showToast(`${ex.name} added.`);
});

$("replaceTip").addEventListener("click",()=>{
  const choices=exercises.filter(x=>!data.workout.some(y=>y.name===x.name));
  if(!choices.length){showToast("No unused beginner alternative is available.");return;}
  const old=data.workout.pop();
  data.workout.push({...choices[Math.floor(Math.random()*choices.length)]});
  saveData(); renderWorkout(); renderGuides();
  showToast(`${old?.name||"Exercise"} replaced with a beginner alternative.`);
});

$("saveBottle").addEventListener("click",()=>{
  const cap=Number($("bottleCapacity").value);
  if(!cap || cap<100){showToast("Enter a valid bottle capacity.");return;}
  data.bottle={capacity:cap, hasPhoto:$("bottlePhoto").files.length>0};
  saveData(); renderWater(); showToast("Bottle saved.");
});

$("drinkBottle").addEventListener("click",()=>{
  if(!data.bottle){showToast("Save your bottle first.");return;}
  const c=calc();
  data.waterDone=Math.min(c.water,data.waterDone+data.bottle.capacity);
  touchDay();
  pointsAdd(40,"Bottle finished");
  saveData(); renderWater(); renderPoints();
});

function renderWater(){
  if(!profile)return;
  const c=calc();
  const done=Math.min(data.waterDone,c.water);
  $("waterDone").textContent=done;
  $("waterPercent").textContent=`${Math.round(done/c.water*100)}% complete`;
  $("bottleStatus").textContent=data.bottle
    ? `Bottle: ${data.bottle.capacity} ml${data.bottle.hasPhoto?" • photo added":""}`
    : "No bottle registered.";
}

function showToast(msg){
  let t=document.getElementById("toast");
  if(!t){t=document.createElement("div");t.id="toast";t.style.cssText="position:fixed;right:20px;bottom:20px;background:#17202a;color:#fff;padding:13px 16px;border-radius:12px;z-index:99;box-shadow:0 10px 30px rgba(0,0,0,.2)";document.body.appendChild(t);}
  t.textContent=msg;t.style.opacity="1";
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.style.opacity="0",2200);
}

function assistantReply(q){
  const s=q.toLowerCase();
  if(s.includes("workout")||s.includes("beginner")) return "Start with 2–3 comfortable sessions per week. Learn the movement first, use manageable reps, and take rest days. You do not need to train to exhaustion.";
  if(s.includes("water")||s.includes("hydr")) return "Drink water regularly through the day and more when you are thirsty or active. Your dashboard number is only a general estimate.";
  if(s.includes("food")||s.includes("meal")||s.includes("vegetarian")) return "Try a simple balanced meal: a grain such as rice/roti, a protein source such as dal/curd/tofu/eggs, vegetables and fruit. Your Diet section has more examples.";
  if(s.includes("pain")) return "Do not push through pain. Stop the movement and tell a parent/guardian or qualified health professional if you need help, especially if pain is persistent or severe.";
  return "I can help with beginner exercise, hydration, food ideas and how this website works. For medical or nutrition treatment questions, ask a qualified professional.";
}

function sendChat(text){
  const q=(text||$("chatInput").value).trim();
  if(!q)return;
  const box=$("chatMessages");
  box.innerHTML += `<div class="user-message">${q.replace(/[<>]/g,"")}</div>`;
  box.innerHTML += `<div class="bot-message">${assistantReply(q)}</div>`;
  $("chatInput").value="";
  box.scrollTop=box.scrollHeight;
}
$("sendChat").onclick=()=>sendChat();
$("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendChat()});
document.querySelectorAll(".quick-questions button").forEach(b=>b.onclick=()=>sendChat(b.dataset.q));

setupDots();

if(profile){
  $("name").value=profile.name||"";
  $("age").value=profile.age||"";
  $("weight").value=profile.weight||"";
  $("height").value=profile.height||"";
  $("budget").value=profile.budget||3000;
  const g=document.querySelector(`input[name="goal"][value="${profile.goal}"]`); if(g)g.checked=true;
  const d=document.querySelector(`input[name="dietType"][value="${profile.dietType}"]`); if(d)d.checked=true;
  const a=document.querySelector(`input[name="activity"][value="${profile.activity}"]`); if(a)a.checked=true;
  if(!data.workout.length)data.workout=defaultWorkout();
  touchDay();saveData();render();
}
