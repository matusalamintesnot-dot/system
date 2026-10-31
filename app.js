const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const today = new Date().toISOString().slice(0,10);
const seed = {
 students:[
  {id:"DSM-1001",name:"Abel Tesfaye",grade:10,section:"A",gender:"Male",status:"active"},
  {id:"DSM-1002",name:"Hana Bekele",grade:10,section:"A",gender:"Female",status:"active"},
  {id:"DSM-1003",name:"Dawit Alemu",grade:10,section:"A",gender:"Male",status:"active"},
  {id:"DSM-1004",name:"Meron Girma",grade:10,section:"A",gender:"Female",status:"active"},
  {id:"DSM-1005",name:"Samuel Tadesse",grade:10,section:"A",gender:"Male",status:"active"},
  {id:"DSM-1006",name:"Rahel Worku",grade:9,section:"B",gender:"Female",status:"active"}
 ],
 applications:[
  {id:"APP-2026-001",name:"Mekdes Fikru",grade:9,section:"A",guardian:"Fikru Bekele",phone:"",date:today,status:"pending"},
  {id:"APP-2026-002",name:"Yonatan Kassa",grade:10,section:"B",guardian:"Kassa T.",phone:"",date:today,status:"pending"}
 ],
 classes:[
  {id:"C10A",name:"Grade 10 - Section A",grade:10,section:"A",teacher:"Mr. Daniel"},
  {id:"C10B",name:"Grade 10 - Section B",grade:10,section:"B",teacher:"Ms. Selam"},
  {id:"C9B",name:"Grade 9 - Section B",grade:9,section:"B",teacher:"Mr. Daniel"}
 ],
 attendance:{},
 announcements:[
  {title:"Welcome to the new school term",body:"Welcome students and teachers. Please check your school information and keep your profiles updated.",date:today},
  {title:"Daily attendance reminder",body:"Homeroom teachers should complete attendance every school day.",date:today}
 ]
};
let db;
try { db=JSON.parse(localStorage.getItem("edutrack_demo_db")) || structuredClone(seed); } catch { db=structuredClone(seed); }
let page="dashboard", role="guest", lang="en", filter="all";
const ACCESS_CODES={admin:"DSMS-ADMIN-2026",teacher:"DSMS-TEACHER-2026",student:"DSMS-STUDENT-2026"};
let signedInTeacher="";
const copy={
 en:{dashboard:"Dashboard",registration:"Student registration",attendance:"Daily attendance",students:"Students",classes:"Classes & teachers",reports:"Reports",assistant:"AI assistant",announcements:"Announcements",welcome:"Your school's attendance and information at a glance.",totalStudents:"Total students",presentToday:"Present today",pendingApps:"Pending applications",classesCount:"Homeroom classes",recent:"Recent activity",quick:"Quick actions",newRegistration:"New student application",takeAttendance:"Take attendance",viewReports:"View reports",name:"Student name",grade:"Grade",section:"Section",guardian:"Parent/guardian name",phone:"Guardian phone",submit:"Submit application",pending:"Pending",approved:"Approved",rejected:"Rejected",approve:"Approve",reject:"Reject",search:"Search students...",studentList:"Student directory",class:"Class",teacher:"Homeroom teacher",date:"School date",save:"Save attendance",present:"Present",absent:"Absent",late:"Late",excused:"Excused",status:"Status",all:"All",today:"Today",ask:"Ask a school question...",send:"Send",assistantIntro:"Hello! I can answer general questions about registration, attendance and school procedures. Try asking in English or Amharic.",post:"Publish announcement",title:"Announcement title",message:"Announcement message",empty:"Nothing to show yet.",selectClass:"Select homeroom",roleAdmin:"Administrator",roleTeacher:"Teacher",roleStudent:"Student",chooseRole:"View as",demo:"Demo mode",pendingOnly:"Pending applications",daily:"Daily attendance",rate:"Attendance rate",records:"Attendance records",notice:"Demo information only. Do not enter real student data."},
 am:{dashboard:"ዳሽቦርድ",registration:"የተማሪ ምዝገባ",attendance:"ዕለታዊ መገኘት",students:"ተማሪዎች",classes:"ክፍሎችና መምህራን",reports:"ሪፖርቶች",assistant:"AI ረዳት",announcements:"ማስታወቂያዎች",welcome:"የትምህርት ቤቱን መረጃና የመገኘት ሁኔታ ይመልከቱ።",totalStudents:"ጠቅላላ ተማሪዎች",presentToday:"ዛሬ የተገኙ",pendingApps:"በመጠባበቅ ላይ ያሉ ምዝገባዎች",classesCount:"የክፍል አስተዳደር",recent:"የቅርብ እንቅስቃሴ",quick:"ፈጣን አገናኞች",newRegistration:"አዲስ የተማሪ ማመልከቻ",takeAttendance:"መገኘት መመዝገብ",viewReports:"ሪፖርቶችን ይመልከቱ",name:"የተማሪ ስም",grade:"ክፍል",section:"ሴክሽን",guardian:"የወላጅ/አሳዳጊ ስም",phone:"የወላጅ ስልክ",submit:"ማመልከቻ ላክ",pending:"በመጠባበቅ ላይ",approved:"ተፈቅዷል",rejected:"ውድቅ ተደርጓል",approve:"ፍቀድ",reject:"ውድቅ አድርግ",search:"ተማሪ ፈልግ...",studentList:"የተማሪ ዝርዝር",class:"ክፍል",teacher:"የክፍል መምህር",date:"ቀን",save:"መገኘትን አስቀምጥ",present:"ተገኝቷል",absent:"አልተገኘም",late:"ዘግይቷል",excused:"በምክንያት ቀርቷል",status:"ሁኔታ",all:"ሁሉም",today:"ዛሬ",ask:"የትምህርት ቤት ጥያቄ ይጠይቁ...",send:"ላክ",assistantIntro:"ሰላም! ስለ ምዝገባ፣ መገኘትና የትምህርት ቤት ሂደቶች አጠቃላይ ጥያቄዎችን መልሳለሁ።",post:"ማስታወቂያ አትም",title:"የማስታወቂያ ርዕስ",message:"የማስታወቂያ መልዕክት",empty:"ምንም መረጃ የለም።",selectClass:"ክፍል ይምረጡ",roleAdmin:"አስተዳዳሪ",roleTeacher:"መምህር",roleStudent:"ተማሪ",chooseRole:"እንደ",demo:"የሙከራ ሁኔታ",pendingOnly:"በመጠባበቅ ላይ ያሉ ማመልከቻዎች",daily:"ዕለታዊ መገኘት",rate:"የመገኘት መጠን",records:"የመገኘት መዝገቦች",notice:"የሙከራ መረጃ ብቻ ነው። እውነተኛ የተማሪ መረጃ አያስገቡ።"}
};
const t=k=>copy[lang][k]||copy.en[k]||k;
const save=()=>localStorage.setItem("edutrack_demo_db",JSON.stringify(db));
const toast=msg=>{const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)};
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const todayLabel=()=>new Intl.DateTimeFormat(lang==="am"?"am-ET":"en-ET",{weekday:"short",year:"numeric",month:"short",day:"numeric"}).format(new Date());
const dayRecords=()=>db.attendance[today]||{};
const presentCount=()=>Object.values(dayRecords()).filter(x=>x==="present"||x==="late").length;
const selectedClass=()=>db.classes[0];
function setPage(p){page=p;render()}
function roleAllows(p){
 const rules={admin:["dashboard","registration","students","classes","reports","assistant","announcements"],teacher:["dashboard","attendance","students","reports","assistant","announcements"],student:["dashboard","registration","assistant","announcements"]};
 return (rules[role]||[]).includes(p);
}
function render(){
 if(role==="guest"){showLogin();return}
 $("#today").textContent=todayLabel();$("#year").textContent=new Date().getFullYear();
 const titles={dashboard:t("dashboard"),registration:t("registration"),attendance:t("attendance"),students:t("students"),classes:t("classes"),reports:t("reports"),assistant:t("assistant"),announcements:t("announcements")};
 $("#pageTitle").textContent=titles[page]||t("dashboard");$("#pageSubtitle").textContent=page==="dashboard"?t("welcome"):titles[page];
 $$("#nav .nav-item").forEach(b=>{b.classList.toggle("active",b.dataset.page===page);b.style.display=roleAllows(b.dataset.page)?"flex":"none"});
 $("#pendingBadge").textContent=db.applications.filter(a=>a.status==="pending").length;
 const who=role==="admin"?"Administrator":role==="teacher"?`Teacher · ${signedInTeacher||"Homeroom"}`:"Student";
 $("#sessionRole").textContent=who;$("#logoutBtn").hidden=false;
 $("#pageContent").innerHTML=({dashboard:dashboard,registration:registration,attendance:attendance,students:students,classes:classes,reports:reports,assistant:assistant,announcements:announcements}[page])();
}
function showLogin(){
 $("#logoutBtn").hidden=true;$("#sessionRole").textContent="Not signed in";
 $("#pageTitle").textContent="Secure demo access";$("#pageSubtitle").textContent="Choose your portal and enter its access code.";
 $("#pageContent").innerHTML=`<div class="login-wrap"><div class="card login-card"><div class="login-logo"><img src="assets/school-logo.jpg" alt="DATA SANA MEMORIAL SCHOOL"></div><div class="eyebrow">DATA SANA MEMORIAL SCHOOL</div><h2>Welcome to EduTrack AI</h2><p class="muted">Sign in to the correct school portal.</p><form id="loginForm"><div class="field"><label>Portal</label><select name="role" required><option value="admin">Administrator</option><option value="teacher">Teacher / Homeroom</option><option value="student">Student</option></select></div><div class="field"><label>Access code</label><input name="code" required autocomplete="off" placeholder="Enter your portal code"></div><button class="btn primary" type="submit">Enter portal</button><p class="small muted">Demo codes are shown in the assignment guide. These are demonstration codes, not secure real-world authentication.</p><div id="loginError" class="notice" hidden>That access code does not match the selected portal.</div></form></div></div>`;
}
function dashboard(){
 const total=db.students.length, pending=db.applications.filter(a=>a.status==="pending").length, present=presentCount();
 const roster=db.students.filter(s=>s.grade===10&&s.section==="A");
 const rate=roster.length?Math.round(present/roster.length*100):0;
 return `<div class="stats">
 <div class="card"><div class="stat-top">${t("totalStudents")} <span class="stat-icon">♙</span></div><div class="stat-num">${total}</div><div class="stat-foot">Active student profiles</div></div>
 <div class="card"><div class="stat-top">${t("presentToday")} <span class="stat-icon">✓</span></div><div class="stat-num">${present}</div><div class="stat-foot">Present or late today</div></div>
 <div class="card"><div class="stat-top">${t("pendingApps")} <span class="stat-icon">✚</span></div><div class="stat-num">${pending}</div><div class="stat-foot">Awaiting administrator review</div></div>
 <div class="card"><div class="stat-top">${t("classesCount")} <span class="stat-icon">▤</span></div><div class="stat-num">${db.classes.length}</div><div class="stat-foot">Configured demo classes</div></div></div>
 <div class="grid-two"><div class="card"><div class="card-head"><h2>${t("recent")}</h2><span class="badge">${t("demo")}</span></div>
 <div class="row"><div><b>${t("registration")}</b><div class="small muted">${pending} application(s) need review</div></div><button class="btn soft" data-go="registration">Open</button></div>
 ${role==="teacher"?`<div class="row"><div><b>${t("attendance")}</b><div class="small muted">Take attendance for your assigned homeroom</div></div><button class="btn soft" data-go="attendance">Open</button></div>`:""}
 <div class="row"><div><b>${t("announcements")}</b><div class="small muted">${db.announcements.length} published messages</div></div><button class="btn soft" data-go="announcements">Open</button></div></div>
 <div class="card"><h2>${t("quick")}</h2><div class="row"><span>${t("newRegistration")}</span><button class="btn" data-go="registration">Open</button></div>${role==="teacher"?`<div class="row"><span>${t("takeAttendance")}</span><button class="btn" data-go="attendance">Open</button></div>`:""}<div class="row"><span>${t("viewReports")}</span><button class="btn" data-go="reports">Open</button></div><p class="notice" style="margin-top:12px">${t("notice")}</p></div></div>`;
}
function registration(){
 const apps=db.applications.filter(a=>role==="admin"||a.status==="pending");
 return `${role!=="teacher"?`<div class="grid-two"><div class="card"><h2>${t("newRegistration")}</h2><form id="applicationForm"><div class="field"><label>${t("name")} *</label><input name="name" required maxlength="80"></div><div class="form-grid"><div class="field"><label>${t("grade")}</label><select name="grade"><option>9</option><option>10</option><option>11</option><option>12</option></select></div><div class="field"><label>${t("section")}</label><input name="section" value="A" required maxlength="4"></div></div><div class="field"><label>${t("guardian")}</label><input name="guardian"></div><div class="field"><label>${t("phone")}</label><input name="phone" type="tel"></div><button class="btn primary" type="submit">${t("submit")}</button></form></div><div class="card"><h2>Registration workflow</h2><p class="muted small">In this demo, a submitted application appears in the approval queue. Approving creates a student record and a demo student ID.</p><div class="row"><span>1. Student submits details</span><span class="badge">Application</span></div><div class="row"><span>2. Administrator reviews</span><span class="badge amber">Pending</span></div><div class="row"><span>3. Approved student added</span><span class="badge green">Enrolled</span></div></div></div>`:"<div class='card'><h2>Teacher access</h2><p class='muted'>Teachers do not submit student applications. Contact the school administrator for enrollment assistance.</p></div>"}
 <div class="card" style="margin-top:16px"><div class="card-head"><h2>${t("pendingOnly")}</h2><span class="badge">${apps.filter(a=>a.status==="pending").length} pending</span></div>${apps.length?`<div class="table-wrap"><table><thead><tr><th>Application</th><th>${t("name")}</th><th>${t("grade")}</th><th>${t("guardian")}</th><th>${t("status")}</th><th>Action</th></tr></thead><tbody>${apps.map(a=>`<tr><td>${safe(a.id)}</td><td>${safe(a.name)}</td><td>${a.grade} ${safe(a.section)}</td><td>${safe(a.guardian||"—")}</td><td><span class="badge ${a.status==="approved"?"green":a.status==="rejected"?"red":"amber"}">${t(a.status)}</span></td><td>${a.status==="pending"&&role==="admin"?`<button class="btn primary" data-approve="${a.id}">${t("approve")}</button> <button class="btn danger" data-reject="${a.id}">${t("reject")}</button>`:"—"}</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">${t("empty")}</div>`}</div>`;
}
function attendance(){
 if(role!=="teacher")return `<div class="card"><h2>Teacher portal only</h2><p>Only the assigned homeroom teacher can record student attendance.</p></div>`;
 const cls=db.classes.find(c=>(c.teacher||"").toLowerCase()===(signedInTeacher||"").toLowerCase())||db.classes[0], roster=db.students.filter(s=>s.grade===cls.grade&&s.section===cls.section);
 const existing=dayRecords();
 return `<div class="notice">Only the assigned homeroom teacher can submit attendance for this class. Demo data is stored locally on this device.</div><div class="card"><div class="card-head"><h2>${t("daily")} · ${safe(cls.name)}</h2><input id="attDate" type="date" value="${today}" style="border:1px solid var(--line);padding:8px;border-radius:8px"></div><div class="row"><span>${t("teacher")}: ${safe(cls.teacher)}</span><span class="badge">${roster.length} students</span></div><div class="table-wrap"><table><thead><tr><th>Student</th><th>${t("status")}</th></tr></thead><tbody>${roster.map(s=>`<tr><td><div class="person"><span class="avatar">${safe(s.name.split(" ").map(x=>x[0]).join("").slice(0,2))}</span>${safe(s.name)}</div></td><td><select class="att-status" data-student="${s.id}"><option value="present" ${(existing[s.id]||"present")==="present"?"selected":""}>${t("present")}</option><option value="absent" ${existing[s.id]==="absent"?"selected":""}>${t("absent")}</option><option value="late" ${existing[s.id]==="late"?"selected":""}>${t("late")}</option><option value="excused" ${existing[s.id]==="excused"?"selected":""}>${t("excused")}</option></select></td></tr>`).join("")}</tbody></table></div><div class="form-actions"><button class="btn primary" id="saveAttendance">${t("save")}</button></div></div>`;
}
function students(){
 const q=window.studentSearch||"";
 const list=db.students.filter(s=>(s.name+" "+s.id).toLowerCase().includes(q.toLowerCase()));
 return `<div class="card"><div class="card-head"><h2>${t("studentList")}</h2><input class="search" id="studentSearch" placeholder="${t("search")}" value="${safe(q)}" style="max-width:230px"></div><div class="table-wrap"><table><thead><tr><th>Student ID</th><th>${t("name")}</th><th>${t("class")}</th><th>Gender</th><th>${t("status")}</th></tr></thead><tbody>${list.map(s=>`<tr><td>${safe(s.id)}</td><td><div class="person"><span class="avatar">${safe(s.name.split(" ").map(x=>x[0]).join("").slice(0,2))}</span>${safe(s.name)}</div></td><td>Grade ${s.grade} - ${safe(s.section)}</td><td>${safe(s.gender||"—")}</td><td><span class="badge green">${safe(s.status)}</span></td></tr>`).join("")}</tbody></table></div>${list.length?"":`<div class="empty">${t("empty")}</div>`}</div>`;
}
function classes(){
 if(role!=="admin")return `<div class="card"><h2>Administrator only</h2><p>Only the administrator can create classes and assign homeroom teachers.</p></div>`;
 return `<div class="grid-two"><div class="card"><h2>Create a classroom</h2><form id="classForm"><div class="field"><label>Class name</label><input name="name" placeholder="Grade 11 - Section A" required></div><div class="form-grid"><div class="field"><label>Grade</label><select name="grade"><option>9</option><option>10</option><option>11</option><option>12</option></select></div><div class="field"><label>Section</label><input name="section" value="A" required></div></div><div class="field"><label>Assigned homeroom teacher</label><select name="teacher"><option>Mr. Daniel</option><option>Ms. Selam</option><option>Mr. Abel</option><option>Ms. Hana</option></select></div><button class="btn primary">Create class</button></form></div><div class="card"><h2>Classrooms & homeroom teachers</h2><p class="muted small">Only the assigned teacher can record attendance for their classroom.</p>${db.classes.map(c=>`<div class="row"><div><b>${safe(c.name)}</b><div class="small muted">${db.students.filter(s=>s.grade===c.grade&&s.section===c.section).length} students</div></div><span class="badge">${safe(c.teacher)}</span></div>`).join("")}</div></div>`;
}
function reports(){
 const rows=Object.entries(db.attendance).sort((a,b)=>b[0].localeCompare(a[0]));
 const all=rows.flatMap(([date,records])=>Object.entries(records).map(([id,status])=>({date,id,status})));
 const present=all.filter(r=>r.status==="present"||r.status==="late").length;
 const rate=all.length?Math.round(present/all.length*100):0;
 return `<div class="stats"><div class="card"><div class="label">${t("records")}</div><div class="stat-num">${all.length}</div></div><div class="card"><div class="label">${t("present")}</div><div class="stat-num">${present}</div></div><div class="card"><div class="label">${t("absent")}</div><div class="stat-num">${all.filter(r=>r.status==="absent").length}</div></div><div class="card"><div class="label">${t("rate")}</div><div class="stat-num">${rate}%</div></div></div><div class="card"><div class="card-head"><h2>Attendance history</h2><button class="btn" id="exportCsv">Export CSV</button></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>${t("date")}</th><th>Student ID</th><th>${t("status")}</th></tr></thead><tbody>${all.map(r=>`<tr><td>${r.date}</td><td>${safe(r.id)}</td><td><span class="badge ${r.status==="present"?"green":r.status==="absent"?"red":"amber"}">${t(r.status)}</span></td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">No attendance has been submitted yet.</div>`}</div>`;
}
function assistant(){
 return `<div class="grid-two"><div class="card"><h2>${t("assistant")}</h2><div class="assistant-box" id="chat"><div class="bubble bot">${t("assistantIntro")}</div></div><div class="quick-asks"><button data-ask="How do students register?">How do students register?</button><button data-ask="When is attendance taken?">When is attendance taken?</button><button data-ask="What is the school motto?">School motto?</button></div><form class="assistant-input" id="chatForm"><input id="chatInput" placeholder="${t("ask")}" autocomplete="off"><button class="btn primary">${t("send")}</button></form></div><div class="card"><h2>Assistant capabilities</h2><div class="row"><span>English questions</span><span class="badge green">Demo FAQ</span></div><div class="row"><span>አማርኛ ጥያቄዎች</span><span class="badge green">Basic FAQ</span></div><div class="row"><span>Live student records</span><span class="badge amber">Not connected</span></div><div class="row"><span>External AI model</span><span class="badge amber">Not connected</span></div><p class="notice">This assistant uses a small set of predefined answers. A production AI assistant must use a server-side model and retrieve only data the signed-in user is permitted to see.</p></div></div>`;
}
function announcements(){
 return `${role==="admin"?`<div class="card"><h2>Create announcement</h2><form id="announcementForm"><div class="field"><label>${t("title")}</label><input name="title" required></div><div class="field"><label>${t("message")}</label><textarea name="body" rows="3" required></textarea></div><button class="btn primary">${t("post")}</button></form></div>`:""}<div class="card" style="margin-top:15px"><h2>${t("announcements")}</h2>${db.announcements.map(a=>`<div class="row"><div><b>${safe(a.title)}</b><p class="muted small">${safe(a.body)}</p><span class="small muted">${a.date}</span></div></div>`).join("")}</div>`;
}
function faq(q){
 const x=q.toLowerCase();
 if(/register|registration|ምዝገባ|መመዝገብ/.test(x))return "Students submit a registration application with their name, grade and parent/guardian details. The school administrator reviews it. Once approved, the student is added to the school directory and assigned a student ID.";
 if(/attendance|present|absent|መገኘት|ተገኝ|አልተገኘ/.test(x))return "Daily attendance is taken by the assigned homeroom teacher. Students can be marked Present, Absent, Late or Excused. Students should contact their homeroom teacher or school office if a record needs correction.";
 if(/homeroom|teacher|መምህር|ክፍል/.test(x))return "Each class has an assigned homeroom teacher. In the live system, teachers will only be able to submit attendance for their assigned class.";
 if(/motto|seek|serve|know|መርህ/.test(x))return "The DATA SANA MEMORIAL SCHOOL motto is: To seek... To serve... To know...";
 if(/language|amharic|አማርኛ/.test(x))return "EduTrack AI is designed to support English and Amharic. ኢዱትራክ AI በእንግሊዝኛና በአማርኛ እንዲሰራ ተዘጋጅቷል።";
 if(/school|name|ትምህርት ቤት|ስም/.test(x))return "The school name is DATA SANA MEMORIAL SCHOOL.";
 return "I can help with general questions about student registration, daily attendance, homeroom teachers, the school motto and language support. For personal student records, please use the appropriate secure school portal.";
}
function sendQuestion(q){
 if(!q.trim())return;const chat=$("#chat");chat.insertAdjacentHTML("beforeend",`<div class="bubble user">${safe(q)}</div><div class="bubble bot">${safe(faq(q))}</div>`);$("#chatInput").value="";chat.scrollTop=chat.scrollHeight;
}
$("#nav").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b&&roleAllows(b.dataset.page))setPage(b.dataset.page)});
$("#pageContent").addEventListener("click",e=>{
 const go=e.target.closest("[data-go]");if(go){setPage(go.dataset.go);return}
 const ap=e.target.closest("[data-approve]");if(ap){const a=db.applications.find(x=>x.id===ap.dataset.approve);if(a&&a.status==="pending"){a.status="approved";db.students.push({id:"DSM-"+(1001+db.students.length),name:a.name,grade:Number(a.grade),section:a.section,gender:"—",status:"active"});save();toast("Application approved and student added.");render()}return}
 const rj=e.target.closest("[data-reject]");if(rj){const a=db.applications.find(x=>x.id===rj.dataset.reject);if(a)a.status="rejected";save();toast("Application rejected.");render();return}
 const ask=e.target.closest("[data-ask]");if(ask)sendQuestion(ask.dataset.ask);
});
$("#pageContent").addEventListener("submit",e=>{
 e.preventDefault();
 if(e.target.id==="loginForm"){const f=new FormData(e.target),r=f.get("role"),code=String(f.get("code")||"").trim().toUpperCase();if(code!==ACCESS_CODES[r]){$("#loginError").hidden=false;return}role=r;signedInTeacher=r==="teacher"?"Mr. Daniel":"";page="dashboard";render();toast("Signed in to the "+r+" portal.");return}
 if(e.target.id==="classForm"){if(role!=="admin")return;const f=new FormData(e.target);db.classes.push({id:"C"+Date.now(),name:f.get("name"),grade:Number(f.get("grade")),section:f.get("section"),teacher:f.get("teacher")});save();toast("Classroom created and homeroom teacher assigned.");render();return}
 if(e.target.id==="applicationForm"){const f=new FormData(e.target);const id="APP-"+new Date().getFullYear()+"-"+String(db.applications.length+1).padStart(3,"0");db.applications.unshift({id,name:f.get("name"),grade:Number(f.get("grade")),section:f.get("section"),guardian:f.get("guardian"),phone:f.get("phone"),date:today,status:"pending"});save();toast("Application submitted for administrator approval.");render()}
 if(e.target.id==="chatForm")sendQuestion($("#chatInput").value);
 if(e.target.id==="announcementForm"){const f=new FormData(e.target);db.announcements.unshift({title:f.get("title"),body:f.get("body"),date:today});save();toast("Announcement published.");render()}
});
$("#pageContent").addEventListener("input",e=>{if(e.target.id==="studentSearch"){window.studentSearch=e.target.value;const pos=e.target.selectionStart;render();const n=$("#studentSearch");n.focus();n.setSelectionRange(pos,pos)}});
$("#pageContent").addEventListener("click",e=>{
 if(e.target.id==="saveAttendance"){if(role!=="teacher"){toast("Only homeroom teachers can submit attendance.");return}const date=$("#attDate").value;if(!date){toast("Select a date first.");return}db.attendance[date]={};$$(".att-status").forEach(s=>db.attendance[date][s.dataset.student]=s.value);save();toast("Attendance saved on this device.");render()}
 if(e.target.id==="exportCsv"){const rows=[["Date","Student ID","Student Name","Status"]];for(const [date,records] of Object.entries(db.attendance))for(const [id,status] of Object.entries(records)){const s=db.students.find(x=>x.id===id);rows.push([date,id,s?.name||"",status])}const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="edutrack-attendance.csv";a.click();URL.revokeObjectURL(a.href)}
});
$("#logoutBtn").addEventListener("click",()=>{role="guest";signedInTeacher="";page="dashboard";render()});
$("#language").addEventListener("change",e=>{lang=e.target.value;document.documentElement.lang=lang;render()});
render();
if("serviceWorker" in navigator && location.protocol!=="file:")navigator.serviceWorker.register("./sw.js").catch(()=>{});
let installPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").hidden=false});
$("#installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").hidden=true});
