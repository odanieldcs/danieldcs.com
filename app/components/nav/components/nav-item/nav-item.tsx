import { NavLink } from 'react-router'

/**
 * NavItem component for rendering a navigation link.
 * @param props - Props containing the link destination and title.
 * @returns A list item containing a navigation link.
 */
const NavItem = ({ to, title }: { to: string; title: string }) => {
  return (
    <li>
      <NavLink to={to} className="text-blue-500 hover:underline">
        {title}
      </NavLink>
    </li>
  )
}

NavItem.displayName = 'NavItem'

export default NavItem
