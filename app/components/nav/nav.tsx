import { NavLink } from 'react-router'
import NavItem from './components/nav-item/nav-item'
import { navItems } from './nav.utils'

/**
 * Nav component for rendering the navigation bar.
 *
 * @returns A navigation bar component.
 */
const Nav = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-white text-lg font-bold">
          Daniel Castro
        </NavLink>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} title={item.title} />
          ))}
        </ul>
      </div>
    </nav>
  )
}

Nav.displayName = 'Nav'

export default Nav
