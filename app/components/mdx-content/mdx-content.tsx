import * as runtime from 'react/jsx-runtime'

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

interface MDXProps {
  code: string
  components?: Record<string, React.ComponentType>
}

export const MDXContent: React.FC<MDXProps> = ({ code, components }) => {
  const Component = useMDXComponent(code)
  return <Component components={{ ...components }} />
}