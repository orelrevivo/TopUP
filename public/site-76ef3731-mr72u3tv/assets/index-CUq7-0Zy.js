(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerPolicy&&(i.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?i.credentials="include":l.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(l){if(l.ep)return;l.ep=!0;const i=n(l);fetch(l.href,i)}})();function rc(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ha={exports:{}},el={},Qa={exports:{}},L={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xn=Symbol.for("react.element"),lc=Symbol.for("react.portal"),ic=Symbol.for("react.fragment"),oc=Symbol.for("react.strict_mode"),ac=Symbol.for("react.profiler"),sc=Symbol.for("react.provider"),uc=Symbol.for("react.context"),cc=Symbol.for("react.forward_ref"),fc=Symbol.for("react.suspense"),dc=Symbol.for("react.memo"),pc=Symbol.for("react.lazy"),Oo=Symbol.iterator;function mc(e){return e===null||typeof e!="object"?null:(e=Oo&&e[Oo]||e["@@iterator"],typeof e=="function"?e:null)}var Ya={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ka=Object.assign,Xa={};function ln(e,t,n){this.props=e,this.context=t,this.refs=Xa,this.updater=n||Ya}ln.prototype.isReactComponent={};ln.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};ln.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ga(){}Ga.prototype=ln.prototype;function $i(e,t,n){this.props=e,this.context=t,this.refs=Xa,this.updater=n||Ya}var Ai=$i.prototype=new Ga;Ai.constructor=$i;Ka(Ai,ln.prototype);Ai.isPureReactComponent=!0;var Io=Array.isArray,Za=Object.prototype.hasOwnProperty,Bi={current:null},Ja={key:!0,ref:!0,__self:!0,__source:!0};function qa(e,t,n){var r,l={},i=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)Za.call(t,r)&&!Ja.hasOwnProperty(r)&&(l[r]=t[r]);var a=arguments.length-2;if(a===1)l.children=n;else if(1<a){for(var s=Array(a),f=0;f<a;f++)s[f]=arguments[f+2];l.children=s}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)l[r]===void 0&&(l[r]=a[r]);return{$$typeof:Xn,type:e,key:i,ref:o,props:l,_owner:Bi.current}}function hc(e,t){return{$$typeof:Xn,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Wi(e){return typeof e=="object"&&e!==null&&e.$$typeof===Xn}function gc(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Fo=/\/+/g;function xl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?gc(""+e.key):t.toString(36)}function yr(e,t,n,r,l){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Xn:case lc:o=!0}}if(o)return o=e,l=l(o),e=r===""?"."+xl(o,0):r,Io(l)?(n="",e!=null&&(n=e.replace(Fo,"$&/")+"/"),yr(l,t,n,"",function(f){return f})):l!=null&&(Wi(l)&&(l=hc(l,n+(!l.key||o&&o.key===l.key?"":(""+l.key).replace(Fo,"$&/")+"/")+e)),t.push(l)),1;if(o=0,r=r===""?".":r+":",Io(e))for(var a=0;a<e.length;a++){i=e[a];var s=r+xl(i,a);o+=yr(i,t,n,s,l)}else if(s=mc(e),typeof s=="function")for(e=s.call(e),a=0;!(i=e.next()).done;)i=i.value,s=r+xl(i,a++),o+=yr(i,t,n,s,l);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function tr(e,t,n){if(e==null)return e;var r=[],l=0;return yr(e,r,"","",function(i){return t.call(n,i,l++)}),r}function vc(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var se={current:null},xr={transition:null},yc={ReactCurrentDispatcher:se,ReactCurrentBatchConfig:xr,ReactCurrentOwner:Bi};function ba(){throw Error("act(...) is not supported in production builds of React.")}L.Children={map:tr,forEach:function(e,t,n){tr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return tr(e,function(){t++}),t},toArray:function(e){return tr(e,function(t){return t})||[]},only:function(e){if(!Wi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};L.Component=ln;L.Fragment=ic;L.Profiler=ac;L.PureComponent=$i;L.StrictMode=oc;L.Suspense=fc;L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yc;L.act=ba;L.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Ka({},e.props),l=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Bi.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(s in t)Za.call(t,s)&&!Ja.hasOwnProperty(s)&&(r[s]=t[s]===void 0&&a!==void 0?a[s]:t[s])}var s=arguments.length-2;if(s===1)r.children=n;else if(1<s){a=Array(s);for(var f=0;f<s;f++)a[f]=arguments[f+2];r.children=a}return{$$typeof:Xn,type:e.type,key:l,ref:i,props:r,_owner:o}};L.createContext=function(e){return e={$$typeof:uc,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:sc,_context:e},e.Consumer=e};L.createElement=qa;L.createFactory=function(e){var t=qa.bind(null,e);return t.type=e,t};L.createRef=function(){return{current:null}};L.forwardRef=function(e){return{$$typeof:cc,render:e}};L.isValidElement=Wi;L.lazy=function(e){return{$$typeof:pc,_payload:{_status:-1,_result:e},_init:vc}};L.memo=function(e,t){return{$$typeof:dc,type:e,compare:t===void 0?null:t}};L.startTransition=function(e){var t=xr.transition;xr.transition={};try{e()}finally{xr.transition=t}};L.unstable_act=ba;L.useCallback=function(e,t){return se.current.useCallback(e,t)};L.useContext=function(e){return se.current.useContext(e)};L.useDebugValue=function(){};L.useDeferredValue=function(e){return se.current.useDeferredValue(e)};L.useEffect=function(e,t){return se.current.useEffect(e,t)};L.useId=function(){return se.current.useId()};L.useImperativeHandle=function(e,t,n){return se.current.useImperativeHandle(e,t,n)};L.useInsertionEffect=function(e,t){return se.current.useInsertionEffect(e,t)};L.useLayoutEffect=function(e,t){return se.current.useLayoutEffect(e,t)};L.useMemo=function(e,t){return se.current.useMemo(e,t)};L.useReducer=function(e,t,n){return se.current.useReducer(e,t,n)};L.useRef=function(e){return se.current.useRef(e)};L.useState=function(e){return se.current.useState(e)};L.useSyncExternalStore=function(e,t,n){return se.current.useSyncExternalStore(e,t,n)};L.useTransition=function(){return se.current.useTransition()};L.version="18.3.1";Qa.exports=L;var Y=Qa.exports;const xc=rc(Y);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wc=Y,kc=Symbol.for("react.element"),Sc=Symbol.for("react.fragment"),Nc=Object.prototype.hasOwnProperty,Ec=wc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Cc={key:!0,ref:!0,__self:!0,__source:!0};function es(e,t,n){var r,l={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)Nc.call(t,r)&&!Cc.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:kc,type:e,key:i,ref:o,props:l,_owner:Ec.current}}el.Fragment=Sc;el.jsx=es;el.jsxs=es;Ha.exports=el;var c=Ha.exports,Yl={},ts={exports:{}},xe={},ns={exports:{}},rs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(E,z){var P=E.length;E.push(z);e:for(;0<P;){var H=P-1>>>1,Z=E[H];if(0<l(Z,z))E[H]=z,E[P]=Z,P=H;else break e}}function n(E){return E.length===0?null:E[0]}function r(E){if(E.length===0)return null;var z=E[0],P=E.pop();if(P!==z){E[0]=P;e:for(var H=0,Z=E.length,bn=Z>>>1;H<bn;){var gt=2*(H+1)-1,yl=E[gt],vt=gt+1,er=E[vt];if(0>l(yl,P))vt<Z&&0>l(er,yl)?(E[H]=er,E[vt]=P,H=vt):(E[H]=yl,E[gt]=P,H=gt);else if(vt<Z&&0>l(er,P))E[H]=er,E[vt]=P,H=vt;else break e}}return z}function l(E,z){var P=E.sortIndex-z.sortIndex;return P!==0?P:E.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;e.unstable_now=function(){return i.now()}}else{var o=Date,a=o.now();e.unstable_now=function(){return o.now()-a}}var s=[],f=[],g=1,h=null,m=3,x=!1,w=!1,k=!1,F=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function p(E){for(var z=n(f);z!==null;){if(z.callback===null)r(f);else if(z.startTime<=E)r(f),z.sortIndex=z.expirationTime,t(s,z);else break;z=n(f)}}function v(E){if(k=!1,p(E),!w)if(n(s)!==null)w=!0,gl(N);else{var z=n(f);z!==null&&vl(v,z.startTime-E)}}function N(E,z){w=!1,k&&(k=!1,d(_),_=-1),x=!0;var P=m;try{for(p(z),h=n(s);h!==null&&(!(h.expirationTime>z)||E&&!_e());){var H=h.callback;if(typeof H=="function"){h.callback=null,m=h.priorityLevel;var Z=H(h.expirationTime<=z);z=e.unstable_now(),typeof Z=="function"?h.callback=Z:h===n(s)&&r(s),p(z)}else r(s);h=n(s)}if(h!==null)var bn=!0;else{var gt=n(f);gt!==null&&vl(v,gt.startTime-z),bn=!1}return bn}finally{h=null,m=P,x=!1}}var C=!1,j=null,_=-1,V=5,T=-1;function _e(){return!(e.unstable_now()-T<V)}function sn(){if(j!==null){var E=e.unstable_now();T=E;var z=!0;try{z=j(!0,E)}finally{z?un():(C=!1,j=null)}}else C=!1}var un;if(typeof u=="function")un=function(){u(sn)};else if(typeof MessageChannel<"u"){var Do=new MessageChannel,nc=Do.port2;Do.port1.onmessage=sn,un=function(){nc.postMessage(null)}}else un=function(){F(sn,0)};function gl(E){j=E,C||(C=!0,un())}function vl(E,z){_=F(function(){E(e.unstable_now())},z)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(E){E.callback=null},e.unstable_continueExecution=function(){w||x||(w=!0,gl(N))},e.unstable_forceFrameRate=function(E){0>E||125<E?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):V=0<E?Math.floor(1e3/E):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return n(s)},e.unstable_next=function(E){switch(m){case 1:case 2:case 3:var z=3;break;default:z=m}var P=m;m=z;try{return E()}finally{m=P}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(E,z){switch(E){case 1:case 2:case 3:case 4:case 5:break;default:E=3}var P=m;m=E;try{return z()}finally{m=P}},e.unstable_scheduleCallback=function(E,z,P){var H=e.unstable_now();switch(typeof P=="object"&&P!==null?(P=P.delay,P=typeof P=="number"&&0<P?H+P:H):P=H,E){case 1:var Z=-1;break;case 2:Z=250;break;case 5:Z=1073741823;break;case 4:Z=1e4;break;default:Z=5e3}return Z=P+Z,E={id:g++,callback:z,priorityLevel:E,startTime:P,expirationTime:Z,sortIndex:-1},P>H?(E.sortIndex=P,t(f,E),n(s)===null&&E===n(f)&&(k?(d(_),_=-1):k=!0,vl(v,P-H))):(E.sortIndex=Z,t(s,E),w||x||(w=!0,gl(N))),E},e.unstable_shouldYield=_e,e.unstable_wrapCallback=function(E){var z=m;return function(){var P=m;m=z;try{return E.apply(this,arguments)}finally{m=P}}}})(rs);ns.exports=rs;var jc=ns.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _c=Y,ye=jc;function y(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var ls=new Set,Tn={};function Lt(e,t){Jt(e,t),Jt(e+"Capture",t)}function Jt(e,t){for(Tn[e]=t,e=0;e<t.length;e++)ls.add(t[e])}var Qe=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Kl=Object.prototype.hasOwnProperty,zc=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Uo={},$o={};function Pc(e){return Kl.call($o,e)?!0:Kl.call(Uo,e)?!1:zc.test(e)?$o[e]=!0:(Uo[e]=!0,!1)}function Lc(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Tc(e,t,n,r){if(t===null||typeof t>"u"||Lc(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ue(e,t,n,r,l,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var te={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){te[e]=new ue(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];te[t]=new ue(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){te[e]=new ue(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){te[e]=new ue(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){te[e]=new ue(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){te[e]=new ue(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){te[e]=new ue(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){te[e]=new ue(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){te[e]=new ue(e,5,!1,e.toLowerCase(),null,!1,!1)});var Vi=/[\-:]([a-z])/g;function Hi(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Vi,Hi);te[t]=new ue(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Vi,Hi);te[t]=new ue(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Vi,Hi);te[t]=new ue(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){te[e]=new ue(e,1,!1,e.toLowerCase(),null,!1,!1)});te.xlinkHref=new ue("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){te[e]=new ue(e,1,!1,e.toLowerCase(),null,!0,!0)});function Qi(e,t,n,r){var l=te.hasOwnProperty(t)?te[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Tc(t,n,l,r)&&(n=null),r||l===null?Pc(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var Ge=_c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,nr=Symbol.for("react.element"),Mt=Symbol.for("react.portal"),Dt=Symbol.for("react.fragment"),Yi=Symbol.for("react.strict_mode"),Xl=Symbol.for("react.profiler"),is=Symbol.for("react.provider"),os=Symbol.for("react.context"),Ki=Symbol.for("react.forward_ref"),Gl=Symbol.for("react.suspense"),Zl=Symbol.for("react.suspense_list"),Xi=Symbol.for("react.memo"),Je=Symbol.for("react.lazy"),as=Symbol.for("react.offscreen"),Ao=Symbol.iterator;function cn(e){return e===null||typeof e!="object"?null:(e=Ao&&e[Ao]||e["@@iterator"],typeof e=="function"?e:null)}var B=Object.assign,wl;function yn(e){if(wl===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);wl=t&&t[1]||""}return`
`+wl+e}var kl=!1;function Sl(e,t){if(!e||kl)return"";kl=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(f){var r=f}Reflect.construct(e,[],t)}else{try{t.call()}catch(f){r=f}e.call(t.prototype)}else{try{throw Error()}catch(f){r=f}e()}}catch(f){if(f&&r&&typeof f.stack=="string"){for(var l=f.stack.split(`
`),i=r.stack.split(`
`),o=l.length-1,a=i.length-1;1<=o&&0<=a&&l[o]!==i[a];)a--;for(;1<=o&&0<=a;o--,a--)if(l[o]!==i[a]){if(o!==1||a!==1)do if(o--,a--,0>a||l[o]!==i[a]){var s=`
`+l[o].replace(" at new "," at ");return e.displayName&&s.includes("<anonymous>")&&(s=s.replace("<anonymous>",e.displayName)),s}while(1<=o&&0<=a);break}}}finally{kl=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?yn(e):""}function Rc(e){switch(e.tag){case 5:return yn(e.type);case 16:return yn("Lazy");case 13:return yn("Suspense");case 19:return yn("SuspenseList");case 0:case 2:case 15:return e=Sl(e.type,!1),e;case 11:return e=Sl(e.type.render,!1),e;case 1:return e=Sl(e.type,!0),e;default:return""}}function Jl(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Dt:return"Fragment";case Mt:return"Portal";case Xl:return"Profiler";case Yi:return"StrictMode";case Gl:return"Suspense";case Zl:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case os:return(e.displayName||"Context")+".Consumer";case is:return(e._context.displayName||"Context")+".Provider";case Ki:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Xi:return t=e.displayName||null,t!==null?t:Jl(e.type)||"Memo";case Je:t=e._payload,e=e._init;try{return Jl(e(t))}catch{}}return null}function Mc(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Jl(t);case 8:return t===Yi?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function ft(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ss(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Dc(e){var t=ss(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function rr(e){e._valueTracker||(e._valueTracker=Dc(e))}function us(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ss(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Lr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ql(e,t){var n=t.checked;return B({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Bo(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=ft(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function cs(e,t){t=t.checked,t!=null&&Qi(e,"checked",t,!1)}function bl(e,t){cs(e,t);var n=ft(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?ei(e,t.type,n):t.hasOwnProperty("defaultValue")&&ei(e,t.type,ft(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Wo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function ei(e,t,n){(t!=="number"||Lr(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var xn=Array.isArray;function Qt(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+ft(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function ti(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(y(91));return B({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Vo(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(y(92));if(xn(n)){if(1<n.length)throw Error(y(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:ft(n)}}function fs(e,t){var n=ft(t.value),r=ft(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Ho(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function ds(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ni(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?ds(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var lr,ps=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(lr=lr||document.createElement("div"),lr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=lr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Rn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Sn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Oc=["Webkit","ms","Moz","O"];Object.keys(Sn).forEach(function(e){Oc.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Sn[t]=Sn[e]})});function ms(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Sn.hasOwnProperty(e)&&Sn[e]?(""+t).trim():t+"px"}function hs(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=ms(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Ic=B({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ri(e,t){if(t){if(Ic[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(y(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(y(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(y(61))}if(t.style!=null&&typeof t.style!="object")throw Error(y(62))}}function li(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ii=null;function Gi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var oi=null,Yt=null,Kt=null;function Qo(e){if(e=Jn(e)){if(typeof oi!="function")throw Error(y(280));var t=e.stateNode;t&&(t=il(t),oi(e.stateNode,e.type,t))}}function gs(e){Yt?Kt?Kt.push(e):Kt=[e]:Yt=e}function vs(){if(Yt){var e=Yt,t=Kt;if(Kt=Yt=null,Qo(e),t)for(e=0;e<t.length;e++)Qo(t[e])}}function ys(e,t){return e(t)}function xs(){}var Nl=!1;function ws(e,t,n){if(Nl)return e(t,n);Nl=!0;try{return ys(e,t,n)}finally{Nl=!1,(Yt!==null||Kt!==null)&&(xs(),vs())}}function Mn(e,t){var n=e.stateNode;if(n===null)return null;var r=il(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(y(231,t,typeof n));return n}var ai=!1;if(Qe)try{var fn={};Object.defineProperty(fn,"passive",{get:function(){ai=!0}}),window.addEventListener("test",fn,fn),window.removeEventListener("test",fn,fn)}catch{ai=!1}function Fc(e,t,n,r,l,i,o,a,s){var f=Array.prototype.slice.call(arguments,3);try{t.apply(n,f)}catch(g){this.onError(g)}}var Nn=!1,Tr=null,Rr=!1,si=null,Uc={onError:function(e){Nn=!0,Tr=e}};function $c(e,t,n,r,l,i,o,a,s){Nn=!1,Tr=null,Fc.apply(Uc,arguments)}function Ac(e,t,n,r,l,i,o,a,s){if($c.apply(this,arguments),Nn){if(Nn){var f=Tr;Nn=!1,Tr=null}else throw Error(y(198));Rr||(Rr=!0,si=f)}}function Tt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ks(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Yo(e){if(Tt(e)!==e)throw Error(y(188))}function Bc(e){var t=e.alternate;if(!t){if(t=Tt(e),t===null)throw Error(y(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return Yo(l),e;if(i===r)return Yo(l),t;i=i.sibling}throw Error(y(188))}if(n.return!==r.return)n=l,r=i;else{for(var o=!1,a=l.child;a;){if(a===n){o=!0,n=l,r=i;break}if(a===r){o=!0,r=l,n=i;break}a=a.sibling}if(!o){for(a=i.child;a;){if(a===n){o=!0,n=i,r=l;break}if(a===r){o=!0,r=i,n=l;break}a=a.sibling}if(!o)throw Error(y(189))}}if(n.alternate!==r)throw Error(y(190))}if(n.tag!==3)throw Error(y(188));return n.stateNode.current===n?e:t}function Ss(e){return e=Bc(e),e!==null?Ns(e):null}function Ns(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ns(e);if(t!==null)return t;e=e.sibling}return null}var Es=ye.unstable_scheduleCallback,Ko=ye.unstable_cancelCallback,Wc=ye.unstable_shouldYield,Vc=ye.unstable_requestPaint,Q=ye.unstable_now,Hc=ye.unstable_getCurrentPriorityLevel,Zi=ye.unstable_ImmediatePriority,Cs=ye.unstable_UserBlockingPriority,Mr=ye.unstable_NormalPriority,Qc=ye.unstable_LowPriority,js=ye.unstable_IdlePriority,tl=null,Ue=null;function Yc(e){if(Ue&&typeof Ue.onCommitFiberRoot=="function")try{Ue.onCommitFiberRoot(tl,e,void 0,(e.current.flags&128)===128)}catch{}}var Re=Math.clz32?Math.clz32:Gc,Kc=Math.log,Xc=Math.LN2;function Gc(e){return e>>>=0,e===0?32:31-(Kc(e)/Xc|0)|0}var ir=64,or=4194304;function wn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Dr(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var a=o&~l;a!==0?r=wn(a):(i&=o,i!==0&&(r=wn(i)))}else o=n&~l,o!==0?r=wn(o):i!==0&&(r=wn(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Re(t),l=1<<n,r|=e[n],t&=~l;return r}function Zc(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Jc(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-Re(i),a=1<<o,s=l[o];s===-1?(!(a&n)||a&r)&&(l[o]=Zc(a,t)):s<=t&&(e.expiredLanes|=a),i&=~a}}function ui(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function _s(){var e=ir;return ir<<=1,!(ir&4194240)&&(ir=64),e}function El(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Gn(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Re(t),e[t]=n}function qc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-Re(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function Ji(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Re(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var M=0;function zs(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Ps,qi,Ls,Ts,Rs,ci=!1,ar=[],rt=null,lt=null,it=null,Dn=new Map,On=new Map,be=[],bc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Xo(e,t){switch(e){case"focusin":case"focusout":rt=null;break;case"dragenter":case"dragleave":lt=null;break;case"mouseover":case"mouseout":it=null;break;case"pointerover":case"pointerout":Dn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":On.delete(t.pointerId)}}function dn(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=Jn(t),t!==null&&qi(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function ef(e,t,n,r,l){switch(t){case"focusin":return rt=dn(rt,e,t,n,r,l),!0;case"dragenter":return lt=dn(lt,e,t,n,r,l),!0;case"mouseover":return it=dn(it,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return Dn.set(i,dn(Dn.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,On.set(i,dn(On.get(i)||null,e,t,n,r,l)),!0}return!1}function Ms(e){var t=wt(e.target);if(t!==null){var n=Tt(t);if(n!==null){if(t=n.tag,t===13){if(t=ks(n),t!==null){e.blockedOn=t,Rs(e.priority,function(){Ls(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function wr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=fi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ii=r,n.target.dispatchEvent(r),ii=null}else return t=Jn(n),t!==null&&qi(t),e.blockedOn=n,!1;t.shift()}return!0}function Go(e,t,n){wr(e)&&n.delete(t)}function tf(){ci=!1,rt!==null&&wr(rt)&&(rt=null),lt!==null&&wr(lt)&&(lt=null),it!==null&&wr(it)&&(it=null),Dn.forEach(Go),On.forEach(Go)}function pn(e,t){e.blockedOn===t&&(e.blockedOn=null,ci||(ci=!0,ye.unstable_scheduleCallback(ye.unstable_NormalPriority,tf)))}function In(e){function t(l){return pn(l,e)}if(0<ar.length){pn(ar[0],e);for(var n=1;n<ar.length;n++){var r=ar[n];r.blockedOn===e&&(r.blockedOn=null)}}for(rt!==null&&pn(rt,e),lt!==null&&pn(lt,e),it!==null&&pn(it,e),Dn.forEach(t),On.forEach(t),n=0;n<be.length;n++)r=be[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<be.length&&(n=be[0],n.blockedOn===null);)Ms(n),n.blockedOn===null&&be.shift()}var Xt=Ge.ReactCurrentBatchConfig,Or=!0;function nf(e,t,n,r){var l=M,i=Xt.transition;Xt.transition=null;try{M=1,bi(e,t,n,r)}finally{M=l,Xt.transition=i}}function rf(e,t,n,r){var l=M,i=Xt.transition;Xt.transition=null;try{M=4,bi(e,t,n,r)}finally{M=l,Xt.transition=i}}function bi(e,t,n,r){if(Or){var l=fi(e,t,n,r);if(l===null)Dl(e,t,r,Ir,n),Xo(e,r);else if(ef(l,e,t,n,r))r.stopPropagation();else if(Xo(e,r),t&4&&-1<bc.indexOf(e)){for(;l!==null;){var i=Jn(l);if(i!==null&&Ps(i),i=fi(e,t,n,r),i===null&&Dl(e,t,r,Ir,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else Dl(e,t,r,null,n)}}var Ir=null;function fi(e,t,n,r){if(Ir=null,e=Gi(r),e=wt(e),e!==null)if(t=Tt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ks(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ir=e,null}function Ds(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Hc()){case Zi:return 1;case Cs:return 4;case Mr:case Qc:return 16;case js:return 536870912;default:return 16}default:return 16}}var tt=null,eo=null,kr=null;function Os(){if(kr)return kr;var e,t=eo,n=t.length,r,l="value"in tt?tt.value:tt.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[i-r];r++);return kr=l.slice(e,1<r?1-r:void 0)}function Sr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function sr(){return!0}function Zo(){return!1}function we(e){function t(n,r,l,i,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(n=e[a],this[a]=n?n(i):i[a]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?sr:Zo,this.isPropagationStopped=Zo,this}return B(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=sr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=sr)},persist:function(){},isPersistent:sr}),t}var on={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},to=we(on),Zn=B({},on,{view:0,detail:0}),lf=we(Zn),Cl,jl,mn,nl=B({},Zn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:no,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==mn&&(mn&&e.type==="mousemove"?(Cl=e.screenX-mn.screenX,jl=e.screenY-mn.screenY):jl=Cl=0,mn=e),Cl)},movementY:function(e){return"movementY"in e?e.movementY:jl}}),Jo=we(nl),of=B({},nl,{dataTransfer:0}),af=we(of),sf=B({},Zn,{relatedTarget:0}),_l=we(sf),uf=B({},on,{animationName:0,elapsedTime:0,pseudoElement:0}),cf=we(uf),ff=B({},on,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),df=we(ff),pf=B({},on,{data:0}),qo=we(pf),mf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},gf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function vf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=gf[e])?!!t[e]:!1}function no(){return vf}var yf=B({},Zn,{key:function(e){if(e.key){var t=mf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Sr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?hf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:no,charCode:function(e){return e.type==="keypress"?Sr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Sr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),xf=we(yf),wf=B({},nl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),bo=we(wf),kf=B({},Zn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:no}),Sf=we(kf),Nf=B({},on,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ef=we(Nf),Cf=B({},nl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),jf=we(Cf),_f=[9,13,27,32],ro=Qe&&"CompositionEvent"in window,En=null;Qe&&"documentMode"in document&&(En=document.documentMode);var zf=Qe&&"TextEvent"in window&&!En,Is=Qe&&(!ro||En&&8<En&&11>=En),ea=" ",ta=!1;function Fs(e,t){switch(e){case"keyup":return _f.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Us(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Ot=!1;function Pf(e,t){switch(e){case"compositionend":return Us(t);case"keypress":return t.which!==32?null:(ta=!0,ea);case"textInput":return e=t.data,e===ea&&ta?null:e;default:return null}}function Lf(e,t){if(Ot)return e==="compositionend"||!ro&&Fs(e,t)?(e=Os(),kr=eo=tt=null,Ot=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Is&&t.locale!=="ko"?null:t.data;default:return null}}var Tf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function na(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Tf[e.type]:t==="textarea"}function $s(e,t,n,r){gs(r),t=Fr(t,"onChange"),0<t.length&&(n=new to("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Cn=null,Fn=null;function Rf(e){Zs(e,0)}function rl(e){var t=Ut(e);if(us(t))return e}function Mf(e,t){if(e==="change")return t}var As=!1;if(Qe){var zl;if(Qe){var Pl="oninput"in document;if(!Pl){var ra=document.createElement("div");ra.setAttribute("oninput","return;"),Pl=typeof ra.oninput=="function"}zl=Pl}else zl=!1;As=zl&&(!document.documentMode||9<document.documentMode)}function la(){Cn&&(Cn.detachEvent("onpropertychange",Bs),Fn=Cn=null)}function Bs(e){if(e.propertyName==="value"&&rl(Fn)){var t=[];$s(t,Fn,e,Gi(e)),ws(Rf,t)}}function Df(e,t,n){e==="focusin"?(la(),Cn=t,Fn=n,Cn.attachEvent("onpropertychange",Bs)):e==="focusout"&&la()}function Of(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return rl(Fn)}function If(e,t){if(e==="click")return rl(t)}function Ff(e,t){if(e==="input"||e==="change")return rl(t)}function Uf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var De=typeof Object.is=="function"?Object.is:Uf;function Un(e,t){if(De(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Kl.call(t,l)||!De(e[l],t[l]))return!1}return!0}function ia(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function oa(e,t){var n=ia(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ia(n)}}function Ws(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ws(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Vs(){for(var e=window,t=Lr();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Lr(e.document)}return t}function lo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function $f(e){var t=Vs(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ws(n.ownerDocument.documentElement,n)){if(r!==null&&lo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=oa(n,i);var o=oa(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Af=Qe&&"documentMode"in document&&11>=document.documentMode,It=null,di=null,jn=null,pi=!1;function aa(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;pi||It==null||It!==Lr(r)||(r=It,"selectionStart"in r&&lo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),jn&&Un(jn,r)||(jn=r,r=Fr(di,"onSelect"),0<r.length&&(t=new to("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=It)))}function ur(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ft={animationend:ur("Animation","AnimationEnd"),animationiteration:ur("Animation","AnimationIteration"),animationstart:ur("Animation","AnimationStart"),transitionend:ur("Transition","TransitionEnd")},Ll={},Hs={};Qe&&(Hs=document.createElement("div").style,"AnimationEvent"in window||(delete Ft.animationend.animation,delete Ft.animationiteration.animation,delete Ft.animationstart.animation),"TransitionEvent"in window||delete Ft.transitionend.transition);function ll(e){if(Ll[e])return Ll[e];if(!Ft[e])return e;var t=Ft[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Hs)return Ll[e]=t[n];return e}var Qs=ll("animationend"),Ys=ll("animationiteration"),Ks=ll("animationstart"),Xs=ll("transitionend"),Gs=new Map,sa="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function pt(e,t){Gs.set(e,t),Lt(t,[e])}for(var Tl=0;Tl<sa.length;Tl++){var Rl=sa[Tl],Bf=Rl.toLowerCase(),Wf=Rl[0].toUpperCase()+Rl.slice(1);pt(Bf,"on"+Wf)}pt(Qs,"onAnimationEnd");pt(Ys,"onAnimationIteration");pt(Ks,"onAnimationStart");pt("dblclick","onDoubleClick");pt("focusin","onFocus");pt("focusout","onBlur");pt(Xs,"onTransitionEnd");Jt("onMouseEnter",["mouseout","mouseover"]);Jt("onMouseLeave",["mouseout","mouseover"]);Jt("onPointerEnter",["pointerout","pointerover"]);Jt("onPointerLeave",["pointerout","pointerover"]);Lt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Lt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Lt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Lt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Lt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Lt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var kn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Vf=new Set("cancel close invalid load scroll toggle".split(" ").concat(kn));function ua(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Ac(r,t,void 0,e),e.currentTarget=null}function Zs(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var o=r.length-1;0<=o;o--){var a=r[o],s=a.instance,f=a.currentTarget;if(a=a.listener,s!==i&&l.isPropagationStopped())break e;ua(l,a,f),i=s}else for(o=0;o<r.length;o++){if(a=r[o],s=a.instance,f=a.currentTarget,a=a.listener,s!==i&&l.isPropagationStopped())break e;ua(l,a,f),i=s}}}if(Rr)throw e=si,Rr=!1,si=null,e}function O(e,t){var n=t[yi];n===void 0&&(n=t[yi]=new Set);var r=e+"__bubble";n.has(r)||(Js(t,e,2,!1),n.add(r))}function Ml(e,t,n){var r=0;t&&(r|=4),Js(n,e,r,t)}var cr="_reactListening"+Math.random().toString(36).slice(2);function $n(e){if(!e[cr]){e[cr]=!0,ls.forEach(function(n){n!=="selectionchange"&&(Vf.has(n)||Ml(n,!1,e),Ml(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[cr]||(t[cr]=!0,Ml("selectionchange",!1,t))}}function Js(e,t,n,r){switch(Ds(t)){case 1:var l=nf;break;case 4:l=rf;break;default:l=bi}n=l.bind(null,t,n,e),l=void 0,!ai||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Dl(e,t,n,r,l){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===l||a.nodeType===8&&a.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var s=o.tag;if((s===3||s===4)&&(s=o.stateNode.containerInfo,s===l||s.nodeType===8&&s.parentNode===l))return;o=o.return}for(;a!==null;){if(o=wt(a),o===null)return;if(s=o.tag,s===5||s===6){r=i=o;continue e}a=a.parentNode}}r=r.return}ws(function(){var f=i,g=Gi(n),h=[];e:{var m=Gs.get(e);if(m!==void 0){var x=to,w=e;switch(e){case"keypress":if(Sr(n)===0)break e;case"keydown":case"keyup":x=xf;break;case"focusin":w="focus",x=_l;break;case"focusout":w="blur",x=_l;break;case"beforeblur":case"afterblur":x=_l;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":x=Jo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":x=af;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":x=Sf;break;case Qs:case Ys:case Ks:x=cf;break;case Xs:x=Ef;break;case"scroll":x=lf;break;case"wheel":x=jf;break;case"copy":case"cut":case"paste":x=df;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":x=bo}var k=(t&4)!==0,F=!k&&e==="scroll",d=k?m!==null?m+"Capture":null:m;k=[];for(var u=f,p;u!==null;){p=u;var v=p.stateNode;if(p.tag===5&&v!==null&&(p=v,d!==null&&(v=Mn(u,d),v!=null&&k.push(An(u,v,p)))),F)break;u=u.return}0<k.length&&(m=new x(m,w,null,n,g),h.push({event:m,listeners:k}))}}if(!(t&7)){e:{if(m=e==="mouseover"||e==="pointerover",x=e==="mouseout"||e==="pointerout",m&&n!==ii&&(w=n.relatedTarget||n.fromElement)&&(wt(w)||w[Ye]))break e;if((x||m)&&(m=g.window===g?g:(m=g.ownerDocument)?m.defaultView||m.parentWindow:window,x?(w=n.relatedTarget||n.toElement,x=f,w=w?wt(w):null,w!==null&&(F=Tt(w),w!==F||w.tag!==5&&w.tag!==6)&&(w=null)):(x=null,w=f),x!==w)){if(k=Jo,v="onMouseLeave",d="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(k=bo,v="onPointerLeave",d="onPointerEnter",u="pointer"),F=x==null?m:Ut(x),p=w==null?m:Ut(w),m=new k(v,u+"leave",x,n,g),m.target=F,m.relatedTarget=p,v=null,wt(g)===f&&(k=new k(d,u+"enter",w,n,g),k.target=p,k.relatedTarget=F,v=k),F=v,x&&w)t:{for(k=x,d=w,u=0,p=k;p;p=Rt(p))u++;for(p=0,v=d;v;v=Rt(v))p++;for(;0<u-p;)k=Rt(k),u--;for(;0<p-u;)d=Rt(d),p--;for(;u--;){if(k===d||d!==null&&k===d.alternate)break t;k=Rt(k),d=Rt(d)}k=null}else k=null;x!==null&&ca(h,m,x,k,!1),w!==null&&F!==null&&ca(h,F,w,k,!0)}}e:{if(m=f?Ut(f):window,x=m.nodeName&&m.nodeName.toLowerCase(),x==="select"||x==="input"&&m.type==="file")var N=Mf;else if(na(m))if(As)N=Ff;else{N=Of;var C=Df}else(x=m.nodeName)&&x.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(N=If);if(N&&(N=N(e,f))){$s(h,N,n,g);break e}C&&C(e,m,f),e==="focusout"&&(C=m._wrapperState)&&C.controlled&&m.type==="number"&&ei(m,"number",m.value)}switch(C=f?Ut(f):window,e){case"focusin":(na(C)||C.contentEditable==="true")&&(It=C,di=f,jn=null);break;case"focusout":jn=di=It=null;break;case"mousedown":pi=!0;break;case"contextmenu":case"mouseup":case"dragend":pi=!1,aa(h,n,g);break;case"selectionchange":if(Af)break;case"keydown":case"keyup":aa(h,n,g)}var j;if(ro)e:{switch(e){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else Ot?Fs(e,n)&&(_="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(Is&&n.locale!=="ko"&&(Ot||_!=="onCompositionStart"?_==="onCompositionEnd"&&Ot&&(j=Os()):(tt=g,eo="value"in tt?tt.value:tt.textContent,Ot=!0)),C=Fr(f,_),0<C.length&&(_=new qo(_,e,null,n,g),h.push({event:_,listeners:C}),j?_.data=j:(j=Us(n),j!==null&&(_.data=j)))),(j=zf?Pf(e,n):Lf(e,n))&&(f=Fr(f,"onBeforeInput"),0<f.length&&(g=new qo("onBeforeInput","beforeinput",null,n,g),h.push({event:g,listeners:f}),g.data=j))}Zs(h,t)})}function An(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Fr(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=Mn(e,n),i!=null&&r.unshift(An(e,i,l)),i=Mn(e,t),i!=null&&r.push(An(e,i,l))),e=e.return}return r}function Rt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ca(e,t,n,r,l){for(var i=t._reactName,o=[];n!==null&&n!==r;){var a=n,s=a.alternate,f=a.stateNode;if(s!==null&&s===r)break;a.tag===5&&f!==null&&(a=f,l?(s=Mn(n,i),s!=null&&o.unshift(An(n,s,a))):l||(s=Mn(n,i),s!=null&&o.push(An(n,s,a)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Hf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function fa(e){return(typeof e=="string"?e:""+e).replace(Hf,`
`).replace(Qf,"")}function fr(e,t,n){if(t=fa(t),fa(e)!==t&&n)throw Error(y(425))}function Ur(){}var mi=null,hi=null;function gi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var vi=typeof setTimeout=="function"?setTimeout:void 0,Yf=typeof clearTimeout=="function"?clearTimeout:void 0,da=typeof Promise=="function"?Promise:void 0,Kf=typeof queueMicrotask=="function"?queueMicrotask:typeof da<"u"?function(e){return da.resolve(null).then(e).catch(Xf)}:vi;function Xf(e){setTimeout(function(){throw e})}function Ol(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),In(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);In(t)}function ot(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function pa(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var an=Math.random().toString(36).slice(2),Fe="__reactFiber$"+an,Bn="__reactProps$"+an,Ye="__reactContainer$"+an,yi="__reactEvents$"+an,Gf="__reactListeners$"+an,Zf="__reactHandles$"+an;function wt(e){var t=e[Fe];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Ye]||n[Fe]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=pa(e);e!==null;){if(n=e[Fe])return n;e=pa(e)}return t}e=n,n=e.parentNode}return null}function Jn(e){return e=e[Fe]||e[Ye],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Ut(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(y(33))}function il(e){return e[Bn]||null}var xi=[],$t=-1;function mt(e){return{current:e}}function I(e){0>$t||(e.current=xi[$t],xi[$t]=null,$t--)}function D(e,t){$t++,xi[$t]=e.current,e.current=t}var dt={},ie=mt(dt),de=mt(!1),Ct=dt;function qt(e,t){var n=e.type.contextTypes;if(!n)return dt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function pe(e){return e=e.childContextTypes,e!=null}function $r(){I(de),I(ie)}function ma(e,t,n){if(ie.current!==dt)throw Error(y(168));D(ie,t),D(de,n)}function qs(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(y(108,Mc(e)||"Unknown",l));return B({},n,r)}function Ar(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||dt,Ct=ie.current,D(ie,e),D(de,de.current),!0}function ha(e,t,n){var r=e.stateNode;if(!r)throw Error(y(169));n?(e=qs(e,t,Ct),r.__reactInternalMemoizedMergedChildContext=e,I(de),I(ie),D(ie,e)):I(de),D(de,n)}var Be=null,ol=!1,Il=!1;function bs(e){Be===null?Be=[e]:Be.push(e)}function Jf(e){ol=!0,bs(e)}function ht(){if(!Il&&Be!==null){Il=!0;var e=0,t=M;try{var n=Be;for(M=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Be=null,ol=!1}catch(l){throw Be!==null&&(Be=Be.slice(e+1)),Es(Zi,ht),l}finally{M=t,Il=!1}}return null}var At=[],Bt=0,Br=null,Wr=0,ke=[],Se=0,jt=null,We=1,Ve="";function yt(e,t){At[Bt++]=Wr,At[Bt++]=Br,Br=e,Wr=t}function eu(e,t,n){ke[Se++]=We,ke[Se++]=Ve,ke[Se++]=jt,jt=e;var r=We;e=Ve;var l=32-Re(r)-1;r&=~(1<<l),n+=1;var i=32-Re(t)+l;if(30<i){var o=l-l%5;i=(r&(1<<o)-1).toString(32),r>>=o,l-=o,We=1<<32-Re(t)+l|n<<l|r,Ve=i+e}else We=1<<i|n<<l|r,Ve=e}function io(e){e.return!==null&&(yt(e,1),eu(e,1,0))}function oo(e){for(;e===Br;)Br=At[--Bt],At[Bt]=null,Wr=At[--Bt],At[Bt]=null;for(;e===jt;)jt=ke[--Se],ke[Se]=null,Ve=ke[--Se],ke[Se]=null,We=ke[--Se],ke[Se]=null}var ve=null,ge=null,U=!1,Te=null;function tu(e,t){var n=Ne(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ga(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ve=e,ge=ot(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ve=e,ge=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=jt!==null?{id:We,overflow:Ve}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Ne(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ve=e,ge=null,!0):!1;default:return!1}}function wi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ki(e){if(U){var t=ge;if(t){var n=t;if(!ga(e,t)){if(wi(e))throw Error(y(418));t=ot(n.nextSibling);var r=ve;t&&ga(e,t)?tu(r,n):(e.flags=e.flags&-4097|2,U=!1,ve=e)}}else{if(wi(e))throw Error(y(418));e.flags=e.flags&-4097|2,U=!1,ve=e}}}function va(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ve=e}function dr(e){if(e!==ve)return!1;if(!U)return va(e),U=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!gi(e.type,e.memoizedProps)),t&&(t=ge)){if(wi(e))throw nu(),Error(y(418));for(;t;)tu(e,t),t=ot(t.nextSibling)}if(va(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ge=ot(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ge=null}}else ge=ve?ot(e.stateNode.nextSibling):null;return!0}function nu(){for(var e=ge;e;)e=ot(e.nextSibling)}function bt(){ge=ve=null,U=!1}function ao(e){Te===null?Te=[e]:Te.push(e)}var qf=Ge.ReactCurrentBatchConfig;function hn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(y(309));var r=n.stateNode}if(!r)throw Error(y(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var a=l.refs;o===null?delete a[i]:a[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(y(284));if(!n._owner)throw Error(y(290,e))}return e}function pr(e,t){throw e=Object.prototype.toString.call(t),Error(y(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ya(e){var t=e._init;return t(e._payload)}function ru(e){function t(d,u){if(e){var p=d.deletions;p===null?(d.deletions=[u],d.flags|=16):p.push(u)}}function n(d,u){if(!e)return null;for(;u!==null;)t(d,u),u=u.sibling;return null}function r(d,u){for(d=new Map;u!==null;)u.key!==null?d.set(u.key,u):d.set(u.index,u),u=u.sibling;return d}function l(d,u){return d=ct(d,u),d.index=0,d.sibling=null,d}function i(d,u,p){return d.index=p,e?(p=d.alternate,p!==null?(p=p.index,p<u?(d.flags|=2,u):p):(d.flags|=2,u)):(d.flags|=1048576,u)}function o(d){return e&&d.alternate===null&&(d.flags|=2),d}function a(d,u,p,v){return u===null||u.tag!==6?(u=Vl(p,d.mode,v),u.return=d,u):(u=l(u,p),u.return=d,u)}function s(d,u,p,v){var N=p.type;return N===Dt?g(d,u,p.props.children,v,p.key):u!==null&&(u.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Je&&ya(N)===u.type)?(v=l(u,p.props),v.ref=hn(d,u,p),v.return=d,v):(v=Pr(p.type,p.key,p.props,null,d.mode,v),v.ref=hn(d,u,p),v.return=d,v)}function f(d,u,p,v){return u===null||u.tag!==4||u.stateNode.containerInfo!==p.containerInfo||u.stateNode.implementation!==p.implementation?(u=Hl(p,d.mode,v),u.return=d,u):(u=l(u,p.children||[]),u.return=d,u)}function g(d,u,p,v,N){return u===null||u.tag!==7?(u=Et(p,d.mode,v,N),u.return=d,u):(u=l(u,p),u.return=d,u)}function h(d,u,p){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Vl(""+u,d.mode,p),u.return=d,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case nr:return p=Pr(u.type,u.key,u.props,null,d.mode,p),p.ref=hn(d,null,u),p.return=d,p;case Mt:return u=Hl(u,d.mode,p),u.return=d,u;case Je:var v=u._init;return h(d,v(u._payload),p)}if(xn(u)||cn(u))return u=Et(u,d.mode,p,null),u.return=d,u;pr(d,u)}return null}function m(d,u,p,v){var N=u!==null?u.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return N!==null?null:a(d,u,""+p,v);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case nr:return p.key===N?s(d,u,p,v):null;case Mt:return p.key===N?f(d,u,p,v):null;case Je:return N=p._init,m(d,u,N(p._payload),v)}if(xn(p)||cn(p))return N!==null?null:g(d,u,p,v,null);pr(d,p)}return null}function x(d,u,p,v,N){if(typeof v=="string"&&v!==""||typeof v=="number")return d=d.get(p)||null,a(u,d,""+v,N);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case nr:return d=d.get(v.key===null?p:v.key)||null,s(u,d,v,N);case Mt:return d=d.get(v.key===null?p:v.key)||null,f(u,d,v,N);case Je:var C=v._init;return x(d,u,p,C(v._payload),N)}if(xn(v)||cn(v))return d=d.get(p)||null,g(u,d,v,N,null);pr(u,v)}return null}function w(d,u,p,v){for(var N=null,C=null,j=u,_=u=0,V=null;j!==null&&_<p.length;_++){j.index>_?(V=j,j=null):V=j.sibling;var T=m(d,j,p[_],v);if(T===null){j===null&&(j=V);break}e&&j&&T.alternate===null&&t(d,j),u=i(T,u,_),C===null?N=T:C.sibling=T,C=T,j=V}if(_===p.length)return n(d,j),U&&yt(d,_),N;if(j===null){for(;_<p.length;_++)j=h(d,p[_],v),j!==null&&(u=i(j,u,_),C===null?N=j:C.sibling=j,C=j);return U&&yt(d,_),N}for(j=r(d,j);_<p.length;_++)V=x(j,d,_,p[_],v),V!==null&&(e&&V.alternate!==null&&j.delete(V.key===null?_:V.key),u=i(V,u,_),C===null?N=V:C.sibling=V,C=V);return e&&j.forEach(function(_e){return t(d,_e)}),U&&yt(d,_),N}function k(d,u,p,v){var N=cn(p);if(typeof N!="function")throw Error(y(150));if(p=N.call(p),p==null)throw Error(y(151));for(var C=N=null,j=u,_=u=0,V=null,T=p.next();j!==null&&!T.done;_++,T=p.next()){j.index>_?(V=j,j=null):V=j.sibling;var _e=m(d,j,T.value,v);if(_e===null){j===null&&(j=V);break}e&&j&&_e.alternate===null&&t(d,j),u=i(_e,u,_),C===null?N=_e:C.sibling=_e,C=_e,j=V}if(T.done)return n(d,j),U&&yt(d,_),N;if(j===null){for(;!T.done;_++,T=p.next())T=h(d,T.value,v),T!==null&&(u=i(T,u,_),C===null?N=T:C.sibling=T,C=T);return U&&yt(d,_),N}for(j=r(d,j);!T.done;_++,T=p.next())T=x(j,d,_,T.value,v),T!==null&&(e&&T.alternate!==null&&j.delete(T.key===null?_:T.key),u=i(T,u,_),C===null?N=T:C.sibling=T,C=T);return e&&j.forEach(function(sn){return t(d,sn)}),U&&yt(d,_),N}function F(d,u,p,v){if(typeof p=="object"&&p!==null&&p.type===Dt&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case nr:e:{for(var N=p.key,C=u;C!==null;){if(C.key===N){if(N=p.type,N===Dt){if(C.tag===7){n(d,C.sibling),u=l(C,p.props.children),u.return=d,d=u;break e}}else if(C.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Je&&ya(N)===C.type){n(d,C.sibling),u=l(C,p.props),u.ref=hn(d,C,p),u.return=d,d=u;break e}n(d,C);break}else t(d,C);C=C.sibling}p.type===Dt?(u=Et(p.props.children,d.mode,v,p.key),u.return=d,d=u):(v=Pr(p.type,p.key,p.props,null,d.mode,v),v.ref=hn(d,u,p),v.return=d,d=v)}return o(d);case Mt:e:{for(C=p.key;u!==null;){if(u.key===C)if(u.tag===4&&u.stateNode.containerInfo===p.containerInfo&&u.stateNode.implementation===p.implementation){n(d,u.sibling),u=l(u,p.children||[]),u.return=d,d=u;break e}else{n(d,u);break}else t(d,u);u=u.sibling}u=Hl(p,d.mode,v),u.return=d,d=u}return o(d);case Je:return C=p._init,F(d,u,C(p._payload),v)}if(xn(p))return w(d,u,p,v);if(cn(p))return k(d,u,p,v);pr(d,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,u!==null&&u.tag===6?(n(d,u.sibling),u=l(u,p),u.return=d,d=u):(n(d,u),u=Vl(p,d.mode,v),u.return=d,d=u),o(d)):n(d,u)}return F}var en=ru(!0),lu=ru(!1),Vr=mt(null),Hr=null,Wt=null,so=null;function uo(){so=Wt=Hr=null}function co(e){var t=Vr.current;I(Vr),e._currentValue=t}function Si(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Gt(e,t){Hr=e,so=Wt=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(fe=!0),e.firstContext=null)}function Ce(e){var t=e._currentValue;if(so!==e)if(e={context:e,memoizedValue:t,next:null},Wt===null){if(Hr===null)throw Error(y(308));Wt=e,Hr.dependencies={lanes:0,firstContext:e}}else Wt=Wt.next=e;return t}var kt=null;function fo(e){kt===null?kt=[e]:kt.push(e)}function iu(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,fo(t)):(n.next=l.next,l.next=n),t.interleaved=n,Ke(e,r)}function Ke(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var qe=!1;function po(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ou(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function He(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function at(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,R&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Ke(e,n)}return l=r.interleaved,l===null?(t.next=t,fo(r)):(t.next=l.next,l.next=t),r.interleaved=t,Ke(e,n)}function Nr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ji(e,n)}}function xa(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Qr(e,t,n,r){var l=e.updateQueue;qe=!1;var i=l.firstBaseUpdate,o=l.lastBaseUpdate,a=l.shared.pending;if(a!==null){l.shared.pending=null;var s=a,f=s.next;s.next=null,o===null?i=f:o.next=f,o=s;var g=e.alternate;g!==null&&(g=g.updateQueue,a=g.lastBaseUpdate,a!==o&&(a===null?g.firstBaseUpdate=f:a.next=f,g.lastBaseUpdate=s))}if(i!==null){var h=l.baseState;o=0,g=f=s=null,a=i;do{var m=a.lane,x=a.eventTime;if((r&m)===m){g!==null&&(g=g.next={eventTime:x,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var w=e,k=a;switch(m=t,x=n,k.tag){case 1:if(w=k.payload,typeof w=="function"){h=w.call(x,h,m);break e}h=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=k.payload,m=typeof w=="function"?w.call(x,h,m):w,m==null)break e;h=B({},h,m);break e;case 2:qe=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,m=l.effects,m===null?l.effects=[a]:m.push(a))}else x={eventTime:x,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},g===null?(f=g=x,s=h):g=g.next=x,o|=m;if(a=a.next,a===null){if(a=l.shared.pending,a===null)break;m=a,a=m.next,m.next=null,l.lastBaseUpdate=m,l.shared.pending=null}}while(!0);if(g===null&&(s=h),l.baseState=s,l.firstBaseUpdate=f,l.lastBaseUpdate=g,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);zt|=o,e.lanes=o,e.memoizedState=h}}function wa(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(y(191,l));l.call(r)}}}var qn={},$e=mt(qn),Wn=mt(qn),Vn=mt(qn);function St(e){if(e===qn)throw Error(y(174));return e}function mo(e,t){switch(D(Vn,t),D(Wn,e),D($e,qn),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ni(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ni(t,e)}I($e),D($e,t)}function tn(){I($e),I(Wn),I(Vn)}function au(e){St(Vn.current);var t=St($e.current),n=ni(t,e.type);t!==n&&(D(Wn,e),D($e,n))}function ho(e){Wn.current===e&&(I($e),I(Wn))}var $=mt(0);function Yr(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Fl=[];function go(){for(var e=0;e<Fl.length;e++)Fl[e]._workInProgressVersionPrimary=null;Fl.length=0}var Er=Ge.ReactCurrentDispatcher,Ul=Ge.ReactCurrentBatchConfig,_t=0,A=null,X=null,J=null,Kr=!1,_n=!1,Hn=0,bf=0;function ne(){throw Error(y(321))}function vo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!De(e[n],t[n]))return!1;return!0}function yo(e,t,n,r,l,i){if(_t=i,A=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Er.current=e===null||e.memoizedState===null?rd:ld,e=n(r,l),_n){i=0;do{if(_n=!1,Hn=0,25<=i)throw Error(y(301));i+=1,J=X=null,t.updateQueue=null,Er.current=id,e=n(r,l)}while(_n)}if(Er.current=Xr,t=X!==null&&X.next!==null,_t=0,J=X=A=null,Kr=!1,t)throw Error(y(300));return e}function xo(){var e=Hn!==0;return Hn=0,e}function Ie(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return J===null?A.memoizedState=J=e:J=J.next=e,J}function je(){if(X===null){var e=A.alternate;e=e!==null?e.memoizedState:null}else e=X.next;var t=J===null?A.memoizedState:J.next;if(t!==null)J=t,X=e;else{if(e===null)throw Error(y(310));X=e,e={memoizedState:X.memoizedState,baseState:X.baseState,baseQueue:X.baseQueue,queue:X.queue,next:null},J===null?A.memoizedState=J=e:J=J.next=e}return J}function Qn(e,t){return typeof t=="function"?t(e):t}function $l(e){var t=je(),n=t.queue;if(n===null)throw Error(y(311));n.lastRenderedReducer=e;var r=X,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var o=l.next;l.next=i.next,i.next=o}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var a=o=null,s=null,f=i;do{var g=f.lane;if((_t&g)===g)s!==null&&(s=s.next={lane:0,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null}),r=f.hasEagerState?f.eagerState:e(r,f.action);else{var h={lane:g,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null};s===null?(a=s=h,o=r):s=s.next=h,A.lanes|=g,zt|=g}f=f.next}while(f!==null&&f!==i);s===null?o=r:s.next=a,De(r,t.memoizedState)||(fe=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=s,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,A.lanes|=i,zt|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Al(e){var t=je(),n=t.queue;if(n===null)throw Error(y(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do i=e(i,o.action),o=o.next;while(o!==l);De(i,t.memoizedState)||(fe=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function su(){}function uu(e,t){var n=A,r=je(),l=t(),i=!De(r.memoizedState,l);if(i&&(r.memoizedState=l,fe=!0),r=r.queue,wo(du.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||J!==null&&J.memoizedState.tag&1){if(n.flags|=2048,Yn(9,fu.bind(null,n,r,l,t),void 0,null),q===null)throw Error(y(349));_t&30||cu(n,t,l)}return l}function cu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=A.updateQueue,t===null?(t={lastEffect:null,stores:null},A.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function fu(e,t,n,r){t.value=n,t.getSnapshot=r,pu(t)&&mu(e)}function du(e,t,n){return n(function(){pu(t)&&mu(e)})}function pu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!De(e,n)}catch{return!0}}function mu(e){var t=Ke(e,1);t!==null&&Me(t,e,1,-1)}function ka(e){var t=Ie();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Qn,lastRenderedState:e},t.queue=e,e=e.dispatch=nd.bind(null,A,e),[t.memoizedState,e]}function Yn(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=A.updateQueue,t===null?(t={lastEffect:null,stores:null},A.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function hu(){return je().memoizedState}function Cr(e,t,n,r){var l=Ie();A.flags|=e,l.memoizedState=Yn(1|t,n,void 0,r===void 0?null:r)}function al(e,t,n,r){var l=je();r=r===void 0?null:r;var i=void 0;if(X!==null){var o=X.memoizedState;if(i=o.destroy,r!==null&&vo(r,o.deps)){l.memoizedState=Yn(t,n,i,r);return}}A.flags|=e,l.memoizedState=Yn(1|t,n,i,r)}function Sa(e,t){return Cr(8390656,8,e,t)}function wo(e,t){return al(2048,8,e,t)}function gu(e,t){return al(4,2,e,t)}function vu(e,t){return al(4,4,e,t)}function yu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function xu(e,t,n){return n=n!=null?n.concat([e]):null,al(4,4,yu.bind(null,t,e),n)}function ko(){}function wu(e,t){var n=je();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&vo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ku(e,t){var n=je();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&vo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Su(e,t,n){return _t&21?(De(n,t)||(n=_s(),A.lanes|=n,zt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,fe=!0),e.memoizedState=n)}function ed(e,t){var n=M;M=n!==0&&4>n?n:4,e(!0);var r=Ul.transition;Ul.transition={};try{e(!1),t()}finally{M=n,Ul.transition=r}}function Nu(){return je().memoizedState}function td(e,t,n){var r=ut(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Eu(e))Cu(t,n);else if(n=iu(e,t,n,r),n!==null){var l=ae();Me(n,e,r,l),ju(n,t,r)}}function nd(e,t,n){var r=ut(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Eu(e))Cu(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,a=i(o,n);if(l.hasEagerState=!0,l.eagerState=a,De(a,o)){var s=t.interleaved;s===null?(l.next=l,fo(t)):(l.next=s.next,s.next=l),t.interleaved=l;return}}catch{}finally{}n=iu(e,t,l,r),n!==null&&(l=ae(),Me(n,e,r,l),ju(n,t,r))}}function Eu(e){var t=e.alternate;return e===A||t!==null&&t===A}function Cu(e,t){_n=Kr=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function ju(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ji(e,n)}}var Xr={readContext:Ce,useCallback:ne,useContext:ne,useEffect:ne,useImperativeHandle:ne,useInsertionEffect:ne,useLayoutEffect:ne,useMemo:ne,useReducer:ne,useRef:ne,useState:ne,useDebugValue:ne,useDeferredValue:ne,useTransition:ne,useMutableSource:ne,useSyncExternalStore:ne,useId:ne,unstable_isNewReconciler:!1},rd={readContext:Ce,useCallback:function(e,t){return Ie().memoizedState=[e,t===void 0?null:t],e},useContext:Ce,useEffect:Sa,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Cr(4194308,4,yu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Cr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Cr(4,2,e,t)},useMemo:function(e,t){var n=Ie();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ie();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=td.bind(null,A,e),[r.memoizedState,e]},useRef:function(e){var t=Ie();return e={current:e},t.memoizedState=e},useState:ka,useDebugValue:ko,useDeferredValue:function(e){return Ie().memoizedState=e},useTransition:function(){var e=ka(!1),t=e[0];return e=ed.bind(null,e[1]),Ie().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=A,l=Ie();if(U){if(n===void 0)throw Error(y(407));n=n()}else{if(n=t(),q===null)throw Error(y(349));_t&30||cu(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,Sa(du.bind(null,r,i,e),[e]),r.flags|=2048,Yn(9,fu.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Ie(),t=q.identifierPrefix;if(U){var n=Ve,r=We;n=(r&~(1<<32-Re(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Hn++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=bf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ld={readContext:Ce,useCallback:wu,useContext:Ce,useEffect:wo,useImperativeHandle:xu,useInsertionEffect:gu,useLayoutEffect:vu,useMemo:ku,useReducer:$l,useRef:hu,useState:function(){return $l(Qn)},useDebugValue:ko,useDeferredValue:function(e){var t=je();return Su(t,X.memoizedState,e)},useTransition:function(){var e=$l(Qn)[0],t=je().memoizedState;return[e,t]},useMutableSource:su,useSyncExternalStore:uu,useId:Nu,unstable_isNewReconciler:!1},id={readContext:Ce,useCallback:wu,useContext:Ce,useEffect:wo,useImperativeHandle:xu,useInsertionEffect:gu,useLayoutEffect:vu,useMemo:ku,useReducer:Al,useRef:hu,useState:function(){return Al(Qn)},useDebugValue:ko,useDeferredValue:function(e){var t=je();return X===null?t.memoizedState=e:Su(t,X.memoizedState,e)},useTransition:function(){var e=Al(Qn)[0],t=je().memoizedState;return[e,t]},useMutableSource:su,useSyncExternalStore:uu,useId:Nu,unstable_isNewReconciler:!1};function Pe(e,t){if(e&&e.defaultProps){t=B({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Ni(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:B({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var sl={isMounted:function(e){return(e=e._reactInternals)?Tt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ae(),l=ut(e),i=He(r,l);i.payload=t,n!=null&&(i.callback=n),t=at(e,i,l),t!==null&&(Me(t,e,l,r),Nr(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ae(),l=ut(e),i=He(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=at(e,i,l),t!==null&&(Me(t,e,l,r),Nr(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ae(),r=ut(e),l=He(n,r);l.tag=2,t!=null&&(l.callback=t),t=at(e,l,r),t!==null&&(Me(t,e,r,n),Nr(t,e,r))}};function Na(e,t,n,r,l,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,o):t.prototype&&t.prototype.isPureReactComponent?!Un(n,r)||!Un(l,i):!0}function _u(e,t,n){var r=!1,l=dt,i=t.contextType;return typeof i=="object"&&i!==null?i=Ce(i):(l=pe(t)?Ct:ie.current,r=t.contextTypes,i=(r=r!=null)?qt(e,l):dt),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=sl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function Ea(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&sl.enqueueReplaceState(t,t.state,null)}function Ei(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},po(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=Ce(i):(i=pe(t)?Ct:ie.current,l.context=qt(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(Ni(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&sl.enqueueReplaceState(l,l.state,null),Qr(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function nn(e,t){try{var n="",r=t;do n+=Rc(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function Bl(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Ci(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var od=typeof WeakMap=="function"?WeakMap:Map;function zu(e,t,n){n=He(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Zr||(Zr=!0,Oi=r),Ci(e,t)},n}function Pu(e,t,n){n=He(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){Ci(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){Ci(e,t),typeof r!="function"&&(st===null?st=new Set([this]):st.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Ca(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new od;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=wd.bind(null,e,t,n),t.then(e,e))}function ja(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function _a(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=He(-1,1),t.tag=2,at(n,t,1))),n.lanes|=1),e)}var ad=Ge.ReactCurrentOwner,fe=!1;function oe(e,t,n,r){t.child=e===null?lu(t,null,n,r):en(t,e.child,n,r)}function za(e,t,n,r,l){n=n.render;var i=t.ref;return Gt(t,l),r=yo(e,t,n,r,i,l),n=xo(),e!==null&&!fe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Xe(e,t,l)):(U&&n&&io(t),t.flags|=1,oe(e,t,r,l),t.child)}function Pa(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!Po(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,Lu(e,t,i,r,l)):(e=Pr(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&l)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:Un,n(o,r)&&e.ref===t.ref)return Xe(e,t,l)}return t.flags|=1,e=ct(i,r),e.ref=t.ref,e.return=t,t.child=e}function Lu(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(Un(i,r)&&e.ref===t.ref)if(fe=!1,t.pendingProps=r=i,(e.lanes&l)!==0)e.flags&131072&&(fe=!0);else return t.lanes=e.lanes,Xe(e,t,l)}return ji(e,t,n,r,l)}function Tu(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},D(Ht,he),he|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,D(Ht,he),he|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,D(Ht,he),he|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,D(Ht,he),he|=r;return oe(e,t,l,n),t.child}function Ru(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ji(e,t,n,r,l){var i=pe(n)?Ct:ie.current;return i=qt(t,i),Gt(t,l),n=yo(e,t,n,r,i,l),r=xo(),e!==null&&!fe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Xe(e,t,l)):(U&&r&&io(t),t.flags|=1,oe(e,t,n,l),t.child)}function La(e,t,n,r,l){if(pe(n)){var i=!0;Ar(t)}else i=!1;if(Gt(t,l),t.stateNode===null)jr(e,t),_u(t,n,r),Ei(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,a=t.memoizedProps;o.props=a;var s=o.context,f=n.contextType;typeof f=="object"&&f!==null?f=Ce(f):(f=pe(n)?Ct:ie.current,f=qt(t,f));var g=n.getDerivedStateFromProps,h=typeof g=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||s!==f)&&Ea(t,o,r,f),qe=!1;var m=t.memoizedState;o.state=m,Qr(t,r,o,l),s=t.memoizedState,a!==r||m!==s||de.current||qe?(typeof g=="function"&&(Ni(t,n,g,r),s=t.memoizedState),(a=qe||Na(t,n,a,r,m,s,f))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=s),o.props=r,o.state=s,o.context=f,r=a):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,ou(e,t),a=t.memoizedProps,f=t.type===t.elementType?a:Pe(t.type,a),o.props=f,h=t.pendingProps,m=o.context,s=n.contextType,typeof s=="object"&&s!==null?s=Ce(s):(s=pe(n)?Ct:ie.current,s=qt(t,s));var x=n.getDerivedStateFromProps;(g=typeof x=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||m!==s)&&Ea(t,o,r,s),qe=!1,m=t.memoizedState,o.state=m,Qr(t,r,o,l);var w=t.memoizedState;a!==h||m!==w||de.current||qe?(typeof x=="function"&&(Ni(t,n,x,r),w=t.memoizedState),(f=qe||Na(t,n,f,r,m,w,s)||!1)?(g||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,w,s),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,w,s)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=w),o.props=r,o.state=w,o.context=s,r=f):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),r=!1)}return _i(e,t,n,r,i,l)}function _i(e,t,n,r,l,i){Ru(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&ha(t,n,!1),Xe(e,t,i);r=t.stateNode,ad.current=t;var a=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=en(t,e.child,null,i),t.child=en(t,null,a,i)):oe(e,t,a,i),t.memoizedState=r.state,l&&ha(t,n,!0),t.child}function Mu(e){var t=e.stateNode;t.pendingContext?ma(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ma(e,t.context,!1),mo(e,t.containerInfo)}function Ta(e,t,n,r,l){return bt(),ao(l),t.flags|=256,oe(e,t,n,r),t.child}var zi={dehydrated:null,treeContext:null,retryLane:0};function Pi(e){return{baseLanes:e,cachePool:null,transitions:null}}function Du(e,t,n){var r=t.pendingProps,l=$.current,i=!1,o=(t.flags&128)!==0,a;if((a=o)||(a=e!==null&&e.memoizedState===null?!1:(l&2)!==0),a?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),D($,l&1),e===null)return ki(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,i?(r=t.mode,i=t.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=fl(o,r,0,null),e=Et(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=Pi(n),t.memoizedState=zi,e):So(t,o));if(l=e.memoizedState,l!==null&&(a=l.dehydrated,a!==null))return sd(e,t,o,r,a,l,n);if(i){i=r.fallback,o=t.mode,l=e.child,a=l.sibling;var s={mode:"hidden",children:r.children};return!(o&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=s,t.deletions=null):(r=ct(l,s),r.subtreeFlags=l.subtreeFlags&14680064),a!==null?i=ct(a,i):(i=Et(i,o,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,o=e.child.memoizedState,o=o===null?Pi(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=zi,r}return i=e.child,e=i.sibling,r=ct(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function So(e,t){return t=fl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function mr(e,t,n,r){return r!==null&&ao(r),en(t,e.child,null,n),e=So(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function sd(e,t,n,r,l,i,o){if(n)return t.flags&256?(t.flags&=-257,r=Bl(Error(y(422))),mr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=fl({mode:"visible",children:r.children},l,0,null),i=Et(i,l,o,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&en(t,e.child,null,o),t.child.memoizedState=Pi(o),t.memoizedState=zi,i);if(!(t.mode&1))return mr(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var a=r.dgst;return r=a,i=Error(y(419)),r=Bl(i,r,void 0),mr(e,t,o,r)}if(a=(o&e.childLanes)!==0,fe||a){if(r=q,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|o)?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,Ke(e,l),Me(r,e,l,-1))}return zo(),r=Bl(Error(y(421))),mr(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=kd.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,ge=ot(l.nextSibling),ve=t,U=!0,Te=null,e!==null&&(ke[Se++]=We,ke[Se++]=Ve,ke[Se++]=jt,We=e.id,Ve=e.overflow,jt=t),t=So(t,r.children),t.flags|=4096,t)}function Ra(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Si(e.return,t,n)}function Wl(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function Ou(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(oe(e,t,r.children,n),r=$.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ra(e,n,t);else if(e.tag===19)Ra(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(D($,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Yr(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Wl(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Yr(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Wl(t,!0,n,null,i);break;case"together":Wl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function jr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Xe(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),zt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(y(153));if(t.child!==null){for(e=t.child,n=ct(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ct(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ud(e,t,n){switch(t.tag){case 3:Mu(t),bt();break;case 5:au(t);break;case 1:pe(t.type)&&Ar(t);break;case 4:mo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;D(Vr,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(D($,$.current&1),t.flags|=128,null):n&t.child.childLanes?Du(e,t,n):(D($,$.current&1),e=Xe(e,t,n),e!==null?e.sibling:null);D($,$.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Ou(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),D($,$.current),r)break;return null;case 22:case 23:return t.lanes=0,Tu(e,t,n)}return Xe(e,t,n)}var Iu,Li,Fu,Uu;Iu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Li=function(){};Fu=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,St($e.current);var i=null;switch(n){case"input":l=ql(e,l),r=ql(e,r),i=[];break;case"select":l=B({},l,{value:void 0}),r=B({},r,{value:void 0}),i=[];break;case"textarea":l=ti(e,l),r=ti(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Ur)}ri(n,r);var o;n=null;for(f in l)if(!r.hasOwnProperty(f)&&l.hasOwnProperty(f)&&l[f]!=null)if(f==="style"){var a=l[f];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else f!=="dangerouslySetInnerHTML"&&f!=="children"&&f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&f!=="autoFocus"&&(Tn.hasOwnProperty(f)?i||(i=[]):(i=i||[]).push(f,null));for(f in r){var s=r[f];if(a=l!=null?l[f]:void 0,r.hasOwnProperty(f)&&s!==a&&(s!=null||a!=null))if(f==="style")if(a){for(o in a)!a.hasOwnProperty(o)||s&&s.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in s)s.hasOwnProperty(o)&&a[o]!==s[o]&&(n||(n={}),n[o]=s[o])}else n||(i||(i=[]),i.push(f,n)),n=s;else f==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,a=a?a.__html:void 0,s!=null&&a!==s&&(i=i||[]).push(f,s)):f==="children"?typeof s!="string"&&typeof s!="number"||(i=i||[]).push(f,""+s):f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&(Tn.hasOwnProperty(f)?(s!=null&&f==="onScroll"&&O("scroll",e),i||a===s||(i=[])):(i=i||[]).push(f,s))}n&&(i=i||[]).push("style",n);var f=i;(t.updateQueue=f)&&(t.flags|=4)}};Uu=function(e,t,n,r){n!==r&&(t.flags|=4)};function gn(e,t){if(!U)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function re(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function cd(e,t,n){var r=t.pendingProps;switch(oo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return re(t),null;case 1:return pe(t.type)&&$r(),re(t),null;case 3:return r=t.stateNode,tn(),I(de),I(ie),go(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(dr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Te!==null&&(Ui(Te),Te=null))),Li(e,t),re(t),null;case 5:ho(t);var l=St(Vn.current);if(n=t.type,e!==null&&t.stateNode!=null)Fu(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(y(166));return re(t),null}if(e=St($e.current),dr(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Fe]=t,r[Bn]=i,e=(t.mode&1)!==0,n){case"dialog":O("cancel",r),O("close",r);break;case"iframe":case"object":case"embed":O("load",r);break;case"video":case"audio":for(l=0;l<kn.length;l++)O(kn[l],r);break;case"source":O("error",r);break;case"img":case"image":case"link":O("error",r),O("load",r);break;case"details":O("toggle",r);break;case"input":Bo(r,i),O("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},O("invalid",r);break;case"textarea":Vo(r,i),O("invalid",r)}ri(n,i),l=null;for(var o in i)if(i.hasOwnProperty(o)){var a=i[o];o==="children"?typeof a=="string"?r.textContent!==a&&(i.suppressHydrationWarning!==!0&&fr(r.textContent,a,e),l=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(i.suppressHydrationWarning!==!0&&fr(r.textContent,a,e),l=["children",""+a]):Tn.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&O("scroll",r)}switch(n){case"input":rr(r),Wo(r,i,!0);break;case"textarea":rr(r),Ho(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=Ur)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=ds(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[Fe]=t,e[Bn]=r,Iu(e,t,!1,!1),t.stateNode=e;e:{switch(o=li(n,r),n){case"dialog":O("cancel",e),O("close",e),l=r;break;case"iframe":case"object":case"embed":O("load",e),l=r;break;case"video":case"audio":for(l=0;l<kn.length;l++)O(kn[l],e);l=r;break;case"source":O("error",e),l=r;break;case"img":case"image":case"link":O("error",e),O("load",e),l=r;break;case"details":O("toggle",e),l=r;break;case"input":Bo(e,r),l=ql(e,r),O("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=B({},r,{value:void 0}),O("invalid",e);break;case"textarea":Vo(e,r),l=ti(e,r),O("invalid",e);break;default:l=r}ri(n,l),a=l;for(i in a)if(a.hasOwnProperty(i)){var s=a[i];i==="style"?hs(e,s):i==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,s!=null&&ps(e,s)):i==="children"?typeof s=="string"?(n!=="textarea"||s!=="")&&Rn(e,s):typeof s=="number"&&Rn(e,""+s):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(Tn.hasOwnProperty(i)?s!=null&&i==="onScroll"&&O("scroll",e):s!=null&&Qi(e,i,s,o))}switch(n){case"input":rr(e),Wo(e,r,!1);break;case"textarea":rr(e),Ho(e);break;case"option":r.value!=null&&e.setAttribute("value",""+ft(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?Qt(e,!!r.multiple,i,!1):r.defaultValue!=null&&Qt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Ur)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return re(t),null;case 6:if(e&&t.stateNode!=null)Uu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(y(166));if(n=St(Vn.current),St($e.current),dr(t)){if(r=t.stateNode,n=t.memoizedProps,r[Fe]=t,(i=r.nodeValue!==n)&&(e=ve,e!==null))switch(e.tag){case 3:fr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&fr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Fe]=t,t.stateNode=r}return re(t),null;case 13:if(I($),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(U&&ge!==null&&t.mode&1&&!(t.flags&128))nu(),bt(),t.flags|=98560,i=!1;else if(i=dr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(y(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(y(317));i[Fe]=t}else bt(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;re(t),i=!1}else Te!==null&&(Ui(Te),Te=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||$.current&1?G===0&&(G=3):zo())),t.updateQueue!==null&&(t.flags|=4),re(t),null);case 4:return tn(),Li(e,t),e===null&&$n(t.stateNode.containerInfo),re(t),null;case 10:return co(t.type._context),re(t),null;case 17:return pe(t.type)&&$r(),re(t),null;case 19:if(I($),i=t.memoizedState,i===null)return re(t),null;if(r=(t.flags&128)!==0,o=i.rendering,o===null)if(r)gn(i,!1);else{if(G!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Yr(e),o!==null){for(t.flags|=128,gn(i,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return D($,$.current&1|2),t.child}e=e.sibling}i.tail!==null&&Q()>rn&&(t.flags|=128,r=!0,gn(i,!1),t.lanes=4194304)}else{if(!r)if(e=Yr(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),gn(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!U)return re(t),null}else 2*Q()-i.renderingStartTime>rn&&n!==1073741824&&(t.flags|=128,r=!0,gn(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=Q(),t.sibling=null,n=$.current,D($,r?n&1|2:n&1),t):(re(t),null);case 22:case 23:return _o(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?he&1073741824&&(re(t),t.subtreeFlags&6&&(t.flags|=8192)):re(t),null;case 24:return null;case 25:return null}throw Error(y(156,t.tag))}function fd(e,t){switch(oo(t),t.tag){case 1:return pe(t.type)&&$r(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return tn(),I(de),I(ie),go(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ho(t),null;case 13:if(I($),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(y(340));bt()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return I($),null;case 4:return tn(),null;case 10:return co(t.type._context),null;case 22:case 23:return _o(),null;case 24:return null;default:return null}}var hr=!1,le=!1,dd=typeof WeakSet=="function"?WeakSet:Set,S=null;function Vt(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){W(e,t,r)}else n.current=null}function Ti(e,t,n){try{n()}catch(r){W(e,t,r)}}var Ma=!1;function pd(e,t){if(mi=Or,e=Vs(),lo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,a=-1,s=-1,f=0,g=0,h=e,m=null;t:for(;;){for(var x;h!==n||l!==0&&h.nodeType!==3||(a=o+l),h!==i||r!==0&&h.nodeType!==3||(s=o+r),h.nodeType===3&&(o+=h.nodeValue.length),(x=h.firstChild)!==null;)m=h,h=x;for(;;){if(h===e)break t;if(m===n&&++f===l&&(a=o),m===i&&++g===r&&(s=o),(x=h.nextSibling)!==null)break;h=m,m=h.parentNode}h=x}n=a===-1||s===-1?null:{start:a,end:s}}else n=null}n=n||{start:0,end:0}}else n=null;for(hi={focusedElem:e,selectionRange:n},Or=!1,S=t;S!==null;)if(t=S,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,S=e;else for(;S!==null;){t=S;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var k=w.memoizedProps,F=w.memoizedState,d=t.stateNode,u=d.getSnapshotBeforeUpdate(t.elementType===t.type?k:Pe(t.type,k),F);d.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var p=t.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(y(163))}}catch(v){W(t,t.return,v)}if(e=t.sibling,e!==null){e.return=t.return,S=e;break}S=t.return}return w=Ma,Ma=!1,w}function zn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&Ti(t,n,i)}l=l.next}while(l!==r)}}function ul(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ri(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function $u(e){var t=e.alternate;t!==null&&(e.alternate=null,$u(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Fe],delete t[Bn],delete t[yi],delete t[Gf],delete t[Zf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Au(e){return e.tag===5||e.tag===3||e.tag===4}function Da(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Au(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Mi(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ur));else if(r!==4&&(e=e.child,e!==null))for(Mi(e,t,n),e=e.sibling;e!==null;)Mi(e,t,n),e=e.sibling}function Di(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Di(e,t,n),e=e.sibling;e!==null;)Di(e,t,n),e=e.sibling}var b=null,Le=!1;function Ze(e,t,n){for(n=n.child;n!==null;)Bu(e,t,n),n=n.sibling}function Bu(e,t,n){if(Ue&&typeof Ue.onCommitFiberUnmount=="function")try{Ue.onCommitFiberUnmount(tl,n)}catch{}switch(n.tag){case 5:le||Vt(n,t);case 6:var r=b,l=Le;b=null,Ze(e,t,n),b=r,Le=l,b!==null&&(Le?(e=b,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):b.removeChild(n.stateNode));break;case 18:b!==null&&(Le?(e=b,n=n.stateNode,e.nodeType===8?Ol(e.parentNode,n):e.nodeType===1&&Ol(e,n),In(e)):Ol(b,n.stateNode));break;case 4:r=b,l=Le,b=n.stateNode.containerInfo,Le=!0,Ze(e,t,n),b=r,Le=l;break;case 0:case 11:case 14:case 15:if(!le&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&Ti(n,t,o),l=l.next}while(l!==r)}Ze(e,t,n);break;case 1:if(!le&&(Vt(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){W(n,t,a)}Ze(e,t,n);break;case 21:Ze(e,t,n);break;case 22:n.mode&1?(le=(r=le)||n.memoizedState!==null,Ze(e,t,n),le=r):Ze(e,t,n);break;default:Ze(e,t,n)}}function Oa(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new dd),t.forEach(function(r){var l=Sd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function ze(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,o=t,a=o;e:for(;a!==null;){switch(a.tag){case 5:b=a.stateNode,Le=!1;break e;case 3:b=a.stateNode.containerInfo,Le=!0;break e;case 4:b=a.stateNode.containerInfo,Le=!0;break e}a=a.return}if(b===null)throw Error(y(160));Bu(i,o,l),b=null,Le=!1;var s=l.alternate;s!==null&&(s.return=null),l.return=null}catch(f){W(l,t,f)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Wu(t,e),t=t.sibling}function Wu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(ze(t,e),Oe(e),r&4){try{zn(3,e,e.return),ul(3,e)}catch(k){W(e,e.return,k)}try{zn(5,e,e.return)}catch(k){W(e,e.return,k)}}break;case 1:ze(t,e),Oe(e),r&512&&n!==null&&Vt(n,n.return);break;case 5:if(ze(t,e),Oe(e),r&512&&n!==null&&Vt(n,n.return),e.flags&32){var l=e.stateNode;try{Rn(l,"")}catch(k){W(e,e.return,k)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,a=e.type,s=e.updateQueue;if(e.updateQueue=null,s!==null)try{a==="input"&&i.type==="radio"&&i.name!=null&&cs(l,i),li(a,o);var f=li(a,i);for(o=0;o<s.length;o+=2){var g=s[o],h=s[o+1];g==="style"?hs(l,h):g==="dangerouslySetInnerHTML"?ps(l,h):g==="children"?Rn(l,h):Qi(l,g,h,f)}switch(a){case"input":bl(l,i);break;case"textarea":fs(l,i);break;case"select":var m=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var x=i.value;x!=null?Qt(l,!!i.multiple,x,!1):m!==!!i.multiple&&(i.defaultValue!=null?Qt(l,!!i.multiple,i.defaultValue,!0):Qt(l,!!i.multiple,i.multiple?[]:"",!1))}l[Bn]=i}catch(k){W(e,e.return,k)}}break;case 6:if(ze(t,e),Oe(e),r&4){if(e.stateNode===null)throw Error(y(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(k){W(e,e.return,k)}}break;case 3:if(ze(t,e),Oe(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{In(t.containerInfo)}catch(k){W(e,e.return,k)}break;case 4:ze(t,e),Oe(e);break;case 13:ze(t,e),Oe(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(Co=Q())),r&4&&Oa(e);break;case 22:if(g=n!==null&&n.memoizedState!==null,e.mode&1?(le=(f=le)||g,ze(t,e),le=f):ze(t,e),Oe(e),r&8192){if(f=e.memoizedState!==null,(e.stateNode.isHidden=f)&&!g&&e.mode&1)for(S=e,g=e.child;g!==null;){for(h=S=g;S!==null;){switch(m=S,x=m.child,m.tag){case 0:case 11:case 14:case 15:zn(4,m,m.return);break;case 1:Vt(m,m.return);var w=m.stateNode;if(typeof w.componentWillUnmount=="function"){r=m,n=m.return;try{t=r,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(k){W(r,n,k)}}break;case 5:Vt(m,m.return);break;case 22:if(m.memoizedState!==null){Fa(h);continue}}x!==null?(x.return=m,S=x):Fa(h)}g=g.sibling}e:for(g=null,h=e;;){if(h.tag===5){if(g===null){g=h;try{l=h.stateNode,f?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(a=h.stateNode,s=h.memoizedProps.style,o=s!=null&&s.hasOwnProperty("display")?s.display:null,a.style.display=ms("display",o))}catch(k){W(e,e.return,k)}}}else if(h.tag===6){if(g===null)try{h.stateNode.nodeValue=f?"":h.memoizedProps}catch(k){W(e,e.return,k)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===e)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===e)break e;for(;h.sibling===null;){if(h.return===null||h.return===e)break e;g===h&&(g=null),h=h.return}g===h&&(g=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:ze(t,e),Oe(e),r&4&&Oa(e);break;case 21:break;default:ze(t,e),Oe(e)}}function Oe(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Au(n)){var r=n;break e}n=n.return}throw Error(y(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Rn(l,""),r.flags&=-33);var i=Da(e);Di(e,i,l);break;case 3:case 4:var o=r.stateNode.containerInfo,a=Da(e);Mi(e,a,o);break;default:throw Error(y(161))}}catch(s){W(e,e.return,s)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function md(e,t,n){S=e,Vu(e)}function Vu(e,t,n){for(var r=(e.mode&1)!==0;S!==null;){var l=S,i=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||hr;if(!o){var a=l.alternate,s=a!==null&&a.memoizedState!==null||le;a=hr;var f=le;if(hr=o,(le=s)&&!f)for(S=l;S!==null;)o=S,s=o.child,o.tag===22&&o.memoizedState!==null?Ua(l):s!==null?(s.return=o,S=s):Ua(l);for(;i!==null;)S=i,Vu(i),i=i.sibling;S=l,hr=a,le=f}Ia(e)}else l.subtreeFlags&8772&&i!==null?(i.return=l,S=i):Ia(e)}}function Ia(e){for(;S!==null;){var t=S;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:le||ul(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!le)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Pe(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&wa(t,i,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}wa(t,o,n)}break;case 5:var a=t.stateNode;if(n===null&&t.flags&4){n=a;var s=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":s.autoFocus&&n.focus();break;case"img":s.src&&(n.src=s.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var f=t.alternate;if(f!==null){var g=f.memoizedState;if(g!==null){var h=g.dehydrated;h!==null&&In(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(y(163))}le||t.flags&512&&Ri(t)}catch(m){W(t,t.return,m)}}if(t===e){S=null;break}if(n=t.sibling,n!==null){n.return=t.return,S=n;break}S=t.return}}function Fa(e){for(;S!==null;){var t=S;if(t===e){S=null;break}var n=t.sibling;if(n!==null){n.return=t.return,S=n;break}S=t.return}}function Ua(e){for(;S!==null;){var t=S;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ul(4,t)}catch(s){W(t,n,s)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(s){W(t,l,s)}}var i=t.return;try{Ri(t)}catch(s){W(t,i,s)}break;case 5:var o=t.return;try{Ri(t)}catch(s){W(t,o,s)}}}catch(s){W(t,t.return,s)}if(t===e){S=null;break}var a=t.sibling;if(a!==null){a.return=t.return,S=a;break}S=t.return}}var hd=Math.ceil,Gr=Ge.ReactCurrentDispatcher,No=Ge.ReactCurrentOwner,Ee=Ge.ReactCurrentBatchConfig,R=0,q=null,K=null,ee=0,he=0,Ht=mt(0),G=0,Kn=null,zt=0,cl=0,Eo=0,Pn=null,ce=null,Co=0,rn=1/0,Ae=null,Zr=!1,Oi=null,st=null,gr=!1,nt=null,Jr=0,Ln=0,Ii=null,_r=-1,zr=0;function ae(){return R&6?Q():_r!==-1?_r:_r=Q()}function ut(e){return e.mode&1?R&2&&ee!==0?ee&-ee:qf.transition!==null?(zr===0&&(zr=_s()),zr):(e=M,e!==0||(e=window.event,e=e===void 0?16:Ds(e.type)),e):1}function Me(e,t,n,r){if(50<Ln)throw Ln=0,Ii=null,Error(y(185));Gn(e,n,r),(!(R&2)||e!==q)&&(e===q&&(!(R&2)&&(cl|=n),G===4&&et(e,ee)),me(e,r),n===1&&R===0&&!(t.mode&1)&&(rn=Q()+500,ol&&ht()))}function me(e,t){var n=e.callbackNode;Jc(e,t);var r=Dr(e,e===q?ee:0);if(r===0)n!==null&&Ko(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Ko(n),t===1)e.tag===0?Jf($a.bind(null,e)):bs($a.bind(null,e)),Kf(function(){!(R&6)&&ht()}),n=null;else{switch(zs(r)){case 1:n=Zi;break;case 4:n=Cs;break;case 16:n=Mr;break;case 536870912:n=js;break;default:n=Mr}n=Ju(n,Hu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Hu(e,t){if(_r=-1,zr=0,R&6)throw Error(y(327));var n=e.callbackNode;if(Zt()&&e.callbackNode!==n)return null;var r=Dr(e,e===q?ee:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=qr(e,r);else{t=r;var l=R;R|=2;var i=Yu();(q!==e||ee!==t)&&(Ae=null,rn=Q()+500,Nt(e,t));do try{yd();break}catch(a){Qu(e,a)}while(!0);uo(),Gr.current=i,R=l,K!==null?t=0:(q=null,ee=0,t=G)}if(t!==0){if(t===2&&(l=ui(e),l!==0&&(r=l,t=Fi(e,l))),t===1)throw n=Kn,Nt(e,0),et(e,r),me(e,Q()),n;if(t===6)et(e,r);else{if(l=e.current.alternate,!(r&30)&&!gd(l)&&(t=qr(e,r),t===2&&(i=ui(e),i!==0&&(r=i,t=Fi(e,i))),t===1))throw n=Kn,Nt(e,0),et(e,r),me(e,Q()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(y(345));case 2:xt(e,ce,Ae);break;case 3:if(et(e,r),(r&130023424)===r&&(t=Co+500-Q(),10<t)){if(Dr(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){ae(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=vi(xt.bind(null,e,ce,Ae),t);break}xt(e,ce,Ae);break;case 4:if(et(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-Re(r);i=1<<o,o=t[o],o>l&&(l=o),r&=~i}if(r=l,r=Q()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*hd(r/1960))-r,10<r){e.timeoutHandle=vi(xt.bind(null,e,ce,Ae),r);break}xt(e,ce,Ae);break;case 5:xt(e,ce,Ae);break;default:throw Error(y(329))}}}return me(e,Q()),e.callbackNode===n?Hu.bind(null,e):null}function Fi(e,t){var n=Pn;return e.current.memoizedState.isDehydrated&&(Nt(e,t).flags|=256),e=qr(e,t),e!==2&&(t=ce,ce=n,t!==null&&Ui(t)),e}function Ui(e){ce===null?ce=e:ce.push.apply(ce,e)}function gd(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!De(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function et(e,t){for(t&=~Eo,t&=~cl,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Re(t),r=1<<n;e[n]=-1,t&=~r}}function $a(e){if(R&6)throw Error(y(327));Zt();var t=Dr(e,0);if(!(t&1))return me(e,Q()),null;var n=qr(e,t);if(e.tag!==0&&n===2){var r=ui(e);r!==0&&(t=r,n=Fi(e,r))}if(n===1)throw n=Kn,Nt(e,0),et(e,t),me(e,Q()),n;if(n===6)throw Error(y(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,xt(e,ce,Ae),me(e,Q()),null}function jo(e,t){var n=R;R|=1;try{return e(t)}finally{R=n,R===0&&(rn=Q()+500,ol&&ht())}}function Pt(e){nt!==null&&nt.tag===0&&!(R&6)&&Zt();var t=R;R|=1;var n=Ee.transition,r=M;try{if(Ee.transition=null,M=1,e)return e()}finally{M=r,Ee.transition=n,R=t,!(R&6)&&ht()}}function _o(){he=Ht.current,I(Ht)}function Nt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Yf(n)),K!==null)for(n=K.return;n!==null;){var r=n;switch(oo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&$r();break;case 3:tn(),I(de),I(ie),go();break;case 5:ho(r);break;case 4:tn();break;case 13:I($);break;case 19:I($);break;case 10:co(r.type._context);break;case 22:case 23:_o()}n=n.return}if(q=e,K=e=ct(e.current,null),ee=he=t,G=0,Kn=null,Eo=cl=zt=0,ce=Pn=null,kt!==null){for(t=0;t<kt.length;t++)if(n=kt[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=l,r.next=o}n.pending=r}kt=null}return e}function Qu(e,t){do{var n=K;try{if(uo(),Er.current=Xr,Kr){for(var r=A.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Kr=!1}if(_t=0,J=X=A=null,_n=!1,Hn=0,No.current=null,n===null||n.return===null){G=1,Kn=t,K=null;break}e:{var i=e,o=n.return,a=n,s=t;if(t=ee,a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){var f=s,g=a,h=g.tag;if(!(g.mode&1)&&(h===0||h===11||h===15)){var m=g.alternate;m?(g.updateQueue=m.updateQueue,g.memoizedState=m.memoizedState,g.lanes=m.lanes):(g.updateQueue=null,g.memoizedState=null)}var x=ja(o);if(x!==null){x.flags&=-257,_a(x,o,a,i,t),x.mode&1&&Ca(i,f,t),t=x,s=f;var w=t.updateQueue;if(w===null){var k=new Set;k.add(s),t.updateQueue=k}else w.add(s);break e}else{if(!(t&1)){Ca(i,f,t),zo();break e}s=Error(y(426))}}else if(U&&a.mode&1){var F=ja(o);if(F!==null){!(F.flags&65536)&&(F.flags|=256),_a(F,o,a,i,t),ao(nn(s,a));break e}}i=s=nn(s,a),G!==4&&(G=2),Pn===null?Pn=[i]:Pn.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var d=zu(i,s,t);xa(i,d);break e;case 1:a=s;var u=i.type,p=i.stateNode;if(!(i.flags&128)&&(typeof u.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(st===null||!st.has(p)))){i.flags|=65536,t&=-t,i.lanes|=t;var v=Pu(i,a,t);xa(i,v);break e}}i=i.return}while(i!==null)}Xu(n)}catch(N){t=N,K===n&&n!==null&&(K=n=n.return);continue}break}while(!0)}function Yu(){var e=Gr.current;return Gr.current=Xr,e===null?Xr:e}function zo(){(G===0||G===3||G===2)&&(G=4),q===null||!(zt&268435455)&&!(cl&268435455)||et(q,ee)}function qr(e,t){var n=R;R|=2;var r=Yu();(q!==e||ee!==t)&&(Ae=null,Nt(e,t));do try{vd();break}catch(l){Qu(e,l)}while(!0);if(uo(),R=n,Gr.current=r,K!==null)throw Error(y(261));return q=null,ee=0,G}function vd(){for(;K!==null;)Ku(K)}function yd(){for(;K!==null&&!Wc();)Ku(K)}function Ku(e){var t=Zu(e.alternate,e,he);e.memoizedProps=e.pendingProps,t===null?Xu(e):K=t,No.current=null}function Xu(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=fd(n,t),n!==null){n.flags&=32767,K=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{G=6,K=null;return}}else if(n=cd(n,t,he),n!==null){K=n;return}if(t=t.sibling,t!==null){K=t;return}K=t=e}while(t!==null);G===0&&(G=5)}function xt(e,t,n){var r=M,l=Ee.transition;try{Ee.transition=null,M=1,xd(e,t,n,r)}finally{Ee.transition=l,M=r}return null}function xd(e,t,n,r){do Zt();while(nt!==null);if(R&6)throw Error(y(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(y(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(qc(e,i),e===q&&(K=q=null,ee=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||gr||(gr=!0,Ju(Mr,function(){return Zt(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=Ee.transition,Ee.transition=null;var o=M;M=1;var a=R;R|=4,No.current=null,pd(e,n),Wu(n,e),$f(hi),Or=!!mi,hi=mi=null,e.current=n,md(n),Vc(),R=a,M=o,Ee.transition=i}else e.current=n;if(gr&&(gr=!1,nt=e,Jr=l),i=e.pendingLanes,i===0&&(st=null),Yc(n.stateNode),me(e,Q()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Zr)throw Zr=!1,e=Oi,Oi=null,e;return Jr&1&&e.tag!==0&&Zt(),i=e.pendingLanes,i&1?e===Ii?Ln++:(Ln=0,Ii=e):Ln=0,ht(),null}function Zt(){if(nt!==null){var e=zs(Jr),t=Ee.transition,n=M;try{if(Ee.transition=null,M=16>e?16:e,nt===null)var r=!1;else{if(e=nt,nt=null,Jr=0,R&6)throw Error(y(331));var l=R;for(R|=4,S=e.current;S!==null;){var i=S,o=i.child;if(S.flags&16){var a=i.deletions;if(a!==null){for(var s=0;s<a.length;s++){var f=a[s];for(S=f;S!==null;){var g=S;switch(g.tag){case 0:case 11:case 15:zn(8,g,i)}var h=g.child;if(h!==null)h.return=g,S=h;else for(;S!==null;){g=S;var m=g.sibling,x=g.return;if($u(g),g===f){S=null;break}if(m!==null){m.return=x,S=m;break}S=x}}}var w=i.alternate;if(w!==null){var k=w.child;if(k!==null){w.child=null;do{var F=k.sibling;k.sibling=null,k=F}while(k!==null)}}S=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,S=o;else e:for(;S!==null;){if(i=S,i.flags&2048)switch(i.tag){case 0:case 11:case 15:zn(9,i,i.return)}var d=i.sibling;if(d!==null){d.return=i.return,S=d;break e}S=i.return}}var u=e.current;for(S=u;S!==null;){o=S;var p=o.child;if(o.subtreeFlags&2064&&p!==null)p.return=o,S=p;else e:for(o=u;S!==null;){if(a=S,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:ul(9,a)}}catch(N){W(a,a.return,N)}if(a===o){S=null;break e}var v=a.sibling;if(v!==null){v.return=a.return,S=v;break e}S=a.return}}if(R=l,ht(),Ue&&typeof Ue.onPostCommitFiberRoot=="function")try{Ue.onPostCommitFiberRoot(tl,e)}catch{}r=!0}return r}finally{M=n,Ee.transition=t}}return!1}function Aa(e,t,n){t=nn(n,t),t=zu(e,t,1),e=at(e,t,1),t=ae(),e!==null&&(Gn(e,1,t),me(e,t))}function W(e,t,n){if(e.tag===3)Aa(e,e,n);else for(;t!==null;){if(t.tag===3){Aa(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(st===null||!st.has(r))){e=nn(n,e),e=Pu(t,e,1),t=at(t,e,1),e=ae(),t!==null&&(Gn(t,1,e),me(t,e));break}}t=t.return}}function wd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ae(),e.pingedLanes|=e.suspendedLanes&n,q===e&&(ee&n)===n&&(G===4||G===3&&(ee&130023424)===ee&&500>Q()-Co?Nt(e,0):Eo|=n),me(e,t)}function Gu(e,t){t===0&&(e.mode&1?(t=or,or<<=1,!(or&130023424)&&(or=4194304)):t=1);var n=ae();e=Ke(e,t),e!==null&&(Gn(e,t,n),me(e,n))}function kd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Gu(e,n)}function Sd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(y(314))}r!==null&&r.delete(t),Gu(e,n)}var Zu;Zu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||de.current)fe=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return fe=!1,ud(e,t,n);fe=!!(e.flags&131072)}else fe=!1,U&&t.flags&1048576&&eu(t,Wr,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;jr(e,t),e=t.pendingProps;var l=qt(t,ie.current);Gt(t,n),l=yo(null,t,r,e,l,n);var i=xo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,pe(r)?(i=!0,Ar(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,po(t),l.updater=sl,t.stateNode=l,l._reactInternals=t,Ei(t,r,e,n),t=_i(null,t,r,!0,i,n)):(t.tag=0,U&&i&&io(t),oe(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(jr(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Ed(r),e=Pe(r,e),l){case 0:t=ji(null,t,r,e,n);break e;case 1:t=La(null,t,r,e,n);break e;case 11:t=za(null,t,r,e,n);break e;case 14:t=Pa(null,t,r,Pe(r.type,e),n);break e}throw Error(y(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pe(r,l),ji(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pe(r,l),La(e,t,r,l,n);case 3:e:{if(Mu(t),e===null)throw Error(y(387));r=t.pendingProps,i=t.memoizedState,l=i.element,ou(e,t),Qr(t,r,null,n);var o=t.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=nn(Error(y(423)),t),t=Ta(e,t,r,n,l);break e}else if(r!==l){l=nn(Error(y(424)),t),t=Ta(e,t,r,n,l);break e}else for(ge=ot(t.stateNode.containerInfo.firstChild),ve=t,U=!0,Te=null,n=lu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(bt(),r===l){t=Xe(e,t,n);break e}oe(e,t,r,n)}t=t.child}return t;case 5:return au(t),e===null&&ki(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,o=l.children,gi(r,l)?o=null:i!==null&&gi(r,i)&&(t.flags|=32),Ru(e,t),oe(e,t,o,n),t.child;case 6:return e===null&&ki(t),null;case 13:return Du(e,t,n);case 4:return mo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=en(t,null,r,n):oe(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pe(r,l),za(e,t,r,l,n);case 7:return oe(e,t,t.pendingProps,n),t.child;case 8:return oe(e,t,t.pendingProps.children,n),t.child;case 12:return oe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,o=l.value,D(Vr,r._currentValue),r._currentValue=o,i!==null)if(De(i.value,o)){if(i.children===l.children&&!de.current){t=Xe(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var a=i.dependencies;if(a!==null){o=i.child;for(var s=a.firstContext;s!==null;){if(s.context===r){if(i.tag===1){s=He(-1,n&-n),s.tag=2;var f=i.updateQueue;if(f!==null){f=f.shared;var g=f.pending;g===null?s.next=s:(s.next=g.next,g.next=s),f.pending=s}}i.lanes|=n,s=i.alternate,s!==null&&(s.lanes|=n),Si(i.return,n,t),a.lanes|=n;break}s=s.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(y(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Si(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}oe(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Gt(t,n),l=Ce(l),r=r(l),t.flags|=1,oe(e,t,r,n),t.child;case 14:return r=t.type,l=Pe(r,t.pendingProps),l=Pe(r.type,l),Pa(e,t,r,l,n);case 15:return Lu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pe(r,l),jr(e,t),t.tag=1,pe(r)?(e=!0,Ar(t)):e=!1,Gt(t,n),_u(t,r,l),Ei(t,r,l,n),_i(null,t,r,!0,e,n);case 19:return Ou(e,t,n);case 22:return Tu(e,t,n)}throw Error(y(156,t.tag))};function Ju(e,t){return Es(e,t)}function Nd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ne(e,t,n,r){return new Nd(e,t,n,r)}function Po(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ed(e){if(typeof e=="function")return Po(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ki)return 11;if(e===Xi)return 14}return 2}function ct(e,t){var n=e.alternate;return n===null?(n=Ne(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Pr(e,t,n,r,l,i){var o=2;if(r=e,typeof e=="function")Po(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case Dt:return Et(n.children,l,i,t);case Yi:o=8,l|=8;break;case Xl:return e=Ne(12,n,t,l|2),e.elementType=Xl,e.lanes=i,e;case Gl:return e=Ne(13,n,t,l),e.elementType=Gl,e.lanes=i,e;case Zl:return e=Ne(19,n,t,l),e.elementType=Zl,e.lanes=i,e;case as:return fl(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case is:o=10;break e;case os:o=9;break e;case Ki:o=11;break e;case Xi:o=14;break e;case Je:o=16,r=null;break e}throw Error(y(130,e==null?e:typeof e,""))}return t=Ne(o,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function Et(e,t,n,r){return e=Ne(7,e,r,t),e.lanes=n,e}function fl(e,t,n,r){return e=Ne(22,e,r,t),e.elementType=as,e.lanes=n,e.stateNode={isHidden:!1},e}function Vl(e,t,n){return e=Ne(6,e,null,t),e.lanes=n,e}function Hl(e,t,n){return t=Ne(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Cd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=El(0),this.expirationTimes=El(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=El(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Lo(e,t,n,r,l,i,o,a,s){return e=new Cd(e,t,n,a,s),t===1?(t=1,i===!0&&(t|=8)):t=0,i=Ne(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},po(i),e}function jd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Mt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function qu(e){if(!e)return dt;e=e._reactInternals;e:{if(Tt(e)!==e||e.tag!==1)throw Error(y(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(pe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(y(171))}if(e.tag===1){var n=e.type;if(pe(n))return qs(e,n,t)}return t}function bu(e,t,n,r,l,i,o,a,s){return e=Lo(n,r,!0,e,l,i,o,a,s),e.context=qu(null),n=e.current,r=ae(),l=ut(n),i=He(r,l),i.callback=t??null,at(n,i,l),e.current.lanes=l,Gn(e,l,r),me(e,r),e}function dl(e,t,n,r){var l=t.current,i=ae(),o=ut(l);return n=qu(n),t.context===null?t.context=n:t.pendingContext=n,t=He(i,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=at(l,t,o),e!==null&&(Me(e,l,o,i),Nr(e,l,o)),o}function br(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ba(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function To(e,t){Ba(e,t),(e=e.alternate)&&Ba(e,t)}function _d(){return null}var ec=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ro(e){this._internalRoot=e}pl.prototype.render=Ro.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(y(409));dl(e,t,null,null)};pl.prototype.unmount=Ro.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Pt(function(){dl(null,e,null,null)}),t[Ye]=null}};function pl(e){this._internalRoot=e}pl.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ts();e={blockedOn:null,target:e,priority:t};for(var n=0;n<be.length&&t!==0&&t<be[n].priority;n++);be.splice(n,0,e),n===0&&Ms(e)}};function Mo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function ml(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Wa(){}function zd(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var f=br(o);i.call(f)}}var o=bu(t,r,e,0,null,!1,!1,"",Wa);return e._reactRootContainer=o,e[Ye]=o.current,$n(e.nodeType===8?e.parentNode:e),Pt(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var a=r;r=function(){var f=br(s);a.call(f)}}var s=Lo(e,0,!1,null,null,!1,!1,"",Wa);return e._reactRootContainer=s,e[Ye]=s.current,$n(e.nodeType===8?e.parentNode:e),Pt(function(){dl(t,s,n,r)}),s}function hl(e,t,n,r,l){var i=n._reactRootContainer;if(i){var o=i;if(typeof l=="function"){var a=l;l=function(){var s=br(o);a.call(s)}}dl(t,o,e,l)}else o=zd(n,t,e,l,r);return br(o)}Ps=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=wn(t.pendingLanes);n!==0&&(Ji(t,n|1),me(t,Q()),!(R&6)&&(rn=Q()+500,ht()))}break;case 13:Pt(function(){var r=Ke(e,1);if(r!==null){var l=ae();Me(r,e,1,l)}}),To(e,1)}};qi=function(e){if(e.tag===13){var t=Ke(e,134217728);if(t!==null){var n=ae();Me(t,e,134217728,n)}To(e,134217728)}};Ls=function(e){if(e.tag===13){var t=ut(e),n=Ke(e,t);if(n!==null){var r=ae();Me(n,e,t,r)}To(e,t)}};Ts=function(){return M};Rs=function(e,t){var n=M;try{return M=e,t()}finally{M=n}};oi=function(e,t,n){switch(t){case"input":if(bl(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=il(r);if(!l)throw Error(y(90));us(r),bl(r,l)}}}break;case"textarea":fs(e,n);break;case"select":t=n.value,t!=null&&Qt(e,!!n.multiple,t,!1)}};ys=jo;xs=Pt;var Pd={usingClientEntryPoint:!1,Events:[Jn,Ut,il,gs,vs,jo]},vn={findFiberByHostInstance:wt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Ld={bundleType:vn.bundleType,version:vn.version,rendererPackageName:vn.rendererPackageName,rendererConfig:vn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ge.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ss(e),e===null?null:e.stateNode},findFiberByHostInstance:vn.findFiberByHostInstance||_d,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var vr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vr.isDisabled&&vr.supportsFiber)try{tl=vr.inject(Ld),Ue=vr}catch{}}xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Pd;xe.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Mo(t))throw Error(y(200));return jd(e,t,null,n)};xe.createRoot=function(e,t){if(!Mo(e))throw Error(y(299));var n=!1,r="",l=ec;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Lo(e,1,!1,null,null,n,!1,r,l),e[Ye]=t.current,$n(e.nodeType===8?e.parentNode:e),new Ro(t)};xe.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(y(188)):(e=Object.keys(e).join(","),Error(y(268,e)));return e=Ss(t),e=e===null?null:e.stateNode,e};xe.flushSync=function(e){return Pt(e)};xe.hydrate=function(e,t,n){if(!ml(t))throw Error(y(200));return hl(null,e,t,!0,n)};xe.hydrateRoot=function(e,t,n){if(!Mo(e))throw Error(y(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",o=ec;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=bu(t,null,e,1,n??null,l,!1,i,o),e[Ye]=t.current,$n(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new pl(t)};xe.render=function(e,t,n){if(!ml(t))throw Error(y(200));return hl(null,e,t,!1,n)};xe.unmountComponentAtNode=function(e){if(!ml(e))throw Error(y(40));return e._reactRootContainer?(Pt(function(){hl(null,null,e,!1,function(){e._reactRootContainer=null,e[Ye]=null})}),!0):!1};xe.unstable_batchedUpdates=jo;xe.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!ml(n))throw Error(y(200));if(e==null||e._reactInternals===void 0)throw Error(y(38));return hl(e,t,n,!1,r)};xe.version="18.3.1-next-f1338f8080-20240426";function tc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(tc)}catch(e){console.error(e)}}tc(),ts.exports=xe;var Td=ts.exports,Va=Td;Yl.createRoot=Va.createRoot,Yl.hydrateRoot=Va.hydrateRoot;function Rd(){const[e,t]=Y.useState(!1),[n,r]=Y.useState(!1);return Y.useEffect(()=>{const l=()=>{t(window.scrollY>50)};return window.addEventListener("scroll",l),()=>window.removeEventListener("scroll",l)},[]),c.jsxs("header",{className:`header ${e?"scrolled":""}`,children:[c.jsxs("div",{className:"container header-content",children:[c.jsxs("a",{href:"/",className:"logo",children:[c.jsx("span",{className:"logo-icon",children:"✦"}),c.jsx("span",{className:"logo-text",children:"Narrative"})]}),c.jsxs("nav",{className:`nav-links ${n?"open":""}`,children:[c.jsx("a",{href:"#",className:"nav-link active",children:"Home"}),c.jsx("a",{href:"#",className:"nav-link",children:"Articles"}),c.jsx("a",{href:"#",className:"nav-link",children:"Categories"}),c.jsx("a",{href:"#",className:"nav-link",children:"About"}),c.jsx("a",{href:"#",className:"nav-link",children:"Contact"})]}),c.jsxs("div",{className:"header-actions",children:[c.jsx("button",{className:"search-btn","aria-label":"Search",children:c.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("circle",{cx:"11",cy:"11",r:"8"}),c.jsx("path",{d:"m21 21-4.3-4.3"})]})}),c.jsx("button",{className:"subscribe-btn",children:"Subscribe"}),c.jsxs("button",{className:`menu-toggle ${n?"open":""}`,onClick:()=>r(!n),"aria-label":"Toggle menu",children:[c.jsx("span",{}),c.jsx("span",{}),c.jsx("span",{})]})]})]}),n&&c.jsx("div",{className:"mobile-menu",onClick:()=>r(!1),children:c.jsxs("div",{className:"mobile-menu-content",onClick:l=>l.stopPropagation(),children:[c.jsx("a",{href:"#",className:"mobile-link active",children:"Home"}),c.jsx("a",{href:"#",className:"mobile-link",children:"Articles"}),c.jsx("a",{href:"#",className:"mobile-link",children:"Categories"}),c.jsx("a",{href:"#",className:"mobile-link",children:"About"}),c.jsx("a",{href:"#",className:"mobile-link",children:"Contact"}),c.jsx("button",{className:"mobile-subscribe",children:"Subscribe"})]})}),c.jsx("style",{children:`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 20px 0;
          transition: all var(--transition);
        }

        .header.scrolled {
          background: rgba(23, 23, 23, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          text-decoration: none;
        }

        .logo-icon {
          font-size: 28px;
          color: var(--primary);
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .logo-text {
          background: linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 500;
          transition: color var(--transition);
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width var(--transition);
          border-radius: 1px;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--text);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-btn {
          color: var(--text-secondary);
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: all var(--transition);
        }

        .search-btn:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.05);
        }

        .subscribe-btn {
          padding: 10px 24px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          transition: all var(--transition);
          box-shadow: 0 4px 15px rgba(224, 54, 2, 0.3);
        }

        .subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(224, 54, 2, 0.4);
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          cursor: pointer;
        }

        .menu-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all var(--transition);
        }

        .menu-toggle.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle.open span:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .mobile-menu-content {
          position: absolute;
          top: 80px;
          right: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 240px;
          animation: slideIn 0.3s ease;
        }

        .mobile-link {
          color: var(--text-secondary);
          font-size: 16px;
          font-weight: 500;
          padding: 8px 0;
          transition: color var(--transition);
        }

        .mobile-link:hover,
        .mobile-link.active {
          color: var(--text);
        }

        .mobile-subscribe {
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          margin-top: 8px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .subscribe-btn {
            display: none;
          }

          .menu-toggle {
            display: flex;
          }
        }
      `})]})}function Md({post:e,featuredRef:t}){const n=Y.useRef(null);return Y.useEffect(()=>{const r=new IntersectionObserver(([l])=>{l.isIntersecting&&l.target.classList.add("visible")},{threshold:.1});return n.current&&r.observe(n.current),()=>r.disconnect()},[]),c.jsxs("section",{className:"featured-section",ref:t,children:[c.jsxs("div",{className:"container",children:[c.jsxs("div",{className:"featured-label",children:[c.jsx("span",{className:"featured-dot"}),"Featured Story"]}),c.jsxs("article",{className:"featured-post",ref:n,children:[c.jsxs("div",{className:"featured-image-wrapper",children:[c.jsx("div",{className:"featured-image-overlay"}),c.jsx("img",{src:e.image,alt:e.title,className:"featured-image",loading:"eager"}),c.jsx("div",{className:"featured-gradient"})]}),c.jsxs("div",{className:"featured-content",children:[c.jsxs("div",{className:"featured-meta",children:[c.jsx("span",{className:"featured-category",children:e.category}),c.jsx("span",{className:"featured-date",children:e.date}),c.jsx("span",{className:"featured-read",children:e.readTime})]}),c.jsx("h1",{className:"featured-title",children:e.title}),c.jsx("p",{className:"featured-excerpt",children:e.excerpt}),c.jsxs("div",{className:"featured-author",children:[c.jsx("img",{src:e.author.avatar,alt:e.author.name,className:"author-avatar"}),c.jsxs("div",{className:"author-info",children:[c.jsx("span",{className:"author-name",children:e.author.name}),c.jsx("span",{className:"author-role",children:e.author.role})]})]}),c.jsxs("div",{className:"featured-actions",children:[c.jsxs("button",{className:"read-btn",children:["Read Article",c.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("path",{d:"M5 12h14"}),c.jsx("path",{d:"m12 5 7 7-7 7"})]})]}),c.jsx("div",{className:"featured-tags",children:e.tags.map(r=>c.jsx("span",{className:"tag",children:r},r))})]})]})]})]}),c.jsx("style",{children:`
        .featured-section {
          padding: 140px 0 80px;
          position: relative;
          overflow: hidden;
        }

        .featured-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(224, 54, 2, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .featured-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary);
          margin-bottom: 24px;
        }

        .featured-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .featured-post {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .featured-post.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .featured-image-wrapper {
          position: relative;
          border-radius: var(--radius);
          overflow: hidden;
          aspect-ratio: 4/3;
        }

        .featured-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .featured-post:hover .featured-image {
          transform: scale(1.05);
        }

        .featured-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(224, 54, 2, 0.1), transparent);
          z-index: 1;
        }

        .featured-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(23, 23, 23, 0.8), transparent);
          z-index: 1;
        }

        .featured-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .featured-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .featured-category {
          padding: 4px 12px;
          background: rgba(224, 54, 2, 0.1);
          color: var(--primary);
          border-radius: 50px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .featured-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          line-height: 1.2;
          color: var(--text);
        }

        .featured-excerpt {
          font-size: 16px;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .featured-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
        }

        .author-role {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .featured-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .read-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          transition: all var(--transition);
          box-shadow: 0 4px 15px rgba(224, 54, 2, 0.3);
        }

        .read-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(224, 54, 2, 0.4);
        }

        .read-btn svg {
          transition: transform var(--transition);
        }

        .read-btn:hover svg {
          transform: translateX(4px);
        }

        .featured-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 50px;
          font-size: 12px;
          color: var(--text-secondary);
          transition: all var(--transition);
        }

        .tag:hover {
          background: rgba(224, 54, 2, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        @media (max-width: 968px) {
          .featured-post {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .featured-title {
            font-size: 32px;
          }

          .featured-image-wrapper {
            aspect-ratio: 16/9;
          }
        }

        @media (max-width: 768px) {
          .featured-section {
            padding: 120px 0 60px;
          }

          .featured-title {
            font-size: 28px;
          }
        }
      `})]})}function Dd({post:e,index:t}){const n=Y.useRef(null),[r,l]=Y.useState(!1);return Y.useEffect(()=>{const i=new IntersectionObserver(([o])=>{o.isIntersecting&&(l(!0),i.disconnect())},{threshold:.1});return n.current&&i.observe(n.current),()=>i.disconnect()},[]),c.jsxs("article",{ref:n,className:`blog-card ${r?"visible":""}`,style:{transitionDelay:`${t*100}ms`},children:[c.jsxs("div",{className:"card-image-wrapper",children:[c.jsx("img",{src:e.image,alt:e.title,className:"card-image",loading:"lazy"}),c.jsx("div",{className:"card-image-overlay",children:c.jsxs("button",{className:"card-read-btn",children:["Read More",c.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("path",{d:"M5 12h14"}),c.jsx("path",{d:"m12 5 7 7-7 7"})]})]})}),c.jsx("span",{className:"card-category",children:e.category})]}),c.jsxs("div",{className:"card-content",children:[c.jsxs("div",{className:"card-meta",children:[c.jsx("span",{children:e.date}),c.jsx("span",{children:"·"}),c.jsx("span",{children:e.readTime})]}),c.jsx("h3",{className:"card-title",children:e.title}),c.jsx("p",{className:"card-excerpt",children:e.excerpt}),c.jsxs("div",{className:"card-footer",children:[c.jsxs("div",{className:"card-author",children:[c.jsx("img",{src:e.author.avatar,alt:e.author.name,className:"card-avatar"}),c.jsx("span",{className:"card-author-name",children:e.author.name})]}),c.jsx("div",{className:"card-tags",children:e.tags.slice(0,2).map(i=>c.jsx("span",{className:"card-tag",children:i},i))})]})]})]})}function Od({posts:e}){return e.length===0?c.jsxs("div",{className:"empty-state",children:[c.jsx("div",{className:"empty-icon",children:"📭"}),c.jsx("h3",{className:"empty-title",children:"No articles found"}),c.jsx("p",{className:"empty-text",children:"Try selecting a different category to discover more stories."})]}):c.jsxs("div",{className:"blog-grid",children:[e.map((t,n)=>c.jsx(Dd,{post:t,index:n},t.id)),c.jsx("style",{children:`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .blog-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: all var(--transition);
          opacity: 0;
          transform: translateY(20px);
        }

        .blog-card.visible {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-card:hover {
          transform: translateY(-4px);
          border-color: rgba(224, 54, 2, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .card-image-wrapper {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .blog-card:hover .card-image {
          transform: scale(1.08);
        }

        .card-image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition);
        }

        .blog-card:hover .card-image-overlay {
          opacity: 1;
        }

        .card-read-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: white;
          color: var(--background);
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          transform: translateY(10px);
          transition: all var(--transition);
        }

        .blog-card:hover .card-read-btn {
          transform: translateY(0);
        }

        .card-read-btn:hover {
          background: var(--primary);
          color: white;
        }

        .card-category {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 14px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          color: white;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          z-index: 2;
        }

        .card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-excerpt {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .card-author {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .card-author-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }

        .card-tags {
          display: flex;
          gap: 6px;
        }

        .card-tag {
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .empty-text {
          color: var(--text-secondary);
          font-size: 16px;
        }

        .load-more-wrapper {
          display: flex;
          justify-content: center;
          padding: 48px 0;
        }

        .load-more-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 40px;
          background: transparent;
          border: 2px solid var(--border);
          color: var(--text);
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          transition: all var(--transition);
        }

        .load-more-btn:hover {
          border-color: var(--primary);
          background: rgba(224, 54, 2, 0.1);
        }

        .load-more-btn.loading {
          border-color: var(--primary);
          background: rgba(224, 54, 2, 0.1);
          pointer-events: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .card-content {
            padding: 20px;
          }

          .card-title {
            font-size: 18px;
          }
        }
      `})]})}function Id(){const[e,t]=Y.useState(""),[n,r]=Y.useState("idle"),l=i=>{i.preventDefault(),e&&(r("loading"),setTimeout(()=>{r("success"),t(""),setTimeout(()=>r("idle"),3e3)},1500))};return c.jsxs("section",{className:"newsletter-section",children:[c.jsx("div",{className:"container",children:c.jsxs("div",{className:"newsletter-content",children:[c.jsx("div",{className:"newsletter-particles",children:[...Array(20)].map((i,o)=>c.jsx("div",{className:"particle",style:{left:`${Math.random()*100}%`,animationDelay:`${Math.random()*5}s`,animationDuration:`${3+Math.random()*4}s`}},o))}),c.jsxs("div",{className:"newsletter-text",children:[c.jsx("h2",{className:"newsletter-title",children:"Stay in the Loop"}),c.jsx("p",{className:"newsletter-subtitle",children:"Get the latest stories, insights, and exclusive content delivered straight to your inbox."})]}),c.jsxs("form",{className:"newsletter-form",onSubmit:l,children:[c.jsxs("div",{className:"input-wrapper",children:[c.jsxs("svg",{className:"input-icon",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("rect",{width:"20",height:"16",x:"2",y:"4",rx:"2"}),c.jsx("path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"})]}),c.jsx("input",{type:"email",placeholder:"Enter your email",value:e,onChange:i=>t(i.target.value),className:"newsletter-input",required:!0,disabled:n==="loading"})]}),c.jsx("button",{type:"submit",className:`newsletter-btn ${n}`,disabled:n==="loading"||n==="success",children:n==="loading"?c.jsx("span",{className:"btn-spinner"}):n==="success"?c.jsxs(c.Fragment,{children:[c.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:c.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Subscribed!"]}):"Subscribe"})]})]})}),c.jsx("style",{children:`
        .newsletter-section {
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }

        .newsletter-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(224, 54, 2, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .newsletter-content {
          position: relative;
          background: linear-gradient(135deg, rgba(224, 54, 2, 0.1), rgba(56, 189, 248, 0.05));
          border: 1px solid rgba(224, 54, 2, 0.2);
          border-radius: 24px;
          padding: 64px;
          text-align: center;
          overflow: hidden;
        }

        .newsletter-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          bottom: -10px;
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          opacity: 0.3;
          animation: float-up linear infinite;
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-400px) scale(0);
            opacity: 0;
          }
        }

        .newsletter-text {
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .newsletter-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--text), var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .newsletter-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .newsletter-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 50px;
          color: var(--text);
          font-size: 15px;
          font-family: inherit;
          transition: all var(--transition);
          outline: none;
        }

        .newsletter-input:focus {
          border-color: var(--primary);
          background: rgba(224, 54, 2, 0.05);
          box-shadow: 0 0 0 3px rgba(224, 54, 2, 0.1);
        }

        .newsletter-input::placeholder {
          color: var(--text-secondary);
        }

        .newsletter-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .newsletter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          transition: all var(--transition);
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(224, 54, 2, 0.3);
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(224, 54, 2, 0.4);
        }

        .newsletter-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
        }

        .newsletter-btn.success {
          background: linear-gradient(135deg, var(--success), #059669);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .newsletter-content {
            padding: 40px 24px;
          }

          .newsletter-title {
            font-size: 28px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-btn {
            justify-content: center;
          }
        }
      `})]})}function Fd(){const e=new Date().getFullYear();return c.jsxs("footer",{className:"footer",children:[c.jsxs("div",{className:"container",children:[c.jsxs("div",{className:"footer-grid",children:[c.jsxs("div",{className:"footer-brand",children:[c.jsxs("div",{className:"footer-logo",children:[c.jsx("span",{className:"footer-logo-icon",children:"✦"}),c.jsx("span",{children:"Narrative"})]}),c.jsx("p",{className:"footer-description",children:"A space for curious minds. We publish stories that inspire, educate, and spark meaningful conversations."}),c.jsxs("div",{className:"footer-social",children:[c.jsx("a",{href:"#",className:"social-link","aria-label":"Twitter",children:c.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:c.jsx("path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"})})}),c.jsx("a",{href:"#",className:"social-link","aria-label":"GitHub",children:c.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"}),c.jsx("path",{d:"M9 18c-4.51 2-5-2-7-2"})]})}),c.jsx("a",{href:"#",className:"social-link","aria-label":"LinkedIn",children:c.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}),c.jsx("rect",{width:"4",height:"12",x:"2",y:"9"}),c.jsx("circle",{cx:"4",cy:"4",r:"2"})]})})]})]}),c.jsxs("div",{className:"footer-links",children:[c.jsx("h4",{className:"footer-heading",children:"Navigation"}),c.jsx("a",{href:"#",className:"footer-link",children:"Home"}),c.jsx("a",{href:"#",className:"footer-link",children:"Articles"}),c.jsx("a",{href:"#",className:"footer-link",children:"Categories"}),c.jsx("a",{href:"#",className:"footer-link",children:"About Us"})]}),c.jsxs("div",{className:"footer-links",children:[c.jsx("h4",{className:"footer-heading",children:"Categories"}),c.jsx("a",{href:"#",className:"footer-link",children:"Technology"}),c.jsx("a",{href:"#",className:"footer-link",children:"Design"}),c.jsx("a",{href:"#",className:"footer-link",children:"Business"}),c.jsx("a",{href:"#",className:"footer-link",children:"Science"})]}),c.jsxs("div",{className:"footer-links",children:[c.jsx("h4",{className:"footer-heading",children:"Support"}),c.jsx("a",{href:"#",className:"footer-link",children:"Contact"}),c.jsx("a",{href:"#",className:"footer-link",children:"Privacy Policy"}),c.jsx("a",{href:"#",className:"footer-link",children:"Terms of Service"}),c.jsx("a",{href:"#",className:"footer-link",children:"FAQ"})]})]}),c.jsxs("div",{className:"footer-bottom",children:[c.jsxs("p",{children:["© ",e," Narrative. All rights reserved."]}),c.jsx("p",{children:"Made with passion for storytelling"})]})]}),c.jsx("style",{children:`
        .footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 80px 0 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .footer-logo-icon {
          font-size: 24px;
          color: var(--primary);
        }

        .footer-description {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 24px;
          max-width: 320px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 50%;
          color: var(--text-secondary);
          transition: all var(--transition);
        }

        .social-link:hover {
          background: rgba(224, 54, 2, 0.1);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }

        .footer-heading {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text);
          margin-bottom: 20px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          font-size: 14px;
          color: var(--text-secondary);
          transition: color var(--transition);
        }

        .footer-link:hover {
          color: var(--primary);
        }

        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .footer {
            padding: 60px 0 32px;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})}function Ud({categories:e,activeCategory:t,onCategoryChange:n}){const r=Y.useRef(null);return Y.useEffect(()=>{const l=r.current;if(!l)return;const i=o=>{o.deltaY!==0&&(o.preventDefault(),l.scrollLeft+=o.deltaY)};return l.addEventListener("wheel",i,{passive:!1}),()=>l.removeEventListener("wheel",i)},[]),c.jsxs("div",{className:"category-filter",children:[c.jsx("div",{className:"category-scroll",ref:r,children:e.map(l=>c.jsxs("button",{className:`category-btn ${t===l.id?"active":""}`,onClick:()=>n(l.id),children:[c.jsx("span",{className:"category-icon",children:l.icon}),c.jsx("span",{className:"category-label",children:l.label})]},l.id))}),c.jsx("style",{children:`
        .category-filter {
          margin-bottom: 40px;
          position: relative;
        }

        .category-filter::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 60px;
          background: linear-gradient(to right, transparent, var(--background));
          pointer-events: none;
          z-index: 2;
        }

        .category-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 0;
          scroll-behavior: smooth;
        }

        .category-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 50px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          transition: all var(--transition);
          cursor: pointer;
        }

        .category-btn:hover {
          background: rgba(224, 54, 2, 0.1);
          border-color: rgba(224, 54, 2, 0.3);
          color: var(--text);
        }

        .category-btn.active {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 15px rgba(224, 54, 2, 0.3);
        }

        .category-icon {
          font-size: 16px;
        }

        .category-label {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .category-filter {
            margin-bottom: 24px;
          }

          .category-btn {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `})]})}const $d=[{id:"all",label:"All Posts",icon:"📚"},{id:"technology",label:"Technology",icon:"💻"},{id:"design",label:"Design",icon:"🎨"},{id:"business",label:"Business",icon:"💼"},{id:"lifestyle",label:"Lifestyle",icon:"🌿"},{id:"science",label:"Science",icon:"🔬"}],Ql=[{id:1,title:"The Future of AI: How Machine Learning is Reshaping Our World",excerpt:"Explore the transformative power of artificial intelligence and how it's revolutionizing industries from healthcare to finance, creating unprecedented opportunities for innovation.",category:"technology",author:{name:"Sarah Chen",avatar:"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"AI Research Lead"},image:"https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 15, 2025",readTime:"8 min read",featured:!0,tags:["AI","Machine Learning","Technology"]},{id:2,title:"Designing for the Future: Minimalism Meets Functionality",excerpt:"Discover how modern design principles are evolving to create more intuitive, accessible, and beautiful digital experiences that put users first.",category:"design",author:{name:"Marcus Rivera",avatar:"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"UX Director"},image:"https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 14, 2025",readTime:"6 min read",tags:["Design","UX","Minimalism"]},{id:3,title:"Remote Work Revolution: Building Culture in a Distributed World",excerpt:"Learn how leading companies are reimagining workplace culture and collaboration in the age of remote and hybrid work environments.",category:"business",author:{name:"Emily Watson",avatar:"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"HR Innovation Lead"},image:"https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 13, 2025",readTime:"10 min read",tags:["Remote Work","Culture","Business"]},{id:4,title:"Sustainable Living: Small Changes, Big Impact",excerpt:"Practical tips and insights on how to embrace a more sustainable lifestyle without compromising on comfort or convenience.",category:"lifestyle",author:{name:"Luna Park",avatar:"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"Sustainability Expert"},image:"https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 12, 2025",readTime:"5 min read",tags:["Sustainability","Lifestyle","Environment"]},{id:5,title:"Quantum Computing: Breaking Down the Basics",excerpt:"A beginner-friendly guide to understanding quantum computing and its potential to solve problems that classical computers cannot.",category:"science",author:{name:"Dr. James Park",avatar:"https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"Quantum Physicist"},image:"https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 11, 2025",readTime:"12 min read",tags:["Quantum Computing","Science","Technology"]},{id:6,title:"The Art of Storytelling in Brand Building",excerpt:"How masterful storytelling can transform your brand from a simple business into a movement that resonates with audiences worldwide.",category:"business",author:{name:"Alex Thompson",avatar:"https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"Brand Strategist"},image:"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 10, 2025",readTime:"7 min read",tags:["Branding","Storytelling","Marketing"]},{id:7,title:"Web3 and the Decentralized Internet Revolution",excerpt:"Understanding the paradigm shift towards decentralized technologies and how Web3 is reshaping our digital interactions.",category:"technology",author:{name:"Sarah Chen",avatar:"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"AI Research Lead"},image:"https://images.pexels.com/photos/843891/pexels-photo-843891.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 9, 2025",readTime:"9 min read",tags:["Web3","Blockchain","Technology"]},{id:8,title:"Mindful Productivity: Doing More by Doing Less",excerpt:"Explore how mindfulness practices can dramatically improve your productivity and creativity while reducing stress and burnout.",category:"lifestyle",author:{name:"Luna Park",avatar:"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"Sustainability Expert"},image:"https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 8, 2025",readTime:"6 min read",tags:["Productivity","Mindfulness","Wellness"]},{id:9,title:"Color Theory in UI Design: A Comprehensive Guide",excerpt:"Master the art of color selection in digital design with practical principles that create emotional impact and improve usability.",category:"design",author:{name:"Marcus Rivera",avatar:"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"UX Director"},image:"https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 7, 2025",readTime:"8 min read",tags:["Design","UI","Color Theory"]},{id:10,title:"The Neuroscience of Learning: How Your Brain Absorbs Information",excerpt:"Dive into the fascinating world of neuroscience and discover evidence-based techniques to accelerate your learning.",category:"science",author:{name:"Dr. James Park",avatar:"https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",role:"Quantum Physicist"},image:"https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",date:"Mar 6, 2025",readTime:"11 min read",tags:["Neuroscience","Learning","Science"]}];function Ad(){const[e,t]=Y.useState("all"),[n,r]=Y.useState(6),[l,i]=Y.useState(!1),o=Y.useRef(null),a=e==="all"?Ql:Ql.filter(h=>h.category===e),s=a.slice(0,n),f=n<a.length,g=()=>{i(!0),setTimeout(()=>{r(h=>h+3),i(!1)},600)};return Y.useEffect(()=>{r(6)},[e]),c.jsxs("div",{className:"app",children:[c.jsx(Rd,{}),c.jsxs("main",{children:[c.jsx(Md,{post:Ql[0],featuredRef:o}),c.jsx("section",{className:"blog-section",children:c.jsxs("div",{className:"container",children:[c.jsxs("div",{className:"section-header",children:[c.jsx("h2",{className:"section-title",children:"Latest Articles"}),c.jsx("p",{className:"section-subtitle",children:"Discover stories, insights, and perspectives from our community of writers"})]}),c.jsx(Ud,{categories:$d,activeCategory:e,onCategoryChange:t}),c.jsx(Od,{posts:s}),f&&c.jsx("div",{className:"load-more-wrapper",children:c.jsx("button",{className:`load-more-btn ${l?"loading":""}`,onClick:g,disabled:l,children:l?c.jsxs(c.Fragment,{children:[c.jsx("span",{className:"spinner"}),"Loading..."]}):"Load More Articles"})})]})}),c.jsx(Id,{})]}),c.jsx(Fd,{})]})}Yl.createRoot(document.getElementById("root")).render(c.jsx(xc.StrictMode,{children:c.jsx(Ad,{})}));
