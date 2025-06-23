const apiURL = "https://fakestoreapi.com/products/categories";

/**
 * Function that fetches data from the specified API URL
 * @param {*} url - The URL to fetch data from
 * @returns - The fetched data
 */
const getData = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

/**
 * Function that renders the desktop and mobile menus
 * @param {*} categories - All available product categories
 * @param {*} desktopId - The id of the container for the desktop menu
 * @param {*} mobileId - The id of the container for the mobile menu 
 */
const renderNavMenus = async (categories, desktopId, mobileId) => {
    const desktopMenu = document.getElementById(desktopId);
    const mobileMenu = document.getElementById(mobileId);

    if (!categories.length) return;

    desktopMenu.innerHTML = '';
    mobileMenu.innerHTML = '';

    categories.forEach(category => {
        const label = category.charAt(0).toUpperCase() + category.slice(1);
        const url = `products-index.html?category=${category}`;

        // Desktop menu item
        const liDesktop = document.createElement('li');
        liDesktop.className = 'relative group';

        const aDesktop = document.createElement('a');
        aDesktop.href = url;
        aDesktop.className = 'flex items-center hover:text-zara-darkpink transition font-medium';
        aDesktop.textContent = label;

        liDesktop.appendChild(aDesktop);
        desktopMenu.appendChild(liDesktop);

        // Mobile menu item
        const liMobile = document.createElement('li');

        const aMobile = document.createElement('a');
        aMobile.href = url;
        aMobile.className = 'block py-1 font-medium hover:text-zara-darkpink';
        aMobile.textContent = label;

        liMobile.appendChild(aMobile);
        mobileMenu.appendChild(liMobile);
    });
};

/**
 * Function that renders all collections
 * @param {*} categories - All available categories
 * @param {*} containerId - The id of the container where the categories are rendered
 */
const renderCollections = async (categories, containerId) => {
    const grid = document.getElementById(containerId);
    if (!grid || !categories.length) return;
    grid.innerHTML = '';

    categories.forEach(category => {
        const article = document.createElement('article');
        article.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 group cursor-pointer";

        const figure = document.createElement('figure');
        figure.className = "h-48 bg-zara-pink flex items-center justify-center overflow-hidden";

        const img = document.createElement('img');
        img.src = 'images/bag.png';
        img.alt = `bags image`;
        img.className = "object-cover w-full h-full";

        figure.appendChild(img);
        article.appendChild(figure);

        const header = document.createElement('header');
        header.className = "p-6";

        const h3 = document.createElement('h3');
        h3.className = "text-xl font-semibold mb-2 text-zara-darkpink";
        h3.textContent = category.charAt(0).toUpperCase() + category.slice(1);

        const a = document.createElement('a');
        a.href = `products-index.html?category=${category}`;
        a.className = "text-zara-darkpink font-medium hover:underline";
        a.textContent = "See Now →";

        header.appendChild(h3);
        header.appendChild(a);
        article.appendChild(header);
        grid.appendChild(article);
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    const apiData = await getData(apiURL);

    await Promise.all([
        renderNavMenus(apiData, 'desktop-menu', 'mobile-menu-list'),
        renderCollections(apiData, 'collections-grid')
    ]);

    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    // Toggle mobile menu visibility
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link inside is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
});
