(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[609],{9551:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/students",function(){return c(9706)}])},9706:function(c,b,a){"use strict";a.r(b),a.d(b,{default:function(){return n}});var d=a(5034),e=a(169),f=a(2050),g=a(3444),h=a(4246),i=a(8659),j=a(8816),k=a(5419);function l(a){var c=a.library,d=a.mark,e=a.subjectId,g=a.tests,b=(0,k.Yc)(c,parseInt(e)).value,i=(0,k._B)(c,parseInt(e)).value;return b?(0,h.jsx)("tr",{children:(0,h.jsx)("td",{children:(0,h.jsxs)("div",{className:"collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row",children:[(0,h.jsx)("input",{type:"checkbox",className:"peer"}),(0,h.jsxs)("div",{className:"collapse-title text-xl font-bold flex flex-row justify-between",children:[(0,h.jsx)("div",{children:b.name}),(0,h.jsxs)("div",{children:["CFU: ",b.cfu]}),d&&(0,h.jsx)("div",{children:d})]}),(0,h.jsx)("div",{className:"collapse-content",children:g&&(0,h.jsxs)("table",{className:"table table-zebra w-full",children:[(0,h.jsx)("thead",{children:(0,h.jsxs)("tr",{children:[(0,h.jsx)("th",{children:"Test"}),(0,h.jsx)("th",{children:"Risultato"}),(0,h.jsx)("th",{})]})}),(0,h.jsx)("tbody",{children:Object.entries(g).map(function(d){var b=(0,f.Z)(d,2),a=b[0],c=b[1];return(0,h.jsxs)("tr",{children:[(0,h.jsx)("td",{children:i?i[parseInt(a)].name:a}),(0,h.jsx)("td",{className:c.passed?"text-green-500":"text-red-500",children:c.mark}),(0,h.jsx)("td",{})]},"".concat(e,"-").concat(a))})})]})})]})})}):(0,h.jsx)(h.Fragment,{})}var m=a(7378);function n(){var c=(0,i.K)(),p=c.library,b=c.account,a=(0,k.Mt)(p,b),q=a.studentId,r=a.subjectAccepted,s=a.subjectPassed,t=a.subjectResetted,u=a.testFailed,v=a.testPassed,z=a.testAccepted,w=(0,m.useMemo)(function(){return function(){var a=arguments.length>0&& void 0!==arguments[0]?arguments[0]:[],b=arguments.length>1&& void 0!==arguments[1]?arguments[1]:[],c=arguments.length>2&& void 0!==arguments[2]?arguments[2]:[];return(0,g.Z)(a.map(function(a){return(0,e.Z)((0,d.Z)({},a),{passed:!1,canRefuse:!1})})).concat((0,g.Z)(b.map(function(a){return(0,e.Z)((0,d.Z)({},a),{passed:!0,canRefuse:!0})})),(0,g.Z)(c.map(function(a){return(0,e.Z)((0,d.Z)({},a),{passed:!0,canRefuse:!1})}))).sort(function(a,b){return a.blockNumber-b.blockNumber}).reduce(function(b,a){return void 0===b[a.data.subjectId]&&(b[a.data.subjectId]={}),b[a.data.subjectId][a.data.testIdx]={mark:a.data.mark,passed:a.passed,canRefuse:a.canRefuse},b},{})}(u,v,z)},[u,v]),n=(0,m.useMemo)(function(){return function(){var a=arguments.length>0&& void 0!==arguments[0]?arguments[0]:[],b=arguments.length>1&& void 0!==arguments[1]?arguments[1]:[],c=arguments.length>2&& void 0!==arguments[2]?arguments[2]:[];return{subPending:Object.entries((0,g.Z)(a.map(function(a){return(0,e.Z)((0,d.Z)({},a),{passed:!1})})).concat((0,g.Z)(b.map(function(a){return(0,e.Z)((0,d.Z)({},a),{passed:!0})})),(0,g.Z)(c.map(function(a){return(0,e.Z)((0,d.Z)({},a),{passed:!1})}))).sort(function(a,b){return a.blockNumber-b.blockNumber}).reduce(function(b,a){return b[a.data.subjectId]={mark:a.data.mark,passed:a.passed},b},{})).reduce(function(a,d){var b=(0,f.Z)(d,2),e=b[0],c=b[1];return c.passed&&(a[e]={mark:c.mark,passed:!0}),a},{}),subAccepted:a.reduce(function(a,b){return a[b.data.subjectId]={mark:b.data.mark,passed:!1},a},{})}}(r,s,t)},[r,s,t]),x=n.subPending,y=n.subAccepted,o=(0,m.useMemo)(function(){return Object.entries(w).reduce(function(b,j){var c,d,e,g,h=(0,f.Z)(j,2),a=h[0],i=h[1];return void 0!==y[a]?b.accepted[a]={mark:null===(c=y[a])|| void 0===c?void 0:c.mark,passed:null===(d=y[a])|| void 0===d?void 0:d.passed,tests:i}:b.pending[a]={mark:null===(e=y[a])|| void 0===e?void 0:e.mark,passed:null===(g=y[a])|| void 0===g?void 0:g.passed,tests:i},b},{pending:{},accepted:{}})},[w,x,y]);return(0,h.jsx)("div",{className:"hero min-h-full bg-base-200",children:(0,h.jsx)("div",{className:"hero-content text-center",children:(0,h.jsxs)("div",{className:"max-w-4xl",children:[(0,h.jsxs)("h1",{className:"text-5xl font-bold",children:["Studente ",q]}),(0,h.jsx)("p",{className:"text-xl",title:b,children:b}),(0,h.jsxs)("p",{className:"py-6",children:["Piattaforma ",(0,h.jsx)("b",{children:"ufficialissima"})," del dipartimento di Informatica di Catania per la gestione degli esami universitari"]}),(0,h.jsx)("div",{className:"overflow-x-auto",children:(0,h.jsxs)("table",{className:"table w-full",children:[(0,h.jsx)("thead",{children:(0,h.jsx)("tr",{children:(0,h.jsx)("th",{children:(0,h.jsx)("div",{className:"text-xl",children:"Materie in Pending"})})})}),(0,h.jsx)("tbody",{children:Object.entries(o.pending).map(function(d){var a=(0,f.Z)(d,2),b=a[0],c=a[1],e=c.tests,g=c.mark;return(0,h.jsx)(j.rM,{library:p,mark:g,subjectId:b,tests:e},b)})})]})}),(0,h.jsx)("div",{className:"overflow-x-auto",children:(0,h.jsxs)("table",{className:"table w-full",children:[(0,h.jsx)("thead",{children:(0,h.jsx)("tr",{children:(0,h.jsx)("th",{children:(0,h.jsx)("div",{className:"text-xl",children:"Materie superate"})})})}),(0,h.jsx)("tbody",{children:Object.entries(o.accepted).map(function(d){var a=(0,f.Z)(d,2),b=a[0],c=a[1],e=c.tests,g=c.mark;return(0,h.jsx)(l,{library:p,mark:g,subjectId:b,tests:e},b)})})]})})]})})})}}},function(a){a.O(0,[774,888,179],function(){var b;return a(a.s=9551)}),_N_E=a.O()}])