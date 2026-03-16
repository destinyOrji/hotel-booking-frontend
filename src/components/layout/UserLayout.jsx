import Header from './Header'
import Footer from './Footer'
import SkipNavigation from '../common/SkipNavigation'
import './UserLayout.css'

const UserLayout = ({ children, hotelInfo }) => {
  return (
    <div className="user-layout">
      <SkipNavigation />
      <Header />
      <main id="main-content" className="user-layout-main" role="main">
        {children}
      </main>
      <Footer hotelInfo={hotelInfo} />
    </div>
  )
}

export default UserLayout
