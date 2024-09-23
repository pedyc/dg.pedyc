> [!md] Metadata
> <%* if(tp.frontmatter.author){ %>
> 🙇‍♂作者信息：<% tp.frontmatter.author %>
> <%* } %>
> <%* if(tp.frontmatter.status){ %>
> 🌱文档状态：<% tp.frontmatter.status %>
> <%* } %>
> 📅创建日期：[[<% tp.file.creation_date("YYYY-MM-DD") %>]]
> <%* if(tp.frontmatter.backlinks){ %>
> 🔗反向链接：<% tp.frontmatter.backlinks %>
> <%* } %>
> <%* if(tp.frontmatter.tags){ %>
> 🖋标签列表：#<% tp.frontmatter.tags %>
> <%* } %>

#YCTODO 增加反向链接