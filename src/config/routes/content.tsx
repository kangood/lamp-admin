import { redirect } from 'react-router';

import { RouteOption } from '@/components/router/types';

import ContentIcon from '~icons/fluent/cube-16-regular';

export const content: RouteOption = {
    id: 'content',
    path: 'content',
    meta: { name: '内容管理', icon: ContentIcon },
    children: [
        {
            id: 'post.index',
            index: true,
            menu: false,
            loader: () => redirect('/content/posts/list'),
        },
        {
            id: 'post.list',
            path: 'posts/list',
            page: 'content/posts/list',
            meta: { name: '文章管理' },
        },
        {
            id: 'posts.create',
            menu: false,
            path: 'posts/create',
            page: 'content/posts/create',
        },
        {
            path: 'categories',
            id: 'categories.list',
            page: 'content/categories/list',
            meta: { name: '分类管理' },
        },
        {
            path: 'tags',
            id: 'tags.list',
            page: 'content/tags/list',
            meta: { name: '标签管理' },
        },
        {
            path: 'comments',
            id: 'comments.list',
            page: 'content/comments/list',
            meta: { name: '评论管理' },
        },
    ],
};
