import adminRoute from "./admin/admin.routes.js";
import authenticationRouter from "./authentication/authentication.routes.js";
import brandRouter from "./brands/brands.routes.js";
import cartRouter from "./Cart/cart.routes.js";
import categoryRouter from "./categories/Categories.routes.js";
import couponsRouter from "./coupons/coupons.routes.js";
import orderRouter from "./orders/orders.routes.js";
import productRouter from "./products/products.routes.js";
import reviewRouter from "./reviews/reviews.routes.js";
import userRouter from "./users/user.routes.js";
import wishListRouter from "./wishList/wishList.routes.js";

const baseUrl = "/api/v1";

const bootstrap = (app) => {
  /* Authentication */
  app.use(`${baseUrl}/auth`, authenticationRouter);

  /* Admin */
  app.use(`${baseUrl}/admin`, adminRoute);

  /* Users  */
  app.use(`${baseUrl}/users`, userRouter);

  /* Categories  */
  app.use(`${baseUrl}/categories`, categoryRouter);

  /* Brands */
  app.use(`${baseUrl}/brands`, brandRouter);

  /* Products */
  app.use(`${baseUrl}/products`, productRouter);

  /* Coupons */
  app.use(`${baseUrl}/coupons`, couponsRouter);

  /* cart */
  app.use(`${baseUrl}/cart`, cartRouter);

  /* Orders */

  app.use(`${baseUrl}/orders`, orderRouter);

  /* Wishlist */

  app.use(`${baseUrl}/wishList`, wishListRouter);

  /* Review */

  app.use(`${baseUrl}/reviews`, reviewRouter);
};

export default bootstrap;
