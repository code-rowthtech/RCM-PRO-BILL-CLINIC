import MENU_ITEMS from '../constants/menu';


const canAccess = (item, role) => {
    if (!item.role) return true; // no restriction
    if (!role) return false;

    return item.role.includes(role);
};

const filterMenuByRole = (items, role) => {
    if (!items) return [];

    return items
        .map(item => {
            if (!canAccess(item, role)) return null;

            const newItem = { ...item };

            if (item.children) {
                newItem.children = filterMenuByRole(item.children, role);
            }

            return newItem;
        })
        .filter(Boolean);
};

const getMenuItems = (role) => {
    return filterMenuByRole(MENU_ITEMS, role);
};

const findAllParent = (menuItems, menuItem) => {
    let parents = [];
    const parent = findMenuItem(menuItems, menuItem['parentKey']);
    if (parent) {
        parents.push(parent['key']);
        if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
    }
    return parents;
};


const findMenuItem = (menuItems, menuItemKey) => {
    if (menuItems && menuItemKey) {
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i].key === menuItemKey) {
                return menuItems[i];
            }
            var found = findMenuItem(menuItems[i].children, menuItemKey);
            if (found) return found;
        }
    }
    return null;
};

export { getMenuItems, findAllParent, findMenuItem };
