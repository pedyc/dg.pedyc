---
title: 14-浅谈前端状态管理（上）@annote
alias: 14-浅谈前端状态管理（上）@annote
uid: 
author: 
description: 
date-created: 2024-07-31 01:36
date-modified: 2024-09-13 11:31
type: 
tags: [web]
---

<%
let colors = [ '#B4D9FB', '#ffeb3b', '#a2e9f2', '#a1e0ff', '#a8ea68', '#ffb7da' ],
    color = colors[ annote.color ];
let chls = [ 'srhl1', 'srhl2', 'srhl3', 'srhl4', 'srhl5', 'srhl6' ],
    chl = chls[ annote.color ];
let iframeURI = "http://localhost:7026/unread/"+unread.idx+"#id="+annote.id
let intURL = "http://localhost:7026/reading/"+unread.idx+"#id="+annote.id
if (unread.note && unread.title != unread.note) {
var filetitle = unread.note;
}
else {
var filetitle = unread.title;
}
let wikilinks = "[[SR" + unread.idx + "@" + filetitle + "|📄]]";
-%>
<% if (annote.note.startsWith("######")) { %>
<%
let note = annote.note.slice(7);
-%>

## <% if (note) { %><%- note %><% } else { %>{{an_text}}<% } %>

<% } else if (annote.note.startsWith("######")) { %>
<%
let note = annote.note.slice(6);
-%>

## <% if (note) { %><%- note %><% } else { %>{{an_text}}<% } %>

<% } else if (annote.note.startsWith("####")) { %>
<%
let note = annote.note.slice(5);
-%>

## <% if (note) { %><%- note %><% } else { %>{{an_text}}<% } %>

<% } else if (annote.note.startsWith("###")) { %>
<%
let note = annote.note.slice(4);
-%>

## <% if (note) { %><%- note %><% } else { %>{{an_text}}<% } %>

<% } else { %>

> [!<%= chl %>] <%- wikilinks %> <mark style="background-color: <%= color %>">Highlights</mark> [🧷](<<%= iframeURI %>>) [🌐](<<%= intURL %>>) {{#|an_tag| }}
{{{html_format|>|{{an_html}}}}}
<% if (annote.refs) { -%>
{{> - 🔗|an_refs}}
<% } -%>
<% if (annote.note) { -%>
<% if (annote.note.startsWith("todo:") == false && annote.note.startsWith("done:") == false) { -%>
>
> - 📝{{an_note}}
> ^sran-{{an_id}}
<% } else { -%>
<%
let note = annote.note.slice(6);
if (annote.note.startsWith("todo:")) {
  var taskStatus = " "; }
  else {
  var taskStatus = "x";
}
-%>
> ^sran-{{an_id}}

- [<%= taskStatus %>] <%- note %> #web ^srtask-{{an_id}}
<% } -%>
<% } else { -%>

> ^sran-{{an_id}}
<% } -%>
<% } -%>
