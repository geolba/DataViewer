/**
 * @license RequireJS i18n 2.0.4 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/i18n for details
 */

!function(){"use strict";function o(o,n,e,t,r,i){n[o]&&(e.push(o),!0!==n[o]&&1!==n[o]||t.push(r+o+"/"+i))}function n(o,n,e,t,r){var i=t+n+"/"+r;require._fileExists(o.toUrl(i+".js"))&&e.push(i)}function e(o,n,t){var r;for(r in n)!n.hasOwnProperty(r)||o.hasOwnProperty(r)&&!t?"object"==typeof n[r]&&(!o[r]&&n[r]&&(o[r]={}),e(o[r],n[r],t)):o[r]=n[r]}var t=/(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;define(["module"],function(r){var i=r.config?r.config():{};return{version:"2.0.4",load:function(r,a,l,u){u=u||{},u.locale&&(i.locale=u.locale);var f,c,s,g=t.exec(r),v=g[1],p=g[4],h=g[5],d=p.split("-"),y=[],w={},j="";if(g[5]?(v=g[1],f=v+h):(f=r,h=g[4],p=i.locale,p||(p=i.locale="undefined"==typeof navigator?"root":(navigator.language||navigator.userLanguage||"root").toLowerCase()),d=p.split("-")),u.isBuild){for(y.push(f),n(a,"root",y,v,h),c=0;c<d.length;c++)s=d[c],j+=(j?"-":"")+s,n(a,j,y,v,h);a(y,function(){l()})}else a([f],function(n){var t,r=[];for(o("root",n,r,y,v,h),c=0;c<d.length;c++)t=d[c],j+=(j?"-":"")+t,o(j,n,r,y,v,h);a(y,function(){var o,t,i;for(o=r.length-1;o>-1&&r[o];o--)i=r[o],t=n[i],!0!==t&&1!==t||(t=a(v+i+"/"+h)),e(w,t);l(w)})})}}})}();