const apiURL = "https://fakestoreapi.com/products";

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
 * Function that gets a specific category from the URL parameters
 * @returns - The chosen category
 */
const getCategory = () => {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get("category");
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
    const url = `products-index.html?category=${encodeURIComponent(category)}`;

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
 * Function that renders all product cards for a specific category
 * @param {*} products - All available products for the specified category from the API
 * @param {*} containerId - The container where all the products are rendered
 */
const renderProductCards = (products, containerId) => {
  const container = document.getElementById(containerId);
  if (!container || !products.length) return;

  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden border border-pink-100 hover:shadow-lg transition duration-300 group p-4 cursor-pointer';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    img.className = 'w-full h-48 object-cover group-hover:scale-105 transition duration-300 mb-4';

    const h2 = document.createElement('h2');
    h2.className = 'text-lg font-semibold text-zara-brown';
    h2.textContent = product.title;

    const p = document.createElement('p');
    p.className = 'mt-2 mb-2 text-sm text-zara-brown font-bold';
    p.textContent = `$${Number(product.price).toFixed(2)}`;

    const a = document.createElement('a');
    a.href = `products-details.html?id=${product.id}`;
    a.className = 'text-zara-darkpink font-medium hover:underline';
    a.innerHTML = 'See Now →';

    card.appendChild(img);
    card.appendChild(h2);
    card.appendChild(p);
    card.appendChild(a);
    container.appendChild(card);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const category = getCategory();
  if (!category) {
    alert("The category is not specified!");
    return;
  }

  Promise.all([
    getData(`${apiURL}/categories`),
    getData(`${apiURL}/category/${category}`)
  ])
    .then(([categories, categoryProducts]) => {
      renderNavMenus(categories, 'desktop-menu', 'mobile-menu-list');
      renderProductCards(categoryProducts, 'products-container');
      document.getElementById('loading').style.display = 'none';
      const categoryTitle = document.getElementById('category-title');
      categoryTitle.textContent = category.toUpperCase();
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });

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
