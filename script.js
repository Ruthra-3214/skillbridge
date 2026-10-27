const careerSkills = {
  "Data Scientist": ["Python basics","SQL","Excel","Statistics","NumPy","Pandas","Data visualisation","Machine learning"],
  "AI/ML Engineer": ["Python basics","Math foundations","NumPy","Pandas","Machine learning","Deep learning","Model evaluation","Git and GitHub"],
  "Web Developer": ["HTML","CSS","JavaScript","Responsive design","Git and GitHub","APIs","Frontend framework","Backend basics"]
};
const careerPlans = {
  "Data Scientist": [
    {title:"Python foundations",desc:"Practise variables, conditions, loops, functions, and working with lists and dictionaries.",deliverable:"Build: a simple expense tracker",skills:["Python basics"]},
    {title:"Work with real data",desc:"Learn SQL basics and use NumPy and Pandas to load, clean, filter, and summarise data.",deliverable:"Build: a student marks analysis",skills:["SQL","NumPy","Pandas"]},
    {title:"Statistics and visualisation",desc:"Explore averages, spread, correlation, and clear charts that communicate a finding.",deliverable:"Build: a mini data story with charts",skills:["Statistics","Excel","Data visualisation"]},
    {title:"Your first machine-learning model",desc:"Learn train/test splits, a baseline model, evaluation metrics, and how to explain results.",deliverable:"Build: a beginner prediction project",skills:["Machine learning"]}
  ],
  "AI/ML Engineer": [
    {title:"Python and maths foundations",desc:"Practise functions, collections, loops, basic linear algebra ideas, and probability.",deliverable:"Build: a Python problem-solving notebook",skills:["Python basics","Math foundations"]},
    {title:"Prepare and explore data",desc:"Use NumPy and Pandas to clean data, handle missing values, and understand features.",deliverable:"Build: an exploratory data analysis report",skills:["NumPy","Pandas"]},
    {title:"Train and evaluate a model",desc:"Understand train/test splits, regression or classification, and appropriate evaluation metrics.",deliverable:"Build: a small classification model",skills:["Machine learning","Model evaluation"]},
    {title:"Package your work",desc:"Organise code, document your project, use Git, and explain model limitations.",deliverable:"Build: a documented ML project on GitHub",skills:["Git and GitHub","Deep learning"]}
  ],
  "Web Developer": [
    {title:"Structure pages with HTML",desc:"Build semantic page sections, forms, buttons, and accessible labels.",deliverable:"Build: a personal profile page",skills:["HTML"]},
    {title:"Design with CSS",desc:"Practise layouts, spacing, typography, Flexbox/Grid, and responsive design.",deliverable:"Build: a responsive landing page",skills:["CSS","Responsive design"]},
    {title:"Add interactivity",desc:"Use JavaScript events, arrays, objects, functions, and DOM updates.",deliverable:"Build: a task tracker",skills:["JavaScript"]},
    {title:"Connect and publish",desc:"Learn basic APIs, Git version control, and how to organise a project for deployment.",deliverable:"Build: a small API-powered website",skills:["APIs","Git and GitHub","Frontend framework","Backend basics"]}
  ]
};
const resources = [
  {name:"freeCodeCamp",desc:"Free coding lessons and hands-on practice.",url:"https://www.freecodecamp.org/"},
  {name:"Khan Academy",desc:"Accessible lessons for maths and statistics.",url:"https://www.khanacademy.org/"},
  {name:"GitHub Skills",desc:"Short interactive lessons for GitHub workflows.",url:"https://skills.github.com/"},
  {name:"Kaggle Learn",desc:"Short lessons in Python, Pandas, and machine learning.",url:"https://www.kaggle.com/learn"},
  {name:"MDN Web Docs",desc:"Trusted HTML, CSS, and JavaScript documentation.",url:"https://developer.mozilla.org/"},
  {name:"Google ML Crash Course",desc:"Practical introductory machine-learning material.",url:"https://developers.google.com/machine-learning/crash-course"}
];
const skillChoices = document.getElementById("skillChoices");
const form = document.getElementById("roadmapForm");
let currentProjectDone = localStorage.getItem("skillbridgeProjectDone") === "true";

function selectedCareer(){return document.querySelector('input[name="career"]:checked').value}
function renderSkillChoices(){
  const skills = careerSkills[selectedCareer()];
  skillChoices.innerHTML = skills.map((s,i)=>`<label class="skill-chip"><input type="checkbox" value="${s}" id="skill-${i}"><span>${s}</span></label>`).join("");
}
document.querySelectorAll('input[name="career"]').forEach(r=>r.addEventListener("change",renderSkillChoices));
renderSkillChoices();

function toast(message){
  const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2600);
}
function scrollToBuilder(){document.getElementById("builder").scrollIntoView({behavior:"smooth"})}
["startTop","startHero","startBottom"].forEach(id=>document.getElementById(id).addEventListener("click",scrollToBuilder));

