(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[964],{3848:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin",function(){return c(4253)}])},4253:function(c,b,a){"use strict";a.r(b),a.d(b,{default:function(){return h}});var d=a(4246),e=a(8659),f=a(8816),g=a(5419);function h(){var b=(0,e.K)().library,a=(0,g.Ht)(b),c=a.addStudent,h=a.deleteStudent,i=a.addSubject,j=a.addAuthorizedProf,k=a.removeAuthorizedProf;return(0,d.jsx)("div",{className:"hero min-h-full bg-base-200",children:(0,d.jsx)("div",{className:"hero-content text-center",children:(0,d.jsxs)("div",{className:"max-w-4xl",children:[(0,d.jsx)("h1",{className:"text-5xl font-bold",children:"Admin"}),(0,d.jsxs)("p",{className:"py-6",children:["Piattaforma ",(0,d.jsx)("b",{children:"ufficialissima"})," del dipartimento di Informatica di Catania per la gestione degli esami universitari"]}),(0,d.jsx)("div",{className:"overflow-x-auto",children:(0,d.jsxs)("table",{className:"table w-full",children:[(0,d.jsx)("thead",{children:(0,d.jsx)("tr",{children:(0,d.jsx)("th",{children:"Funzioni disponibili"})})}),(0,d.jsxs)("tbody",{children:[(0,d.jsx)("tr",{children:(0,d.jsx)("td",{children:(0,d.jsx)(f.Gk,{title:"Aggiungi uno studente",description:"Assegna un indirizzo ad una determinata matricola",fields:[{label:"Indirizzo pubblico dello studente",name:"addr",type:"address"},{label:"Matricola",name:"studentId",type:"uint256"},],callback:c})})}),(0,d.jsx)("tr",{children:(0,d.jsx)("td",{children:(0,d.jsx)(f.Gk,{title:"Rimuovi uno studente",description:"Rimuovi la matricola associata ad un determinato indirizzo",fields:[{label:"Indirizzo pubblico dello studente",name:"addr",type:"address"},],callback:h})})}),(0,d.jsx)("tr",{children:(0,d.jsx)("td",{children:(0,d.jsx)(f.Gk,{title:"Aggiungi una materia",description:"Aggiungi una materia specificando il nuovo id, il nome, i CFU, il numero di propedeuticit\xe0 e la lista di materie che hanno la seguente materia necessaria",fields:[{label:"Id materia",name:"subjectId",type:"uint256"},{label:"Nome materia",name:"name",type:"string"},{label:"CFU",name:"cfu",type:"uint8"},{label:"Numero di propedeuticit\xe0",name:"requiredCount",type:"uint8"},{label:"Lista di materie che hanno questa come propedeutica",name:"subjectIdToUnlock",type:"array",subFields:[{label:"Id materia",name:"subjectId",type:"uint256"},]},],callback:i})})}),(0,d.jsx)("tr",{children:(0,d.jsx)("td",{children:(0,d.jsx)(f.Gk,{title:"Aggiungi autorizzazione ad un professore",description:"Aggiungi l'indirizzo pubblico di un professore ad una determinata materia",fields:[{label:"Id materia",name:"subjectId",type:"uint256"},{label:"Indirizzo pubblico del professore",name:"addr",type:"address"},],callback:j})})}),(0,d.jsx)("tr",{children:(0,d.jsx)("td",{children:(0,d.jsx)(f.Gk,{title:"Rimuovi autorizzazione ad un professore",description:"Rimuovi l'indirizzo pubblico di un professore da una determinata materia",fields:[{label:"Id materia",name:"subjectId",type:"uint256"},{label:"Indirizzo pubblico del professore",name:"addr",type:"address"},],callback:k})})})]})]})})]})})})}}},function(a){a.O(0,[774,888,179],function(){var b;return a(a.s=3848)}),_N_E=a.O()}])