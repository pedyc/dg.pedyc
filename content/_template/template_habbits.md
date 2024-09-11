---
title: template_habbits
aliases: 
author: 
description: 
tags: 
date-created: 2024-08-13 22:25
date-modified: 2024-08-14 14:40
created_date: <% tp.file.creation_date() %>
modified_date: '<% tp.file.last_modified_date("dddd Do MMMM YYYY HH:mm:ss") %>'
---

<< [[<% tp.date.now("YYYY-MM-DD", -1) %>]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>]] >>

## <% tp.file.title %>

<% tp.web.daily_quote() %>