function getProject(career){
  if(career==="Data Scientist")return {title:"Student Performance Explorer",desc:"Use a small sample dataset to explore student marks, calculate averages, and create clear charts. Explain one useful finding.",checklist:["Choose or create a small sample dataset","Clean and summarise the data","Create two charts","Write three insights from the data"]};
  if(career==="AI/ML Engineer")return {title:"Student Result Predictor",desc:"Create a beginner-friendly model using sample study-hour data. Compare predictions with actual values and explain limitations.",checklist:["Find or create a small sample dataset","Prepare features and target","Train and evaluate a baseline model","Document results and limitations"]};
  return {title:"Responsive Portfolio Website",desc:"Create a clean personal website that introduces you, showcases two projects, and works on mobile and desktop.",checklist:["Create page sections in HTML","Style the layout with CSS","Add one interactive JavaScript feature","Test mobile layout and publish"]};
}
function renderResources(career){
  let chosen = career==="Web Developer" ? [resources[0],resources[4],resources[2]] : career==="AI/ML Engineer" ? [resources[3],resources[5],resources[2]] : [resources[3],resources[1],resources[0]];
  document.getElementById("resourceList").innerHTML=chosen.map(r=>`<article class="resource"><strong>${r.name}</strong><span>${r.desc}</span><a href="${r.url}" target="_blank" rel="noopener noreferrer">Open resource ↗</a></article>`).join("");
}
function renderRoadmap(career,known){
  const plan=careerPlans[career];
  document.getElementById("roadmapList").innerHTML=plan.map((w,i)=>{
    const missing=w.skills.filter(s=>!known.includes(s));
    const title=missing.length===0?"Review and strengthen: "+w.title:w.title;
    return `<article class="week-card"><div class="week-number">W${i+1}</div><div><h4>${title}</h4><p>${w.desc}</p><span class="deliverable">${w.deliverable}</span></div><input class="done-check" type="checkbox" aria-label="Mark week ${i+1} complete" data-week="${i+1}"></article>`;
  }).join("");
  document.querySelectorAll(".done-check").forEach(box=>box.addEventListener("change",()=>{
    saveWeeks();updateProgress();
  }));
  const saved=JSON.parse(localStorage.getItem("skillbridgeWeeks")||"[]");
  document.querySelectorAll(".done-check").forEach(box=>box.checked=saved.includes(Number(box.dataset.week)));
}
function saveWeeks(){
  const done=[...document.querySelectorAll(".done-check:checked")].map(x=>Number(x.dataset.week));
  localStorage.setItem("skillbridgeWeeks",JSON.stringify(done));
}
function updateProgress(){
  const done=[...document.querySelectorAll(".done-check:checked")].length;
  const percent=Math.round(done/4*100);
  document.getElementById("readiness").textContent=percent+"%";
  document.getElementById("readinessMeter").style.width=percent+"%";
}
form.addEventListener("submit",e=>{
  e.preventDefault();
  const career=selectedCareer();
  const known=[...skillChoices.querySelectorAll("input:checked")].map(x=>x.value);
  const skills=careerSkills[career];
  const gap=skills.filter(s=>!known.includes(s));
  const readiness=Math.round((known.length/skills.length)*100);
  const name=document.getElementById("studentName").value.trim();
  document.getElementById("resultTitle").textContent=(name?name+"'s":"Your")+" "+career+" roadmap";
  document.getElementById("resultSubtitle").textContent=`You marked ${known.length} of ${skills.length} skills as familiar. Start with the steps below and adjust as you learn.`;
  document.getElementById("readiness").textContent=readiness+"%";
  document.getElementById("readinessMeter").style.width=readiness+"%";
  document.getElementById("gapCount").textContent=gap.length;
  renderRoadmap(career,known);
  const project=getProject(career);
  document.getElementById("projectDescription").textContent=project.desc;
  document.getElementById("projectChecklist").innerHTML=project.checklist.map(x=>`<li>${x}</li>`).join("");
  currentProjectDone=localStorage.getItem("skillbridgeProjectDone")==="true";
  updateProjectButton();
  renderResources(career);
  const results=document.getElementById("results");
  results.classList.remove("hidden");
  results.scrollIntoView({behavior:"smooth",block:"start"});
  localStorage.setItem("skillbridgeCareer",career);
  localStorage.setItem("skillbridgeKnownSkills",JSON.stringify(known));
  localStorage.setItem("skillbridgeName",name);
});
function updateProjectButton(){
  const btn=document.getElementById("markProject");
  btn.textContent=currentProjectDone?"Project completed ✓":"Mark project complete ✓";
  btn.style.filter=currentProjectDone?"saturate(.65)":"none";
  document.getElementById("projectStatus").textContent=currentProjectDone?"Nice work! Your project completion is saved on this device.":"Progress is saved on this device.";
  document.querySelectorAll("#projectChecklist li").forEach(li=>li.classList.toggle("checked",currentProjectDone));
}
document.getElementById("markProject").addEventListener("click",()=>{
  currentProjectDone=!currentProjectDone;
  localStorage.setItem("skillbridgeProjectDone",String(currentProjectDone));
  updateProjectButton();
  toast(currentProjectDone?"Project marked complete. Keep building!":"Project marked as in progress.");
});
document.getElementById("resetPlan").addEventListener("click",()=>{
  document.getElementById("builder").scrollIntoView({behavior:"smooth"});
});
document.getElementById("roadmapList").addEventListener("change",updateProgress);
