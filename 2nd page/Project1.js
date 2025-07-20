// Add hover title and click action to nav items
document.querySelectorAll("nav a").forEach(link => {
  link.title = `Go to ${link.innerText}`;

  link.addEventListener("mouseover", () => {
    link.style.color = "#730e6e";
  });

  link.addEventListener("mouseout", () => {
    link.style.color = "#333";
  });

  link.addEventListener("click", (e) => {
    e.preventDefault();
    alert(`You clicked on "${link.innerText}"`);
  });
});

// Add click event to Shop Now button
const shopNowBtn = document.querySelector(".hero button");
if (shopNowBtn) {
  shopNowBtn.addEventListener("click", () => {
    alert("Redirecting to shop...");
    shopNowBtn.style.background = "#f2e3f5";
    shopNowBtn.style.color = "#333";
    setTimeout(() => {
      shopNowBtn.style.background = "#730e6e";
      shopNowBtn.style.color = "#fff";
    }, 1000);
  });
}

// Add to Cart button animation
document.querySelectorAll(".product-card button").forEach(button => {
  button.addEventListener("click", () => {
    button.innerText = "Added!";
    button.style.backgroundColor = "#28a745";
    setTimeout(() => {
      button.innerText = "Add to Cart";
      button.style.backgroundColor = "#730e6e";
    }, 1000);
  });
});
