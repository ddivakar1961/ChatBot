import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getAuth,
onAuthStateChanged
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
query,
where,
onSnapshot,
updateDoc,
doc
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


const firebaseConfig={
apiKey:"YOUR_KEY",
authDomain:"YOUR_DOMAIN",
projectId:"YOUR_PROJECT",
storageBucket:"YOUR_BUCKET",
appId:"YOUR_APP"
};

const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);

const storage=getStorage(app);

let currentUser=null;
let currentChat=null;

onAuthStateChanged(auth,(user)=>{

if(user){
currentUser=user;
loadContacts();
}

});


function loadContacts(){

onSnapshot(collection(db,"users"),snap=>{

contacts.innerHTML="";

snap.forEach(docu=>{

let data=docu.data();

let div=document.createElement("div");

div.className="contact";

div.innerHTML=`
<img src="${data.photo}">
<div>
${data.name}<br>
<span class="online">${data.online?"online":"offline"}</span>
</div>
`;

div.onclick=()=>openChat(docu.id);

contacts.appendChild(div);

});

});

}


function openChat(uid){

currentChat=[currentUser.uid,uid].sort().join("_");

const q=query(
collection(db,"messages"),
where("chatId","==",currentChat)
);

onSnapshot(q,snap=>{

messages.innerHTML="";

snap.forEach(d=>{

let m=d.data();

let div=document.createElement("div");

div.className="message "+(m.sender==currentUser.uid?"me":"");

div.innerHTML=m.text || "";

if(m.image)
div.innerHTML+="<br><img width=120 src='"+m.image+"'>";

if(m.file)
div.innerHTML+="<br><a href='"+m.file+"'>File</a>";

if(m.sender==currentUser.uid)
div.innerHTML+=" "+(m.seen?"✓✓":"✓");

messages.appendChild(div);

});

});

}


window.send=async function(){

let text=msg.value;

let fileInput=file.files[0];

let imageUrl=null;

if(fileInput){

let r=ref(storage,"files/"+Date.now());

await uploadBytes(r,fileInput);

imageUrl=await getDownloadURL(r);

}

await addDoc(collection(db,"messages"),{

chatId:currentChat,
sender:currentUser.uid,
text:text,
image:imageUrl,
seen:false,
time:Date.now()

});

msg.value="";

}


window.toggleTheme=function(){

document.body.classList.toggle("light");

}
