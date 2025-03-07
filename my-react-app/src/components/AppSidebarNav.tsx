import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { CBadge, CNavLink, CSidebarNav, CNavItem, CCollapse } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { ComponentProps } from 'react'

// Define the types for the sidebar navigation items
interface INavBadge {
  color: string
  text: string
}

interface INavLink {
  component?: typeof CNavItem
  name?: string
  badge?: INavBadge
  icon?: ComponentProps<typeof CIcon>
  to?: string
  href?: string
  [key: string]: any
}

interface INavGroup extends INavLink {
  items?: (INavLink | INavGroup)[] // Group items are nested links or groups
  component?: typeof CNavItem // Use CNavItem to represent a group
}

type NavItem = INavLink | INavGroup

interface AppSidebarNavProps {
  items: NavItem[] // Items for navigation passed to the component
}

export const AppSidebarNav: FC<AppSidebarNavProps> = ({ items }) => {
  // Function to render the badge and the navigation name and icon
  const navLink = (name: string | undefined, icon: any, badge: INavBadge | undefined, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  // Function to render each nav item
  const navItem = (item: INavLink, index: number, indent = false) => {
    const { component = CNavItem, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  // Function to render nav group with dropdown behavior using CCollapse
  const navGroup = (item: INavGroup, index: number) => {
    const { component = CNavItem, name, icon, items, ...rest } = item
    const Component = component
    return (
      <div key={index} {...rest}>
        <div className="nav-group-toggler">
          {navLink(name, icon, undefined, false)}
        </div>
        <CCollapse>
          {items?.map((item, itemIndex) =>
            item.items ? navGroup(item as INavGroup, itemIndex) : navItem(item as INavLink, itemIndex, true),
          )}
        </CCollapse>
      </div>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item as INavGroup, index) : navItem(item as INavLink, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
