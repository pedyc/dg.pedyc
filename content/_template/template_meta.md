> [!md] Metadata
> <%* if(tp.frontmatter.author){ %>
> :LiPen:作者信息：<% tp.frontmatter.author %>
> <%* } %>
> <%* if(tp.frontmatter.status){ %>
> :LiFlag:文档状态：<% tp.frontmatter.status %>
> <%* } %>
> :LiCalendarDays:创建日期：[[<% tp.file.creation_date("YYYY-MM-DD") %>]]
> <%* if(tp.frontmatter.backlinks){ %>
> :LiLink:反向链接：<% tp.frontmatter.backlinks %>
> <%* } %>
> <%* if(tp.frontmatter.tags){ %>
> :LiTags:标签列表：#<% tp.frontmatter.tags %>
> <%* } %>
> <%* if(tp.frontmatter.keywords){ %>
> :LiKeyRound::关键词列表：#<% tp.frontmatter.keywords %>
> <%* } %>
> <%* if(tp.frontmatter.description){ %>
> :LiBook:描述信息： #<% tp.frontmatter.description %>
> <%* } %>

