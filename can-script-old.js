// Créé une variable contenant les noms des produits dans la base de donnée
var products;

// use fetch to retrieve it, and report any errors that occur in the fetch operation
// once the products have been successfully loaded and formatted as a JSON object
// using response.json(), run the initialize() function
fetch('products.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      products = json;
      initialize();
    });
  } else {
    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
  }
});

// sets up the app logic, declares required variables, contains all the other functions
function initialize() {
  // grab the UI elements that we need to manipulate
  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('#searchTerm');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');

  // garder un enregistrement de la derniére catégorie et la recherche ayant été taper dans la barre
  var lastCategory = category.value;
  // Aucune recherche n'a encore été faite
  var lastSearch = '';

  // categoryGroup contient les resultats filtré dans la recherche selon les termes saisis
  // finalGroup contient les produits devant être affiché à la fin.

  var categoryGroup;
  var finalGroup;

  // finalGroup sera égal à products initiallement
  // then run updateDisplay(), so ALL products are displayed initially.
  finalGroup = products;
  updateDisplay();

  // Set both to equal an empty array, in time for searches to be run
  categoryGroup = [];
  finalGroup = [];

  // when the search button is clicked, invoke selectCategory() to start
  // a search running to select the category of products we want to display
  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
    // Use preventDefault() to stop the form submitting — that would ruin
    // the experience
    e.preventDefault();

    // Set these back to empty arrays, to clear out the previous search
    categoryGroup = [];
    finalGroup = [];

    // if the category and search term are the same as they were the last time a
    // search was run, the results will be the same, so there is no point running
    // it again — just return out of the function
    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      // update the record of last category and search term
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      // In this case we want to select all products, then filter them by the search
      // term, so we just set categoryGroup to the entire JSON object, then run selectProducts()
      if (category.value === 'All') {
        categoryGroup = products;
        selectProducts();
        // If a specific category is chosen, we need to filter out the products not in that
        // category, then put the remaining products inside categoryGroup, before running
        // selectProducts()
      } else {
        // the values in the <option> elements are uppercase, whereas the categories
        // store in the JSON (under "type") are lowercase. We therefore need to convert
        // to lower case before we do a comparison
        var lowerCaseType = category.value.toLowerCase();
        for (var i = 0; i < products.length; i++) {
          // If a product's type property is the same as the chosen category, we want to
          // dispay it, so we push it onto the categoryGroup array
          if (products[i].type === lowerCaseType) {
            categoryGroup.push(products[i]);
          }
        }

        // Run selectProducts() after the filtering has bene done
        selectProducts();
      }
    }
  }

  // selectProducts() Permet de filtrer les résultats selon les données saisis dans la barre de recherche
  function selectProducts() {
    // If no search term has been entered, just make the finalGroup array equal to the categoryGroup
    // array — we don't want to filter the products further — then run updateDisplay().
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      // Adapte automatiquement les résultats saisis en minuscule.
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      // Donne les résultats de la recherche en excluant les produits ne correspondants pas à la recherche
        if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }
      // mets à jour le résultats final
      updateDisplay();
    }

  }

  // Permet de commencer à mettre à jour vers une nouvelle page de produits, tandis que le précedent contenu est supprimé
  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // Si aucun résultat ne correspond à la recherche, on marquera 'No results to display!'
    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
      // for each product we want to display, pass its product object to fetchBlob()
    } else {
      for (var i = 0; i < finalGroup.length; i++) {
        showProduct(finalGroup[i]);
      }
    }
  }

  // fetchBlob utilise fetch to retrieve the image for that product, and then sends the
  // resulting image display URL and product object on to showProduct() to finally
  // display it
  // function fetchBlob(product) {
  //   // Construit le chemin reliant l'URL au fichier image provenant de product.image
  //   var url = 'images/' + product.image;
  //   // Utiliser fetch pour aller chercher l'image, et convertir l'image en Blob
  //   fetch(url).then(function (response) {
  //     if (response.ok) {
  //       response.blob().then(function (blob) {
  //         // Convertit le Blob en objet URL
  //         var objectURL = URL.createObjectURL(blob);
  //         // invoque showProduct
  //         showProduct(objectURL, product);
  //       });
  //     } else {
  //       console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
  //     }
  //   });
  // }

  // Display a product inside the <main> element
  function showProduct(product) {
    // create <section>, <h2>, <p>, and <img> elements
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var image = document.createElement('img');

    // give the <section> a classname equal to the product "type" property so it will display the correct icon
    section.setAttribute('class', product.type);

    // Give the <h2> textContent equal to the product "name" property, but with the first character
    // replaced with the uppercase version of the first character
    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

    // Give the <p> textContent equal to the product "price" property, with a $ sign in front
    // toFixed(2) is used to fix the price at 2 decimal places, so for example 1.40 is displayed
    // as 1.40, not 1.4.
    para.textContent = '$' + product.price.toFixed(2);

    // Set the src of the <img> element to the ObjectURL, and the alt to the product "name" property
    image.src = "images/"+product.image;
    image.alt = product.name;

    // append the elements to the DOM as appropriate, to add the product to the UI
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
