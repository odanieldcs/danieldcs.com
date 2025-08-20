import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),

  route('about', './routes/about.tsx'),
  route('contact', './routes/contact.tsx'),
  route('projects', './routes/projects.tsx'),

  ...prefix('blog', [
    index('./routes/blog.tsx'),
    route(':slug', './routes/blog.$slug.tsx'),
  ]),

  route('*', './routes/404.tsx')
] satisfies RouteConfig
