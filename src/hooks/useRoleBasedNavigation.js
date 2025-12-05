import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../constants/menuItems'; // Adjust path as needed

const useRoleBasedNavigation = () => {
  const store = useSelector((state) => state);
  const userRole = store?.Auth?.user?.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) return;

    const allowedUrls = MENU_ITEMS
      .filter(item => item.role?.includes(userRole))
      .map(item => item.url)
      .filter(Boolean);

    const currentPath = window.location.pathname;

    if (allowedUrls.includes(currentPath)) return;

    if (allowedUrls.length > 0) {
      navigate(allowedUrls[0], { replace: true });
    } else {
      navigate("/not-authorized", { replace: true });
    }

  }, [userRole, navigate]);
};

export default useRoleBasedNavigation;