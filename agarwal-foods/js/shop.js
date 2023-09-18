const api_url = "http://192.168.0.102:3000/api/product/mirchi";

for (let index = 0; index < 4; index++) {
    
    
    var container = document.querySelector('.tt-grid-items-wrap');

    // Create a new element to hold the provided HTML code
    var newItem = document.createElement('div');
    newItem.className = 'tt-grid-item';
    newItem.innerHTML = `
        <!-- Provided HTML code goes here -->
														<div class="ttgr-item-inner">

															<!-- Begin tt-Product 
															====================== -->
															<div class="tt-product">
																<div class="tt-product-image-holder">
																	<a href="shop-single.html" class="tt-product-image-wrap">
																		<figure class="tt-product-image">
																			<img class="anim-zoomin tt-lazy" src="assets/img/shop/shop-low-qlt-thumb.jpg" data-src="assets/img/shop/grid/product-1/product-1-1.jpg" alt="image" />
																		</figure> <!-- /.tt-product-image -->
																		
																		<figure class="tt-product-hover-image">
																			<img class="tt-lazy" src="assets/img/shop/shop-low-qlt-thumb.jpg" data-src="assets/img/shop/grid/product-1/product-1-2.jpg" alt="image" />
																		</figure> <!-- /.tt-product-hover-image -->

																		<!-- <div class="tt-product-padges">
																			<div class="pr-padge pr-sale-padge" title="Sale">-16%</div>
																			<div class="pr-padge pr-new-padge" title="New product">New</div>
																			<div class="pr-padge pr-hot-padge" title="Featured product">Hot!</div>
																		</div> -->

																		<!-- <div class="tt-product-out-of-stock">Out of Stock</div> -->
																	</a> <!-- /.tt-product-image-wrap -->

																	<div class="tt-product-additional-buttons">
																		<div class="tt-pr-addit-btn-wrap">
																			<a href="#" class="tt-pab-btn tt-add-to-wishlist-btn" title="Add to wishlist"><span><i class="far fa-heart"></i></span></a>
																			<a href="shop-wishlist.html" class="tt-pab-btn tt-add-to-wishlist-btn-active" title="Browse wishlist"><span><i class="fas fa-heart"></i></span></a>
																		</div>

																		<!-- <div class="tt-pr-addit-btn-wrap">
																			<a href="#" class="tt-pab-btn tt-add-to-compare-btn" title="Compare"><span><i class="fas fa-retweet"></i></span></a>
																			<a href="" class="tt-pab-btn tt-add-to-compare-btn-active" title="Browse compare list"><span><i class="fas fa-check"></i></span></a>
																		</div> -->

																		<!-- <a href="#" class="tt-pab-btn" title="Quick view"><i class="fas fa-search-plus"></i></a> -->

																	</div> <!-- /.tt-product-additional-buttons -->
																</div> <!-- /.tt-product-image-holder -->

																<div class="tt-product-info">
																	<!-- <div class="tt-product-categories">
																		<a href="" class="tt-product-category">Mockups</a>
																	</div> -->

																	<h3 class="tt-product-title"><a href="shop-single.html" title="Dash - Branding Mockup Templates">Dash - Branding Mockup Templates</a></h3>

																	<!-- <div class="tt-product-rating">
																		<div class="tt-product-rating-stars">
																			<i class="fas fa-star"></i>
																			<i class="fas fa-star"></i>
																			<i class="fas fa-star"></i>
																			<i class="far fa-star"></i>
																			<i class="far fa-star"></i>
																		</div>
																	</div> -->

																	<div class="tt-pi-price-btn-wrap">
																		<div class="tt-product-price">
																			<bdi>$25.00</bdi>
																			<!-- <ins class="pp-current-price"><bdi>$21.00</bdi></ins>
																			<del class="pp-old-price"><bdi>$25.00</bdi></del> -->
																		</div> <!-- /.tt-product-price -->

																		<div class="tt-product-buttons">
																			<a href="#" class="tt-product-btn tt-product-adc-btn"><span>Add to Cart</span></a>
																			<!-- <a href="shop-single.html" class="tt-product-btn tt-product-sel-opt-btn"><span>Select Options</span></a> -->
																		</div> <!-- /.tt-product-buttons -->
																	</div> <!-- /.tt-pi-price-btn-wrap -->
																</div> <!-- /.tt-product-info -->
															</div>
															<!-- End tt-Product -->

														</div> <!-- /.ttgr-item-inner -->
    `;

    // Append the new element to the container
    container.appendChild(newItem);
    
}

getapi(api_url);

// Defining async function
async function getapi(url) {
  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
  console.log(data);
  if (response) {
    hideloader();
  }
  console.log(data);

}

