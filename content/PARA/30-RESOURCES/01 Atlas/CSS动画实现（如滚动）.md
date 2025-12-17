---
title: CSS动画实现（如滚动）
date-created: 2025-05-19
date-modified: 2025-05-21
---

## 通过改变元素的 transform 属性实现滚动效果

使用 transform: translateY 配合 animation 属性

```css
.scrolling-element {
    height: 200px;
    overflow: hidden;
}

.scrollint-content {
    animation: scroll 10s linear infinite;
}

@keyframes scroll {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-100%)
    }
}
```

## 滚动背景图像

通过使用 background-position 配合 animation 属性

```css
.scrolling-background {
    width: 100%;
    height: 800px;
    background-image: url('image.jpg');
    background-repeat: repeat-y;
    animation: scroll-bg 20s linear infinite;
}

@keyframes scroll-bg {
    from {
        background-position: 0 0;
    }

    to {
        background-position: 0 100%;
    }
}
```
