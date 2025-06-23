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
 * Function that gets a specific id from the URL parameters
 * @returns - The chosen id
 */
const getId = () => {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get("id");
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
 * Function that renders the information for a chosen product
 * @param {*} product - The chosen product
 * @param {*} containerId - The id of the container where the product is rendered
 */
function renderProduct(product, containerId) {
  const container = document.getElementById(containerId);

  const article = document.createElement("article");
  article.className = "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl p-6";
  article.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";

  const figure = document.createElement("figure");
  figure.className = "flex justify-center items-center";
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.title;
  image.className = "max-w-full h-auto object-contain rounded-lg";
  figure.appendChild(image);
  article.appendChild(figure);

  const section = document.createElement("section");
  section.className = "flex flex-col justify-center";

  const title = document.createElement("p");
  title.textContent = product.title;
  title.className = "text-2xl font-bold text-zara-brown mb-4";
  section.appendChild(title);

  const price = document.createElement("p");
  price.className = "text-lg mb-2";
  const priceLabel = document.createElement("strong");
  priceLabel.className = "text-zara-darkpink";
  priceLabel.textContent = "Price: ";
  price.appendChild(priceLabel);
  price.appendChild(document.createTextNode(`$${product.price.toFixed(2)}`));
  section.appendChild(price);

  const category = document.createElement("p");
  category.className = "text-lg mb-2";
  const categoryLabel = document.createElement("strong");
  categoryLabel.className = "text-zara-darkpink";
  categoryLabel.textContent = "Category: ";
  category.appendChild(categoryLabel);
  category.appendChild(document.createTextNode(product.category));
  section.appendChild(category);

  const rating = document.createElement("p");
  rating.className = "text-lg mb-2";
  const ratingLabel = document.createElement("strong");
  ratingLabel.className = "text-zara-darkpink";
  ratingLabel.textContent = "Rating: ";
  rating.appendChild(ratingLabel);
  const stars = "★".repeat(Math.round(product.rating.rate));
  rating.appendChild(document.createTextNode(`${stars} ${product.rating.rate} (${product.rating.count} reviews)`));
  section.appendChild(rating);

  const description = document.createElement("p");
  description.className = "text-lg mb-2";
  const descriptionLabel = document.createElement("strong");
  descriptionLabel.className = "text-zara-darkpink";
  descriptionLabel.textContent = "Description: ";
  description.appendChild(descriptionLabel);
  description.appendChild(document.createTextNode(product.description));
  section.appendChild(description);

  article.appendChild(section);
  container.appendChild(article);
}

document.addEventListener("DOMContentLoaded", () => {
  const id = getId();

  if (!id) {
    alert("The id of the product is not specified!");
    return;
  }

  Promise.all([
    getData(`${apiURL}/categories`),
    getData(`${apiURL}/${id}`)
  ])
    .then(([categories, product]) => {
      renderNavMenus(categories, 'desktop-menu', 'mobile-menu-list');
      renderProduct(product, 'product-details');
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